import { Button, PermissionsAndroid, StatusBar, StyleSheet, Text, View } from 'react-native';
import appConfig from '../../app.json'

const requestCameraPermission = async () => {
    var appName = appConfig.expo.name
    try {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA,
            {
                title: `${appName} Camera Permission`,
                message:
                    `${appName} needs access to your camera so you can take pictures.`,
                buttonNeutral: 'Ask Me Later',
                buttonNegative: 'Cancel',
                buttonPositive: 'OK',
            },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log('You can use the camera');
        } else {
            console.log('Camera permission denied');
        }
    } catch (err) {
        console.warn(err);
    }
};