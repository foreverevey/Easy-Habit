import React from 'react';
import { createSwitchNavigator, createAppContainer, AsyncStorage } from 'react-navigation';
import { createStackNavigator} from 'react-navigation-stack';
import AuthNavigation from './navigation/AuthNavigation';
import AppNavigation from './navigation/AppNavigation';
import RegisterScreen from './src/screens/RegisterScreen';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import CreateHabitScreen from './src/screens/CreateHabitScreen';
import AboutScreen from './src/screens/AboutScreen.js';
import {Provider} from './src/context/authContext';
import { setNavigator } from './src/navigationRef';
import {Provider as HabitProvider} from './src/context/habitContext';
import {Provider as ThemeProvider} from './src/context/themeContext';
import {Provider as LanguageProvider} from './src/context/languageContext';
import HabitDetailScreen from './src/screens/HabitDetailScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import ForgotPasswordScreen from './src/screens/ForgotPassword';

const SwitchNavigator = createSwitchNavigator({
  loginFlow: createStackNavigator({
    Signin: LoginScreen,
    Signup: RegisterScreen,
    Forgot: ForgotPasswordScreen,
    SettingsMain: SettingsScreen,
    AboutMain: AboutScreen,
  }),
  mainFlow: createStackNavigator({
    Home: HomeScreen,
    Create: CreateHabitScreen,
    Detail: HabitDetailScreen,
    Settings: SettingsScreen,
    About: AboutScreen,
  })
    // initialRouteName:  'AuthLoading',
});

const App = createAppContainer(SwitchNavigator);

// export default App;
export default () =>{
  return (
    <LanguageProvider>
      <ThemeProvider>
        <HabitProvider>
          <Provider>
            <App ref={(navigator) => { setNavigator(navigator) }}/>
          </Provider>
        </HabitProvider>
      </ThemeProvider>
    </LanguageProvider>
  )
};
