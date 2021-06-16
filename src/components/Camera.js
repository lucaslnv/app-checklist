import React, { Component, useEffect, useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, LogBox, Image } from 'react-native';
import { RNCamera } from 'react-native-camera';
import { Overlay } from 'react-native-elements';
import BarcodeMask from 'react-native-barcode-mask';

export default class Camera extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            barCodeData:'',
            cameraFlash: RNCamera.Constants.FlashMode.off,
            cameraFlashText: "Flash On",
            modalVisible: false,
            fotoBase64: null
        }

        this.lerBarCode = this.lerBarCode.bind(this);
        this.ligarDesligarFlash = this.ligarDesligarFlash.bind(this);
        this.selecionarFoto = this.selecionarFoto.bind(this);
    }
    
    lerBarCode(obj){
        if( obj.type != null ){
            let state = this.state;
            state.barCodeData = obj.data;
            this.setState(state);
            this.props.navigation.navigate(this.props.navigation.getParam('rota'), {qrCode: obj.data, operacao: this.props.navigation.getParam('operacao')} );
        }
    }
   
    ligarDesligarFlash(){
        if (this.state.cameraFlash == RNCamera.Constants.FlashMode.off){
            this.setState({cameraFlash: RNCamera.Constants.FlashMode.torch, cameraFlashText: 'Flash Off'});
        } else {
            this.setState({cameraFlash: RNCamera.Constants.FlashMode.off, cameraFlashText: 'Flash On'});
        }
       
    }

    componentDidMount() {
        LogBox.ignoreLogs(['Animated: `useNativeDriver`']);
    }

    takePicture = async () => {
        if (this.camera) {
            const options = { quality: 0.5, base64: true, width: 70 };
            const data = await this.camera.takePictureAsync(options);
            this.setState({fotoBase64: 'data:image/png;base64, '+data.base64})
            this.setState({modalVisible: true})
        }
    };

    selecionarFoto(){
        console.log(this.state.fotoBase64);
        console.log(this.props.navigation.getParam('quesito'))
        this.props.navigation.goBack();
    }
    
    render() {
        return (
            <View style={styles.container}>
                <Overlay isVisible={this.state.modalVisible} fullScreen={true} onBackdropPress={() => console.log('fechou') }  >
                    
                    <View style={styles.containerImg}>
                        <Image style={styles.img} source={{uri: this.state.fotoBase64}} />
                    </View > 

                    <TouchableOpacity activeOpacity={0.2} style={styles.botaoLogin} onPress={ ()=> this.selecionarFoto() }>
                        <Text style={styles.textoBotao}>Selecionar</Text>
                    </TouchableOpacity>
                    <Text>''</Text>
                    <TouchableOpacity activeOpacity={0.2} style={styles.botaoLogin} onPress={ ()=> this.setState({modalVisible: false}) }>
                        <Text style={styles.textoBotao}>Fechar</Text>
                    </TouchableOpacity>

                   
                </Overlay>
                
                <View style={styles.containerCamera}>
                    <RNCamera 
                        style={ styles.camera }
                        ref={(camera) =>{
                            this.camera = camera;
                        }}
                        type={ RNCamera.Constants.Type.back }
                        //onBarCodeRead={ this.lerBarCode }
                        captureAudio={ false }
                        flashMode = {this.state.cameraFlash}
                        androidCameraPermissionOptions={{
                            title: 'Permissão para utilizar a câmera',
                            message: 'Precisamos da sua permissão para utilizar a câmera.',
                            buttonPositive: 'Ok',
                            buttonNegative: 'Cancelar',
                        }}
                    >
                    </RNCamera>
                </View>
                
                <TouchableOpacity activeOpacity={0.2} style={styles.botaoLogin} onPress={this.takePicture.bind(this)} >
                    <Text style={styles.textoBotao}> {'Capturar'} </Text>
                </TouchableOpacity>

                <TouchableOpacity activeOpacity={0.2} style={styles.botaoLogin} onPress={ ()=> this.ligarDesligarFlash() }>
                    <Text style={styles.textoBotao}> {this.state.cameraFlashText} </Text>
                </TouchableOpacity>
            </View>
        );
    }
}

Camera.navigationOptions = {
    title: 'Câmera'
  }

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    containerCamera: {
        flex: 1,
        backgroundColor: '#FFF'
    },
    camera: {
        height: '100%',
        width: '100%' 
    },
    botaoLogin: {
        alignItems: 'center',
        backgroundColor: '#DDDDDD',
        padding: 15,
    },
    textoBotao: {
        color: '#1B5AA0',
        fontSize: 15,
        fontWeight: 'bold',
    },
    containerImg: {
        marginTop: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
        resizeMode: 'stretch',
    },
    img:{
        height: 230,
        width: 230,
        resizeMode: 'cover',
    },
});