import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { MyContext as ThemeContext } from '../context/themeContext';

const HabitRow = (props) =>{
  const {state, changeTheme} = useContext(ThemeContext);
  const [selected, setSelected] = useState(false);
  const screenHeight = Dimensions.get('window').height;
  const screenWidth = Dimensions.get('window').height;

  useEffect(() => {
    const splitDay = props.SelectedDate.split('/');
    const selectedDay = new Date(
      Date.UTC(splitDay[2], splitDay[0] - 1, splitDay[1]));
    var foundDay = false;
    if(props.Dates.length>0){
      for(var i=0; i < props.Dates.length; i++){
        var dateToObj = new Date(props.Dates[i].date);
        if(dateToObj.valueOf() === selectedDay.valueOf()){
          setSelected(true);
          foundDay = true;
          break;
        };
      };
    };
    if(!foundDay){
      setSelected(false);
    }
  }, [props.SelectedDate]);

  const addRemoveDate = () => {
    if(!selected){
      props.addDate();
      setSelected(true);
    } else {
      props.removeDate();
      setSelected(false);
    }
  };

  const activateShortPress = () => {
    props.activateShortClick();
  }

  return (
    <TouchableOpacity
      style={props.Selected
        ?styles(state.theme, screenWidth, screenHeight).RowSelected
        :styles(state.theme, screenWidth, screenHeight).Row}
      onPress={props.onPress}
      onLongPress={props.onLongPress}>
      <Text style={styles(state.theme, screenWidth, screenHeight).TextElem}>{props.Text}</Text>
      <View style={styles(state.theme, screenWidth, screenHeight).CheckboxView}>
        {props.longPressSetting === 'true' && <TouchableOpacity
          onLongPress={()=>addRemoveDate()}
          onPress={()=>activateShortPress()}
          style={styles(state.theme, screenWidth, screenHeight).TouchableSelect}
          >
          {selected &&
            <FontAwesome
              style={styles(state.theme, screenWidth, screenHeight).CheckboxPlus}
              name="check"/>}
          {!selected &&
            <FontAwesome
              style={styles(state.theme, screenWidth, screenHeight).Checkbox}
              name='close'/>}
        </TouchableOpacity>}
        {props.longPressSetting === 'false' && <TouchableOpacity
          onPress={()=>addRemoveDate()}
          style={styles(state.theme, screenWidth, screenHeight).TouchableSelect}
            >
          {selected &&
            <FontAwesome
              style={styles(state.theme, screenWidth, screenHeight).CheckboxPlus}
              name="check"/>}
          {!selected &&
            <FontAwesome
              style={styles(state.theme, screenWidth, screenHeight).Checkbox}
              name='close'/>}
        </TouchableOpacity>}
      </View>
    </TouchableOpacity>
  )
};

const styles = (props, screenWidth, screenHeight) => StyleSheet.create({
  Row:{
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: props.habitRowBackground,
    marginBottom:10,
    paddingLeft:10,
    height:screenHeight * 0.1,
    borderRadius:30,
  },
  RowSelected:{
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: props.habitRowBackground,
    borderTopWidth: 1,
    borderWidth: 2,
    borderBottomWidth: 3,
    borderColor: props.checkPlus,
    marginBottom:10,
    marginLeft: 10,
    marginRight: 10,
    paddingLeft: 10,
    height: screenHeight * 0.08,
    borderRadius: 30,
  },
  TouchableSelect:{
    height:'100%',
    width:'100%',
    justifyContent:'center',
    alignItems:'center'
  },
  TextElem:{
    flex:8,
    textAlign: "left",
    fontSize:20,
    paddingLeft: 20,
    color: props.buttonText,
  },
  CheckboxView:{
    flex:3,
    alignItems: 'center',
    height:'100%',
    justifyContent: 'center',
  },
  CheckboxPlus:{
    fontSize:30,
    color: props.checkPlus,
  },
  Checkbox:{
    fontSize:30,
    color: props.check,
  },
});

export default HabitRow;
