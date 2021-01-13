import React, {useState, useContext} from 'react';
import {View, StyleSheet, Text, TouchableOpacity, Switch} from 'react-native';
import {MyContext as ThemeContext} from '../context/themeContext';

const ThemeSwitch = (props) => {
  const {state} = useContext(ThemeContext);

  return(
    <View style={styles(state.theme).Row}>
      <Text style={styles(state.theme).Text}>{props.Text}</Text>
      <Switch
        style={styles(state.theme).Switch}
        value={props.Value}
        onValueChange={props.OnValueChange}
        thumbColor={props.Value?state.theme.sliderThumbOn:state.theme.sliderThumbOff}
        trackColor={{false: 'grey', true: state.theme.sliderTrackOn}}
        />
    </View>
  )
};

const styles = (props) => StyleSheet.create({
  Row:{
    flexDirection: 'row',
    // flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor:'white',
    paddingTop: 5,
    paddingBottom: 5,
    marginBottom: 5,
    // borderBottomColor: 'black',
    // borderBottomWidth: 1,
    elevation: 3,
  },
  Text:{
    marginLeft: 20,
    fontSize: 15,
  },
  Switch:{
    marginRight:20,
  }
});

export default ThemeSwitch;