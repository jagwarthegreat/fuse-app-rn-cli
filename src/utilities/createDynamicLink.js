import * as Linking from 'expo-linking';
import { getEnvVars } from '../services/Environment';

export const createDynamicLink = async (data) => {
    const { apiUrl } = getEnvVars();
    
    // Create a deep link using expo-linking
    const link = Linking.createURL(`products/${data}`, {
        scheme: 'yourapp', // Update this to match your app scheme in app.json
        queryParams: {
            apiUrl, // Pass the API URL as a query param if needed by your app
        }
    });
    
    // For production, you'd want to use a URL shortener service here
    // or configure universal links (iOS) / app links (Android)
    return {
        url: link,
        // If you need short links, integrate a service like Bitly, Branch.io, or your own
    };
};