import { useDispatch, useSelector } from 'react-redux';
import { useApiCall } from '.';

import { setUserData } from '../redux/reducer/User';

const useUserData = () => {
    const dispatch = useDispatch();
    const userData = useSelector((state) => state.user?.userData);
    const accessToken = useSelector((state) => state.user?.accessToken);
    const { ApiCall, ApiEndpoints, ApiMethod } = useApiCall();

    const fetchUserData = async () => {

        const response = await ApiCall({
            apiEndpoint: ApiEndpoints().USER_DATA + userData?.member_account,
            method: ApiMethod.GET,
            apiAccessToken: accessToken,
          });

        if (response?.data) {
            dispatch(setUserData(response?.data));
        }
        
    }
    
    return { fetchUserData };
};

export default useUserData;