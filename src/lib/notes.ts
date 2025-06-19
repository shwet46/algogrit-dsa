
import { db } from "@/firebase/config";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { Note } from "@/types/note";

const notesCollection = collection(db, "notes");

export const createNote = async (note: Note) => {
  const docRef = await addDoc(notesCollection, {
    ...note,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
};

export const getUserNotes = async (userId: string) => {
  const q = query(notesCollection, where("userId", "==", userId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const updateNote = async (id: string, updatedFields: Partial<Note>) => {
  const noteRef = doc(db, "notes", id);
  await updateDoc(noteRef, {
    ...updatedFields,
    updatedAt: serverTimestamp(),
  });
};

export const deleteNote = async (id: string) => {
  await deleteDoc(doc(db, "notes", id));
};