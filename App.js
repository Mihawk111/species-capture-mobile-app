import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import SpeciesAddWindow from './app/species-add/SpeciesAddWindow';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import DynamicMap from './app/shared/DynamicMap';

const Stack = createNativeStackNavigator();

export default function App() {
    
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{
                headerStyle: {
                    backgroundColor: '#00aadd', 
                },
                headerTintColor: '#fff', 
                headerTitleAlign: 'center', 
                headerTitleStyle: {
                    fontWeight: 'bold', 
                    
                },
            }}>
                <Stack.Screen name="AddSpecies" component={SpeciesAddWindow} options={{title: 'Add Species'}} />
                <Stack.Screen name='DynamicMap' component={DynamicMap} options={{title: 'Pick a Location'}} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        // alignItems: 'center',
        // justifyContent: 'center',
    },
});
