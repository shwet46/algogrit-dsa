import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '@/firebase/config';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  getDocs,
  Timestamp,
  doc,
} from 'firebase/firestore';
import { useAuth } from '@/context/authContext';

type Note = {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: Timestamp;
  updatedAt?: Timestamp;
};

type NotesContextType = {
  notes: Note[];
  loading: boolean;
  error: string | null;
  addNote: (n: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateNote: (
    id: string,
    n: Partial<Omit<Note, 'id' | 'createdAt'>>
  ) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  reload: () => Promise<void>;
};

const NotesContext = createContext<NotesContextType | undefined>(undefined);

export const NotesProvider: React.FC<React.PropsWithChildren<object>> = ({
  children,
}) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const loadNotes = React.useCallback(async () => {
    if (!user) {
      setNotes([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const notesCollection = collection(db, 'users', user.uid, 'notes');
      const q = query(notesCollection, orderBy('createdAt', 'desc'));

      const snap = await getDocs(q);
      const notesData = snap.docs.map((docSnap) => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          title: data.title || '',
          content: data.content || '',
          tags: Array.isArray(data.tags) ? data.tags : [],
          createdAt: data.createdAt || Timestamp.now(),
          updatedAt: data.updatedAt,
        } as Note;
      });

      setNotes(notesData);
    } catch (err) {
      console.error('Error loading notes:', err);
      setError(err instanceof Error ? err.message : 'Failed to load notes');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  const addNote = async ({
    title,
    content,
    tags,
  }: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      setError(null);

      if (!title?.trim()) {
        throw new Error('Title is required');
      }

      const noteData = {
        title: title.trim(),
        content: content?.trim() || '',
        tags: Array.isArray(tags) ? tags : [],
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      const notesCollection = collection(db, 'users', user.uid, 'notes');
      await addDoc(notesCollection, noteData);

      await loadNotes();
    } catch (err) {
      console.error('Error adding note:', err);
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to add note';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const updateNote = async (
    id: string,
    data: Partial<Omit<Note, 'id' | 'createdAt'>>
  ) => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      setError(null);

      const updateData = {
        ...data,
        updatedAt: Timestamp.now(),
      };

      Object.keys(updateData).forEach((key) => {
        if (updateData[key as keyof typeof updateData] === undefined) {
          delete updateData[key as keyof typeof updateData];
        }
      });

      const noteDoc = doc(db, 'users', user.uid, 'notes', id);
      await updateDoc(noteDoc, updateData);

      await loadNotes();
    } catch (err) {
      console.error('Error updating note:', err);
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to update note';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const deleteNote = async (id: string) => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      setError(null);

      const noteDoc = doc(db, 'users', user.uid, 'notes', id);
      await deleteDoc(noteDoc);

      await loadNotes();
    } catch (err) {
      console.error('Error deleting note:', err);
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to delete note';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  return (
    <NotesContext.Provider
      value={{
        notes,
        loading,
        error,
        addNote,
        updateNote,
        deleteNote,
        reload: loadNotes,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
};

export const useNotes = () => {
  const ctx = useContext(NotesContext);
  if (!ctx) {
    throw new Error('useNotes must be used within a NotesProvider');
  }
  return ctx;
};