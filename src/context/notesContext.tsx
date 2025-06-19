import React, { createContext, useContext, useState, useEffect } from "react";
import { db } from "@/firebase/config";
import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    orderBy,
    getDocs,
    Timestamp,
    Firestore,
    doc as firestoreDoc,
} from "firebase/firestore";
import { useAuth } from "@/context/authContext";

type Note = {
    id: string;
    title: string;
    content: string;
    tags: string[];
    createdAt: Timestamp;
};

type NotesContextType = {
    notes: Note[];
    loading: boolean;
    addNote: (n: Omit<Note, "id" | "createdAt">) => Promise<void>;
    updateNote: (id: string, n: Partial<Note>) => Promise<void>;
    deleteNote: (id: string) => Promise<void>;
    reload: () => Promise<void>;
};

const NotesContext = createContext<NotesContextType | undefined>(undefined);

export const NotesProvider: React.FC<React.PropsWithChildren<object>> = ({ children }) => {
    const [notes, setNotes] = useState<Note[]>([]);
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();

    const loadNotes = React.useCallback(async () => {
        if (!user) return;
        setLoading(true);
        const q = query(
            collection(db, "notes", user.uid, "notes"),
            orderBy("createdAt", "desc")
        );
        const snap = await getDocs(q);
        setNotes(
            snap.docs.map((d) => {
                const data = d.data() as Note;
                return { ...data, id: d.id };
            })
        );
        setLoading(false);
    }, [user]);

    useEffect(() => {
        loadNotes();
    }, [loadNotes]);

    const addNote = async ({ title, content, tags }: Omit<Note, "id" | "createdAt">) => {
        if (!user) return;
        await addDoc(collection(db, "notes", user.uid, "notes"), {
            title,
            content,
            tags,
            createdAt: Timestamp.now(),
        });
        loadNotes();
    };

    const updateNote = async (id: string, data: Partial<Note>) => {
        if (!user) return;
        await updateDoc(doc(db, "notes", user.uid, "notes", id), data);
        loadNotes();
    };

    const deleteNote = async (id: string) => {
        if (!user) return;
        await deleteDoc(doc(db, "notes", user.uid, "notes", id));
        loadNotes();
    };

    return (
        <NotesContext.Provider
            value={{ notes, loading, addNote, updateNote, deleteNote, reload: loadNotes }}
        >
            {children}
        </NotesContext.Provider>
    );
};

export const useNotes = () => {
    const ctx = useContext(NotesContext);
    if (!ctx) throw new Error("useNotes must be wrapped in NotesProvider");
    return ctx;
};

function doc(db: Firestore, arg1: string, uid: string, arg3: string, id: string) {
    return firestoreDoc(db, arg1, uid, arg3, id);
}
