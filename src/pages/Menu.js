import React, { Component, useState, useContext, useEffect } from 'react'
import { View, Modal, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { Button, Text, Input } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Context } from '../context/Index';

export default function Menu(props) {

    const {obj} = useContext(Context);
    
    useEffect(() => {
        console.log('Agenda: ');
        console.log(obj)
	}, [obj]);


    // RECUPERAR AGENDA CONTEXT API
    return (
        <ScrollView style={styles.container}>
            <View>
            </View>
        </ScrollView>
    )
}

Menu.navigationOptions = {
	title: 'Menu'
  }

const styles = StyleSheet.create({
	container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 10
      },
});