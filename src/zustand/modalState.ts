import { IModalProps } from '@/components/modal/Modal';
import { create } from 'zustand'


interface IModalState {
    modals: Record<string, IModalProps>
    openModal: (key: string, modal: IModalProps) => void;
    closeModal: (key: string) => void;
}

const useModalState = create<IModalState>()(
    (set) => ({
        modals: {},

        openModal: (key: string, modal: IModalProps) => set(state => {
            return {
                modals: { ...state.modals, [key]: modal }
            }
        }),
        closeModal: (key: string) => set(state => {
            const modals = { ...state.modals }
            delete modals[key]
            return { modals }
        })
    })
)

export default useModalState