import React, {useState, useContext, useEffect} from 'react';
import {View, Text, TextInput, StyleSheet, Image, AsyncStorage, ImageBackground} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import {useNetInfo} from "@react-native-community/netinfo";
import NetInfo from '@react-native-community/netinfo';
import ButtonLogin from '../components/ButtonLogin';
import PasswordLock from '../components/PasswordLock';
import SimpleTextLogin from '../components/SimpleTextLogin';
import ErrModal from '../components/ErrModal';
import {MyContext} from '../context/authContext';
import {MyContext as ThemeContext} from '../context/themeContext';
import {MyContext as LanguageContext} from '../context/languageContext';

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

  useEffect(()=>{
    //TODO: maybe use state to not show screen before this function runs?

    setUserSettings().then(()=>{
      navigation.setParams({ theme: themeContext.state });
      navigation.setParams({ language: languageContext.state });
    }).then(()=>{
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
          setErrModalMsg('Internet connection not found! Please connect to the internet');
        }
      });
      // can fake errors with this code instead one above *****************
      // const signedin = tryLocalSignin();
      // if(signedin){
      //   navigation.navigate('Home', {language: languageContext.state.language});
      // } else {
      //   setLoadingScreen(false);
      // }
    });
  }, []);

  useEffect(() => {
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
      setErrModalMsg('Internet connection not available!');
    }
  }, [netInfo]);

  useEffect(() => {
    navigation.setParams({ theme: themeContext.state });
  }, [themeContext.state]);

  useEffect(() => {
    navigation.setParams({ language: languageContext.state });
  }, [languageContext.state]);

  const setUserSettings = async () =>{
    // Load user selected theme and language from storage
    const userTheme = await AsyncStorage.getItem('theme');
    const userLanguage = await AsyncStorage.getItem('language');
    if(userTheme !== null){
      themeContext.changeTheme(userTheme);
    }
    if(userLanguage !== null){
      languageContext.changeLanguage(userLanguage);
    }
  };

  const attemptSignIn = async (email,password) =>{
    // setLoading(true);
    setLoadingScreen(true);
    const attempt = await signin({email,password});
    if(attempt){
      navigation.navigate('Home', {language: languageContext.state.language});
    } else {
      setBadAttempt(true);
      setPassword('');
      // setLoading(false);
      setLoadingScreen(false);
    }
  };

  const navigateRegisterScreen = () => {
    setBadAttempt(false);
    setPassword('');
    setEmail('');
    navigation.navigate('Signup');
  };

  return (
    <View style={styles(themeContext.state.theme).MainParent}>
      <ErrModal isVisible={errModalMsg!==''?true:false} errMessage={errModalMsg} onPressOutside={()=>setErrModalMsg('')}/>
      {loadingScreen && <View style = {styles(themeContext.state.theme).loadingScreen}>
        <Image source={require('../../assets/movie-icon-11.png')} style={styles(themeContext.state.theme).LoadingImage}/>
        <Text style={styles(themeContext.state.theme).LoadingText}>habitApp</Text>
      </View>}
      <View>
        <Spinner
          visible={loading?true:false}
          textContent={languageContext.state.language.spinnerLoading}
          textStyle={styles(themeContext.state.theme).spinnerTextStyle}
        />
      </View>
      {!loadingScreen && <ImageBackground source={{uri: themeContext.state.theme.backgroundImage}} style={styles(themeContext.state.theme).ImageBackground}>
        <Image source={require('../../assets/movie-icon-11.png')} style={styles(themeContext.state.theme).ImageStyle}/>
        <TextInput
          style = {styles(themeContext.state.theme).input}
          autoCapitalize="none"
          autoCorrect={false}
          value={email}
          onChangeText={(newValue) => setEmail(newValue)}
          placeholder={languageContext.state.language.userNameInputPlaceholder}
          placeholderTextColor={themeContext.state.theme.placeholderText}
        />
        <View style={styles(themeContext.state.theme).passwordInput}>
          <TextInput
            style = {styles(themeContext.state.theme).inputPass}
            autoCapitalize="none"
            autoCorrect={false}
            value={password}
            onChangeText={(newValue) => setPassword(newValue)}
            placeholder={languageContext.state.language.passwordInputPlaceholder}
            placeholderTextColor={themeContext.state.theme.placeholderText}
            secureTextEntry={hiddenState ? true : false}
            onSubmitEditing={(e)=>{attemptSignIn(email,password)}}
          />
          <PasswordLock onPress={()=>{setHiddenState(hiddenState => !hiddenState)}} name={hiddenState? "unlock" : "lock"}
            />
        </View>
        {badAttempt && <View>
          <Text style={styles(themeContext.state.theme).errorMessage}>{languageContext.state.language.loginScreenWrong}</Text>
        </View>}
        <ButtonLogin style={styles(themeContext.state.theme).Button} text={languageContext.state.language.login} onPress={()=>attemptSignIn(email,password)}/>
        <SimpleTextLogin text={languageContext.state.language.loginScreenSimpleText1}/>
        <SimpleTextLogin text={languageContext.state.language.loginScreenSimpleText2} onPress={()=>navigateRegisterScreen()}/>
      </ImageBackground>}
    </View>
  )
};

LoginScreen.navigationOptions = () => {
  return {
    headerShown: false
  };
};

const styles = (props) => StyleSheet.create({
  input:{
    marginLeft:30,
    paddingLeft:20,
    marginRight:30,
    borderBottomWidth:1,
    borderRadius:30,
    borderColor: props.text,
    marginBottom: 10,
    marginTop:75,
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
    marginLeft:40,
    marginRight:40,
    borderColor: props.text
  },
  MainParent:{
    // borderWidth: 1,
    // borderColor: 'black',
    flex: 1,
  },
  ImageStyle:{
    width:150,
    height: 150,
    alignSelf: 'center',
    marginTop: 75,
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
    height: 45,
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
    marginRight:15,
  },
  LoadingText:{
    alignSelf: 'center',
    fontSize: 22,
  }
});

export default LoginScreen;
