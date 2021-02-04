import React, {useState, useContext} from 'react';
import {View, StyleSheet, Text, TouchableOpacity, Modal} from 'react-native';
import {FontAwesome5} from '@expo/vector-icons';
import {MyContext as ThemeContext} from '../context/themeContext';

const ErrModal = (props) => {
  const {state} = useContext(ThemeContext);

  return (
    <Modal visible={props.isVisible} transparent={true} animationType="slide">
      <TouchableOpacity style={styles(state.theme).centeredView} onPress={props.onPressOutside}>
        <View style={styles(state.theme).modalView}>
          <Text style={styles(state.theme).modalText}>{props.errMessage}</Text>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = (props) => StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
    // alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: props.white,
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
    height:'15%',
    width:'90%',
  },
  modalText: {
    textAlign: "center",
    flex:1,
    textAlignVertical: "center",
    fontSize: 16,
    color: props.headerPlus,
  },
});

export default ErrModal;
