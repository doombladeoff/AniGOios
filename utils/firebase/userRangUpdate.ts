import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

interface UserProgress {
    level: number;
    exp: number;
}

export async function updateExp(userId: string, amount: number, type?: "reset" | "plus" | "minus") {
    const userRef = doc(db, "user-collection", userId);
    const snap = await getDoc(userRef);

    if (!snap.exists()) throw new Error("User not found");

    let { level, exp } = snap.data().rang as UserProgress;

    const operations = {
        plus: (exp: number, amount: number) => exp + amount,
        minus: (exp: number, amount: number) => Math.max(0, exp - amount),
        reset: (_exp: number, _amount: number) => 0,
        default: (exp: number, amount: number) => exp + amount,
    };

    exp =
        type === "reset" ? 0 : (operations[type ?? "default"])(exp, amount);

    if (type === "reset") {
        level = 1;
    } else {
        while (exp >= 10000 && level < 100) {
            exp -= 10000;
            level += 1;
        }

        if (level >= 100) {
            level = 100;
            exp = Math.min(exp, 10000);
        }

        if (exp === level * 100) {
            exp = 0;
            level += 1;
        }
    }

    await updateDoc(userRef, { rang: { level, exp } });
    return { level, exp };
}


export async function updateLevel(userId: string, newLevel: number) {
    const userRef = doc(db, "user-collection", userId);
    const snap = await getDoc(userRef);

    if (!snap.exists()) throw new Error("User not found");

    let level = Math.min(newLevel, 100);

    await updateDoc(userRef, { level });
    return { level };
}
