import React, {useState, useEffect, useContext} from 'react';
import {View, Text, TextInput, StyleSheet, TouchableOpacity, ImageBackground, Image, ScrollView, Dimensions} from 'react-native';
import {FontAwesome} from '@expo/vector-icons';
import MyHeaderSecondary from '../components/HeaderSecondary';
import {MyContext as ThemeContext} from '../context/themeContext';
import {MyContext as LanguageContext} from '../context/languageContext';
import Accordion from 'react-native-collapsible/Accordion';

const AboutScreen = ({navigation}) =>{
  const themeContext = useContext(ThemeContext);
  const languageContext = useContext(LanguageContext);
  const [activeSections, setActiveSections] = useState([0]);
  const screenHeight = Dimensions.get('window').height;

  const SECTIONS = [
    {
      title: languageContext.state.language.accordionTitle1,
      content: languageContext.state.language.accordionContent1,
    },
    {
      title: languageContext.state.language.accordionTitle2,
      content: languageContext.state.language.accordionContent2,
    },
    {
      title: languageContext.state.language.accordionTitle3,
      content: languageContext.state.language.accordionContent3,
    }
  ];

  _renderHeader = section => {
    return (
      <View style={styles(themeContext.state.theme).header}>
        <Text style={styles(themeContext.state.theme).headerText}>{section.title}</Text>
      </View>
    );
  };

  _renderContent = section => {
    // console.log('renderingContent', section);
    // var index = SECTIONS.findIndex(x => x.title === section.title);
    // console.log('index', index, activeSections.includes(index), activeSections);
    return (
      <View style={styles(themeContext.state.theme).content}>
        <Text style={styles(themeContext.state.theme).headerContentText}>{section.content}</Text>
      </View>
    );
  };

  _updateSections = sections => {
    setActiveSections(sections);
  };

  return (
    <View style={styles(themeContext.state.theme).MainParent}>
      <ScrollView contentContainerStyle={{ flex: 1 }}>
        <ImageBackground source={{uri: themeContext.state.theme.backgroundImage}} style={styles(themeContext.state.theme).ImageBackground}>
          <Accordion
            sections={SECTIONS}
            activeSections={activeSections}
            renderHeader={(item)=>_renderHeader(item)}
            renderContent={(item)=>_renderContent(item)}
            onChange={(item)=>_updateSections(item)}
            expandMultiple={true}
          />
          <Image source={require('../../assets/appLogo.png')} style={styles(themeContext.state.theme).ImageStyle}/>
          <Text style={styles(themeContext.state.theme).Text}>{languageContext.state.language.version}</Text>
          <Text style={styles(themeContext.state.theme).Text}>{languageContext.state.language.createdBy}</Text>
        </ImageBackground>
      </ScrollView>
    </View>
  )
};

AboutScreen.navigationOptions = ({navigation}) => {
  const text = 'About Screen';
  const { params } = navigation.state;
  const theme = params.theme;
  const language = params.language;
  return MyHeaderSecondary(navigation, text, theme, language);
};

const styles = (props) => StyleSheet.create({
  MainParent:{
    flex: 1,
  },
  ImageBackground:{
    flex: 1,
  },
  header: {
    backgroundColor: props.habitRowBackground,
    padding: 10,
    color: props.buttonText,
  },
  headerText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '500',
    color: props.buttonText,
  },
  content: {
    padding: 20,
    backgroundColor: '#fff',
  },
  ImageStyle:{
    width:100,
    height: 100,
    alignSelf: 'center',
    marginTop: 15,
    marginBottom: 15,
  },
  Text:{
    color: props.buttonText,
    marginLeft: 15,
    marginBottom:5,
  },
  headerContentText:{
    lineHeight: 20,
    textAlign: 'left',
  }
});

export default AboutScreen;
