// Firebase messaging is not compatible with Expo Go
// To use Firebase, you need a development build or bare React Native
// Run: npx expo run:android or npx expo run:ios

// Placeholder functions for now
const subscribeNotif = async (userEmail) => {
    console.log('Firebase messaging not available in Expo Go. User:', userEmail);
    // TODO: Implement with development build
}

const unSubscribeNotif = async (userEmail) => {
    console.log('Firebase messaging not available in Expo Go. User:', userEmail);
    // TODO: Implement with development build
}

export default {
    subscribeNotif,
    unSubscribeNotif
};
