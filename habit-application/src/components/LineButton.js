import React, { useContext } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { MyContext as ThemeContext } from '../context/themeContext';

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
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: props.habitRowBackground,
    paddingTop: 5,
    paddingBottom: 5,
    marginBottom: 0,
    marginTop: 5,
    elevation: 3,
  },
  Icon:{
    fontSize: 26,
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
