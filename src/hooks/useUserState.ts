import { useStore } from '../store/useStore';

export const useUserState = () => {
    const userState = useStore(state => state.getUserState());
    return userState;
};
