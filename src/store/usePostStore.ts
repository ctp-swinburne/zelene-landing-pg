import { create } from 'zustand';

interface PostStore {
  // Content state
  title: string;
  content: string;
  tags: string[];
  currentTag: string;
  isPreview: boolean;
  
  // Editor state
  selectionStart: number;
  selectionEnd: number;
  activeSuggestion: 'title' | 'tags' | 'content' | null;

  // Actions
  setTitle: (title: string) => void;
  setContent: (content: string) => void;
  setTags: (tags: string[]) => void;
  addTag: (tag: string) => void;
  removeTag: (tag: string) => void;
  setCurrentTag: (tag: string) => void;
  togglePreview: () => void;
  setSelectionRange: (start: number, end: number) => void;
  setActiveSuggestion: (type: 'title' | 'tags' | 'content' | null) => void;
  reset: () => void;
}

const initialState = {
  title: '',
  content: '',
  tags: [],
  currentTag: '',
  isPreview: false,
  selectionStart: 0,
  selectionEnd: 0,
  activeSuggestion: null,
};

export const usePostStore = create<PostStore>((set) => ({
  // Initial state
  ...initialState,

  // Actions
  setTitle: (title) => set({ title }),
  
  setContent: (content) => set({ content }),
  
  setTags: (tags) => set({ tags }),
  
  addTag: (tag) => set((state) => ({
    tags: [...state.tags, tag],
    currentTag: '', // Reset current tag after adding
  })),
  
  removeTag: (tagToRemove) => set((state) => ({
    tags: state.tags.filter((tag) => tag !== tagToRemove),
  })),
  
  setCurrentTag: (currentTag) => set({ currentTag }),
  
  togglePreview: () => set((state) => ({ 
    isPreview: !state.isPreview 
  })),
  
  setSelectionRange: (selectionStart, selectionEnd) => set({
    selectionStart,
    selectionEnd,
  }),
  
  setActiveSuggestion: (activeSuggestion) => set({ activeSuggestion }),
  
  reset: () => set(initialState),
}));