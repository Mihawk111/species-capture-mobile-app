import React, { Component } from 'react';
import { View, StatusBar, TextInput, Animated, StyleSheet, Text } from 'react-native';

export default function FloatingLabelTextInput(props) {
    return (
        <View style={[styles.container, {
            backgroundColor: (props.editable === false)? '#ffeeee': '#ffffff', 
            borderColor: (props.editable === false)? 'red': 'grey'
        }]}>
            <Text style={[styles.label, {
                color: (props.editable === false)? 'red': 'grey',
            }]}>
                {props.label}
            </Text>
            <TextInput
                style={styles.input}
                autoCapitalize="none"
                value={props.value}
                onChangeText={props.onChangeText}
                keyboardType={props.keyboardType}
                editable={props.editable}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
        backgroundColor: 'white',
        paddingTop: 5,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 2,
    },
    icon: {
        width: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    input: {
        // fontFamily: FONT_FAMILY.primaryMedium,
        fontSize: 13,
        height: 35,
        color: 'black',
    },
    label: {
        // fontFamily: FONT_FAMILY.primary,
        color: 'grey',
        fontSize: 10,
    },
});