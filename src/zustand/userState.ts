import { Session, User } from '@supabase/supabase-js';
import { create } from 'zustand'

interface IUserStore {
    user: null | User;
    session: null | Session;
    login: (user: User, session: Session) => void;
    logout: () => void;
}

const useUserStore = create<IUserStore>()((set) => ({
    user: null,
    session: null,
    login: (user: User, session: Session) => set((state) => ({ user, session })),
    logout: () => set((state) => ({ user: null, session: null })),
}))

export default useUserStore