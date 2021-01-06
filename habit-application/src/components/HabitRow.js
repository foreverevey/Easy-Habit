import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';

// TODO: add another components to this component.

const HabitRow = (props) =>{
  const [selected, setSelected] = useState(false);

  useEffect(() => {
    const splitDay = props.SelectedDate.split('/');
    const selectedDay = new Date(Date.UTC(splitDay[2], splitDay[0] - 1, splitDay[1]));
    if(props.Dates.length>0){
      for(var i=0; i<props.Dates.length; i++){
        var dateToObj = new Date(props.Dates[i].date);
        if(dateToObj.valueOf() === selectedDay.valueOf()){
          console.log('yes');
          setSelected(true);
          break;
        };
      };
    };
  }, []);

  const addRemoveDate = () =>{
    console.log('addRemoveDate', selected);
    if(!selected){
      props.addDate();
    } else {
      props.removeDate();
    }
  };

  return (
    <TouchableOpacity style={styles.Row} onPress={props.onPress}>
      <Text style={styles.TextElem}>{props.Text}</Text>
      <Text style={styles.NumberEl}>{selected?'Selected':'Not Selected'}</Text>
      <View style={{display:'flex'}}>
        <TouchableOpacity onLongPress={()=>addRemoveDate()}>
          <Text style={styles.DateElem}>{selected?'Remove':'Add'}</Text>
        </TouchableOpacity>
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
    fontSize:10,
    paddingLeft: 0,
  },
  DateElem:{
    flex:4,
    fontSize:18,
    paddingLeft: 10,
    textAlign: "right",
    marginLeft: 25,
    paddingRight: 5,
    // marginLeft:"auto",
  }
});

export default HabitRow;
