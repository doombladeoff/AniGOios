import { db } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";

export const UpdateUsername = async (userId: string, newNick: string) => {
    const userRef = doc(db, "user-collection", userId);
    try {
        await updateDoc(userRef, {
            displayName: newNick
        });
    } catch (error) {
        console.log(error)
    }
}