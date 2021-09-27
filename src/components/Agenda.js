import React, { Component, useState, useContext, useEffect } from 'react'
import { View, Modal, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { Button, Text, Input } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Context } from '../context/Index';

export default function Agenda(props) {

    const {obj} = useContext(Context);
    
    useEffect(() => {
        console.log('Agenda: ');
        console.log(obj)
	}, [obj]);


    // RECUPERAR AGENDA CONTEXT API
    return (
        <ScrollView>
            <View>
                <Button
                    buttonStyle={styles.botao}
                    onPress={() => alert(JSON.stringify(obj)) }
                    color="#fff"
                    icon={
                        <Icon
                          name="bars"
                          size={15}
                          color="white"
                        />
                    }
                />
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
	botao: {
        marginRight: 15,
        marginTop: 12,
    }
});