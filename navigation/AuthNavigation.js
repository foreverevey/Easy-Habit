import { createStackNavigator } from 'react-navigation-stack';
import LoginScreen from '../src/screens/LoginScreen';
import RegisterScreen from '../src/screens/RegisterScreen';

const AuthNavigation = createStackNavigator(
  {
    Login: LoginScreen,
    Register: RegisterScreen,
  },
  {
    initialRouteName: 'Login',
    headerMode: 'none',
  }
)

export default AuthNavigation;
