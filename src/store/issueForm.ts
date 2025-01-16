import { create } from "zustand";
import { type TechnicalIssueWithFilesSchema } from "~/schema/queries";
import type { UploadFile } from "antd/es/upload/interface";

interface IssueState {
  // Form Data
  deviceId?: string;
  issueType?: string;
  severity?: string;
  title?: string;
  description?: string;
  stepsToReproduce?: string;
  expectedBehavior?: string;
  email: string;

  // UI State
  currentStep: number;
  fileList: UploadFile[];
  isSubmitting: boolean;
}

interface IssueActions {
  setFormData: (step: number, data: Partial<IssueState>) => void;
  setFileList: (files: UploadFile[]) => void;
  setCurrentStep: (step: number) => void;
  setIsSubmitting: (isSubmitting: boolean) => void;
  reset: () => void;
  getFormData: () => Partial<typeof TechnicalIssueWithFilesSchema>;
}

const initialState: IssueState = {
  // Initialize required fields
  email: "", 
  currentStep: 0,
  fileList: [],
  isSubmitting: false,
};

export const useIssueStore = create<IssueState & IssueActions>((set, get) => ({
  // Initial state
  ...initialState,

  setFormData: (step, data) => {
    set((state) => ({
      ...state,
      ...data,
    }));
  },

  setFileList: (files) => set({ fileList: files }),

  setCurrentStep: (step) => set({ currentStep: step }),

  setIsSubmitting: (isSubmitting) => set({ isSubmitting }),

  reset: () => set(initialState),

  getFormData: () => {
    const state = get();
    return {
      deviceId: state.deviceId,
      issueType: state.issueType,
      severity: state.severity,
      title: state.title,
      description: state.description,
      stepsToReproduce: state.stepsToReproduce,
      expectedBehavior: state.expectedBehavior,
      email: state.email, 
    };
  },
}));