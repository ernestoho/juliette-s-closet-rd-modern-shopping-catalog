import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
interface AuthState {
  isAuthenticated: boolean;
  login: (password: string) => boolean;
  logout: () => void;
}
// This is a simple, hardcoded password for demonstration purposes.
// In a real-world application, this should be handled securely on the backend.
const ADMIN_PASSWORD = 'juliette';
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      login: (password: string) => {
        if (password === ADMIN_PASSWORD) {
          set({ isAuthenticated: true });
          return true;
        }
        return false;
      },
      logout: () => {
        set({ isAuthenticated: false });
      },
    }),
    {
      name: 'juliettes-closet-auth',
      storage: createJSONStorage(() => sessionStorage), // Use sessionStorage for session-only persistence
    }
  )
);