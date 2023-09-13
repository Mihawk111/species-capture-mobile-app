import { Alert, Button, Image, StyleSheet, View, Text } from "react-native";
import { getCurrentPositionAsync, useForegroundPermissions, PermissionStatus } from 'expo-location'
import appConfig from '../../app.json'
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";

export default function LocationPicker(props) {

    const [locationPermission, requestPermission] = useForegroundPermissions()
    // const [pickedLocation, setPickedLocation] = useState()
    var pickedLocation = props.pickedLocation
    var setPickedLocation = props.setPickedLocation
    const navigation = useNavigation()

    // console.log(`Got props [Location Picker] = ${JSON.stringify(props)}`)


    async function verifyPermissions() {
        if(locationPermission.status === PermissionStatus.UNDETERMINED || locationPermission.status === PermissionStatus.DENIED) {
            const response = await requestPermission()
            return response.granted
        }
        return true
    }

    async function getLocationHandler() {
        const permissionGranted = await verifyPermissions()

        if(!permissionGranted) {
            Alert.alert('Insufficient Permission', 'You need to grant location permission to use this app\'s map feature')
            return
        }

        console.log('Trying to get location')
        setPickedLocation()

        const location = await getCurrentPositionAsync()
        console.log(location)
        setPickedLocation({
            latitude: location.coords.latitude, 
            longitude: location.coords.longitude
        })
    }

    function pickOnMapHandler() {
        var params = {
            latitude: 0, 
            longitude: 0
        }
        if(pickedLocation) { 
            params.latitude = pickedLocation.latitude
            params.longitude = pickedLocation.longitude
        }
        navigation.navigate('DynamicMap', params)
    }

    function getMapPreview(latitude, longitude) {
        const apiKey = appConfig.app["google-maps"]["api-key"]
        // const previewUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${latitude},${longitude}&zoom=14&size=400x200&maptype=roadmap&markers=color:blue%7Clabel:S%7C${latitude},${longitude}&key=${apiKey}&signature=YOUR_SIGNATURE`
        const previewUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${latitude},${longitude}&zoom=14&size=400x200&maptype=roadmap&markers=color:blue%7Clabel:S%7C${latitude},${longitude}&key=${apiKey}`
        console.log(`Preview Url = ${previewUrl}`)
        return previewUrl
    }

    var locationMap
    if(!pickedLocation) locationMap = <Text>Pick a location</Text>
    else locationMap = <Image style={styles.map} source={{uri: getMapPreview(pickedLocation.latitude, pickedLocation.longitude)}} />

    return (
        <View style={{marginBottom: 20, paddingHorizontal: 2, paddingVertical: 5, borderWidth: 1, borderColor: 'blue', borderRadius: 5}}>
            <View style={styles.mapPreview}>
                {locationMap}
            </View>
            <View style={styles.actions}>
                <Button title="Current Location" onPress={getLocationHandler} />
                <Button title="Open Map" onPress={pickOnMapHandler} />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    mapPreview: {
        width: '100%', 
        height: 200, 
        marginBottom: 8, 
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: 'grey', 
        borderRadius: 4
    }, 
    actions: {
        flexDirection: 'row', 
        justifyContent: 'space-around', 
        alignItems: 'center'
    }, 
    map: {
        height:'100%', 
        width:'100%'
    }
})