import React, {useEffect, useState} from 'react';
import { StyleSheet, View, ScrollView, Image, Alert, Switch } from 'react-native';
import { Button, Text, Input } from 'react-native-elements';
import LoadingItem from '../components/LoadingItem';
import {buscarEquipamentos} from '../services/api';
import NetInfo from "@react-native-community/netinfo";

export default function Equipamento(props) {

	const [codMotorista, setCodeMotorista] = useState('');
	const [nomeMotorista, setNomeMotorista] = useState('');
	const [equipamentos, setEquipamentos] = useState([]);
	const [loading, setloading] = useState(false);
	const [nomeEquipamento, setNomeEquipamento] = useState('');
	const [qrCodeEquipamento, setQrCodeEquipamento] = useState('');
	const [equipamentoValido, setEquipamentoValido] = useState(false);
	const [inputEquipamento, setInputEquipamento] = useState('');
	const [qrCodeIlegivel, setQrCodeIlegivel] = useState(false);
	  
	//OPERADOR
	useEffect(() => { 
		setCodeMotorista(props.navigation.getParam('codMotorista'));
		setNomeMotorista(props.navigation.getParam('nomeMotorista'));
	}, []);

	//CARREGAR EQUIPAMENTOS
	useEffect(() => { 

		async function carregarEquipamentos(dominio){
			setloading(true);
			//BUSCA EQUIPAMENTOS
			let respostaEquipamentos = await buscarEquipamentos(dominio);
			if(respostaEquipamentos.status){
				if(respostaEquipamentos.resultado == "Chave invalida."){
					setloading(false);
					Alert.alert('Aviso', 'Chave de autenticação inválida.');
				}
				setloading(false);
				setEquipamentos(respostaEquipamentos.resultado);
			}else{
				setloading(false);
				Alert.alert('Aviso', respostaEquipamentos.mensagem);
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
				carregarEquipamentos(dominio);
			}else{
			  setloading(false);
			  Alert.alert('Aviso', 'Dispositivo sem conexão com a internet.');
			}
		});
		
		
	}, []);

	//BUSCA EQUIPAMENTO NO ARRAY EQUIPAMENTOS - PESQUISA
	function pesquisarEquipamento(){
		let resposta = equipamentos.find( equipamento => equipamento.EQUIPAMENTO == inputEquipamento.toUpperCase() /*&& equipamento.COD_EMITENTE == 3526*/);
		if(resposta != undefined){
			setQrCodeEquipamento(resposta.COD_SOL);
			setNomeEquipamento(resposta.EQUIPAMENTO);
			setEquipamentoValido(true);
			props.navigation.navigate('Checklist', { qrCodeEquipamento: resposta.COD_SOL, nomeEquipamento: resposta.EQUIPAMENTO})
		}else{
			setQrCodeEquipamento('-');
			setNomeEquipamento('EQUIPAMENTO '+inputEquipamento.toUpperCase()+' NÃO ENCONTRADO');
			setEquipamentoValido(false);
		}
	}

	//BUSCA EQUIPAMENTO NO ARRAY EQUIPAMENTOS QR CODE
	useEffect(() => { 
		if(props.navigation.getParam('operacao') == 'equipamento'){
			let resposta = equipamentos.find( equipamento => equipamento.COD_SOL == parseInt(props.navigation.getParam('qrCode')) /*&& equipamento.COD_EMITENTE == 3526*/);
			if(resposta != undefined){
				setInputEquipamento('');
				setQrCodeEquipamento(props.navigation.getParam('qrCode'));
				setNomeEquipamento(resposta.EQUIPAMENTO);
				setEquipamentoValido(true);
				props.navigation.navigate('Checklist', { qrCodeEquipamento: props.navigation.getParam('qrCode'), nomeEquipamento: resposta.EQUIPAMENTO})
			}else{
				setInputEquipamento('');
				setQrCodeEquipamento(props.navigation.getParam('qrCode'));
				setNomeEquipamento('EQUIPAMENTO NÃO ENCONTRADO');
				setEquipamentoValido(false);
			}
			
		  }
	}, [props.navigation.getParam('operacao'), props.navigation.getParam('qrCode')]);
	

	return (
		<ScrollView style={styles.container}>
			<View style={styles.containerImg}>
				<Image style={styles.img} source={require('../assets/logo_sol.png')} />
			</View>
			<Text h5 style={{textAlign: 'center', marginBottom: 10}}>{'Operador: '+codMotorista+ ' - '+ nomeMotorista}</Text>
			{
				qrCodeEquipamento != '' && qrCodeEquipamento != undefined
				?
				<>
				<Text style={styles.textoEquipamento}>{qrCodeEquipamento}</Text>
        		<Text style={styles.textoEquipamento}>{nomeEquipamento}</Text>
				</>
				:
				<Text></Text>
			}
			
			<Button
				buttonStyle={styles.botaoEquipamento}
				title="QR CODE EQUIPAMENTO"
				onPress={ ()=> props.navigation.navigate('QRCode', { rota: 'Equipamento', operacao: 'equipamento'})}
			/>
			{ 
				equipamentoValido == true
				? 
				<Button
					buttonStyle={styles.botaoAvancar}
					title="AVANÇAR"
					onPress={ () => props.navigation.navigate('Checklist', { qrCodeEquipamento: qrCodeEquipamento, nomeEquipamento: nomeEquipamento, codOperador: codMotorista})}
				/>
				: 
				<Text></Text>
			}
			<View style={{ flexDirection: "row", justifyContent: "space-between"}}>
				<Text style={{fontWeight: 'bold'}}>QR Code ilegível?</Text>
				<Switch
					trackColor={{ false: "#C4C4C4", true: "#C5DB5F" }}
					thumbColor={ "#fff" }
					ios_backgroundColor="#fff"
					onValueChange={ (previousState) => setQrCodeIlegivel(previousState) }
					value={qrCodeIlegivel}
				/>
			</View>
			{
			qrCodeIlegivel && (
				<>
					<Input 
						editable={true}
						onChangeText={ value => setInputEquipamento(value)}
						placeholder='Informe o equipamento'
						value={inputEquipamento}
					/>
					<Button
						disabled={!inputEquipamento}
						buttonStyle={styles.botaoPesquisar}
						title="PESQUISAR"
						onPress={ pesquisarEquipamento }
					/>
				</>
			)
			}
			<LoadingItem visible={loading} />
		</ScrollView>
  );
}

Equipamento.navigationOptions = {
  title: 'Equipamento'
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
	textoEquipamento: {
		textAlign: "center",
		padding: 5,
		fontSize: 17
	},
	containerImg: {
		marginTop: 20,
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: 10,
	},
	botaoEquipamento: {
		marginTop: 10,
		backgroundColor: 'rgb(250,184,29)',
	},
	botaoAvancar: {
		marginTop: 20,
		marginBottom: 20,
		backgroundColor: 'rgb(0,86,112)',
	},
	botaoPesquisar: {
		marginBottom: 40,
		backgroundColor: 'rgb(0,86,112)',
	},
	img:{
		height: 200,
		width: 200,
		resizeMode: 'cover',
	  },
});