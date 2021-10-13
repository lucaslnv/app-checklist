import React, { Component, useState, useContext, useEffect } from 'react'
import { View, Modal, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Separator, ListItem, Item, Text } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Context } from '../context/Index';

export default function Agenda(props) {

    const {obj} = useContext(Context);

    // RECUPERAR AGENDA CONTEXT API
    return (
        <ScrollView style={styles.container}>
            <View>
            {
                obj.agenda.map((item, i) => {
                    return (
                        <ListItem key={item.COD_ITEM}>
                            <Text>{item.COD_ITEM} - {item.QUESITO}</Text>
                        </ListItem>
                    );
                })
            }
            {
                obj.agenda.length == 0 && (<Text>Agenda não encontrada.</Text>)
            }
            </View>
        </ScrollView>
    )
}

Agenda.navigationOptions = {
	title: 'Agenda'
  }

const styles = StyleSheet.create({
	container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 10
      },
});