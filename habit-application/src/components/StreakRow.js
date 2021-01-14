import React, {useContext} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {MyContext as ThemeContext} from '../context/themeContext';
import {FontAwesome5} from '@expo/vector-icons';

const StreakRow = (props) => {
  const {state} = useContext(ThemeContext);

  return (
    <View style={styles(state.theme).Row}>
      <Text style={styles(state.theme).TextElem}>{props.StreakText}</Text>
      <FontAwesome5 style={styles(state.theme).Icon} name="fire"/>
    </View>
  );
};

const styles = (props) => StyleSheet.create({
  Row:{
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: props.habitRowBackground,
    marginBottom:5,
    paddingLeft:10,
    height:50,
    // borderRadius:30,
  },
  Icon:{
    fontSize: 32,
    flex:3,
    alignItems: 'center',
    color: props.streak,
  },
  TextElem:{
    marginLeft: 20,
    flex:8,
    textAlign: "left",
    fontSize:18,
    paddingLeft: 0,
    color: props.text,
  },
});

export default StreakRow;
