// ~/store/usePostStore.ts
import { create } from "zustand";

interface PostStore {
  // Content state
  title: string;
  content: string;
  tags: string[];
  currentTag: string;

  // Editor state
  isPreview: boolean;
  selectionStart: number;
  selectionEnd: number;
  activeSuggestion: "title" | "tags" | "content" | null;

  // Actions
  setTitle: (title: string) => void;
  setContent: (content: string) => void;
  addTag: (tag: string) => void;
  removeTag: (tag: string) => void;
  setCurrentTag: (tag: string) => void;
  setSelectionRange: (start: number, end: number) => void;
  togglePreview: () => void;
  setActiveSuggestion: (type: "title" | "tags" | "content" | null) => void;
  reset: () => void;
}

const initialState = {
  title: "",
  content: "",
  tags: [],
  currentTag: "",
  isPreview: false,
  selectionStart: 0,
  selectionEnd: 0,
  activeSuggestion: null as "title" | "tags" | "content" | null,
};

export const usePostStore = create<PostStore>((set) => ({
  ...initialState,

  setTitle: (title) => set({ title }),
  setContent: (content) => set({ content }),
  addTag: (tag) =>
    set((state) => ({
      tags: state.tags.includes(tag) ? state.tags : [...state.tags, tag],
      currentTag: "",
    })),
  removeTag: (tag) =>
    set((state) => ({
      tags: state.tags.filter((t) => t !== tag),
    })),
  setCurrentTag: (currentTag) => set({ currentTag }),
  setSelectionRange: (start, end) =>
    set({ selectionStart: start, selectionEnd: end }),
  togglePreview: () => set((state) => ({ isPreview: !state.isPreview })),
  setActiveSuggestion: (activeSuggestion) => set({ activeSuggestion }),
  reset: () => set(initialState),
}));
