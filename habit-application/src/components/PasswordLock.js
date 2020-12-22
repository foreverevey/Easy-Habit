import React from 'react';
import {View, Text ,StyleSheet, TouchableOpacity} from 'react-native';
import { EvilIcons} from '@expo/vector-icons';

const PasswordLock = (props) => {
  return (
    <TouchableOpacity onPress={props.onPress}>
      <EvilIcons name={props.name} size={30} style={styles.styleIcon}/>
    </TouchableOpacity>
  )
};

const styles = StyleSheet.create({
  styleIcon:{
    marginTop:10,
    marginRight: 10,
    color: '#A8ADC2',
  },
});

export default PasswordLock;
