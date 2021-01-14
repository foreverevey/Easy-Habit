import React, {useContext} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {MyContext as ThemeContext} from '../context/themeContext';

const ButtonLogin = (props) => {
  const {state} = useContext(ThemeContext);

  return (
    <TouchableOpacity style={styles(state.theme).Button} onPress={props.onPress}>
      <Text style={styles(state.theme).ButtonText}>{props.text}</Text>
    </TouchableOpacity>
  )
};

const styles = (props) => StyleSheet.create({
  Button:{
    borderRadius: 30,
    backgroundColor: props.button,
    margin: 20,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop:50
  },
  ButtonText:{
    fontSize: 20,
    letterSpacing: 3,
    color: props.text,
  }
});

export default ButtonLogin;
