import React, { Component, useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, LogBox } from 'react-native';
import { RNCamera } from 'react-native-camera';
import BarcodeMask from 'react-native-barcode-mask';

export default class Camera extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            barCodeData:'',
            cameraFlash: RNCamera.Constants.FlashMode.off,
            cameraFlashText: "Flash On",
        }

        this.lerBarCode = this.lerBarCode.bind(this);
        this.ligarDesligarFlash = this.ligarDesligarFlash.bind(this);
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
    
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.containerCamera}>
                    <RNCamera 
                        style={ styles.camera }
                        ref={(camera) =>{
                            this.camera = camera;
                        }}
                        type={ RNCamera.Constants.Type.back }
                        onBarCodeRead={ this.lerBarCode }
                        captureAudio={ false }
                        flashMode = {this.state.cameraFlash}
                        androidCameraPermissionOptions={{
                            title: 'Permissão para utilizar a câmera',
                            message: 'Precisamos da sua permissão para utilizar a câmera.',
                            buttonPositive: 'Ok',
                            buttonNegative: 'Cancelar',
                        }}
                    >
                        <BarcodeMask width={330} height={450} edgeColor={'#CCC'} showAnimatedLine={true}/>
                    </RNCamera>
                </View>
                <TouchableOpacity activeOpacity={0.2} style={styles.botaoLogin} onPress={ ()=> this.ligarDesligarFlash() }>
                    <Text style={styles.textoBotao}> {this.state.cameraFlashText} </Text>
                </TouchableOpacity>
            </View>
        );
    }
}

Camera.navigationOptions = {
    title: 'QR Code'
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
    }
});