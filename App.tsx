import { Merienda_400Regular, useFonts } from '@expo-google-fonts/merienda';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, DefaultTheme, Provider as PaperProvider } from 'react-native-paper';

import { Home } from './screens/Home/home';
import { LogInContainer } from './screens/LogIn/loginContainer';
import { Splash } from './screens/Splash/Splash';

const Stack = createNativeStackNavigator();

export default function App() {
  let [fontsLoaded] = useFonts({
    Merienda_400Regular
  });

  if ( !fontsLoaded ) return <ActivityIndicator/>

  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Splash" screenOptions={ { headerShown: false } }>
          <Stack.Screen
            name="LogIn"
            component={LogInContainer}/>
          <Stack.Screen
            name='Home'
            component={Home}/>
          <Stack.Screen
            name="Splash"
            component={Splash}
            initialParams={ {to: "LogIn"} }/>
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
