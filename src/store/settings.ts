import { create } from "zustand";
import type { RouterOutputs } from "~/trpc/react";
import { type UpdateProfileInput } from "~/schema/profile";

type Profile = RouterOutputs["profile"]["getCurrentProfile"];

interface SettingsState {
  userInfo: {
    name: string;
    username: string;
    email: string;
  };
  profileInfo: {
    bio: string;
    location: string;
    currentLearning: string;
    availableFor: string;
    skills: string;
    currentProject: string;
    pronouns: boolean;
    work: string;
    education: string;
  };
  socialInfo: {
    website: string;
    twitter: string;
    github: string;
    linkedin: string;
    facebook: string;
  };
  ui: {
    activeTab: string;
    isLoading: boolean;
    isDirty: boolean;
  };
}

interface SettingsActions {
  setActiveTab: (tab: string) => void;
  setIsLoading: (loading: boolean) => void;
  setIsDirty: (dirty: boolean) => void;
  initializeFromProfile: (profile: Profile) => void;
  updateUserInfo: <K extends keyof SettingsState["userInfo"]>(
    field: K,
    value: SettingsState["userInfo"][K],
  ) => void;
  updateProfileInfo: <K extends keyof SettingsState["profileInfo"]>(
    field: K,
    value: SettingsState["profileInfo"][K],
  ) => void;
  updateSocialInfo: <K extends keyof SettingsState["socialInfo"]>(
    field: K,
    value: SettingsState["socialInfo"][K],
  ) => void;
  reset: () => void;
}

const initialState: SettingsState = {
  userInfo: {
    name: "",
    username: "",
    email: "",
  },
  profileInfo: {
    bio: "",
    location: "",
    currentLearning: "",
    availableFor: "",
    skills: "",
    currentProject: "",
    pronouns: false,
    work: "",
    education: "",
  },
  socialInfo: {
    website: "",
    twitter: "",
    github: "",
    linkedin: "",
    facebook: "",
  },
  ui: {
    activeTab: "1",
    isLoading: false,
    isDirty: false,
  },
};

export const useSettingsStore = create<SettingsState & SettingsActions>()(
  (set) => ({
    ...initialState,

    setActiveTab: (tab) =>
      set((state) => ({ ui: { ...state.ui, activeTab: tab } })),
    setIsLoading: (loading) =>
      set((state) => ({ ui: { ...state.ui, isLoading: loading } })),
    setIsDirty: (dirty) =>
      set((state) => ({ ui: { ...state.ui, isDirty: dirty } })),

    initializeFromProfile: (profile) => {
      if (!profile) return;

      set({
        userInfo: {
          name: profile.name ?? "",
          username: profile.username ?? "",
          email: profile.email ?? "",
        },
        profileInfo: {
          bio: profile.profile?.bio ?? "",
          location: profile.profile?.location ?? "",
          currentLearning: profile.profile?.currentLearning ?? "",
          availableFor: profile.profile?.availableFor ?? "",
          skills: profile.profile?.skills ?? "",
          currentProject: profile.profile?.currentProject ?? "",
          pronouns: profile.profile?.pronouns ?? false,
          work: profile.profile?.work ?? "",
          education: profile.profile?.education ?? "",
        },
        socialInfo: {
          website: profile.social?.website ?? "",
          twitter: profile.social?.twitter ?? "",
          github: profile.social?.github ?? "",
          linkedin: profile.social?.linkedin ?? "",
          facebook: profile.social?.facebook ?? "",
        },
        ui: {
          ...initialState.ui,
          isDirty: false,
        },
      });
    },

    updateUserInfo: (field, value) =>
      set((state) => ({
        userInfo: { ...state.userInfo, [field]: value || "" },
        ui: { ...state.ui, isDirty: true },
      })),

    updateProfileInfo: (field, value) =>
      set((state) => ({
        profileInfo: { ...state.profileInfo, [field]: value || "" },
        ui: { ...state.ui, isDirty: true },
      })),

    updateSocialInfo: (field, value) =>
      set((state) => ({
        socialInfo: { ...state.socialInfo, [field]: value || "" },
        ui: { ...state.ui, isDirty: true },
      })),

    reset: () => set(initialState),
  }),
);

export const prepareUpdateData = (state: SettingsState): UpdateProfileInput => {
  return {
    user: {
      name: state.userInfo.name || undefined,
      username: state.userInfo.username || undefined,
      email: state.userInfo.email || undefined,
    },
    profile: {
      bio: state.profileInfo.bio || undefined,
      location: state.profileInfo.location || undefined,
      currentLearning: state.profileInfo.currentLearning || undefined,
      availableFor: state.profileInfo.availableFor || undefined,
      skills: state.profileInfo.skills || undefined,
      currentProject: state.profileInfo.currentProject || undefined,
      pronouns: state.profileInfo.pronouns || undefined,
      work: state.profileInfo.work || undefined,
      education: state.profileInfo.education || undefined,
    },
    social: {
      website: state.socialInfo.website || undefined,
      twitter: state.socialInfo.twitter || undefined,
      github: state.socialInfo.github || undefined,
      linkedin: state.socialInfo.linkedin || undefined,
      facebook: state.socialInfo.facebook || undefined,
    },
  };
};
