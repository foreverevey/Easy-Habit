import React, {useState, useContext} from 'react';
import {View, StyleSheet, Text, TouchableOpacity, Modal, TextInput} from 'react-native';
import {FontAwesome5} from '@expo/vector-icons';
import {MyContext as ThemeContext} from '../context/themeContext';

const CustomModal = (props) => {
  const {state} = useContext(ThemeContext);
  const [text, setText] = useState('');

  const handleEmail = () => {
    if(props.type === 'bug'){
      props.sendEmail(text, 'Bug Report');
    }
    if(props.type === 'feedback'){
      props.sendEmail(text, 'Feedback Report');
    }
    props.onPressOutside();
  };

  return (
    <Modal visible={props.isVisible} transparent={true}>
      <TouchableOpacity style={styles(state.theme).centeredView} onPress={props.onPressOutside}>
        <View style={styles(state.theme).modalView}>
          <Text style={styles(state.theme).modalText}>{props.title}</Text>
          <TextInput
            style={styles(state.theme).TextInput}
            autoCapitalize="none"
            autoCorrect={false}
            value={text}
            onChangeText={(newValue)=> setText(newValue)}
            placeholder={props.modalPlaceholder}
            placeholderTextColor={state.theme.buttonText}
            paddingLeft={15}/>
          <TouchableOpacity style={styles(state.theme).modalSend} onPress={()=>handleEmail()}>
            <Text style={styles(state.theme).modalSendText}>Send!</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = (props) => StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: props.headerBackground,
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    borderWidth:2,
    borderColor: props.habitRowBackground,
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    height:'70%',
    width:'90%',
  },
  modalText: {
    textAlign: "center",
    flex:1,
    textAlignVertical: "center",
    fontSize: 16,
    color: props.headerPlus,
  },
  modalSend:{
    alignSelf: 'center',
    justifyContent: 'center',
    flex: 1,
    color: props.headerPlus,
    width: '40%',
  },
  modalSendText:{
    color: props.headerPlus,
    fontSize: 16,
    alignSelf: 'center',
  },
  TextInput:{
    borderRadius: 15,
    width: '90%',
    flex:6,
    textAlignVertical: 'top',
    paddingTop: 30,
    backgroundColor: props.habitRowBackground,
    color: props.buttonText,
  }
});

export default CustomModal;
