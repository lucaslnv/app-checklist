import React, { Component } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, LogBox, Vibration } from 'react-native';
import { RNCamera } from 'react-native-camera';
import BarcodeMask from 'react-native-barcode-mask';

export default class QRCode extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            cameraFlash: RNCamera.Constants.FlashMode.off,
            cameraFlashText: "Flash On",
            isBarcodeRead: false
        }

        this.lerBarCode = this.lerBarCode.bind(this);
        this.ligarDesligarFlash = this.ligarDesligarFlash.bind(this);
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

    lerBarCode( qrCode ){
        if( this.state.isBarcodeRead == false ){
            if (qrCode.length !== 0) {
                Vibration.vibrate(200, true);
                this.setState({isBarcodeRead: true});
                console.log(qrCode[0].data);
                this.props.navigation.navigate(this.props.navigation.getParam('rota'), {qrCode: qrCode[0].data, operacao: this.props.navigation.getParam('operacao')} );
            }
        }
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
                        captureAudio={ false }
                        flashMode = {this.state.cameraFlash}
                        onGoogleVisionBarcodesDetected={({barcodes}) => this.lerBarCode(barcodes)}
                        googleVisionBarcodeType={RNCamera.Constants.GoogleVisionBarcodeDetection.BarcodeType.QR_CODE}
                        androidCameraPermissionOptions={{
                            title: 'Permissão para utilizar a câmera',
                            message: 'Precisamos da sua permissão para utilizar a câmera.',
                            buttonPositive: 'Ok',
                            buttonNegative: 'Cancelar',
                        }}
                    >
                    </RNCamera>
                    <BarcodeMask width={350} height={400} showAnimatedLine={true} />
                </View>
                <View style={styles.containerBotao}>
                    <TouchableOpacity activeOpacity={0.2} style={styles.botaoLogin} onPress={ ()=> this.ligarDesligarFlash() }>
                        <Text style={styles.textoBotao}> {this.state.cameraFlashText} </Text>
                    </TouchableOpacity>
                </View>
                
            </View>
        );
    }
}

QRCode.navigationOptions = {
    title: 'QR Code'
  }

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
    containerCamera: {
        flex: 1,
        backgroundColor: 'black'
    },
    camera: {
        height: '100%',
        width: '100%' 
    },
    botaoLogin: {
        margin: 5,
        alignItems: 'center',
        backgroundColor: '#DDDDDD',
        padding: 15,
        borderRadius: 50,
        width: '100%',
    },
    botaoSelecionarCancelar: {
        margin: 5,
        alignItems: 'center',
        backgroundColor: '#DDDDDD',
        padding: 15,
        borderRadius: 50,
        width: '30%',
    },
    textoBotao: {
        color: 'black',
        fontSize: 15,
        fontWeight: 'bold',
    },
    containerBotao: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    }
});