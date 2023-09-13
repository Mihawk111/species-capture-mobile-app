import { useCallback, useLayoutEffect, useState } from 'react'
import { Alert, StyleSheet, Button } from 'react-native'
import MapView, { Marker } from 'react-native-maps'
import { useNavigation } from "@react-navigation/native";

export default function DynamicMap(props) {

    const navigation = useNavigation()

    const region = {
        latitude: props.route.params.latitude, 
        longitude: props.route.params.longitude, 
        latitudeDelta: 0.0009, 
        longitudeDelta: 0.0001
    }

    const [selectedLocation, setSelectedLocation] = useState({
        latitude: region.latitude, 
        longitude: region.longitude
    })

    console.log(`Got region = ${JSON.stringify(region)}`)
    console.log(`Got props = ${JSON.stringify(props)}`)

    function selectLocationhandler(event) {
        const latitude = event.nativeEvent.coordinate.latitude
        const longitude = event.nativeEvent.coordinate.longitude

        setSelectedLocation({
            latitude: latitude, 
            longitude: longitude
        })
    }

    // To avoid infinite dependency loop 
    const savePickedLocationHandler = useCallback(() => {
        if(!selectedLocation) {
            Alert.alert('No location picked !!!', 'Pick a location on the map first ...')
        } else {
            // React applies back navigation appropriately ...
            navigation.navigate('AddSpecies', selectedLocation)
        }
    }, [navigation, selectedLocation])

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: ({tintColor}) => <Button title="Save" onPress={savePickedLocationHandler} color="green" ></Button>
        })
    }, [navigation, savePickedLocationHandler])

    return (
        <MapView style={styles.main} initialRegion={region} onPress={selectLocationhandler}>
            <Marker title='Picked Location' coordinate={selectedLocation} />
        </MapView>
    )
}

const styles = StyleSheet.create({
    main: {
        flex: 1
    }
})