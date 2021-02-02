import React, {useContext} from 'react';
import {View, Text ,StyleSheet, TouchableOpacity} from 'react-native';
import {MyContext as ThemeContext} from '../context/themeContext';

const SimpleTextLogin = (props) => {
  const {state} = useContext(ThemeContext);

  return (
    <TouchableOpacity style={styles(state.theme).ForgotPass} onPress={props.onPress}>
      <Text style={styles(state.theme).ForgotText}>{props.text}</Text>
    </TouchableOpacity>
  )
};

const styles = (props) => StyleSheet.create({
  ForgotPass:{
    alignSelf: 'center',
    flex:1,
  },
  ForgotText:{
    fontSize: 16,
    color: props.text,
    textAlign: 'center',
  },
});

export default SimpleTextLogin;
