import React, { Component } from 'react';

import {
  AppRegistry,
  StyleSheet,
  Text,
  TouchableOpacity,
  Linking,
  Alert
} from 'react-native';

import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';

export default class QRCode extends Component {

    constructor(props) {
        super(props);
        this.state = {
            barCodeData:'',
            cameraFlash: RNCamera.Constants.FlashMode.off,
            cameraFlashText: "Flash On",
        }

        this.ligarDesligarFlash = this.ligarDesligarFlash.bind(this);
        this.lerBarCode = this.lerBarCode.bind(this);
    }

    ligarDesligarFlash(){
        if (this.state.cameraFlash == RNCamera.Constants.FlashMode.off){
            this.setState({cameraFlash: RNCamera.Constants.FlashMode.torch, cameraFlashText: 'Flash Off'});
        } else {
            this.setState({cameraFlash: RNCamera.Constants.FlashMode.off, cameraFlashText: 'Flash On'});
        }
       
    }

    lerBarCode(obj){
      if( obj.type != null ){
          let state = this.state;
          state.barCodeData = obj.data;
          this.setState(state);
          this.props.navigation.navigate(this.props.navigation.getParam('rota'), {qrCode: obj.data, operacao: this.props.navigation.getParam('operacao')} );
      }
    }

  onSuccess = e => {
    Alert.alert('Aviso', e.data, [ { text: "OK", onPress: () => this.props.navigation.navigate('Operador') } ]);
    console.log(e);
    /*Linking.openURL(e.data).catch(err =>
        console.error('An error occured', err)
    );*/
  };

  render() {
    return (
      <QRCodeScanner
        onRead={this.lerBarCode}
        flashMode = {this.state.cameraFlash}
        topContent={''}
        showMarker={true}
        permissionDialogTitle={'Aviso'}
        permissionDialogMessage={'Precisamos da sua permissão para utilizar a câmera.'}
        bottomContent={
          <TouchableOpacity activeOpacity={0.2} style={styles.botaoLogin} onPress={ () => this.ligarDesligarFlash() }>
              <Text style={styles.textoBotao}> {this.state.cameraFlashText} </Text>
          </TouchableOpacity>
        }
      />
    );
  }
}

const styles = StyleSheet.create({
  centerText: {
    flex: 1,
    fontSize: 18,
    padding: 32,
    color: '#777'
  },
  textBold: {
    fontWeight: '500',
    color: '#000'
  },
  buttonText: {
    fontSize: 21,
    color: 'rgb(0,122,255)'
  },
  buttonTouchable: {
    padding: 16
  },
  botaoLogin: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 15,
},
});