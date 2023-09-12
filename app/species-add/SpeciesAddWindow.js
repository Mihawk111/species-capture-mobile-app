import { Button, Image, StyleSheet, Text, TextInput, View } from "react-native";
import { launchCameraAsync, launchImageLibraryAsync } from 'expo-image-picker'
import { useState } from "react";
import { base64ToBlob } from '../shared/util'
import axios from "axios";
import appConfig from '../../app.json'

export default function SpeciesAddWindow(props) {
    defaultImageUrl = require('../../assets/default-image.png')
    const [pickedImageUri, setPickedImageUri] = useState('')

    function predictSpeciesAndFill(imageBinaryData) {
        const apiKey = appConfig.app["plant-net"]["api-key"]
        const formData = new FormData()
        formData.append('images', imageBinaryData)
        console.log(typeof imageBinaryData);
        axios.post(`https://my-api.plantnet.org/v2/identify/all?include-related-images=false&no-reject=false&lang=en&api-key=${apiKey}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then((data) => {
            console.log(data)
        }, (err) => {
            console.error(err)
            console.error(JSON.stringify(err))
            console.error('------------------------------')
        })
    }

    async function takeImageHandler() {
        const image = await launchCameraAsync({allowsEditing: true, base64: true})
        if(!image.canceled) {
            setPickedImageUri(image.assets[0].uri)
            const imageBinaryData = image.assets[0].base64
            predictSpeciesAndFill(imageBinaryData)
        }
    }

    async function selectImageHandler() {
        const image = await launchImageLibraryAsync({allowsEditing: true, base64: true})
        if(!image.canceled) {
            setPickedImageUri(image.assets[0].uri)
            const imageBinaryData = image.assets[0].base64
            predictSpeciesAndFill(imageBinaryData)
        }
    }

    if(pickedImageUri) imagePreview = <Image style={styles.img} source={{uri: pickedImageUri}} />
    else imagePreview = <Image style={styles.img} source={defaultImageUrl} />

    return (
        <View style={styles.main}>
            {imagePreview}
            <View style={styles.btn}>
                <Button title="Take Image" onPress={takeImageHandler} />
                <Button title="Choose Gallery" onPress={selectImageHandler} />
            </View>
            <View style={styles.inputContainer}>
                
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