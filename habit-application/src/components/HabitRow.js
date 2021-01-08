import React, {useState, useEffect, useContext} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {MyContext as ThemeContext} from '../context/themeContext';
import {FontAwesome} from '@expo/vector-icons';
import mainStyle from '../styles/mainStyle';

// TODO: add another components to this component.

const HabitRow = (props) =>{
  const [selected, setSelected] = useState(false);
  const {state, changeTheme} = useContext(ThemeContext);
  console.log('habitrow');
  console.log(props.SelectedDate);

  useEffect(() => {
    console.log('effect from props.selectedDay');
    const splitDay = props.SelectedDate.split('/');
    const selectedDay = new Date(Date.UTC(splitDay[2], splitDay[0] - 1, splitDay[1]));
    var foundDay = false;
    if(props.Dates.length>0){
      for(var i=0; i<props.Dates.length; i++){
        var dateToObj = new Date(props.Dates[i].date);
        // console.log('habitrow useeffect', dateToObj, selectedDay, props.Text);
        if(dateToObj.valueOf() === selectedDay.valueOf()){
          console.log('first effect setting to selected true', props.Text);
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

  const addRemoveDate = () =>{
    console.log('addRemoveDate habitrow: ', selected, props.Text);
    if(!selected){
      props.addDate();
      setSelected(true);
    } else {
      props.removeDate();
      console.log('remove selected in habitrow');
      setSelected(false);
    }
  };

  useEffect(() => {
    console.log('day selected');
  }, [selected]);

  return (
    <TouchableOpacity style={styles(state.theme).Row} onPress={props.onPress}>
      <Text style={styles(state.theme).TextElem}>{props.Text}</Text>
      <View style={styles(state.theme).CheckboxView}>
        <TouchableOpacity onLongPress={()=>addRemoveDate()}>
          <FontAwesome style={styles(state.theme).Checkbox} name={selected?"check":'close'}/>
        </TouchableOpacity>
      </View>

    </TouchableOpacity>
  )
};

const styles = (props) => StyleSheet.create({
  Row:{
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'white',
    marginBottom:10,
    paddingLeft:10,
    height:75,
    borderRadius:30,
  },
  TextElem:{
    flex:8,
    textAlign: "left",
    fontSize:18,
    paddingLeft: 0,
  },
  CheckboxView:{
    flex:3,
    alignItems: 'center',
  },
  Checkbox:{
    fontSize:30,
    color: props.pri1,
  },
});

export default HabitRow;
