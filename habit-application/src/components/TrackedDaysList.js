import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { MyContext as ThemeContext } from '../context/themeContext';
import { MyContext as LanguageContext } from '../context/languageContext';

const TrackedDaysList = (props) =>{
  const themeContext = useContext(ThemeContext);
  const languageContext = useContext(LanguageContext);

  return (
    <View style={styles(themeContext.state.theme).trackDays}>
      <View style={styles(themeContext.state.theme).Schedule1}>
        <Text style={styles(themeContext.state.theme).Schedule1Item}>
          {languageContext.state.language.mon}
        </Text>
        <Text style={styles(themeContext.state.theme).Schedule1Item}>
          {languageContext.state.language.tue}
        </Text>
        <Text style={styles(themeContext.state.theme).Schedule1Item}>
          {languageContext.state.language.wen}
        </Text>
        <Text style={styles(themeContext.state.theme).Schedule1Item}>
          {languageContext.state.language.thu}
        </Text>
        <Text style={styles(themeContext.state.theme).Schedule1Item}>
          {languageContext.state.language.fri}
        </Text>
        <Text style={styles(themeContext.state.theme).Schedule1Item}>
          {languageContext.state.language.sat}
        </Text>
        <Text style={styles(themeContext.state.theme).Schedule1Item}>
          {languageContext.state.language.sun}
        </Text>
      </View>
      <View style={styles(themeContext.state.theme).Schedule2}>
        <View style={styles(themeContext.state.theme).CheckboxView}>
          <TouchableOpacity
            disabled={props.disabled}
            onPress={()=>props.changeTrackedDays('Mon')}>
            {props.trackedDays.Mon &&
              <FontAwesome
                style={styles(themeContext.state.theme).CheckboxPlus}
                name="check-square"/>}
            {!props.trackedDays.Mon &&
              <FontAwesome
                style={styles(themeContext.state.theme).Checkbox}
                name='square'/>}
          </TouchableOpacity>
        </View>
        <View style={styles(themeContext.state.theme).CheckboxView}>
          <TouchableOpacity
            disabled={props.disabled}
            onPress={()=>props.changeTrackedDays('Tue')}>
            {props.trackedDays.Tue &&
              <FontAwesome
                style={styles(themeContext.state.theme).CheckboxPlus}
                name="check-square"/>}
            {!props.trackedDays.Tue &&
              <FontAwesome
                style={styles(themeContext.state.theme).Checkbox}
                name='square'/>}
          </TouchableOpacity>
        </View>
        <View style={styles(themeContext.state.theme).CheckboxView}>
          <TouchableOpacity
            disabled={props.disabled}
            onPress={()=>props.changeTrackedDays('Wed')}>
            {props.trackedDays.Wed &&
              <FontAwesome
                style={styles(themeContext.state.theme).CheckboxPlus}
                name="check-square"/>}
            {!props.trackedDays.Wed &&
              <FontAwesome
                style={styles(themeContext.state.theme).Checkbox}
                name='square'/>}
          </TouchableOpacity>
        </View>
        <View style={styles(themeContext.state.theme).CheckboxView}>
          <TouchableOpacity
            disabled={props.disabled}
            onPress={()=>props.changeTrackedDays('Thu')}>
            {props.trackedDays.Thu &&
              <FontAwesome
                style={styles(themeContext.state.theme).CheckboxPlus}
                name="check-square"/>}
            {!props.trackedDays.Thu &&
              <FontAwesome
                style={styles(themeContext.state.theme).Checkbox}
                name='square'/>}
          </TouchableOpacity>
        </View>
        <View style={styles(themeContext.state.theme).CheckboxView}>
          <TouchableOpacity
            disabled={props.disabled}
            onPress={()=>props.changeTrackedDays('Fri')}>
            {props.trackedDays.Fri &&
              <FontAwesome
                style={styles(themeContext.state.theme).CheckboxPlus}
                name="check-square"/>}
            {!props.trackedDays.Fri &&
              <FontAwesome
                style={styles(themeContext.state.theme).Checkbox}
                name='square'/>}
          </TouchableOpacity>
        </View>
        <View style={styles(themeContext.state.theme).CheckboxView}>
          <TouchableOpacity
            disabled={props.disabled}
            onPress={()=>props.changeTrackedDays('Sat')}>
            {props.trackedDays.Sat &&
              <FontAwesome
                style={styles(themeContext.state.theme).CheckboxPlus}
                name="check-square"/>}
            {!props.trackedDays.Sat &&
              <FontAwesome
                style={styles(themeContext.state.theme).Checkbox}
                name='square'/>}
          </TouchableOpacity>
        </View>
        <View style={styles(themeContext.state.theme).CheckboxView}>
          <TouchableOpacity
            disabled={props.disabled}
            onPress={()=>props.changeTrackedDays('Sun')}>
            {props.trackedDays.Sun &&
              <FontAwesome
                style={styles(themeContext.state.theme).CheckboxPlus}
                name="check-square"/>}
            {!props.trackedDays.Sun &&
              <FontAwesome
                style={styles(themeContext.state.theme).Checkbox}
                name='square'/>}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
};

const styles = (props) => StyleSheet.create({
  CheckboxView:{
    flex: 1,
  },
  CheckboxPlus:{
    fontSize:26,
    color: props.checkPlus,
    textAlign: 'center',
  },
  Checkbox:{
    fontSize:26,
    color: props.checkPlus,
    textAlign: 'center',
  },
  Schedule2:{
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  Schedule1:{
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  Schedule1Item:{
    flex: 1,
    color: props.headerPlus,
    textAlign: 'center',
  },
  trackDays:{
    height: 70,

  },
});

export default TrackedDaysList;
