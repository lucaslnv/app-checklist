import React, { Component } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
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
  };

  render() {
    return (
		<QRCodeScanner
      cameraProps={{}}
      onRead={this.lerBarCode}
			flashMode = {this.state.cameraFlash}
			topContent={''}
      showMarker={true}
			containerStyle={{backgroundColor: 'black'}}
			cameraStyle={{ height: '50%', width: '100%', backgroundColor: 'black'}}
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