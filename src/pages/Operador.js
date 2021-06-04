import { StatusBar } from 'expo-status-bar';
import React, {useEffect, useState} from 'react';
import { StyleSheet, View, ScrollView, Image, Alert } from 'react-native';

import NetInfo from "@react-native-community/netinfo";

import { Button, Text } from 'react-native-elements';

import LoadingItem from '../components/LoadingItem';

import {buscarMotoristas} from '../services/api';

export default function Login(props) {

	const [motoristas, setMotoristas] = useState([]);
	const [codMotorista, setCodMotorista] = useState('');
	const [nomeMotorista, setNomeMotorista] = useState('');
	const [qrCodeMotorista, setQrCodeMotorista] = useState('');
	const [operadorValido, setOperadorValido] = useState(false);
	const [loading, setloading] = useState(false);
	
	function autenticarOperador(operador){

		async function autenticar(dominio, operador){
			setloading(true);
			//BUSCA MOTORISTAS
			let respostaMotoristas = await buscarMotoristas(dominio, operador);
			if(respostaMotoristas.status){
				setloading(false);
				setCodMotorista(respostaMotoristas.resultado.QrCode);
				setQrCodeMotorista(respostaMotoristas.resultado.QrCode);
				setNomeMotorista(respostaMotoristas.resultado.Name);
				setOperadorValido(true);
			  	props.navigation.navigate('Equipamento', { codMotorista: respostaMotoristas.resultado.QrCode, nomeMotorista: respostaMotoristas.resultado.Name})
			}else{
				setloading(false);
				setQrCodeMotorista('QR Code: '+props.navigation.getParam('qrCode'));
			  	setNomeMotorista('OPERADOR NÃO ENCONTRADO');
			  	setOperadorValido(false);
				Alert.alert('Aviso', respostaMotoristas.mensagem);
			}
		}

		
		//VERIFICA CONEXAO COM A INTERNET
		NetInfo.fetch().then(state => {
			var dominio = 'web';
			if( state.details.ipAddress != undefined ){
				var ip = state.details.ipAddress;
				var ws = ip.indexOf("192.168.2");
				if( ws != -1 ){
					dominio = 'intranet';
				}
			}

			if(state.isConnected){
				autenticar(dominio, operador);
			}else{
			setloading(false);
			Alert.alert('Aviso', 'Dispositivo sem conexão com a internet.');
			}
		});
	}

	//CARREGAR MOTORISTAS
	useEffect(() => { 
		console.log('Checklist rodando...');
	}, []);
	
	//BUSCA OPERADOR NO ARRAY MOTORISTAS
	useEffect(() => { 
		if(props.navigation.getParam('operacao') == 'operador'){
			if (props.navigation.getParam('qrCode') != undefined ){
				autenticarOperador(props.navigation.getParam('qrCode'));
			}
		  }
	}, [props.navigation.getParam('operacao'), props.navigation.getParam('qrCode')]);

  return (
    <ScrollView style={styles.container}>
		<View style={styles.containerImg}>
            <Image style={styles.img} source={require('../assets/logo_sol.png')} />
        </View >  
      	<View style={styles.containerBotao}>
		{
			qrCodeMotorista != '' && qrCodeMotorista != undefined
			?
			<>
			<Text style={styles.textoOperador}>{qrCodeMotorista}</Text>
			<Text style={styles.textoOperador}>{nomeMotorista}</Text>
			</>
			:
			<Text></Text>
		}
			
		<Button
			buttonStyle={styles.botaoOperador}
			title="OPERADOR"
			onPress={ ()=> props.navigation.navigate('Camera', { rota: 'Operador', operacao: 'operador'})}
		/>
		<Button
			buttonStyle={styles.botaoOperador}
			title="Teste QR Code"
			onPress={ ()=> props.navigation.navigate('QRCode', { rota: 'Operador', operacao: 'operador'})}
		/>
        { 
            operadorValido == true
			? 
			<Button
				buttonStyle={styles.botaoAvancar}
				title="AVANÇAR"
				onPress={ ()=> props.navigation.navigate('Equipamento', { codMotorista: codMotorista, nomeMotorista: nomeMotorista}) }
			/>
            : 
            <Text></Text>
        }
      </View>  
    	<LoadingItem visible={loading} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10
  },
  containerBotao: {
    textAlign: "center",
    marginTop: 5
  },
  botaoOperador: {
	marginTop: 10,
	backgroundColor: 'rgb(250,184,29)',
  },
  botaoAvancar: {
	marginTop: 20,
	backgroundColor: 'rgb(0,86,112)',
  },
  textoOperador: {
	textAlign: "center",
	padding: 5,
	fontSize: 17
  },
  textoBotao: {
    color: '#191970',
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
