import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';

const ButtonLogin = (props) => {
  return (
    <TouchableOpacity style={styles.Button} onPress={props.onPress}>
      <Text style={styles.ButtonText}>{props.text}</Text>
    </TouchableOpacity>
  )
};

const styles = StyleSheet.create({
  Button:{
    borderRadius: 30,
    backgroundColor: '#C2867C',
    margin: 20,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop:50
  },
  ButtonText:{
    fontSize: 20,
    letterSpacing: 3,
    color: '#FFFFFF',
  }
});

export default ButtonLogin;
