import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  ImageBackground,
  TouchableOpacity,
  Dimensions } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import isEmail from 'validator/lib/isEmail';
import { FontAwesome } from '@expo/vector-icons';
import ButtonLogin from '../components/ButtonLogin';
import PasswordLock from '../components/PasswordLock';
import SimpleTextLogin from '../components/SimpleTextLogin';
import { MyContext } from '../context/authContext';
import { MyContext as ThemeContext } from '../context/themeContext';
import { MyContext as LanguageContext } from '../context/languageContext';

const RegisterScreen = ({navigation}) => {
  const {state, signup} = useContext(MyContext);
  const themeContext = useContext(ThemeContext);
  const languageContext = useContext(LanguageContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [hiddenState, setHiddenState] = useState(true);
  const [loading, setLoading] = useState(false);
  const [badAttempt, setBadAttempt] = useState(false);
  const [emailValidate, setEmailValidate] = useState(true);
  const screenHeight = Dimensions.get('window').height;
  const screenWidth = Dimensions.get('window').height;

  const attemptSignUp = async (email,password) =>{
    const validateEmail = isEmail(email);
    if(validateEmail){
      setLoading(true);
      setEmailValidate(true);
      const attempt = await signup({email,password});
      if(attempt){
        navigation.navigate('Home', {language: languageContext.state.language});
      } else {
        setBadAttempt(true);
        setPassword('');
        setEmail('');
        setLoading(false);
      }
    } else {
      setEmailValidate(false);
    }
  };

  const navigateSettingsScreen = () => {
    navigation.navigate('SettingsMain', {
      theme: themeContext.state.theme,
      language: languageContext.state.language,
      flow: 'loginFlow'})
  };

  return (
    <View style={styles(themeContext.state.theme, screenWidth, screenHeight).MainParent}>
      <View>
        <Spinner
          visible={loading?true:false}
          textContent={languageContext.state.language.spinnerLoading}
          textStyle={styles(themeContext.state.theme, screenWidth, screenHeight).spinnerTextStyle}
        />
      </View>
      <ImageBackground
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
            onSubmitEditing={(e)=>{attemptSignUp(email,password)}}
          />
          <PasswordLock
            onPress={()=>{setHiddenState(hiddenState => !hiddenState)}}
            name={hiddenState? "unlock" : "lock"}/>
        </View>
        {badAttempt && <View>
          <Text style={styles(themeContext.state.theme, screenWidth, screenHeight).errorMessage}>
            {languageContext.state.language.registerScreenWrong}
          </Text>
        </View>}
        {!emailValidate && <View>
          <Text style={styles(themeContext.state.theme, screenWidth, screenHeight).errorMessage}>
            {languageContext.state.language.registerScreenValidate}
          </Text>
        </View>}
        <ButtonLogin
          style={styles(themeContext.state.theme, screenWidth, screenHeight).Button}
          text={languageContext.state.language.register}
          onPress={()=>attemptSignUp(email,password)}/>
        <SimpleTextLogin
          text={languageContext.state.language.registerScreenSimpleText1}
          onPress={()=>navigation.navigate('Signin')}
          style={styles(themeContext.state.theme, screenWidth, screenHeight).NewAcc}/>
        <TouchableOpacity
          style={{flex:1}}
          onPress={()=>navigateSettingsScreen()}>
          <FontAwesome style={{color:themeContext.state.theme.headerPlus, fontSize:30, alignSelf:'center', flex:1}} name="cog"/>
        </TouchableOpacity>
      </ImageBackground>
  </View>
  )
};

RegisterScreen.navigationOptions = () => {
  return {
    headerShown: false,
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
  Button:{
    borderRadius: 30,
    backgroundColor: props.button,
    margin: 20,
    height: screenWidth*0.07,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop:50
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
    borderWidth: 1,
    borderColor: 'black',
    flex: 1,
  },
  NewAcc:{
    alignSelf: 'center',
    marginTop:100,
    textAlign: 'center',
    textAlignVertical: 'center',
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
  errorMessage: {
    paddingLeft:40,
    marginTop:10,
    color: props.text,
  },
  spinnerTextStyle: {
    color: '#FFF'
  },
});

export default RegisterScreen;
