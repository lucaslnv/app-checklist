import React, { Component } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, LogBox } from 'react-native';
import { RNCamera } from 'react-native-camera';

export default class Camera extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            barCodeData:'',
            cameraFlash: RNCamera.Constants.FlashMode.off,
            cameraFlashText: "Flash On",
            fotoBase64: null,
            pausePreview: false
        }

        this.lerBarCode = this.lerBarCode.bind(this);
        this.ligarDesligarFlash = this.ligarDesligarFlash.bind(this);
        this.selecionarFoto = this.selecionarFoto.bind(this);
        this.resumePicture = this.resumePicture.bind(this);
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
            const options = { quality: 0.8, base64: true, fixOrientation: true, pauseAfterCapture: true, width : 300};
            const data = await this.camera.takePictureAsync(options);
            this.setState({ pausePreview: true });
            this.setState({fotoBase64: 'data:image/png;base64, '+data.base64});
        }
    };

    resumePicture(){
        if (this.camera) {
            this.camera.resumePreview();
            this.setState({pausePreview:false})
        }
    }

    selecionarFoto(){
        this.setState({ pausePreview: false })
        this.camera.resumePreview();
        this.props.navigation.navigate('Checklist', {quesito: this.props.navigation.getParam('quesito'), fotoBase64: this.state.fotoBase64, tipo: this.props.navigation.getParam('tipo'), numero: this.props.navigation.getParam('numero')})
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
                        androidCameraPermissionOptions={{
                            title: 'Permissão para utilizar a câmera',
                            message: 'Precisamos da sua permissão para utilizar a câmera.',
                            buttonPositive: 'Ok',
                            buttonNegative: 'Cancelar',
                        }}
                    >
                        { this.state.pausePreview && 
                            (   
                                <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center', marginTop: 30 }}>
                                    <TouchableOpacity activeOpacity={0.2} style={styles.botaoSelecionarCancelar} onPress={ ()=> this.resumePicture(this) }>
                                        <Text style={styles.textoBotao}>Cancelar</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity activeOpacity={0.2} style={styles.botaoSelecionarCancelar} onPress={ ()=> this.selecionarFoto() }>
                                        <Text style={styles.textoBotao}>Selecionar</Text>
                                    </TouchableOpacity>
                                </View>
                            )
                        }
                    </RNCamera>
                </View>
                <View style={styles.containerBotao}>
                    <TouchableOpacity activeOpacity={0.2} style={styles.botaoLogin} onPress={this.takePicture.bind(this)} >
                        <Text style={styles.textoBotao}> {'Capturar'} </Text>
                    </TouchableOpacity>

                    <TouchableOpacity activeOpacity={0.2} style={styles.botaoLogin} onPress={ ()=> this.ligarDesligarFlash() }>
                        <Text style={styles.textoBotao}> {this.state.cameraFlashText} </Text>
                    </TouchableOpacity>
                </View>
                
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
        marginTop: 60,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    }
});