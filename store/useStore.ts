
import { create } from 'zustand';
import { UserRole } from '../types';

interface AppState {
  currentRole: UserRole;
  setRole: (role: UserRole) => void;
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
}

export const useStore = create<AppState>((set) => ({
  currentRole: UserRole.ADMIN,
  setRole: (role) => set({ currentRole: role }),
  isSidebarCollapsed: false,
  toggleSidebar: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
}));
