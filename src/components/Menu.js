import React, { Component, useState, useContext, useEffect } from 'react'
import { View, Modal, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Separator, ListItem, Item, Text } from 'native-base';
import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function Menu(props) {
    
    const [modalVisible, setModalVisible] = useState(false);

    function abrirAgenda(){
        setModalVisible(false);
        props.navigation.navigate('Agenda')
    }
    // RECUPERAR AGENDA CONTEXT API
    return (
            <View>
                <Button
                    buttonStyle={styles.botaoMenu}
                    onPress={ () => setModalVisible(true) }
                    color="#fff"
                    icon={
                        <Icon
                            name="bars"
                            color="white"
                            size={17}
                        />
                    }
                />
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                >
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Text style={{ fontWeight: 'bold', fontSize: 16, color: '#000000', textAlign: 'center' }}>Menu</Text>
                            <Button
                                buttonStyle={styles.botaoItemMenu}
                                onPress={ () => abrirAgenda()}
                                color="#fff"
                                title="Agenda"
                            />

                            <Button
                                buttonStyle={styles.botaoFechar}
                                onPress={ () => setModalVisible(false)}
                                color="#fff"
                                title="Fechar"
                            />

                            
                        </View>
                    </View>
                </Modal>
            </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 5
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    modalView: {
        backgroundColor: '#fff',
        padding: 10,
        //alignItems: "center",
        borderRadius: 5,
        width: '50%'
    },
    botaoMenu: {
        marginRight: 15,
        backgroundColor: 'rgb(0,86,112)',
    },
    botaoFechar: {
        marginTop: 30,
        marginBottom: 10,
        backgroundColor: 'red',
    },
    botaoItemMenu: {
        marginTop: 20,
        marginBottom: 10,
        backgroundColor: 'rgb(0,86,112)',
    }
});