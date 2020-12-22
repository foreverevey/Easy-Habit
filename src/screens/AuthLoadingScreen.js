import React, {useEffect} from 'react';
import { View, Text , StyleSheet, AsyncStorage, ActivityIndicator, StatusBar } from 'react-native';

const AuthLoadingScreen = ({navigation}) => {

  useEffect(()=>{
    _checkForToken();
  }, []);

  _checkForToken = async () => {
    const userToken = await AsyncStorage.getItem('logged_in');
    console.log('\n\n', userToken);
    navigation.navigate(userToken =='yes'? 'App' : 'Auth');
  }

  return (
    <View style={styles.container}>
      <ActivityIndicator />
      <StatusBar barStyle="default" />
    </View>
  )
};

const styles = StyleSheet.create({
  container:{
    flex:1,
    alignItems:"center",
    justifyContent: 'space-around',
  }
});

export default AuthLoadingScreen;
