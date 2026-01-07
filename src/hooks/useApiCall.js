import { ApiEndpoints, ApiMethod, newApi } from '../services/AxiosInstance';
import AxiosInterceptor from '../services/AxiosInterceptor';
import { getEnvVars } from '../services/Environment';

const useApiCall = () => {
    const axiosInterceptor = AxiosInterceptor();
    const { apiUrl } = getEnvVars();

    const ApiCall = ({
        apiEndpoint,
        apiData = {},
        apiAccessToken = null,
        method = ApiMethod.POST,
        apiPointTo = apiUrl.app,
        timeout = 20000,
        abortSignal = null,
      }) => {
        const api = newApi(apiPointTo, apiAccessToken);
        apiEndpoint = api.url + apiEndpoint;

        console.log('ApiCall', apiEndpoint);

        let params = {
            method: method,
            url: apiEndpoint,
            timeout: timeout,
            headers: {
                'Content-Type': 'application/json',
            },
        }

        // Add Authorization header only if token is provided
        if (apiAccessToken) {
            params.headers['Authorization'] = api.bearer;
        }

        // Add abort signal only if provided
        if (abortSignal) {
            params.signal = abortSignal;
        }

        if (method === ApiMethod.POST || method === ApiMethod.PUT) {
            params.data = apiData;
        }

        return axiosInterceptor(params);
    }
    return {
        ApiCall,
        ApiEndpoints,
        ApiMethod,
        apiUrl
    }
}

export default useApiCall;