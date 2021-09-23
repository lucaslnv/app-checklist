import React, { Component, useState, useContext, useEffect } from 'react'
import { View, Modal, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { Button, Text, Input } from 'react-native-elements';
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
                    title="Agenda"
                    color="#fff"
                />
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
	botao: {
        margin: 10
    }
});