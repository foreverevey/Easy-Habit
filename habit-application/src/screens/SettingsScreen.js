import React, {useState, useContext, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  AsyncStorage,
  Picker,
  ScrollView
} from 'react-native';
import habitApi from '../api/habitApi';
import NetInfo from '@react-native-community/netinfo';
import Spinner from 'react-native-loading-spinner-overlay';
import translations from '../translation/Translations';
import Spacer from '../components/Spacer';
import ThemeSwitch from '../components/ThemeSwitch';
import ButtonLogin from '../components/ButtonLogin';
import LineButton from '../components/LineButton';
import CustomModal from '../components/CustomModal';
import ErrModal from '../components/ErrModal';
import MyHeaderSecondary from '../components/HeaderSecondary';
import {MyContext as ThemeContext} from '../context/themeContext';
import {MyContext as LanguageContext} from '../context/languageContext';

const SettingsScreen = ({navigation}) => {
  const {state, changeTheme} = useContext(ThemeContext);
  const languageContext = useContext(LanguageContext);
  const [bugModal, setBugModal] = useState(false);
  const [feedbackModal, setFeedbackModal] = useState(false);
  const [errModalMsg, setErrModalMsg] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const _changeThemeCheerful = () => {
    if (state.theme.name === 'cheerful') {
      changeTheme('clean');
    } else {
      changeTheme('cheerful');
    }
  };

  const _changeThemeClean = () => {
    if (state.theme.name === 'clean') {
      changeTheme('cheerful');
    } else {
      changeTheme('clean');
    }
  };

  const _changeThemeDark = () => {
    if (state.theme.name === 'dark') {
      changeTheme('cheerful');
    } else {
      changeTheme('dark');
    }
  };

  const _changeShowNotChosenDays = () => {
    if (languageContext.state.showNotChosenDays === 'true') {
      languageContext.changeShowDays('false');
    } else {
      languageContext.changeShowDays('true');
    }
  };

  const _changeLongClickHabit = () =>{
    if (languageContext.state.longClickHabit === 'true') {
      languageContext.changeLongClick('false');
    } else {
      languageContext.changeLongClick('true');
    }
  };

  const clearStorage = async () => {
    try {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('theme');
      await AsyncStorage.removeItem('showNotChosenDays');
      await AsyncStorage.removeItem('longClickHabit');
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  const sendEmail = async (body, subject) => {
    setLoading(true);
    NetInfo.fetch().then(async state => {
      if(state.isInternetReachable){
        try {
          const to = "patkppDev@gmail.com";
          const from = "patkppDev@gmail.com";
          const response = await habitApi.post('/email', {to, from, body, subject});
          setLoading(false);
          if(subject==='Bug Report'){
            setErrModalMsg(languageContext.state.language.successBugSent);
          } else {
            setErrModalMsg(languageContext.state.language.successFeedbackSent);
          }
          setTimeout(() => {
            setErrModalMsg('');
          }, 1500);
        } catch (error) {
          setLoading(false);
          setErrModalMsg(languageContext.state.language.errorEmailNotSent);
          setTimeout(() => {
            setErrModalMsg('');
          }, 1500);
        }
      } else {
        setLoading(false);
        setErrModalMsg(languageContext.state.language.errorNoInternet);
      }
    });
  };

  const openModal = (modalType) => {
    if (modalType === 'bug') {
      setBugModal(true);
    };
    if (modalType === 'feedback') {
      setFeedbackModal(true);
    };
  };

  useEffect(() => {
    AsyncStorage.getItem('email').then((email)=>{
      setEmail(email);
    });
  }, []);

  useEffect(() => {
    navigation.setParams({theme: state.theme});
  }, [state]);

  useEffect(() => {
    navigation.setParams({language: languageContext.state.language});
  }, [languageContext.state]);

  return (<View style={styles(state.theme).container}>
  <ErrModal isVisible={errModalMsg !== ''
      ? true
      : false}
      errMessage={errModalMsg}
      onPressOutside={() => setErrModalMsg('')}/>
      <View>
      <Spinner
        visible={loading?true:false}
        textContent={languageContext.state.language.spinnerLoading}
        textStyle={styles(state.theme).spinnerTextStyle}
      />
    </View>
  <ScrollView>
    <ImageBackground source={{
        uri: state.theme.backgroundImage
      }} style={styles(state.theme).ImageBackground}>
      <CustomModal
        modalSend={languageContext.state.language.modalSend}
        modalPlaceholder={languageContext.state.language.modalPlaceholder}
        isVisible={bugModal}
        type='bug'
        title={languageContext.state.language.bugModalTitle}
        onPressOutside={() => setBugModal(!bugModal)}
        sendEmail={sendEmail}/>
      <CustomModal
        modalSend={languageContext.state.language.modalSend}
        modalPlaceholder={languageContext.state.language.modalPlaceholder}
        isVisible={feedbackModal}
        type='feedback'
        title={languageContext.state.language.feedbackModalTitle}
        onPressOutside={() => setFeedbackModal(!feedbackModal)}
        sendEmail={sendEmail}/>
      <Text style={styles(state.theme).Header}>
        {languageContext.state.language.themeOptions}
      </Text>
      <ThemeSwitch Value={state.theme.name === 'cheerful'
          ? true
          : false}
          OnValueChange={() => {
          _changeThemeCheerful()
        }} Text={languageContext.state.language.cheerful}/>
      <ThemeSwitch Value={state.theme.name === 'clean'
          ? true
          : false}
          OnValueChange={() => {
          _changeThemeClean()
        }} Text={languageContext.state.language.clean}/>
      <ThemeSwitch Value={state.theme.name === 'dark'
          ? true
          : false}
          OnValueChange={() => {
          _changeThemeDark()
        }} Text={languageContext.state.language.dark}/>
      <Text style={styles(state.theme).Header}>
        {languageContext.state.language.userSettings}
      </Text>
      <ThemeSwitch Value={languageContext.state.showNotChosenDays === 'true'
          ? true
          : false}
          OnValueChange={() => {
            _changeShowNotChosenDays()
        }} Text={languageContext.state.language.showNotChosenDays}/>
      <ThemeSwitch Value={languageContext.state.longClickHabit === 'true'
          ? true
          : false}
          OnValueChange={() => {
            _changeLongClickHabit()
        }} Text={languageContext.state.language.longClickHabit}/>
      <View style={styles(state.theme).Picker}>
        <Picker
          style={styles(state.theme).PickerText}
          selectedValue={languageContext.state.language.label}
          onValueChange={(itemValue, itemIndex) =>
            languageContext.changeLanguage(itemValue)}>
          {
            Object.keys(translations).map((langItem) => {
              return <Picker.Item
                color='black' key={langItem}
                value={langItem}
                label={translations[langItem].label}/>
            })
          }
        </Picker>
      </View>
      <Text style={styles(state.theme).Header}>
        {languageContext.state.language.letUsKnow}
      </Text>
      <LineButton
        text={languageContext.state.language.bugReportText}
        onPress={() => openModal('bug')} type='bug'/>
      <LineButton
        text={languageContext.state.language.feedbackSimpleText}
        onPress={() => openModal('feedback')} type='paper-plane'/>
      <Spacer/>
      <View style={styles(state.theme).Username}>
        <Text style={styles(state.theme).UsernameLabel}>{languageContext.state.language.usernameLabel}</Text>
        <Text style={styles(state.theme).UsernameText}>
          {email}
        </Text>
      </View>
      <LineButton
        text={languageContext.state.language.about}
        onPress={() => navigation.navigate('About', {theme: state.theme, language: languageContext.state.language})} type='info'/>
      <ButtonLogin style={styles(state.theme).ButtonSave}
        text={languageContext.state.language.logout}
        onPress={async () => {
          await clearStorage();
          navigation.navigate('Signin');
        }
      }/>
    </ImageBackground>
  </ScrollView>
</View>)
};

SettingsScreen.navigationOptions = ({navigation}) => {
  const text = 'Settings';
  const {params} = navigation.state;
  const theme = params.theme;
  const language = params.language;
  return MyHeaderSecondary(navigation, text, theme, language);
};

const styles = (props) => StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-around'
  },
  ImageBackground: {
    flex: 1
  },
  Header: {
    fontSize: 18,
    margin: 10,
    marginBottom: 5,
    marginLeft: 20,
    alignSelf: 'center',
    color: props.headerPlus
  },
  ButtonSave: {
    borderRadius: 30,
    backgroundColor: props.button,
    margin: 20,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center'
  },
  Picker: {
    backgroundColor: props.habitRowBackground,
    // paddingTop: 5,
    // paddingBottom: 5,
    marginBottom: 0,
    marginTop: 5,
    height: 37,
    justifyContent: 'center'
  },
  PickerText: {
    marginLeft: -5,
    marginRight: 10,
    color: props.buttonText,
    transform: [
      {
        scaleX: 0.9
      }, {
        scaleY: 0.9
      }
    ]
  },
  Username:{
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: props.habitRowBackground,
    marginTop: 5,
    height: 37,
  },
  UsernameLabel:{
    flex: 4,
    marginLeft: 20,
    fontSize: 16,
    color: props.buttonText,
  },
  UsernameText:{
    flex: 8,
    fontSize: 16,
    color: props.buttonText,
    textAlign: 'left',
  },
  spinnerTextStyle: {
    color: '#FFF'
  },
});

export default SettingsScreen;
