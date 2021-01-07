import React from 'react';
import { createSwitchNavigator, createAppContainer, AsyncStorage } from 'react-navigation';
import { createStackNavigator} from 'react-navigation-stack';
import AuthNavigation from './navigation/AuthNavigation';
import AppNavigation from './navigation/AppNavigation';
import RegisterScreen from './src/screens/RegisterScreen';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import AuthLoadingScreen from './src/screens/AuthLoadingScreen';
import CreateHabitScreen from './src/screens/CreateHabitScreen';
import {Provider} from './src/context/authContext';
import { setNavigator } from './src/navigationRef';
import {Provider as HabitProvider} from './src/context/habitContext';
import {Provider as ThemeProvider} from './src/context/themeContext';
import HabitDetailScreen from './src/screens/HabitDetailScreen';

const SwitchNavigator = createSwitchNavigator({
  loginFlow: createStackNavigator({
    Signin: LoginScreen,
    Signup: RegisterScreen,
  }),
  mainFlow: createStackNavigator({
    Home: HomeScreen,
    Auth: AuthLoadingScreen,
    Create: CreateHabitScreen,
    Detail: HabitDetailScreen,
  })
    // initialRouteName:  'AuthLoading',
});

const App = createAppContainer(SwitchNavigator);

// export default App;
export default () =>{
  return (
    <ThemeProvider>
      <HabitProvider>
        <Provider>
          <App ref={(navigator) => { setNavigator(navigator) }}/>
        </Provider>
      </HabitProvider>
    </ThemeProvider>
  )
};
