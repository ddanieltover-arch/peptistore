import { create } from 'zustand';

interface WizardState {
  isOpen: boolean;
  openWizard: () => void;
  closeWizard: () => void;
}

export const useWizardStore = create<WizardState>((set) => ({
  isOpen: false,
  openWizard: () => set({ isOpen: true }),
  closeWizard: () => set({ isOpen: false }),
}));
