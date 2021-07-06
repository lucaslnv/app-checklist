import React, { Component, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Alert, Vibration, LogBox } from 'react-native';
import BarcodeMask from 'react-native-barcode-mask';
import { RNCamera } from 'react-native-camera';
import BarcodeScanner, { TorchMode, FocusMode } from 'react-native-barcode-scanner-google';
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
    
    componentDidMount(){
        LogBox.ignoreLogs(['Animated: `useNativeDriver`']);
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
          Vibration.vibrate(200, true);
          this.props.navigation.navigate(this.props.navigation.getParam('rota'), {qrCode: obj.data, operacao: this.props.navigation.getParam('operacao')} );
      }
    }

  onSuccess = e => {
    Alert.alert('Aviso', e.data, [ { text: "OK", onPress: () => this.props.navigation.navigate('Operador') } ]);
  };
  
  render() {
    return (
      <View style={{flex: 1}}>
          <BarcodeScanner
              style={{flex: 1}}
              focusMode={FocusMode.AUTO}
              torchMode={TorchMode.ON}
              onBarcodeRead={(obj) => this.lerBarCode(obj)}
          />
          <BarcodeMask width={350} height={400} showAnimatedLine={true} />
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
  centerText: {
    flex: 1,
    fontSize: 18
  },
  containerStyle:{
    marginTop: 20
  },
  textBold: {
    color: '#DDDDDD'
  },
  botaoLogin: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 15,
    borderRadius: 50,
    width: '100%'
  },
  textoBotao:{
    color: 'black',
    fontWeight: 'bold'
  }
});