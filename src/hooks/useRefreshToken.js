import { useSelector } from 'react-redux';
import { axiosInstance } from '../services/AxiosInstance';
import useAuthToken from './useAuthToken';

const useRefreshToken = () => {
    const userData = useSelector(state => state.user.userData);
    const { setAuthToken, getAuthToken } = useAuthToken();

    const refresh = async () => {
        try {   
            let authToken = await getAuthToken();
            if(!authToken) return null;
            
            const response = await axiosInstance.post('/refresh-access-token', {email: userData.email_addr, isKeepLogin: userData?.isKeepLogin}, {
                headers: {
                    Authorization: `Bearer ${authToken.refreshToken}`,
                },
            });
            const newAuthToken = response.data.data;

            if(newAuthToken){
                setAuthToken(newAuthToken);
                return newAuthToken.accessToken;
            }
            return null;
        } catch(error){
            console.log('useRefreshToken error', error.message)
            return null;
        }
    }
    return refresh;
};

export default useRefreshToken;