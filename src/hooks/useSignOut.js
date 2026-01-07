import AsyncStorage from '@react-native-async-storage/async-storage';
import { DeviceEventEmitter } from 'react-native';
import { useDispatch } from 'react-redux';
import constants from '../constants';
import { setAccessToken, setUserData } from '../redux/reducer/User';
import useAuthToken from './useAuthToken';

const useSignOut = () => {
    const dispatch = useDispatch();
    const { deleteAuthToken } = useAuthToken();
    const { EMITTER_KEY } = constants;

    const signOut = async (message = 'Session has expired') => {
        try {   
            // Clear Redux state first
            dispatch(setUserData(null));
            dispatch(setAccessToken(null));
            
            // Clear all auth data from AsyncStorage
            await deleteAuthToken();
            // Also clear the user token
            await AsyncStorage.removeItem('useToken');
            
            // TODO: Firebase messaging unsubscribe
            // Only works with development build or bare React Native
            // If you need Firebase, run: npx expo run:android or npx expo run:ios
            // For now, this is commented out to work with Expo Go
            // await unSubscribeNotif(userData?.email_addr);
            
            if (EMITTER_KEY?.SNACKBAR) {
                DeviceEventEmitter.emit(EMITTER_KEY.SNACKBAR, message);
            }
            
            // Navigation will happen automatically via RootStackNavigation
            // when userData is set to null in Redux state
            
            return true;
        } catch(error){
            console.log('signOut error', error.message)
            return false;
        }
    }
    
    return { signOut };
};

export default useSignOut;