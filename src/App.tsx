import React from 'react';
import type {PropsWithChildren} from 'react';
import { SafeAreaView, Text, View } from 'react-native';


//Navigation
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { NavigationContainer } from '@react-navigation/native';

//Screens
import Home from './screens/Home';

const Stack = createNativeStackNavigator();

function App(): React.JSX.Element {

  return (
    
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name = 'Home'  component={Home} options={{headerShown: false}} ></Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
export default App;
