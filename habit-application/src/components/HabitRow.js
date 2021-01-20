import React, {useState, useEffect, useContext} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {MyContext as ThemeContext} from '../context/themeContext';
import {FontAwesome} from '@expo/vector-icons';
import mainStyle from '../styles/mainStyle';

const HabitRow = (props) =>{
  const [selected, setSelected] = useState(false);
  const {state, changeTheme} = useContext(ThemeContext);

  useEffect(() => {
    const splitDay = props.SelectedDate.split('/');
    const selectedDay = new Date(Date.UTC(splitDay[2], splitDay[0] - 1, splitDay[1]));
    var foundDay = false;
    if(props.Dates.length>0){
      for(var i=0; i<props.Dates.length; i++){
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

  const addRemoveDate = () =>{
    if(!selected){
      props.addDate();
      setSelected(true);
    } else {
      props.removeDate();
      setSelected(false);
    }
  };

  return (
    <TouchableOpacity style={props.Selected?styles(state.theme).RowSelected:styles(state.theme).Row} onPress={props.onPress} onLongPress={props.onLongPress}>
      <Text style={styles(state.theme).TextElem}>{props.Text}</Text>
      <View style={styles(state.theme).CheckboxView}>
        <TouchableOpacity onLongPress={()=>addRemoveDate()}>
          {selected &&
            <FontAwesome style={styles(state.theme).CheckboxPlus} name="check"/>}
          {!selected &&
            <FontAwesome style={styles(state.theme).Checkbox} name='close'/>}

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
    backgroundColor: props.habitRowBackground,
    marginBottom:10,
    paddingLeft:10,
    height:75,
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
    // elevation: 10,
    marginBottom:10,
    marginLeft: 10,
    marginRight: 10,
    paddingLeft: 10,
    height: 65,
    borderRadius: 30,
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
