import React from 'react';
import {View, Text ,StyleSheet, TouchableOpacity} from 'react-native';

const SimpleTextLogin = (props) => {
  return (
    <TouchableOpacity style={props.style ? props.style: styles.ForgotPass} onPress={props.onPress}>
      <Text style={styles.ForgotText}>{props.text}</Text>
    </TouchableOpacity>
  )
};

const styles = StyleSheet.create({
  ForgotPass:{
    alignSelf: 'center',
  },
  ForgotText:{
    fontSize: 16,
    color: '#A8ADC2',
    alignSelf: 'center',
  },
});

export default SimpleTextLogin;
