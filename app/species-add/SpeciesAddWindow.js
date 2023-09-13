import { Button, Image, StyleSheet, Text, TextInput, View, ToastAndroid, ScrollView, ActivityIndicator } from "react-native";
import { launchCameraAsync, launchImageLibraryAsync, MediaTypeOptions } from 'expo-image-picker'
import { useEffect, useState } from "react";
import { base64ToBlob } from '../shared/util'
import FloatingLabelTextInput from '../shared/FloatingLabelTextInput'
// import { FloatingLabelInput } from 'react-native-floating-label-input';
import axios from "axios";
import appConfig from '../../app.json'
import { getSpeciesDetails } from '../service/species_service'
import LocationPicker from "../shared/LocationPicker";
import DynamicMap from "../shared/DynamicMap";
import { useNavigation, useRoute } from "@react-navigation/native";

export default function SpeciesAddWindow(props) {
    defaultImageUrl = require('../../assets/default-image.png')
    const [pickedImageUri, setPickedImageUri] = useState('')
    const [classifyingSpecies, setClassifyingSpecies] = useState(false)
    const [scientificNameField, setScientificNameField] = useState('')
    const [nameField, setNameField] = useState('')
    const [descriptionField, setDescriptionField] = useState('')
    const [userDescriptionField, setUserDescriptionField] = useState('')
    const [pickedLocation, setPickedLocation] = useState()
    const classifyUrl = appConfig.app.backend.url + appConfig.app.backend.endpoints.classifySpecies

    console.log(`Got props [Add] = ${JSON.stringify(props)}`)

    const route = useRoute()
    const mapPickedLocation = route.params && {
        latitude: route.params.latitude, 
        longitude: route.params.longitude
    }
    route.params = undefined  // To avoid the params being carried on in the next rendering when updateState() is called for current location button ...

    // To avoid infinite rendering due to useState's set state ...
    if(mapPickedLocation && (!pickedLocation || pickedLocation.latitude != mapPickedLocation.latitude || pickedLocation.longitude != mapPickedLocation.longitude)) {
        setPickedLocation(mapPickedLocation)
    }

    // // Not working why ???
    // useEffect(() => {
    //     if(mapPickedLocation) {
    //         setPickedLocation(mapPickedLocation)
    //     }
    // }, [mapPickedLocation])


    function setDefaults() {
        setScientificNameField('')
        setNameField('')
        setDescriptionField('')
        setUserDescriptionField('')
        setPickedLocation()
    }

    function predictSpeciesAndFill(imageBinaryData) {
        var scientificName = null
        setDefaults()
        setClassifyingSpecies(true)
        axios.post(classifyUrl, imageBinaryData, {
            headers: {
                'Content-Type': 'text/plain'
            }
        }).then((data) => {
            // console.log(data)
            const res = data.data
            scientificName = res.scientificName
            console.log(`Scientific Name = ${scientificName}`)

            if(scientificName === null || scientificName === undefined) {
                ToastAndroid.showWithGravity('Tree Species could not be determined', ToastAndroid.SHORT, ToastAndroid.TOP)
                throw new Error('Species could not be found')
            }
            
            scientificName = scientificName.toLowerCase().trim()
            console.log(`Processed Scientific Name = ${scientificName}`)
            return getSpeciesDetails(scientificName)
        }).then((data) => {
            const res = data.data
            console.log(`Species Found = ${JSON.stringify(res)}`)
            setScientificNameField(scientificName)

            if(res) {
                setNameField(res.name)
                setDescriptionField(res.description)
            } else {
                ToastAndroid.showWithGravity('Seems to be a new species !!!', ToastAndroid.SHORT, ToastAndroid.TOP)
            }

            setClassifyingSpecies(false)
        })
        .catch((err) => {
            console.error(err)
            console.error(JSON.stringify(err))
            console.error('------------------------------')
            // ToastAndroid.showWithGravity('Could not connect to server !!!', ToastAndroid.SHORT, ToastAndroid.TOP)
            setClassifyingSpecies(false)
        })
    }

    async function takeImageHandler() {
        const image = await launchCameraAsync({allowsEditing: true, base64: true, mediaTypes: MediaTypeOptions.Images})
        if(!image.canceled) {
            setPickedImageUri(image.assets[0].uri)
            const imageBinaryData = image.assets[0].base64
            predictSpeciesAndFill(imageBinaryData)
        }
    }

    async function selectImageHandler() {
        const image = await launchImageLibraryAsync({allowsEditing: true, base64: true, mediaTypes: MediaTypeOptions.Images})
        if(!image.canceled) {
            setPickedImageUri(image.assets[0].uri)
            const imageBinaryData = image.assets[0].base64
            predictSpeciesAndFill(imageBinaryData)
        }
    }

    var imagePreview
    if(pickedImageUri) imagePreview = <Image style={styles.img} source={{uri: pickedImageUri}} />
    else imagePreview = <Image style={styles.img} source={defaultImageUrl} />

    var inputSection
    if(classifyingSpecies) inputSection =   <View style={{alignItems: 'center'}}>
                                                <ActivityIndicator size="200" color="blue" />
                                                <Text style={{marginTop: 20, fontSize: 20}}> Loading ... </Text>
                                            </View>
    else if(!pickedImageUri) inputSection = <View style={{alignItems: 'center'}}>
                                                <Text style={{marginTop: 20, fontSize: 20}}>Select image first ...</Text>
                                            </View>
    else inputSection = <View>
                            <FloatingLabelTextInput label="Name" value={nameField} onChangeText={setNameField}/>
                            <FloatingLabelTextInput label="Scientific Name" value={scientificNameField} onChangeText={setScientificNameField}/>
                            {(descriptionField)? (<FloatingLabelTextInput label="Description" value={descriptionField} onChangeText={setDescriptionField} editable={false} />): (<></>)}
                            <FloatingLabelTextInput label="User Description" value={userDescriptionField} onChangeText={setUserDescriptionField}/>
                            <LocationPicker pickedLocation={pickedLocation} setPickedLocation={setPickedLocation} />
                            <Button title="Add Entry" onPress={null} color={'#00bb00'} />
                        </View>

    return (
        <View style={styles.main}>
            {imagePreview}
            <View style={styles.btn}>
                <Button title="Take Image" onPress={takeImageHandler} />
                <Text style={{marginLeft: 30}}></Text>
                <Button title="Choose Gallery" onPress={selectImageHandler} />
            </View>
            <View style={styles.inputContainer}>
                <ScrollView>
                    {inputSection}
                    {/* <LocationPicker pickedLocation={pickedLocation} setPickedLocation={setPickedLocation} /> */}
                </ScrollView>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    main: {
        padding: 10, 
        flex: 1, 
        alignItems: 'center', 
        backgroundColor: '#fefefe'
    }, 
    img: {
        marginTop: 30, 
        width: '100%', 
        height: '40%', 
        resizeMode: 'stretch'
    }, 
    btn: {
        marginTop: 10, 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        flex: 0
    }, 
    inputContainer: {
        marginTop: 40, 
        padding: 15, 
        flex: 1, 
        height: '100%', 
        width: '100%', 
        borderWidth: 3, 
        borderColor: '#00ff00', 
        borderRadius: 10, 
        backgroundColor: '#efefef'
    }, 
    input: {
        fontSize: 16, // Text size
        color: '#333', // Text color
        padding: 5, // Vertical padding inside the input
        margin: 12,
        borderWidth: 1,
    }
})