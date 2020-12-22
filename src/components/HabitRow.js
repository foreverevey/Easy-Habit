import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';

// TODO: add another components to this component.

const HabitRow = (props) =>{
  return (
    <TouchableOpacity style={styles.Row} onPress={props.onPress}>
      <Text style={styles.NumberEl}>5</Text>
      <Text style={styles.TextElem}>{props.Text}</Text>
      <Text style={styles.NumberEl}>{props.Dates}</Text>
      <View style={{display:'flex'}}>
        <Text style={styles.DateElem}>Click to complete</Text>
      </View>
    </TouchableOpacity>
  )
};

const styles = StyleSheet.create({
  Row:{
    borderWidth: 1,
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor:'lightgrey',
    marginBottom:10,
  },
  TextElem:{
    textAlign: "left",
    flex:6,
    // width:160,
    fontSize:18,
    paddingLeft: 10,
  },
  NumberEl:{
    flex:1,
    fontSize:18,
    paddingLeft: 10,
  },
  DateElem:{
    flex:4,
    fontSize:18,
    paddingLeft: 10,
    textAlign: "right",
    // marginLeft:"auto",
  }
});

export default HabitRow;
