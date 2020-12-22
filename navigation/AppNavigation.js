import { createStackNavigator } from 'react-navigation-stack';
import HomeScreen from '../src/screens/HomeScreen';

const AppNavigation = createStackNavigator(
  {
    Home: HomeScreen
  },
  {
    initialRouteName: 'Home',
    headerMode: 'none'
  }
)

export default AppNavigation;
