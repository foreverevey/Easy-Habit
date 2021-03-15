import React, { useContext } from 'react';
import { View, Text ,StyleSheet, TouchableOpacity } from 'react-native';
import { EvilIcons } from '@expo/vector-icons';
import { MyContext as ThemeContext } from '../context/themeContext';

const PasswordLock = (props) => {
  const {state} = useContext(ThemeContext);

  return (
    <TouchableOpacity onPress={props.onPress}>
      <EvilIcons
        name={props.name} 
        size={30}
        style={styles(state.theme).styleIcon}/>
    </TouchableOpacity>
  )
};

const styles = (props) => StyleSheet.create({
  styleIcon:{
    marginTop:10,
    marginRight: 10,
    color: props.button,
  },
});

export default PasswordLock;
