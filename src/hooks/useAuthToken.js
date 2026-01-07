import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_NAME = 'authData';

const setAuthToken = async (data) => {
    await AsyncStorage.setItem(STORAGE_NAME, JSON.stringify(data));
}

const getAuthToken = async () => {
    const data = await AsyncStorage.getItem(STORAGE_NAME);
    return data ? JSON.parse(data) : null;
}

const deleteAuthToken = async () => {
    await AsyncStorage.removeItem(STORAGE_NAME);
}

// ------------------------- User Token ---------------------------
const USER_TOKEN = 'useToken';
export const saveUserToken = async (token) => {
    return await AsyncStorage.setItem(USER_TOKEN, token);
}
export const checkUserToken = async () => {
    return await AsyncStorage.getItem(USER_TOKEN);
}

const useAuthToken = () => {
    return {
        setAuthToken,
        getAuthToken,
        deleteAuthToken,
        saveUserToken,
        checkUserToken
    }
}

export default useAuthToken