import React, { Component, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Alert, Vibration, LogBox, Button } from 'react-native';
import BarcodeMask from 'react-native-barcode-mask';
import { RNCamera } from 'react-native-camera';
import BarcodeScanner, { TorchMode, FocusMode } from 'react-native-barcode-scanner-google';
import { turnLightOn, turnLightOff } from "react-native-light";


export default class QRCode extends Component {

    constructor(props) {
        super(props);
        this.state = {
            barCodeData:'',
            cameraFlash: false,
            cameraFlashText: "Flash On",
        }
        
        this.ligarDesligarFlash = this.ligarDesligarFlash.bind(this);
        this.lerBarCode = this.lerBarCode.bind(this);
    }
    
    componentDidMount(){
        LogBox.ignoreLogs(['Animated: `useNativeDriver`']);
    }

    ligarDesligarFlash(){
        if (this.state.cameraFlash == false){
          this.setState({cameraFlash: true, cameraFlashText: 'Flash Off'});
          turnLightOn();
        } else {
          this.setState({cameraFlash: false, cameraFlashText: 'Flash On'});
          turnLightOff();
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
              torchMode={RNCamera.Constants.FlashMode.on}
              onBarcodeRead={(obj) => this.lerBarCode(obj)}
          />
          <BarcodeMask width={350} height={400} showAnimatedLine={true} />

          <TouchableOpacity activeOpacity={0.2} style={styles.botaoFlash} onPress={ ()=> this.ligarDesligarFlash() }>
              <Text style={styles.textoBotao}> {this.state.cameraFlashText} </Text>
          </TouchableOpacity>
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
  botaoFlash: {
    marginBottom: 10,
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 15,
    borderRadius: 50,
    width: '100%'
  },
  textoBotao:{
    color: 'black',
    fontWeight: 'bold'
  },
});