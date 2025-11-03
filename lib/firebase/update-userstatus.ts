import { db } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";

export const UpdateUserStatus = async (userId: string, status: string) => {
    const userRef = doc(db, "user-collection", userId);
    try {
        await updateDoc(userRef, {
            status: status
        });
    } catch (error) {
        console.log(error)
    }
}