import { localStorageKeyName } from "../constants";
import useLocalStorage from "./useLocalStorage";

export const useAuth = () => {
    const userData = useLocalStorage().getLocalStorage(localStorageKeyName)
    return userData;
};