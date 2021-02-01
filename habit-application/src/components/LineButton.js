import React, {useContext} from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {MyContext as ThemeContext} from '../context/themeContext';
import {FontAwesome5} from '@expo/vector-icons';

const LineButton = (props) => {
  const {state} = useContext(ThemeContext);

  return (
    <TouchableOpacity style={styles(state.theme).Row} onPress={props.onPress}>
      <Text style={styles(state.theme).ButtonText}>{props.text}</Text>
      <FontAwesome5 style={styles(state.theme).Icon} name={props.type}/>
    </TouchableOpacity>
  );
};

const styles = (props) => StyleSheet.create({
  Row:{
    flexDirection: 'row',
    // flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: props.habitRowBackground,
    paddingTop: 5,
    paddingBottom: 5,
    marginBottom: 5,
    elevation: 3,
  },
  Icon:{
    fontSize: 26,
    // flex:3,
    marginRight: 30,
    color: props.streak,
  },
  ButtonText:{
    marginLeft: 20,
    fontSize: 15,
    color: props.buttonText,
  }
});

export default LineButton;
