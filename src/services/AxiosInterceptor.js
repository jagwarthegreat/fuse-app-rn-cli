import { useEffect } from "react";
import useAuthToken from '../hooks/useAuthToken';
import useRefreshToken from '../hooks/useRefreshToken';
import useSignOut from '../hooks/useSignOut';
import { axiosInstance } from './AxiosInstance';

const AxiosInterceptor = () => {
    const refresh = useRefreshToken();
    const { signOut } = useSignOut();
    const { getAuthToken } = useAuthToken();

    useEffect(() => {

        const requestIntercept = axiosInstance.interceptors.request.use(
            async config => {
                const authToken = await getAuthToken();
                const authHeader = config.headers['Authorization'];
                if (!authHeader || authHeader.includes('undefined') && authToken) {
                    config.headers['Authorization'] = `Bearer ${authToken?.accessToken}`;
                }
                return config;
            }, (error) => Promise.reject(error)
        );

        const responseIntercept = axiosInstance.interceptors.response.use(
            response => {
                return response
            },
            async (error) => {
                const prevRequest = error?.config;
                if (error?.response?.status === 401 && !prevRequest?.sent) {
                    const newAccessToken = await refresh();
                    if(newAccessToken){
                        prevRequest.sent = true;
                        prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                        return axiosInstance(prevRequest);
                    } else {
                        signOut('Session expired. Please login again.');
                    }
                }
                return Promise.reject(error);
            }
        );

        return () => {
            axiosInstance.interceptors.request.eject(requestIntercept);
            axiosInstance.interceptors.response.eject(responseIntercept);
        }
    }, [refresh, getAuthToken, signOut])

    return axiosInstance;
}

export default AxiosInterceptor;