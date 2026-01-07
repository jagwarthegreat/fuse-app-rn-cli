import React, { useEffect, useRef, useState } from 'react';
import { DeviceEventEmitter } from 'react-native';
import { checkMultiple, requestMultiple, PERMISSIONS } from 'react-native-permissions';
import { useApiCall } from '../hooks';
import { Snackbar } from 'react-native-paper';
import constants from '../constants';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation, useLinkTo } from '@react-navigation/native';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import firebaseMessaging, { firebase } from '@react-native-firebase/messaging';
import notifee, { AuthorizationStatus } from '@notifee/react-native';
import { checkUserToken, saveUserToken } from '../hooks/useAuthToken';
import { getEnvVars } from '../services/Environment';

const AppProvider = ({children}) => {
    
    const { EMITTER_KEY } = constants;
    const userData = useSelector(state => state.user.userData);
    const dispatch = useDispatch();
    const linkTo = useLinkTo();
    const navigation = useNavigation();
    const { ApiCall, ApiEndpoints, ApiMethod, ApiPoint } = useApiCall();
    const [snackbar, setSnackbar] = React.useState({visible: false, message: ''});

    useEffect(() => {
        initialize();
        initEmitter();
    },[])

    const initialize = async () => {
        await requestPermission();
        await firebaseGetLinkWhileAppIsClosed();
        await firebaseGetLinkWhileAppIsInBackground();
        await firebaseGetToken();
        await firebaseNotifReciever();
    }

    const initEmitter = () => {
        DeviceEventEmitter.addListener(EMITTER_KEY.SNACKBAR, async (message) => {
            setSnackbar({visible: true, message: message});
        });
    }

    const requestPermission = async () => {
        requestMultiple([
            PERMISSIONS.ANDROID.CAMERA,
        ]);
    }

    const onDismissSnackBar = () => {
        setSnackbar(false);
    }

    async function firebaseGetToken() {
        try {
            await firebaseMessaging().registerDeviceForRemoteMessages();
            const token = await firebaseMessaging().getToken();
            const localToken = await checkUserToken();
            console.log("firebaseGetToken", token)

            if (localToken !== token) {
                await saveUserToken(token);
            }

            // iOS - Requesting permissions
            const authStatus = await firebaseMessaging().requestPermission();
            const enabled = authStatus === firebaseMessaging.AuthorizationStatus.AUTHORIZED || authStatus === firebaseMessaging.AuthorizationStatus.PROVISIONAL;
            if (enabled) {
                //console.log('Authorization status:', authStatus);
            }
        } catch(e){
            console.log('firebaseGetToken', e.message)
        }
    }

    const firebaseGetLinkWhileAppIsClosed = async () => {
        const { apiUrl, env } = getEnvVars();

        try {
            const { url } = await dynamicLinks().getInitialLink();
            console.log('firebaseGetLinkWhileAppIsClosed', url);
        } catch (error) {
            console.log("firebaseGetLinkWhileAppIsClosed Error!", error.message)
        }
    }

    const firebaseGetLinkWhileAppIsInBackground = async () => {
        const { apiUrl, env } = getEnvVars();

        try {
            dynamicLinks().onLink((link) => {
                console.log('firebaseGetLinkWhileAppIsInBackground', link.url);
            });
        } catch (error) {
            console.log("firebaseGetLinkWhileAppIsInBackground Error!", error.message)
        }
    }
    
    const firebaseNotifReciever = async () => {
        
        firebaseMessaging().onNotificationOpenedApp(async remoteMessage => {
            console.log("onNotificationOpenedApp",remoteMessage);
            if (!remoteMessage) return

        });

        firebaseMessaging()
        .getInitialNotification()
        .then(async remoteMessage => {
            console.log("getInitialNotification", remoteMessage);
            if (!remoteMessage) return
            
        }).catch(async (error) => {
            console.log('getInitialNotification error', error)
        })

        const unsubscribe = firebaseMessaging().onMessage(async remoteMessage => {
            if (!remoteMessage) return
            DisplayNotification(remoteMessage);
        });

        return unsubscribe;
    }

    const DisplayNotification = async (remoteMessage) => {
        // Create a channel
        const channelId = await notifee.createChannel({
            id: 'default',
            name: 'Default Channel',
        });

        // Display a notification
        await notifee.displayNotification({
            title: remoteMessage.notification.title,
            body: remoteMessage.notification.body,
            android: {
                channelId,
            },
        });
    }

    return (
        <>
            {children}

            <Snackbar
                visible={snackbar.visible}
                onDismiss={onDismissSnackBar}
                action={{
                    label: 'Close',
                    onPress: () => {
                        // Do something
                    },
                }} 
            >
                {snackbar.message}
            </Snackbar>
        </>
    )
}

export default AppProvider;