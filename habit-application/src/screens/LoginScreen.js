import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  AsyncStorage,
  ImageBackground,
  TouchableOpacity,
  Dimensions } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { useNetInfo } from "@react-native-community/netinfo";
import changeNavigationBarColor, {
  hideNavigationBar,
  showNavigationBar } from 'react-native-navigation-bar-color';
import NetInfo from '@react-native-community/netinfo';
import { FontAwesome } from '@expo/vector-icons';
import ButtonLogin from '../components/ButtonLogin';
import PasswordLock from '../components/PasswordLock';
import SimpleTextLogin from '../components/SimpleTextLogin';
import ErrModal from '../components/ErrModal';
import { MyContext } from '../context/authContext';
import { MyContext as ThemeContext } from '../context/themeContext';
import { MyContext as LanguageContext } from '../context/languageContext';

const LoginScreen = ({navigation}) => {
  const {state, signin, tryLocalSignin} = useContext(MyContext);
  const themeContext = useContext(ThemeContext);
  const languageContext = useContext(LanguageContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [hiddenState, setHiddenState] = useState(true)
  const [loading, setLoading] = useState(false);
  const [badAttempt, setBadAttempt] = useState(false);
  const [loadingScreen, setLoadingScreen] = useState(true);
  const [errModalMsg, setErrModalMsg] = useState('');
  const netInfo = useNetInfo();
  const [readyNavigate, setReadyNavigate] = useState(false);
  const screenHeight = Dimensions.get('window').height;
  const screenWidth = Dimensions.get('window').height;

  useEffect(()=>{
    setUserSettings().then(()=>{
      navigation.setParams({ theme: themeContext.state });
      navigation.setParams({ language: languageContext.state });
    }).then(()=>{
      setReadyNavigate(true);
    });
  }, []);

  useEffect(() => {
    if(netInfo.type !== 'unknown' && readyNavigate){
      if(netInfo.isInternetReachable){
        setErrModalMsg('');
        tryLocalSignin().then((res)=>{
          if(res){
            navigation.navigate('Home', {language: languageContext.state.language});
          } else {
            setLoadingScreen(false);
          }
        });
      } else {
        setErrModalMsg(languageContext.state.language.errorNoInternet);
      }
    }
  }, [netInfo]);

  useEffect(() => {
    navigation.setParams({ theme: themeContext.state });
  }, [themeContext.state]);

  useEffect(() => {
    navigation.setParams({ language: languageContext.state });
  }, [languageContext.state]);

  useEffect(() => {
    if(readyNavigate){
      NetInfo.fetch().then(state => {
        if(state.isInternetReachable){
          tryLocalSignin().then((res)=>{
            if(res){
              navigation.navigate('Home', {language: languageContext.state.language});
            } else {
              setLoadingScreen(false);
            }
          });
        } else {
          setErrModalMsg(languageContext.state.language.errorNoInternet);
        }
      });
    };
  }, [readyNavigate]);

  const setUserSettings = async () =>{
    const userTheme = await AsyncStorage.getItem('theme');
    const userLanguage = await AsyncStorage.getItem('language');
    const showNotChosenDays = await AsyncStorage.getItem('showNotChosenDays');
    const longClickHabit = await AsyncStorage.getItem('longClickHabit');
    if(userTheme !== null){
      themeContext.changeTheme(userTheme);
    }
    await languageContext.loadSettings(userLanguage, showNotChosenDays, longClickHabit);
  };

  const attemptSignIn = async (email,password) =>{
    setLoadingScreen(true);
    NetInfo.fetch().then(async state => {
      if(state.isInternetReachable){
        const attempt = await signin({email,password});
        if(attempt){
          navigation.navigate('Home', {language: languageContext.state.language});
        } else {
          setBadAttempt(true);
          setPassword('');
          setLoadingScreen(false);
        }
      } else {
        setErrModalMsg(languageContext.state.language.errorNoInternet);
      }
    });
  };

  const navigateRegisterScreen = () => {
    setBadAttempt(false);
    setPassword('');
    setEmail('');
    navigation.navigate('Signup');
  };

  const navigateSettingsScreen = () => {
    navigation.navigate('SettingsMain', {
      theme: themeContext.state.theme,
      language: languageContext.state.language,
      flow: 'loginFlow'})
  };

  const navigateForgotPasswordScreen = () => {
    setBadAttempt(false);
    setPassword('');
    setEmail('');
    navigation.navigate('Forgot', {
      theme: themeContext.state.theme,
      language: languageContext.state.language});
  };

  return (
    <View style={styles(themeContext.state.theme, screenWidth, screenHeight).MainParent}>
      <ErrModal
        isVisible={errModalMsg!==''?true:false}
        errMessage={errModalMsg}
        onPressOutside={()=>setErrModalMsg('')}/>
      {loadingScreen && <View
        style={styles(themeContext.state.theme, screenWidth, screenHeight).loadingScreen}>
        <Image
          source={require('../../assets/appLogo.png')}
          style={styles(themeContext.state.theme, screenWidth, screenHeight).LoadingImage}/>
      </View>}
      <View>
        <Spinner
          visible={loading?true:false}
          textContent={languageContext.state.language.spinnerLoading}
          textStyle={styles(themeContext.state.theme, screenWidth, screenHeight).spinnerTextStyle}
        />
      </View>
      {!loadingScreen && <ImageBackground
        source={{uri: themeContext.state.theme.backgroundImage}}
        style={styles(themeContext.state.theme, screenWidth, screenHeight).ImageBackground}>
        <Image
          source={require('../../assets/appLogo.png')}
          style={styles(themeContext.state.theme, screenWidth, screenHeight).ImageStyle}/>
        <TextInput
          style = {styles(themeContext.state.theme, screenWidth, screenHeight).input}
          autoCapitalize="none"
          autoCorrect={false}
          value={email}
          onChangeText={(newValue) => setEmail(newValue)}
          placeholder={languageContext.state.language.userNameInputPlaceholder}
          placeholderTextColor={themeContext.state.theme.placeholderText}
        />
        <View style={styles(themeContext.state.theme, screenWidth, screenHeight).passwordInput}>
          <TextInput
            style = {styles(themeContext.state.theme, screenWidth, screenHeight).inputPass}
            autoCapitalize="none"
            autoCorrect={false}
            value={password}
            onChangeText={(newValue) => setPassword(newValue)}
            placeholder={languageContext.state.language.passwordInputPlaceholder}
            placeholderTextColor={themeContext.state.theme.placeholderText}
            secureTextEntry={hiddenState ? true : false}
            onSubmitEditing={(e)=>{attemptSignIn(email,password)}}
          />
          <PasswordLock
            onPress={()=>{setHiddenState(hiddenState => !hiddenState)}}
            name={hiddenState? "unlock" : "lock"}
            />
        </View>
        {badAttempt && <View>
          <Text style={styles(themeContext.state.theme, screenWidth, screenHeight).errorMessage}>
            {languageContext.state.language.loginScreenWrong}
          </Text>
        </View>}
        <ButtonLogin
          style={styles(themeContext.state.theme, screenWidth, screenHeight).Button}
          text={languageContext.state.language.login}
          onPress={()=>attemptSignIn(email,password)}/>
        <SimpleTextLogin
          text={languageContext.state.language.loginScreenSimpleText1}
          onPress={()=>navigateForgotPasswordScreen()}/>
        <SimpleTextLogin
          text={languageContext.state.language.loginScreenSimpleText2}
          onPress={()=>navigateRegisterScreen()}/>
        <TouchableOpacity
          style={{flex:1}}
          onPress={()=>navigateSettingsScreen()}>
          <FontAwesome style={{color:themeContext.state.theme.headerPlus, fontSize:30, alignSelf:'center', flex:1}} name="cog"/>
        </TouchableOpacity>

      </ImageBackground>}
    </View>
  )
};

LoginScreen.navigationOptions = () => {
  return {
    headerShown: false
  };
};

const styles = (props, screenWidth, screenHeight) => StyleSheet.create({
  input:{
    marginLeft:screenWidth*0.05,
    paddingLeft:10,
    marginRight:screenWidth*0.05,
    borderBottomWidth:1,
    borderColor: props.text,
    marginBottom: 10,
    marginTop:screenHeight*0.05,
    color: props.text,
  },
  inputPass:{
    flex:1,
    marginTop: 10,
    paddingLeft: 10,
    color: props.text,
  },
  passwordInput:{
    flexDirection: 'row',
    borderBottomWidth: 1,
    marginLeft:screenWidth*0.05,
    marginRight:screenWidth*0.05,
    borderColor: props.text,
  },
  MainParent:{
    flex: 1,
  },
  ImageStyle:{
    width:150,
    height: 150,
    alignSelf: 'center',
    marginTop: screenHeight*0.1,
  },
  ImageBackground:{
    flex: 1,
  },
  spinnerTextStyle: {
    color: '#FFF'
  },
  errorMessage: {
    paddingLeft:40,
    marginTop:10,
    color: props.text,
  },
  Button:{
    borderRadius: 30,
    backgroundColor: props.button,
    margin: 20,
    height: screenWidth*0.07,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop:50
  },
  loadingScreen:{
    backgroundColor:'#fff',
    flex:1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  LoadingImage:{
    width:100,
    height: 100,
    alignSelf: 'center',
  },
  LoadingText:{
    alignSelf: 'center',
    fontSize: 22,
  }
});

export default LoginScreen;
