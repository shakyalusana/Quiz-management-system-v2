import { create } from "zustand";

interface QuestionStore {
  isQuestionModalOpen: boolean;
  isCategoryModalOpen: boolean;

  openQuestionModal: () => void;
  closeQuestionModal: () => void;

  openCategoryModal: () => void;
  closeCategoryModal: () => void;
}

export const useQuestionStore = create<QuestionStore>((set) => ({
  isQuestionModalOpen: false,
  isCategoryModalOpen: false,

  openQuestionModal: () => set({ isQuestionModalOpen: true }),

  closeQuestionModal: () => set({ isQuestionModalOpen: false }),

  openCategoryModal: () => set({ isCategoryModalOpen: true }),

  closeCategoryModal: () => set({ isCategoryModalOpen: false }),
}));
