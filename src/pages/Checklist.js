import { StatusBar } from 'expo-status-bar';
import React, {useEffect, useState} from 'react';
import { StyleSheet, View, ScrollView, Switch, Alert, Image, Picker } from 'react-native';
import {buscarQuesitos} from '../services/api';
import { Separator, Radio, Right, Left, Center, ListItem } from 'native-base';
import {Collapse,CollapseHeader, CollapseBody, AccordionList} from 'accordion-collapse-react-native';
import LoadingItem from '../components/LoadingItem';
import { Button, Text, Input } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import NetInfo from "@react-native-community/netinfo";
import { Formik } from 'formik';
import {registrarChecklist} from '../services/api';

export default function Checklist(props) {

	const [nomeEquipamento, setNomeEquipamento] = useState('');
	const [qrCodeEquipamento, setQrCodeEquipamento] = useState('');
	const [loading, setloading] = useState(false);
	const [ultimoCheckup, setUltimoCheckup] = useState('');
	const [ultimoHorimetro, setUltimoHorimetro] = useState('');
	const [tipoEquipamento, setTipoEquipamento] = useState('');
	const [cliente, setCliente] = useState('');
	const [codEmitente, setCodEmitente] = useState('');
	const [quesitos, setQuesitos] = useState([]);
	
	//EQUIPAMENTO
	useEffect(() => { 
		setQrCodeEquipamento(props.navigation.getParam('qrCodeEquipamento'));
		setNomeEquipamento(props.navigation.getParam('nomeEquipamento'));
	}, []);

	//CARREGAR QUESITOS
	useEffect(() => { 

		async function carregarQuesitos(dominio){
			setloading(true);
			//BUSCA QUESITOS
			let respostaQuesitos = await buscarQuesitos(dominio, props.navigation.getParam('qrCodeEquipamento'));
			//let respostaQuesitos = await buscarQuesitos(dominio, 2000);
			
			if(respostaQuesitos.status){

				//VERIFICA SE A INPEÇÃO FOI REALIZADA NO DIA INSPECT_ALREADY_DONE_TODAY 
				if(respostaQuesitos.resultado.status == 409){
					setloading(false);
					Alert.alert('Aviso', 'Inspeção já realizada para este equipamento hoje.', [ { text: "OK", onPress: () => props.navigation.navigate('Equipamento') } ]);
				}
				
				//VERIFICA AUTENTICAÇÃO
				if(respostaQuesitos.resultado == "Chave invalida."){
					setloading(false);
					Alert.alert('Aviso', 'Chave de autenticação inválida.');
				}
				
				setloading(false);
				setQuesitos(respostaQuesitos.resultado.data.draw);
				let data = new Date(respostaQuesitos.resultado.data.draw.ULT_CHECKUP);
				/*if( (data != '') && (data != undefined)){
					let dataFormatada = data.toLocaleString();
					setUltimoCheckup(dataFormatada);
				}*/
				setUltimoCheckup(respostaQuesitos.resultado.data.draw.ULT_CHECKUP);
				let ultHorimetro = respostaQuesitos.resultado.data.draw.ULT_HORIMETRO;
				setUltimoHorimetro( parseFloat(ultHorimetro).toFixed(1) );
				setTipoEquipamento(respostaQuesitos.resultado.data.draw.TIPO_EQUIPAMENTO);
				setCliente(respostaQuesitos.resultado.data.draw.CLIENTE);
				setCodEmitente(respostaQuesitos.resultado.data.draw.COD_EMITENTE);
			}else{
				setloading(false);
				Alert.alert('Aviso', respostaQuesitos.mensagem);
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
				carregarQuesitos(dominio);
			}else{
			  setloading(false);
			  Alert.alert('Aviso', 'Dispositivo sem conexão com a internet.');
			}
		});
		
		
	}, []);

	function registrar(values){
		var quesitos = [];
		var indice = 0;
		Object.keys(values).forEach(function(item){
			if( item.indexOf("icon") == -1 ){

				//PNEU TRUE
				if(  item.indexOf("Pneu") != -1 ){
					let pneu = item.substring(5,6);
					let quesitoPneu = item.substring(item.indexOf("Q") + 1);
					let respostaPneu = values[item];

					//LIST BOX
					if(item.indexOf("lb") != -1){
						quesitos[indice] = ({ "COD_LADO": pneu, "COD_ITEM": quesitoPneu, "NUM_RESPOSTA": respostaPneu, "NUM_ALTERNATIVO":"", "DES_RESPOSTA": "", "DES_FOTO": "" });
					}
					//RADIO BUTTON
					if(item.indexOf("rb") != -1){
						quesitos[indice] = ({ "COD_LADO": pneu, "COD_ITEM": quesitoPneu, "NUM_RESPOSTA": respostaPneu, "NUM_ALTERNATIVO":"", "DES_RESPOSTA": "", "DES_FOTO": "" });
					}
					//CHECKBOX
					if(item.indexOf("cb") != -1){
						quesitos[indice] = ({ "COD_LADO": pneu, "COD_ITEM": quesitoPneu, "NUM_RESPOSTA": respostaPneu, "NUM_ALTERNATIVO":"", "DES_RESPOSTA": "", "DES_FOTO": "" });
					}
					//TEXTO
					if(item.indexOf("Texto") != -1){
						quesitos[indice] = ({ "COD_LADO": pneu, "COD_ITEM": quesitoPneu, "NUM_RESPOSTA": "", "NUM_ALTERNATIVO":"", "DES_RESPOSTA": respostaPneu, "DES_FOTO": "" });
					}
					//DECIMAL
					if(item.indexOf("Decimal") != -1){
						quesitos[indice] = ({ "COD_LADO": pneu, "COD_ITEM": quesitoPneu, "NUM_RESPOSTA": "", "NUM_ALTERNATIVO": respostaPneu, "DES_RESPOSTA": "", "DES_FOTO": "" });
					}
					//INTEIRO
					if(item.indexOf("Inteiro") != -1){
						quesitos[indice] = ({ "COD_LADO": pneu, "COD_ITEM": quesitoPneu, "NUM_RESPOSTA": "", "NUM_ALTERNATIVO": respostaPneu, "DES_RESPOSTA": "", "DES_FOTO": "" });
					}
					
				}

				//LATARIA TRUE
				if(  item.indexOf("Lataria") != -1 ){
					let lataria = item.substring(8,9);
					let quesitoLataria = item.substring(item.indexOf("Q") + 1);
					let respostaLataria = values[item];

					//LIST BOX
					if(item.indexOf("lb") != -1){
						quesitos[indice] = ({ "COD_LADO": lataria, "COD_ITEM": quesitoLataria, "NUM_RESPOSTA": respostaLataria, "NUM_ALTERNATIVO":"", "DES_RESPOSTA": "", "DES_FOTO": "" });
					}
					//RADIO BUTTON
					if(item.indexOf("rb") != -1){
						quesitos[indice] = ({ "COD_LADO": lataria, "COD_ITEM": quesitoLataria, "NUM_RESPOSTA": respostaLataria, "NUM_ALTERNATIVO":"", "DES_RESPOSTA": "", "DES_FOTO": "" });
					}
					//CHECKBOX
					if(item.indexOf("cb") != -1){
						quesitos[indice] = ({ "COD_LADO": lataria, "COD_ITEM": quesitoLataria, "NUM_RESPOSTA": respostaLataria, "NUM_ALTERNATIVO":"", "DES_RESPOSTA": "", "DES_FOTO": "" });
					}
					//TEXTO
					if(item.indexOf("Texto") != -1){
						quesitos[indice] = ({ "COD_LADO": lataria, "COD_ITEM": quesitoLataria, "NUM_RESPOSTA": "", "NUM_ALTERNATIVO":"", "DES_RESPOSTA": respostaLataria, "DES_FOTO": "" });
					}
					//DECIMAL
					if(item.indexOf("Decimal") != -1){
						quesitos[indice] = ({ "COD_LADO": lataria, "COD_ITEM": quesitoLataria, "NUM_RESPOSTA": "", "NUM_ALTERNATIVO": respostaLataria, "DES_RESPOSTA": "", "DES_FOTO": "" });
					}
					//INTEIRO
					if(item.indexOf("Inteiro") != -1){
						quesitos[indice] = ({ "COD_LADO": lataria, "COD_ITEM": quesitoLataria, "NUM_RESPOSTA": "", "NUM_ALTERNATIVO": respostaLataria, "DES_RESPOSTA": "", "DES_FOTO": "" });
					}

				}

				//PNEU FALSE - LATARIA FALSE
				if( (item.indexOf("Pneu") == -1) && (item.indexOf("Lataria") == -1) ){
					let quesito = item.substring(item.indexOf("_") + 1);
					let resposta = values[item];
					
					//LIST BOX
					if(item.indexOf("lb") != -1){
						quesitos[indice] = ({ "COD_LADO":"", "COD_ITEM": quesito, "NUM_RESPOSTA": resposta, "NUM_ALTERNATIVO":"", "DES_RESPOSTA": "", "DES_FOTO": "" });
					}
					//RADIO BUTTON
					if(item.indexOf("rb") != -1){
						quesitos[indice] = ({ "COD_LADO":"", "COD_ITEM": quesito, "NUM_RESPOSTA": resposta, "NUM_ALTERNATIVO":"", "DES_RESPOSTA": "", "DES_FOTO": "" });
					}
					//CHECKBOX
					if(item.indexOf("cb") != -1){
						quesitos[indice] = ({ "COD_LADO":"", "COD_ITEM": quesito, "NUM_RESPOSTA": resposta, "NUM_ALTERNATIVO":"", "DES_RESPOSTA": "", "DES_FOTO": "" });
					}
					//TEXTO
					if(item.indexOf("Texto") != -1){
						quesitos[indice] = ({ "COD_LADO":"", "COD_ITEM": quesito, "NUM_RESPOSTA": "", "NUM_ALTERNATIVO":"", "DES_RESPOSTA": resposta, "DES_FOTO": "" });
					}
					//DECIMAL
					if(item.indexOf("Decimal") != -1){
						quesitos[indice] = ({ "COD_LADO":"", "COD_ITEM": quesito, "NUM_RESPOSTA": "", "NUM_ALTERNATIVO": resposta, "DES_RESPOSTA": "", "DES_FOTO": "" });
					}
					//INTEIRO
					if(item.indexOf("Inteiro") != -1){
						quesitos[indice] = ({ "COD_LADO":"", "COD_ITEM": quesito, "NUM_RESPOSTA": "", "NUM_ALTERNATIVO": resposta, "DES_RESPOSTA": "", "DES_FOTO": "" });
					}
					
				}

				indice++;
			}
		});
		
		async function registrar(dominio, quesitos, codEmitente, nomeEquipamento){
			if(quesitos.length == 0 ){
				Alert.alert('Aviso', 'Favor preencher o checklist.'); return;
			}
			setloading(true);
			//REGISTRA CHECKLIST
			let respostaChecklist = await registrarChecklist(dominio, quesitos, codEmitente, nomeEquipamento);
			if(respostaChecklist.status){
				if(respostaChecklist.resultado == "OK"){
					setloading(false);
					Alert.alert('Aviso', 'Checklist registrado com sucesso.', [ { text: "OK", onPress: () => props.navigation.navigate('Equipamento') } ]);
				}
				setloading(false);
			}else{
				setloading(false);
				Alert.alert('Aviso', respostaChecklist.mensagem);
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
				registrar(dominio, quesitos, codEmitente, nomeEquipamento);
			}else{
			  Alert.alert('Aviso', 'Dispositivo sem conexão com a internet.');
			}
		});
	}
	
  return (
    	<ScrollView style={styles.container}>
		
		<View style={{flex: 1, flexDirection: 'row'}}>
			<View style={{ width: '70%'}}>
				<Text style={styles.textoEquipamento}>{nomeEquipamento}</Text>
				<Text style={styles.textoTipoEquipamento}>{tipoEquipamento}</Text>
				<Text style={styles.textoCliente}>{cliente}</Text>
				<Text style={styles.textoCliente}>{'Último checkup: '+ultimoCheckup}</Text>
				<Text style={styles.textoCliente}>{'Último horí­metro: '+ultimoHorimetro}</Text>
			</View>
			<View style={{ width: '30%'}}>
				<View style={styles.containerImg}>
					<Image style={styles.img} source={require('../assets/foto.png')} />
				</View >
			</View>
		</View>

		<Formik
			initialValues={{}}
		>
			{({ handleChange, handleBlur, setFieldValue, values }) => (
			<View>
				{
					quesitos.GRUPO != undefined && (
						quesitos.GRUPO.map((grupo, g) => {
							return (
								<View key={grupo.COD_GRUPO}>
									<Collapse onToggle={ (isExpanded) => setFieldValue('icon_'+grupo.COD_GRUPO, isExpanded ) } >
										<CollapseHeader>
											<Separator style={{ backgroundColor: '#fdb700', height: 45, marginTop: 3 }} bordered >
											<Text style={{ fontWeight: 'bold', fontSize: 16 }}>
											<Icon
												name = { 
													grupo.COD_GRUPO == 1 ? values.icon_1 == true ? 'angle-up' : 'angle-down' :
													grupo.COD_GRUPO == 2 ? values.icon_2 == true ? 'angle-up' : 'angle-down' :
													grupo.COD_GRUPO == 3 ? values.icon_3 == true ? 'angle-up' : 'angle-down' :
													grupo.COD_GRUPO == 4 ? values.icon_4 == true ? 'angle-up' : 'angle-down' :
													grupo.COD_GRUPO == 5 ? values.icon_5 == true ? 'angle-up' : 'angle-down' :
													grupo.COD_GRUPO == 6 ? values.icon_6 == true ? 'angle-up' : 'angle-down' :
													grupo.COD_GRUPO == 7 ? values.icon_7 == true ? 'angle-up' : 'angle-down' :
													grupo.COD_GRUPO == 8 ? values.icon_8 == true ? 'angle-up' : 'angle-down' :
													grupo.COD_GRUPO == 9 ? values.icon_9 == true ? 'angle-up' : 'angle-down' :
													grupo.COD_GRUPO == 10 ? values.icon_10 == true ? 'angle-up' : 'angle-down' :
													false
												}
												size={15}
												color="black"
											/>
											&nbsp;&nbsp;{grupo.DES_GRUPO}
											</Text>
											</Separator>
										</CollapseHeader>
										<CollapseBody>
										{
											//TABELA CALIBRAGEM PNEU
											grupo.IND_PNEUS == true && grupo.CALIBRAGEM.length > 0 && (
												<Collapse
														isExpanded={false}
														>
														<CollapseHeader>
															<Separator style={{ backgroundColor: '#C4C4C4', height: 45, marginTop: 3, marginLeft: 20, marginRight: 20  }} bordered >
																<Text style={{ fontWeight: 'bold'}} > &nbsp;&nbsp;{'Tabela de Calibragem dos Pneus'} </Text>
															</Separator>
														</CollapseHeader>
														<CollapseBody>
															<View style={{flex: 1, flexDirection: 'row', marginLeft: 20, marginRight: 20, borderBottomWidth: 1 }}>
																<View style={{ width: '55%'}}><Text style={{ padding: 5, fontWeight: 'bold', textAlign: 'center' }}>{'EQUIPAMENTO'}</Text></View>
																<View style={{ width: '30%'}}><Text style={{ padding: 5, fontWeight: 'bold', textAlign: 'center' }}>{'MEDIDA'}</Text></View>
																<View style={{ width: '15%'}}><Text style={{ padding: 5, fontWeight: 'bold', textAlign: 'center' }}>{'PSI'}</Text></View>
															</View>
														{
															grupo.CALIBRAGEM.map((calibragem, q) => {
																return(
																	<View key={calibragem.COD_MEDIDA} style={{flex: 1, flexDirection: 'row', marginLeft: 20, marginRight: 20, borderBottomWidth: 1, marginBottom: 5 }}>
																		<View style={{ width: '55%'}}>
																			<Text style={{padding: 5, textAlign: 'center'}}>{calibragem.DES_EQUIPAMENTO}</Text>
																		</View>
																		<View style={{ width: '30%'}}>
																			<Text style={{padding: 5, textAlign: 'center'}}>{calibragem.DES_MEDIDA}</Text>
																		</View>
																		<View style={{ width: '15%'}}>
																			<Text style={{padding: 5, textAlign: 'center'}}>{calibragem.PSI}</Text>
																		</View>
																	</View>
																)
															})
														}
														</CollapseBody>
												</Collapse>
											)
										}
										{
											//PNEU TRUE
											grupo.IND_PNEUS == true && (
												quesitos.LISTA_PNEUS.map((listbox, i) => {
													return ( 
														<Collapse 
																key={listbox.DES_OPCAO}
																isExpanded={false}
																>
																<CollapseHeader>
																	<Separator style={{ backgroundColor: '#C4C4C4', height: 45, marginTop: 3, marginLeft: 20, marginRight: 20  }} bordered >
																	<Text > 
																	&nbsp;&nbsp;{listbox.DES_OPCAO}
																	</Text>
																	</Separator>
																</CollapseHeader>
																<CollapseBody style={{ marginLeft: 10 }} >
																{
																	grupo.QUESITOS != undefined &&(
																		grupo.QUESITOS.map((quesito, q) => {
																			return(
																				<View key={quesito.QUESITO}>
																				
																				<Text style={{fontSize: 20, marginLeft: 10, marginTop: 10, fontWeight: 'bold' }}>{quesito.COD_ITEM+'. '+quesito.QUESITO}</Text>
																				{
																					//LIST BOX
																					quesito.IND_LISTA == true && quesito.IND_ATIVO == true &&
																					(
																						<Picker
																								selectedValue={
																									//PNEU 1
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 1 ? values.Pneu_1_lbQ1 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 2 ? values.Pneu_1_lbQ2 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 3 ? values.Pneu_1_lbQ3 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 4 ? values.Pneu_1_lbQ4 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 5 ? values.Pneu_1_lbQ5 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 6 ? values.Pneu_1_lbQ6 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 7 ? values.Pneu_1_lbQ7 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 8 ? values.Pneu_1_lbQ8 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 9 ? values.Pneu_1_lbQ9 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 10  ? values.Pneu_1_lbQ10 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 11  ? values.Pneu_1_lbQ11 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 12  ? values.Pneu_1_lbQ12 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 13  ? values.Pneu_1_lbQ13 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 14  ? values.Pneu_1_lbQ14 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 15  ? values.Pneu_1_lbQ15 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 16  ? values.Pneu_1_lbQ16 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 17  ? values.Pneu_1_lbQ17 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 18  ? values.Pneu_1_lbQ18 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 19  ? values.Pneu_1_lbQ19 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 20  ? values.Pneu_1_lbQ20 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 21  ? values.Pneu_1_lbQ21 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 22  ? values.Pneu_1_lbQ22 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 23  ? values.Pneu_1_lbQ23 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 24  ? values.Pneu_1_lbQ24 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 25  ? values.Pneu_1_lbQ25 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 26  ? values.Pneu_1_lbQ26 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 27  ? values.Pneu_1_lbQ27 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 28  ? values.Pneu_1_lbQ28 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 29  ? values.Pneu_1_lbQ29 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 30  ? values.Pneu_1_lbQ30 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 31  ? values.Pneu_1_lbQ31 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 32  ? values.Pneu_1_lbQ32 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 33  ? values.Pneu_1_lbQ33 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 34  ? values.Pneu_1_lbQ34 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 35  ? values.Pneu_1_lbQ35 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 36  ? values.Pneu_1_lbQ36 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 37  ? values.Pneu_1_lbQ37 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 38  ? values.Pneu_1_lbQ38 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 39  ? values.Pneu_1_lbQ39 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 40  ? values.Pneu_1_lbQ40 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 41  ? values.Pneu_1_lbQ41 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 42  ? values.Pneu_1_lbQ42 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 43  ? values.Pneu_1_lbQ43 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 44  ? values.Pneu_1_lbQ44 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 45  ? values.Pneu_1_lbQ45 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 46  ? values.Pneu_1_lbQ46 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 47  ? values.Pneu_1_lbQ47 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 48  ? values.Pneu_1_lbQ48 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 49  ? values.Pneu_1_lbQ49 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 50  ? values.Pneu_1_lbQ50 :

																									//PNEU 2
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 1 ? values.Pneu_2_lbQ1 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 2 ? values.Pneu_2_lbQ2 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 3 ? values.Pneu_2_lbQ3 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 4 ? values.Pneu_2_lbQ4 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 5 ? values.Pneu_2_lbQ5 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 6 ? values.Pneu_2_lbQ6 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 7 ? values.Pneu_2_lbQ7 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 8 ? values.Pneu_2_lbQ8 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 9 ? values.Pneu_2_lbQ9 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 10  ? values.Pneu_2_lbQ10 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 11  ? values.Pneu_2_lbQ11 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 12  ? values.Pneu_2_lbQ12 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 13  ? values.Pneu_2_lbQ13 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 14  ? values.Pneu_2_lbQ14 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 15  ? values.Pneu_2_lbQ15 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 16  ? values.Pneu_2_lbQ16 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 17  ? values.Pneu_2_lbQ17 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 18  ? values.Pneu_2_lbQ18 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 19  ? values.Pneu_2_lbQ19 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 20  ? values.Pneu_2_lbQ20 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 21  ? values.Pneu_2_lbQ21 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 22  ? values.Pneu_2_lbQ22 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 23  ? values.Pneu_2_lbQ23 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 24  ? values.Pneu_2_lbQ24 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 25  ? values.Pneu_2_lbQ25 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 26  ? values.Pneu_2_lbQ26 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 27  ? values.Pneu_2_lbQ27 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 28  ? values.Pneu_2_lbQ28 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 29  ? values.Pneu_2_lbQ29 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 30  ? values.Pneu_2_lbQ30 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 31  ? values.Pneu_2_lbQ31 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 32  ? values.Pneu_2_lbQ32 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 33  ? values.Pneu_2_lbQ33 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 34  ? values.Pneu_2_lbQ34 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 35  ? values.Pneu_2_lbQ35 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 36  ? values.Pneu_2_lbQ36 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 37  ? values.Pneu_2_lbQ37 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 38  ? values.Pneu_2_lbQ38 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 39  ? values.Pneu_2_lbQ39 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 40  ? values.Pneu_2_lbQ40 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 41  ? values.Pneu_2_lbQ41 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 42  ? values.Pneu_2_lbQ42 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 43  ? values.Pneu_2_lbQ43 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 44  ? values.Pneu_2_lbQ44 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 45  ? values.Pneu_2_lbQ45 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 46  ? values.Pneu_2_lbQ46 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 47  ? values.Pneu_2_lbQ47 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 48  ? values.Pneu_2_lbQ48 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 49  ? values.Pneu_2_lbQ49 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 50  ? values.Pneu_2_lbQ50 :

																									//PNEU 3
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 1 ? values.Pneu_3_lbQ1 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 2 ? values.Pneu_3_lbQ2 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 3 ? values.Pneu_3_lbQ3 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 4 ? values.Pneu_3_lbQ4 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 5 ? values.Pneu_3_lbQ5 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 6 ? values.Pneu_3_lbQ6 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 7 ? values.Pneu_3_lbQ7 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 8 ? values.Pneu_3_lbQ8 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 9 ? values.Pneu_3_lbQ9 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 10  ? values.Pneu_3_lbQ10 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 11  ? values.Pneu_3_lbQ11 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 12  ? values.Pneu_3_lbQ12 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 13  ? values.Pneu_3_lbQ13 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 14  ? values.Pneu_3_lbQ14 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 15  ? values.Pneu_3_lbQ15 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 16  ? values.Pneu_3_lbQ16 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 17  ? values.Pneu_3_lbQ17 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 18  ? values.Pneu_3_lbQ18 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 19  ? values.Pneu_3_lbQ19 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 20  ? values.Pneu_3_lbQ20 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 21  ? values.Pneu_3_lbQ21 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 22  ? values.Pneu_3_lbQ22 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 23  ? values.Pneu_3_lbQ23 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 24  ? values.Pneu_3_lbQ24 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 25  ? values.Pneu_3_lbQ25 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 26  ? values.Pneu_3_lbQ26 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 27  ? values.Pneu_3_lbQ27 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 28  ? values.Pneu_3_lbQ28 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 29  ? values.Pneu_3_lbQ29 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 30  ? values.Pneu_3_lbQ30 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 31  ? values.Pneu_3_lbQ31 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 32  ? values.Pneu_3_lbQ32 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 33  ? values.Pneu_3_lbQ33 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 34  ? values.Pneu_3_lbQ34 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 35  ? values.Pneu_3_lbQ35 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 36  ? values.Pneu_3_lbQ36 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 37  ? values.Pneu_3_lbQ37 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 38  ? values.Pneu_3_lbQ38 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 39  ? values.Pneu_3_lbQ39 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 40  ? values.Pneu_3_lbQ40 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 41  ? values.Pneu_3_lbQ41 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 42  ? values.Pneu_3_lbQ42 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 43  ? values.Pneu_3_lbQ43 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 44  ? values.Pneu_3_lbQ44 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 45  ? values.Pneu_3_lbQ45 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 46  ? values.Pneu_3_lbQ46 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 47  ? values.Pneu_3_lbQ47 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 48  ? values.Pneu_3_lbQ48 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 49  ? values.Pneu_3_lbQ49 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 50  ? values.Pneu_3_lbQ50 :

																									//PNEU 4
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 1 ? values.Pneu_4_lbQ1 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 2 ? values.Pneu_4_lbQ2 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 3 ? values.Pneu_4_lbQ3 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 4 ? values.Pneu_4_lbQ4 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 5 ? values.Pneu_4_lbQ5 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 6 ? values.Pneu_4_lbQ6 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 7 ? values.Pneu_4_lbQ7 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 8 ? values.Pneu_4_lbQ8 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 9 ? values.Pneu_4_lbQ9 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 10  ? values.Pneu_4_lbQ10 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 11  ? values.Pneu_4_lbQ11 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 12  ? values.Pneu_4_lbQ12 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 13  ? values.Pneu_4_lbQ13 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 14  ? values.Pneu_4_lbQ14 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 15  ? values.Pneu_4_lbQ15 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 16  ? values.Pneu_4_lbQ16 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 17  ? values.Pneu_4_lbQ17 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 18  ? values.Pneu_4_lbQ18 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 19  ? values.Pneu_4_lbQ19 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 20  ? values.Pneu_4_lbQ20 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 21  ? values.Pneu_4_lbQ21 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 22  ? values.Pneu_4_lbQ22 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 23  ? values.Pneu_4_lbQ23 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 24  ? values.Pneu_4_lbQ24 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 25  ? values.Pneu_4_lbQ25 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 26  ? values.Pneu_4_lbQ26 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 27  ? values.Pneu_4_lbQ27 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 28  ? values.Pneu_4_lbQ28 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 29  ? values.Pneu_4_lbQ29 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 30  ? values.Pneu_4_lbQ30 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 31  ? values.Pneu_4_lbQ31 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 32  ? values.Pneu_4_lbQ32 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 33  ? values.Pneu_4_lbQ33 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 34  ? values.Pneu_4_lbQ34 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 35  ? values.Pneu_4_lbQ35 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 36  ? values.Pneu_4_lbQ36 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 37  ? values.Pneu_4_lbQ37 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 38  ? values.Pneu_4_lbQ38 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 39  ? values.Pneu_4_lbQ39 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 40  ? values.Pneu_4_lbQ40 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 41  ? values.Pneu_4_lbQ41 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 42  ? values.Pneu_4_lbQ42 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 43  ? values.Pneu_4_lbQ43 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 44  ? values.Pneu_4_lbQ44 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 45  ? values.Pneu_4_lbQ45 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 46  ? values.Pneu_4_lbQ46 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 47  ? values.Pneu_4_lbQ47 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 48  ? values.Pneu_4_lbQ48 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 49  ? values.Pneu_4_lbQ49 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 50  ? values.Pneu_4_lbQ50 :

																									//PNEU 5
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 1 ? values.Pneu_5_lbQ1 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 2 ? values.Pneu_5_lbQ2 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 3 ? values.Pneu_5_lbQ3 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 4 ? values.Pneu_5_lbQ4 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 5 ? values.Pneu_5_lbQ5 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 6 ? values.Pneu_5_lbQ6 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 7 ? values.Pneu_5_lbQ7 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 8 ? values.Pneu_5_lbQ8 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 9 ? values.Pneu_5_lbQ9 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 10  ? values.Pneu_5_lbQ10 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 11  ? values.Pneu_5_lbQ11 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 12  ? values.Pneu_5_lbQ12 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 13  ? values.Pneu_5_lbQ13 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 14  ? values.Pneu_5_lbQ14 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 15  ? values.Pneu_5_lbQ15 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 16  ? values.Pneu_5_lbQ16 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 17  ? values.Pneu_5_lbQ17 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 18  ? values.Pneu_5_lbQ18 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 19  ? values.Pneu_5_lbQ19 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 20  ? values.Pneu_5_lbQ20 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 21  ? values.Pneu_5_lbQ21 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 22  ? values.Pneu_5_lbQ22 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 23  ? values.Pneu_5_lbQ23 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 24  ? values.Pneu_5_lbQ24 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 25  ? values.Pneu_5_lbQ25 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 26  ? values.Pneu_5_lbQ26 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 27  ? values.Pneu_5_lbQ27 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 28  ? values.Pneu_5_lbQ28 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 29  ? values.Pneu_5_lbQ29 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 30  ? values.Pneu_5_lbQ30 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 31  ? values.Pneu_5_lbQ31 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 32  ? values.Pneu_5_lbQ32 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 33  ? values.Pneu_5_lbQ33 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 34  ? values.Pneu_5_lbQ34 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 35  ? values.Pneu_5_lbQ35 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 36  ? values.Pneu_5_lbQ36 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 37  ? values.Pneu_5_lbQ37 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 38  ? values.Pneu_5_lbQ38 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 39  ? values.Pneu_5_lbQ39 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 40  ? values.Pneu_5_lbQ40 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 41  ? values.Pneu_5_lbQ41 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 42  ? values.Pneu_5_lbQ42 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 43  ? values.Pneu_5_lbQ43 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 44  ? values.Pneu_5_lbQ44 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 45  ? values.Pneu_5_lbQ45 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 46  ? values.Pneu_5_lbQ46 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 47  ? values.Pneu_5_lbQ47 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 48  ? values.Pneu_5_lbQ48 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 49  ? values.Pneu_5_lbQ49 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 50  ? values.Pneu_5_lbQ50 :

																									//PNEU 6
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 1 ? values.Pneu_6_lbQ1 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 2 ? values.Pneu_6_lbQ2 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 3 ? values.Pneu_6_lbQ3 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 4 ? values.Pneu_6_lbQ4 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 5 ? values.Pneu_6_lbQ5 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 6 ? values.Pneu_6_lbQ6 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 7 ? values.Pneu_6_lbQ7 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 8 ? values.Pneu_6_lbQ8 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 9 ? values.Pneu_6_lbQ9 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 10  ? values.Pneu_6_lbQ10 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 11  ? values.Pneu_6_lbQ11 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 12  ? values.Pneu_6_lbQ12 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 13  ? values.Pneu_6_lbQ13 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 14  ? values.Pneu_6_lbQ14 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 15  ? values.Pneu_6_lbQ15 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 16  ? values.Pneu_6_lbQ16 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 17  ? values.Pneu_6_lbQ17 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 18  ? values.Pneu_6_lbQ18 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 19  ? values.Pneu_6_lbQ19 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 20  ? values.Pneu_6_lbQ20 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 21  ? values.Pneu_6_lbQ21 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 22  ? values.Pneu_6_lbQ22 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 23  ? values.Pneu_6_lbQ23 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 24  ? values.Pneu_6_lbQ24 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 25  ? values.Pneu_6_lbQ25 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 26  ? values.Pneu_6_lbQ26 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 27  ? values.Pneu_6_lbQ27 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 28  ? values.Pneu_6_lbQ28 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 29  ? values.Pneu_6_lbQ29 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 30  ? values.Pneu_6_lbQ30 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 31  ? values.Pneu_6_lbQ31 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 32  ? values.Pneu_6_lbQ32 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 33  ? values.Pneu_6_lbQ33 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 34  ? values.Pneu_6_lbQ34 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 35  ? values.Pneu_6_lbQ35 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 36  ? values.Pneu_6_lbQ36 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 37  ? values.Pneu_6_lbQ37 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 38  ? values.Pneu_6_lbQ38 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 39  ? values.Pneu_6_lbQ39 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 40  ? values.Pneu_6_lbQ40 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 41  ? values.Pneu_6_lbQ41 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 42  ? values.Pneu_6_lbQ42 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 43  ? values.Pneu_6_lbQ43 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 44  ? values.Pneu_6_lbQ44 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 45  ? values.Pneu_6_lbQ45 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 46  ? values.Pneu_6_lbQ46 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 47  ? values.Pneu_6_lbQ47 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 48  ? values.Pneu_6_lbQ48 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 49  ? values.Pneu_6_lbQ49 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 50  ? values.Pneu_6_lbQ50 :

																									false
																								}
																								style={{ height: 50, margin:5, width: '100%'}}
																								onValueChange={(itemValue, itemIndex) => setFieldValue('Pneu_'+listbox.COD_OPCAO+'_lbQ'+quesito.COD_ITEM, itemValue )}
																						>
																							<Picker.Item 
																								label={'Selecione um item'} 
																								value={0} 
																							/>
																						{
																							quesito.componentes.listbox.OPCOES.map((listbox, i) => {
																								return (
																									<Picker.Item 
																										key={listbox.DES_OPCAO}
																										label={listbox.DES_OPCAO} 
																										value={listbox.COD_OPCAO} 
																									/>
																								);
																							})
																						}
																						</Picker>
																					)
																				}
																				{
																					//RADIO BUTTON PNEU
																					quesito.IND_RADIO == true && quesito.IND_ATIVO == true &&
																					(
																						quesito.componentes.radio.OPCOES.map((radio, i) => {
																							return (
																								<ListItem 
																									key={radio.DES_OPCAO}
																									onPress={ () => setFieldValue('Pneu_'+listbox.COD_OPCAO+'_rbQ'+quesito.COD_ITEM, radio.COD_OPCAO) }
																									>
																									<Radio
																										onPress={ () => setFieldValue('Pneu_'+listbox.COD_OPCAO+'_rbQ'+quesito.COD_ITEM, radio.COD_OPCAO) }
																										color={"#f0ad4e"}
																										selectedColor={"#5cb85c"}
																										selected={ 
																											
																											//PNEU 1
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 1 ? values.Pneu_1_rbQ1 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 2 ? values.Pneu_1_rbQ2 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 3 ? values.Pneu_1_rbQ3 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 4 ? values.Pneu_1_rbQ4 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 5 ? values.Pneu_1_rbQ5 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 6 ? values.Pneu_1_rbQ6 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 7 ? values.Pneu_1_rbQ7 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 8 ? values.Pneu_1_rbQ8 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 9 ? values.Pneu_1_rbQ9 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 10  ? values.Pneu_1_rbQ10 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 11  ? values.Pneu_1_rbQ11 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 12  ? values.Pneu_1_rbQ12 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 13  ? values.Pneu_1_rbQ13 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 14  ? values.Pneu_1_rbQ14 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 15  ? values.Pneu_1_rbQ15 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 16  ? values.Pneu_1_rbQ16 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 17  ? values.Pneu_1_rbQ17 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 18  ? values.Pneu_1_rbQ18 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 19  ? values.Pneu_1_rbQ19 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 20  ? values.Pneu_1_rbQ20 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 21  ? values.Pneu_1_rbQ21 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 22  ? values.Pneu_1_rbQ22 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 23  ? values.Pneu_1_rbQ23 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 24  ? values.Pneu_1_rbQ24 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 25  ? values.Pneu_1_rbQ25 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 26  ? values.Pneu_1_rbQ26 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 27  ? values.Pneu_1_rbQ27 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 28  ? values.Pneu_1_rbQ28 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 29  ? values.Pneu_1_rbQ29 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 30  ? values.Pneu_1_rbQ30 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 31  ? values.Pneu_1_rbQ31 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 32  ? values.Pneu_1_rbQ32 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 33  ? values.Pneu_1_rbQ33 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 34  ? values.Pneu_1_rbQ34 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 35  ? values.Pneu_1_rbQ35 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 36  ? values.Pneu_1_rbQ36 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 37  ? values.Pneu_1_rbQ37 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 38  ? values.Pneu_1_rbQ38 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 39  ? values.Pneu_1_rbQ39 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 40  ? values.Pneu_1_rbQ40 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 41  ? values.Pneu_1_rbQ41 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 42  ? values.Pneu_1_rbQ42 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 43  ? values.Pneu_1_rbQ43 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 44  ? values.Pneu_1_rbQ44 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 45  ? values.Pneu_1_rbQ45 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 46  ? values.Pneu_1_rbQ46 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 47  ? values.Pneu_1_rbQ47 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 48  ? values.Pneu_1_rbQ48 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 49  ? values.Pneu_1_rbQ49 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 50  ? values.Pneu_1_rbQ50 == radio.COD_OPCAO ? true : false :

																											//PNEU 2
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 1 ? values.Pneu_2_rbQ1 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 2 ? values.Pneu_2_rbQ2 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 3 ? values.Pneu_2_rbQ3 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 4 ? values.Pneu_2_rbQ4 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 5 ? values.Pneu_2_rbQ5 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 6 ? values.Pneu_2_rbQ6 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 7 ? values.Pneu_2_rbQ7 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 8 ? values.Pneu_2_rbQ8 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 9 ? values.Pneu_2_rbQ9 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 10  ? values.Pneu_2_rbQ10 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 11  ? values.Pneu_2_rbQ11 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 12  ? values.Pneu_2_rbQ12 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 13  ? values.Pneu_2_rbQ13 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 14  ? values.Pneu_2_rbQ14 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 15  ? values.Pneu_2_rbQ15 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 16  ? values.Pneu_2_rbQ16 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 17  ? values.Pneu_2_rbQ17 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 18  ? values.Pneu_2_rbQ18 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 19  ? values.Pneu_2_rbQ19 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 20  ? values.Pneu_2_rbQ20 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 21  ? values.Pneu_2_rbQ21 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 22  ? values.Pneu_2_rbQ22 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 23  ? values.Pneu_2_rbQ23 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 24  ? values.Pneu_2_rbQ24 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 25  ? values.Pneu_2_rbQ25 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 26  ? values.Pneu_2_rbQ26 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 27  ? values.Pneu_2_rbQ27 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 28  ? values.Pneu_2_rbQ28 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 29  ? values.Pneu_2_rbQ29 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 30  ? values.Pneu_2_rbQ30 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 31  ? values.Pneu_2_rbQ31 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 32  ? values.Pneu_2_rbQ32 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 33  ? values.Pneu_2_rbQ33 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 34  ? values.Pneu_2_rbQ34 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 35  ? values.Pneu_2_rbQ35 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 36  ? values.Pneu_2_rbQ36 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 37  ? values.Pneu_2_rbQ37 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 38  ? values.Pneu_2_rbQ38 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 39  ? values.Pneu_2_rbQ39 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 40  ? values.Pneu_2_rbQ40 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 41  ? values.Pneu_2_rbQ41 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 42  ? values.Pneu_2_rbQ42 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 43  ? values.Pneu_2_rbQ43 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 44  ? values.Pneu_2_rbQ44 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 45  ? values.Pneu_2_rbQ45 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 46  ? values.Pneu_2_rbQ46 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 47  ? values.Pneu_2_rbQ47 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 48  ? values.Pneu_2_rbQ48 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 49  ? values.Pneu_2_rbQ49 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 50  ? values.Pneu_2_rbQ50 == radio.COD_OPCAO ? true : false :

																											//PNEU 3
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 1 ? values.Pneu_3_rbQ1 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 2 ? values.Pneu_3_rbQ2 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 3 ? values.Pneu_3_rbQ3 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 4 ? values.Pneu_3_rbQ4 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 5 ? values.Pneu_3_rbQ5 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 6 ? values.Pneu_3_rbQ6 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 7 ? values.Pneu_3_rbQ7 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 8 ? values.Pneu_3_rbQ8 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 9 ? values.Pneu_3_rbQ9 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 10  ? values.Pneu_3_rbQ10 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 11  ? values.Pneu_3_rbQ11 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 12  ? values.Pneu_3_rbQ12 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 13  ? values.Pneu_3_rbQ13 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 14  ? values.Pneu_3_rbQ14 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 15  ? values.Pneu_3_rbQ15 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 16  ? values.Pneu_3_rbQ16 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 17  ? values.Pneu_3_rbQ17 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 18  ? values.Pneu_3_rbQ18 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 19  ? values.Pneu_3_rbQ19 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 20  ? values.Pneu_3_rbQ20 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 21  ? values.Pneu_3_rbQ21 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 22  ? values.Pneu_3_rbQ22 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 23  ? values.Pneu_3_rbQ23 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 24  ? values.Pneu_3_rbQ24 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 25  ? values.Pneu_3_rbQ25 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 26  ? values.Pneu_3_rbQ26 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 27  ? values.Pneu_3_rbQ27 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 28  ? values.Pneu_3_rbQ28 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 29  ? values.Pneu_3_rbQ29 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 30  ? values.Pneu_3_rbQ30 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 31  ? values.Pneu_3_rbQ31 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 32  ? values.Pneu_3_rbQ32 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 33  ? values.Pneu_3_rbQ33 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 34  ? values.Pneu_3_rbQ34 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 35  ? values.Pneu_3_rbQ35 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 36  ? values.Pneu_3_rbQ36 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 37  ? values.Pneu_3_rbQ37 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 38  ? values.Pneu_3_rbQ38 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 39  ? values.Pneu_3_rbQ39 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 40  ? values.Pneu_3_rbQ40 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 41  ? values.Pneu_3_rbQ41 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 42  ? values.Pneu_3_rbQ42 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 43  ? values.Pneu_3_rbQ43 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 44  ? values.Pneu_3_rbQ44 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 45  ? values.Pneu_3_rbQ45 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 46  ? values.Pneu_3_rbQ46 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 47  ? values.Pneu_3_rbQ47 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 48  ? values.Pneu_3_rbQ48 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 49  ? values.Pneu_3_rbQ49 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 50  ? values.Pneu_3_rbQ50 == radio.COD_OPCAO ? true : false :

																											//PNEU 4
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 1 ? values.Pneu_4_rbQ1 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 2 ? values.Pneu_4_rbQ2 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 3 ? values.Pneu_4_rbQ3 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 4 ? values.Pneu_4_rbQ4 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 5 ? values.Pneu_4_rbQ5 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 6 ? values.Pneu_4_rbQ6 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 7 ? values.Pneu_4_rbQ7 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 8 ? values.Pneu_4_rbQ8 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 9 ? values.Pneu_4_rbQ9 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 10  ? values.Pneu_4_rbQ10 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 11  ? values.Pneu_4_rbQ11 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 12  ? values.Pneu_4_rbQ12 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 13  ? values.Pneu_4_rbQ13 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 14  ? values.Pneu_4_rbQ14 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 15  ? values.Pneu_4_rbQ15 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 16  ? values.Pneu_4_rbQ16 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 17  ? values.Pneu_4_rbQ17 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 18  ? values.Pneu_4_rbQ18 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 19  ? values.Pneu_4_rbQ19 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 20  ? values.Pneu_4_rbQ20 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 21  ? values.Pneu_4_rbQ21 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 22  ? values.Pneu_4_rbQ22 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 23  ? values.Pneu_4_rbQ24 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 24  ? values.Pneu_4_rbQ24 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 25  ? values.Pneu_4_rbQ25 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 26  ? values.Pneu_4_rbQ26 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 27  ? values.Pneu_4_rbQ27 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 28  ? values.Pneu_4_rbQ28 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 29  ? values.Pneu_4_rbQ29 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 30  ? values.Pneu_4_rbQ30 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 31  ? values.Pneu_4_rbQ31 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 32  ? values.Pneu_4_rbQ32 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 33  ? values.Pneu_4_rbQ33 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 34  ? values.Pneu_4_rbQ34 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 35  ? values.Pneu_4_rbQ35 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 36  ? values.Pneu_4_rbQ36 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 37  ? values.Pneu_4_rbQ37 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 38  ? values.Pneu_4_rbQ38 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 39  ? values.Pneu_4_rbQ39 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 40  ? values.Pneu_4_rbQ40 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 41  ? values.Pneu_4_rbQ41 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 42  ? values.Pneu_4_rbQ42 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 43  ? values.Pneu_4_rbQ43 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 44  ? values.Pneu_4_rbQ44 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 45  ? values.Pneu_4_rbQ45 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 46  ? values.Pneu_4_rbQ46 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 47  ? values.Pneu_4_rbQ47 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 48  ? values.Pneu_4_rbQ48 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 49  ? values.Pneu_4_rbQ49 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 50  ? values.Pneu_4_rbQ50 == radio.COD_OPCAO ? true : false :

																											//PNEU 5
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 1 ? values.Pneu_5_rbQ1 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 2 ? values.Pneu_5_rbQ2 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 3 ? values.Pneu_5_rbQ3 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 4 ? values.Pneu_5_rbQ4 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 5 ? values.Pneu_5_rbQ5 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 6 ? values.Pneu_5_rbQ6 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 7 ? values.Pneu_5_rbQ7 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 8 ? values.Pneu_5_rbQ8 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 9 ? values.Pneu_5_rbQ9 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 10  ? values.Pneu_5_rbQ10 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 11  ? values.Pneu_5_rbQ11 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 12  ? values.Pneu_5_rbQ12 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 13  ? values.Pneu_5_rbQ13 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 14  ? values.Pneu_5_rbQ14 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 15  ? values.Pneu_5_rbQ15 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 16  ? values.Pneu_5_rbQ16 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 17  ? values.Pneu_5_rbQ17 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 18  ? values.Pneu_5_rbQ18 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 19  ? values.Pneu_5_rbQ19 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 20  ? values.Pneu_5_rbQ20 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 21  ? values.Pneu_5_rbQ21 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 22  ? values.Pneu_5_rbQ22 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 23  ? values.Pneu_5_rbQ23 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 24  ? values.Pneu_5_rbQ24 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 25  ? values.Pneu_5_rbQ25 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 26  ? values.Pneu_5_rbQ26 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 27  ? values.Pneu_5_rbQ27 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 28  ? values.Pneu_5_rbQ28 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 29  ? values.Pneu_5_rbQ29 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 30  ? values.Pneu_5_rbQ30 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 31  ? values.Pneu_5_rbQ31 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 32  ? values.Pneu_5_rbQ32 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 33  ? values.Pneu_5_rbQ33 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 34  ? values.Pneu_5_rbQ34 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 35  ? values.Pneu_5_rbQ35 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 36  ? values.Pneu_5_rbQ36 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 37  ? values.Pneu_5_rbQ37 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 38  ? values.Pneu_5_rbQ38 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 39  ? values.Pneu_5_rbQ39 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 40  ? values.Pneu_5_rbQ40 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 41  ? values.Pneu_5_rbQ41 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 42  ? values.Pneu_5_rbQ42 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 43  ? values.Pneu_5_rbQ43 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 44  ? values.Pneu_5_rbQ44 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 45  ? values.Pneu_5_rbQ45 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 46  ? values.Pneu_5_rbQ46 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 47  ? values.Pneu_5_rbQ47 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 48  ? values.Pneu_5_rbQ48 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 49  ? values.Pneu_5_rbQ49 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 50  ? values.Pneu_5_rbQ50 == radio.COD_OPCAO ? true : false :

																											//PNEU 6
																											listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 1 ? values.Pneu_6_rbQ1 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 2 ? values.Pneu_6_rbQ2 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 3 ? values.Pneu_6_rbQ3 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 4 ? values.Pneu_6_rbQ4 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 5 ? values.Pneu_6_rbQ5 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 6 ? values.Pneu_6_rbQ6 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 7 ? values.Pneu_6_rbQ7 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 8 ? values.Pneu_6_rbQ8 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 9 ? values.Pneu_6_rbQ9 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 10  ? values.Pneu_6_rbQ10 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 11  ? values.Pneu_6_rbQ11 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 12  ? values.Pneu_6_rbQ12 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 13  ? values.Pneu_6_rbQ13 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 14  ? values.Pneu_6_rbQ14 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 15  ? values.Pneu_6_rbQ15 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 16  ? values.Pneu_6_rbQ16 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 17  ? values.Pneu_6_rbQ17 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 18  ? values.Pneu_6_rbQ18 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 19  ? values.Pneu_6_rbQ19 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 20  ? values.Pneu_6_rbQ20 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 21  ? values.Pneu_6_rbQ21 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 22  ? values.Pneu_6_rbQ22 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 23  ? values.Pneu_6_rbQ23 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 24  ? values.Pneu_6_rbQ24 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 25  ? values.Pneu_6_rbQ25 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 26  ? values.Pneu_6_rbQ26 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 27  ? values.Pneu_6_rbQ27 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 28  ? values.Pneu_6_rbQ28 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 29  ? values.Pneu_6_rbQ29 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 30  ? values.Pneu_6_rbQ30 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 31  ? values.Pneu_6_rbQ31 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 32  ? values.Pneu_6_rbQ32 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 33  ? values.Pneu_6_rbQ33 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 34  ? values.Pneu_6_rbQ34 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 35  ? values.Pneu_6_rbQ35 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 36  ? values.Pneu_6_rbQ36 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 37  ? values.Pneu_6_rbQ37 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 38  ? values.Pneu_6_rbQ38 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 39  ? values.Pneu_6_rbQ39 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 40  ? values.Pneu_6_rbQ40 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 41  ? values.Pneu_6_rbQ41 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 42  ? values.Pneu_6_rbQ42 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 43  ? values.Pneu_6_rbQ43 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 44  ? values.Pneu_6_rbQ44 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 45  ? values.Pneu_6_rbQ45 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 46  ? values.Pneu_6_rbQ46 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 47  ? values.Pneu_6_rbQ47 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 48  ? values.Pneu_6_rbQ48 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 49  ? values.Pneu_6_rbQ49 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 50  ? values.Pneu_6_rbQ50 == radio.COD_OPCAO ? true : false :

																											false
																										}
																									/>
																									<Text>{radio.DES_OPCAO}</Text>
																								</ListItem>
																							);
																						})
																					)
																				}
																				{
																					//CHECKBOX
																					quesito.IND_CHECKBOX == true && quesito.IND_ATIVO == true && 
																					(
																						<ListItem>
																							<Switch
																								trackColor={{ false: "#C4C4C4", true: "#C5DB5F" }}
																								thumbColor={ "#fff"}
																								ios_backgroundColor="#fff"
																								onValueChange={ (previousState) => setFieldValue('Pneu_'+listbox.COD_OPCAO+'_cbQ'+quesito.COD_ITEM, previousState ) }
																								value={
																									//PNEU 1
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 1 ? values.Pneu_1_cbQ1 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 2 ? values.Pneu_1_cbQ2 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 3 ? values.Pneu_1_cbQ3 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 4 ? values.Pneu_1_cbQ4 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 5 ? values.Pneu_1_cbQ5 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 6 ? values.Pneu_1_cbQ6 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 7 ? values.Pneu_1_cbQ7 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 8 ? values.Pneu_1_cbQ8 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 9 ? values.Pneu_1_cbQ9 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 10  ? values.Pneu_1_cbQ10 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 11  ? values.Pneu_1_cbQ11 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 12  ? values.Pneu_1_cbQ12 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 13  ? values.Pneu_1_cbQ13 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 14  ? values.Pneu_1_cbQ14 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 15  ? values.Pneu_1_cbQ15 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 16  ? values.Pneu_1_cbQ16 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 17  ? values.Pneu_1_cbQ17 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 18  ? values.Pneu_1_cbQ18 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 19  ? values.Pneu_1_cbQ19 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 20  ? values.Pneu_1_cbQ20 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 21  ? values.Pneu_1_cbQ21 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 22  ? values.Pneu_1_cbQ22 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 23  ? values.Pneu_1_cbQ23 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 24  ? values.Pneu_1_cbQ24 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 25  ? values.Pneu_1_cbQ25 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 26  ? values.Pneu_1_cbQ26 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 27  ? values.Pneu_1_cbQ27 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 28  ? values.Pneu_1_cbQ28 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 29  ? values.Pneu_1_cbQ29 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 30  ? values.Pneu_1_cbQ30 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 31  ? values.Pneu_1_cbQ31 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 32  ? values.Pneu_1_cbQ32 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 33  ? values.Pneu_1_cbQ33 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 34  ? values.Pneu_1_cbQ34 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 35  ? values.Pneu_1_cbQ35 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 36  ? values.Pneu_1_cbQ36 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 37  ? values.Pneu_1_cbQ37 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 38  ? values.Pneu_1_cbQ38 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 39  ? values.Pneu_1_cbQ39 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 40  ? values.Pneu_1_cbQ40 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 41  ? values.Pneu_1_cbQ41 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 42  ? values.Pneu_1_cbQ42 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 43  ? values.Pneu_1_cbQ43 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 44  ? values.Pneu_1_cbQ44 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 45  ? values.Pneu_1_cbQ45 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 46  ? values.Pneu_1_cbQ46 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 47  ? values.Pneu_1_cbQ47 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 48  ? values.Pneu_1_cbQ48 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 49  ? values.Pneu_1_cbQ49 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 50  ? values.Pneu_1_cbQ50 :

																									//PNEU 2
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 1 ? values.Pneu_2_cbQ1 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 2 ? values.Pneu_2_cbQ2 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 3 ? values.Pneu_2_cbQ3 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 4 ? values.Pneu_2_cbQ4 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 5 ? values.Pneu_2_cbQ5 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 6 ? values.Pneu_2_cbQ6 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 7 ? values.Pneu_2_cbQ7 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 8 ? values.Pneu_2_cbQ8 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 9 ? values.Pneu_2_cbQ9 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 10  ? values.Pneu_2_cbQ10 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 11  ? values.Pneu_2_cbQ11 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 12  ? values.Pneu_2_cbQ12 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 13  ? values.Pneu_2_cbQ13 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 14  ? values.Pneu_2_cbQ14 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 15  ? values.Pneu_2_cbQ15 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 16  ? values.Pneu_2_cbQ16 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 17  ? values.Pneu_2_cbQ17 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 18  ? values.Pneu_2_cbQ18 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 19  ? values.Pneu_2_cbQ19 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 20  ? values.Pneu_2_cbQ20 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 21  ? values.Pneu_2_cbQ21 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 22  ? values.Pneu_2_cbQ22 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 23  ? values.Pneu_2_cbQ23 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 24  ? values.Pneu_2_cbQ24 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 25  ? values.Pneu_2_cbQ25 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 26  ? values.Pneu_2_cbQ26 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 27  ? values.Pneu_2_cbQ27 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 28  ? values.Pneu_2_cbQ28 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 29  ? values.Pneu_2_cbQ29 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 30  ? values.Pneu_2_cbQ30 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 31  ? values.Pneu_2_cbQ31 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 32  ? values.Pneu_2_cbQ32 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 33  ? values.Pneu_2_cbQ33 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 34  ? values.Pneu_2_cbQ34 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 35  ? values.Pneu_2_cbQ35 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 36  ? values.Pneu_2_cbQ36 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 37  ? values.Pneu_2_cbQ37 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 38  ? values.Pneu_2_cbQ38 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 39  ? values.Pneu_2_cbQ39 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 40  ? values.Pneu_2_cbQ40 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 41  ? values.Pneu_2_cbQ41 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 42  ? values.Pneu_2_cbQ42 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 43  ? values.Pneu_2_cbQ43 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 44  ? values.Pneu_2_cbQ44 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 45  ? values.Pneu_2_cbQ45 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 46  ? values.Pneu_2_cbQ46 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 47  ? values.Pneu_2_cbQ47 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 48  ? values.Pneu_2_cbQ48 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 49  ? values.Pneu_2_cbQ49 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 50  ? values.Pneu_2_cbQ50 :

																									//PNEU 3
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 1 ? values.Pneu_3_cbQ1 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 2 ? values.Pneu_3_cbQ2 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 3 ? values.Pneu_3_cbQ3 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 4 ? values.Pneu_3_cbQ4 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 5 ? values.Pneu_3_cbQ5 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 6 ? values.Pneu_3_cbQ6 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 7 ? values.Pneu_3_cbQ7 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 8 ? values.Pneu_3_cbQ8 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 9 ? values.Pneu_3_cbQ9 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 10  ? values.Pneu_3_cbQ10 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 11  ? values.Pneu_3_cbQ11 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 12  ? values.Pneu_3_cbQ12 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 13  ? values.Pneu_3_cbQ13 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 14  ? values.Pneu_3_cbQ14 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 15  ? values.Pneu_3_cbQ15 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 16  ? values.Pneu_3_cbQ16 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 17  ? values.Pneu_3_cbQ17 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 18  ? values.Pneu_3_cbQ18 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 19  ? values.Pneu_3_cbQ19 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 20  ? values.Pneu_3_cbQ20 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 21  ? values.Pneu_3_cbQ21 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 22  ? values.Pneu_3_cbQ22 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 23  ? values.Pneu_3_cbQ23 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 24  ? values.Pneu_3_cbQ24 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 25  ? values.Pneu_3_cbQ25 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 26  ? values.Pneu_3_cbQ26 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 27  ? values.Pneu_3_cbQ27 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 28  ? values.Pneu_3_cbQ28 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 29  ? values.Pneu_3_cbQ29 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 30  ? values.Pneu_3_cbQ30 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 31  ? values.Pneu_3_cbQ31 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 32  ? values.Pneu_3_cbQ32 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 33  ? values.Pneu_3_cbQ33 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 34  ? values.Pneu_3_cbQ34 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 35  ? values.Pneu_3_cbQ35 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 36  ? values.Pneu_3_cbQ36 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 37  ? values.Pneu_3_cbQ37 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 38  ? values.Pneu_3_cbQ38 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 39  ? values.Pneu_3_cbQ39 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 40  ? values.Pneu_3_cbQ40 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 41  ? values.Pneu_3_cbQ41 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 42  ? values.Pneu_3_cbQ42 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 43  ? values.Pneu_3_cbQ43 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 44  ? values.Pneu_3_cbQ44 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 45  ? values.Pneu_3_cbQ45 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 46  ? values.Pneu_3_cbQ46 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 47  ? values.Pneu_3_cbQ47 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 48  ? values.Pneu_3_cbQ48 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 49  ? values.Pneu_3_cbQ49 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 50  ? values.Pneu_3_cbQ50 :

																									//PNEU 4
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 1 ? values.Pneu_4_cbQ1 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 2 ? values.Pneu_4_cbQ2 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 3 ? values.Pneu_4_cbQ3 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 4 ? values.Pneu_4_cbQ4 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 5 ? values.Pneu_4_cbQ5 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 6 ? values.Pneu_4_cbQ6 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 7 ? values.Pneu_4_cbQ7 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 8 ? values.Pneu_4_cbQ8 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 9 ? values.Pneu_4_cbQ9 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 10  ? values.Pneu_4_cbQ10 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 11  ? values.Pneu_4_cbQ11 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 12  ? values.Pneu_4_cbQ12 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 13  ? values.Pneu_4_cbQ13 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 14  ? values.Pneu_4_cbQ14 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 15  ? values.Pneu_4_cbQ15 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 16  ? values.Pneu_4_cbQ16 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 17  ? values.Pneu_4_cbQ17 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 18  ? values.Pneu_4_cbQ18 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 19  ? values.Pneu_4_cbQ19 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 20  ? values.Pneu_4_cbQ20 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 21  ? values.Pneu_4_cbQ21 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 22  ? values.Pneu_4_cbQ22 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 23  ? values.Pneu_4_cbQ23 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 24  ? values.Pneu_4_cbQ24 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 25  ? values.Pneu_4_cbQ25 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 26  ? values.Pneu_4_cbQ26 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 27  ? values.Pneu_4_cbQ27 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 28  ? values.Pneu_4_cbQ28 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 29  ? values.Pneu_4_cbQ29 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 30  ? values.Pneu_4_cbQ30 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 31  ? values.Pneu_4_cbQ31 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 32  ? values.Pneu_4_cbQ32 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 33  ? values.Pneu_4_cbQ33 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 34  ? values.Pneu_4_cbQ34 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 35  ? values.Pneu_4_cbQ35 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 36  ? values.Pneu_4_cbQ36 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 37  ? values.Pneu_4_cbQ37 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 38  ? values.Pneu_4_cbQ38 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 39  ? values.Pneu_4_cbQ39 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 40  ? values.Pneu_4_cbQ40 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 41  ? values.Pneu_4_cbQ41 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 42  ? values.Pneu_4_cbQ42 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 43  ? values.Pneu_4_cbQ43 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 44  ? values.Pneu_4_cbQ44 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 45  ? values.Pneu_4_cbQ45 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 46  ? values.Pneu_4_cbQ46 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 47  ? values.Pneu_4_cbQ47 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 48  ? values.Pneu_4_cbQ48 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 49  ? values.Pneu_4_cbQ49 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 50  ? values.Pneu_4_cbQ50 :


																									//PNEU 5
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 1 ? values.Pneu_5_cbQ1 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 2 ? values.Pneu_5_cbQ2 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 3 ? values.Pneu_5_cbQ3 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 4 ? values.Pneu_5_cbQ4 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 5 ? values.Pneu_5_cbQ5 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 6 ? values.Pneu_5_cbQ6 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 7 ? values.Pneu_5_cbQ7 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 8 ? values.Pneu_5_cbQ8 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 9 ? values.Pneu_5_cbQ9 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 10  ? values.Pneu_5_cbQ10 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 11  ? values.Pneu_5_cbQ11 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 12  ? values.Pneu_5_cbQ12 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 13  ? values.Pneu_5_cbQ13 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 14  ? values.Pneu_5_cbQ14 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 15  ? values.Pneu_5_cbQ15 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 16  ? values.Pneu_5_cbQ16 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 17  ? values.Pneu_5_cbQ17 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 18  ? values.Pneu_5_cbQ18 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 19  ? values.Pneu_5_cbQ19 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 20  ? values.Pneu_5_cbQ20 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 21  ? values.Pneu_5_cbQ21 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 22  ? values.Pneu_5_cbQ22 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 23  ? values.Pneu_5_cbQ23 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 24  ? values.Pneu_5_cbQ24 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 25  ? values.Pneu_5_cbQ25 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 26  ? values.Pneu_5_cbQ26 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 27  ? values.Pneu_5_cbQ27 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 28  ? values.Pneu_5_cbQ28 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 29  ? values.Pneu_5_cbQ29 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 30  ? values.Pneu_5_cbQ30 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 31  ? values.Pneu_5_cbQ31 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 32  ? values.Pneu_5_cbQ32 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 33  ? values.Pneu_5_cbQ33 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 34  ? values.Pneu_5_cbQ34 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 35  ? values.Pneu_5_cbQ35 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 36  ? values.Pneu_5_cbQ36 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 37  ? values.Pneu_5_cbQ37 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 38  ? values.Pneu_5_cbQ38 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 39  ? values.Pneu_5_cbQ39 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 40  ? values.Pneu_5_cbQ40 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 41  ? values.Pneu_5_cbQ41 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 42  ? values.Pneu_5_cbQ42 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 43  ? values.Pneu_5_cbQ43 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 44  ? values.Pneu_5_cbQ44 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 45  ? values.Pneu_5_cbQ45 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 46  ? values.Pneu_5_cbQ46 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 47  ? values.Pneu_5_cbQ47 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 48  ? values.Pneu_5_cbQ48 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 49  ? values.Pneu_5_cbQ49 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 50  ? values.Pneu_5_cbQ50 :

																									//PNEU 6
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 1 ? values.Pneu_6_cbQ1 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 2 ? values.Pneu_6_cbQ2 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 3 ? values.Pneu_6_cbQ3 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 4 ? values.Pneu_6_cbQ4 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 5 ? values.Pneu_6_cbQ5 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 6 ? values.Pneu_6_cbQ6 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 7 ? values.Pneu_6_cbQ7 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 8 ? values.Pneu_6_cbQ8 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 9 ? values.Pneu_6_cbQ9 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 10  ? values.Pneu_6_cbQ10 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 11  ? values.Pneu_6_cbQ11 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 12  ? values.Pneu_6_cbQ12 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 13  ? values.Pneu_6_cbQ13 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 14  ? values.Pneu_6_cbQ14 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 15  ? values.Pneu_6_cbQ15 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 16  ? values.Pneu_6_cbQ16 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 17  ? values.Pneu_6_cbQ17 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 18  ? values.Pneu_6_cbQ18 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 19  ? values.Pneu_6_cbQ19 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 20  ? values.Pneu_6_cbQ20 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 21  ? values.Pneu_6_cbQ21 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 22  ? values.Pneu_6_cbQ22 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 23  ? values.Pneu_6_cbQ23 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 24  ? values.Pneu_6_cbQ24 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 25  ? values.Pneu_6_cbQ25 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 26  ? values.Pneu_6_cbQ26 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 27  ? values.Pneu_6_cbQ27 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 28  ? values.Pneu_6_cbQ28 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 29  ? values.Pneu_6_cbQ29 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 30  ? values.Pneu_6_cbQ30 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 31  ? values.Pneu_6_cbQ31 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 32  ? values.Pneu_6_cbQ32 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 33  ? values.Pneu_6_cbQ33 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 34  ? values.Pneu_6_cbQ34 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 35  ? values.Pneu_6_cbQ35 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 36  ? values.Pneu_6_cbQ36 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 37  ? values.Pneu_6_cbQ37 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 38  ? values.Pneu_6_cbQ38 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 39  ? values.Pneu_6_cbQ39 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 40  ? values.Pneu_6_cbQ40 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 41  ? values.Pneu_6_cbQ41 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 42  ? values.Pneu_6_cbQ42 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 43  ? values.Pneu_6_cbQ43 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 44  ? values.Pneu_6_cbQ44 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 45  ? values.Pneu_6_cbQ45 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 46  ? values.Pneu_6_cbQ46 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 47  ? values.Pneu_6_cbQ47 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 48  ? values.Pneu_6_cbQ48 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 49  ? values.Pneu_6_cbQ49 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 50  ? values.Pneu_6_cbQ50 :


																									false
																								}
																							/>
																						</ListItem>	
																					)
																				}
																				{
																					//INPUT INTEIRO PNEU
																					quesito.IND_INTEIRO == true && quesito.IND_ATIVO == true && 
																					(	
																						<>
																						<Input 
																							onChangeText={handleChange('Pneu_'+listbox.COD_OPCAO+'_inputInteiroQ'+quesito.COD_ITEM)}
																							onBlur={handleBlur('Pneu_'+listbox.COD_OPCAO+'_inputInteiroQ'+quesito.COD_ITEM)}
																							placeholder='Valor'
																							value={
																								//PNEU 1
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 1 ? values.Pneu_1_inputInteiroQ1 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 2 ? values.Pneu_1_inputInteiroQ2 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 3 ? values.Pneu_1_inputInteiroQ3 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 4 ? values.Pneu_1_inputInteiroQ4 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 5 ? values.Pneu_1_inputInteiroQ5 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 6 ? values.Pneu_1_inputInteiroQ6 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 7 ? values.Pneu_1_inputInteiroQ7 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 8 ? values.Pneu_1_inputInteiroQ8 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 9 ? values.Pneu_1_inputInteiroQ9 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 10  ? values.Pneu_1_inputInteiroQ10 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 11  ? values.Pneu_1_inputInteiroQ11 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 12  ? values.Pneu_1_inputInteiroQ12 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 13  ? values.Pneu_1_inputInteiroQ13 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 14  ? values.Pneu_1_inputInteiroQ14 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 15  ? values.Pneu_1_inputInteiroQ15 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 16  ? values.Pneu_1_inputInteiroQ16 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 17  ? values.Pneu_1_inputInteiroQ17 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 18  ? values.Pneu_1_inputInteiroQ18 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 19  ? values.Pneu_1_inputInteiroQ19 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 20  ? values.Pneu_1_inputInteiroQ20 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 21  ? values.Pneu_1_inputInteiroQ21 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 22  ? values.Pneu_1_inputInteiroQ22 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 23  ? values.Pneu_1_inputInteiroQ23 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 24  ? values.Pneu_1_inputInteiroQ24 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 25  ? values.Pneu_1_inputInteiroQ25 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 26  ? values.Pneu_1_inputInteiroQ26 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 27  ? values.Pneu_1_inputInteiroQ27 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 28  ? values.Pneu_1_inputInteiroQ28 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 29  ? values.Pneu_1_inputInteiroQ29 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 30  ? values.Pneu_1_inputInteiroQ30 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 31  ? values.Pneu_1_inputInteiroQ31 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 32  ? values.Pneu_1_inputInteiroQ32 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 33  ? values.Pneu_1_inputInteiroQ33 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 34  ? values.Pneu_1_inputInteiroQ34 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 35  ? values.Pneu_1_inputInteiroQ35 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 36  ? values.Pneu_1_inputInteiroQ36 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 37  ? values.Pneu_1_inputInteiroQ37 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 38  ? values.Pneu_1_inputInteiroQ38 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 39  ? values.Pneu_1_inputInteiroQ39 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 40  ? values.Pneu_1_inputInteiroQ40 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 41  ? values.Pneu_1_inputInteiroQ41 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 42  ? values.Pneu_1_inputInteiroQ42 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 43  ? values.Pneu_1_inputInteiroQ43 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 44  ? values.Pneu_1_inputInteiroQ44 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 45  ? values.Pneu_1_inputInteiroQ45 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 46  ? values.Pneu_1_inputInteiroQ46 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 47  ? values.Pneu_1_inputInteiroQ47 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 48  ? values.Pneu_1_inputInteiroQ48 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 49  ? values.Pneu_1_inputInteiroQ49 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 50  ? values.Pneu_1_inputInteiroQ50 :

																								//PNEU 2
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 1 ? values.Pneu_2_inputInteiroQ1 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 2 ? values.Pneu_2_inputInteiroQ2 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 3 ? values.Pneu_2_inputInteiroQ3 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 4 ? values.Pneu_2_inputInteiroQ4 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 5 ? values.Pneu_2_inputInteiroQ5 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 6 ? values.Pneu_2_inputInteiroQ6 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 7 ? values.Pneu_2_inputInteiroQ7 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 8 ? values.Pneu_2_inputInteiroQ8 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 9 ? values.Pneu_2_inputInteiroQ9 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 10  ? values.Pneu_2_inputInteiroQ10 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 11  ? values.Pneu_2_inputInteiroQ11 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 12  ? values.Pneu_2_inputInteiroQ12 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 13  ? values.Pneu_2_inputInteiroQ13 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 14  ? values.Pneu_2_inputInteiroQ14 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 15  ? values.Pneu_2_inputInteiroQ15 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 16  ? values.Pneu_2_inputInteiroQ16 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 17  ? values.Pneu_2_inputInteiroQ17 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 18  ? values.Pneu_2_inputInteiroQ18 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 19  ? values.Pneu_2_inputInteiroQ19 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 20  ? values.Pneu_2_inputInteiroQ20 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 21  ? values.Pneu_2_inputInteiroQ21 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 22  ? values.Pneu_2_inputInteiroQ22 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 23  ? values.Pneu_2_inputInteiroQ23 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 24  ? values.Pneu_2_inputInteiroQ24 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 25  ? values.Pneu_2_inputInteiroQ25 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 26  ? values.Pneu_2_inputInteiroQ26 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 27  ? values.Pneu_2_inputInteiroQ27 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 28  ? values.Pneu_2_inputInteiroQ28 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 29  ? values.Pneu_2_inputInteiroQ29 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 30  ? values.Pneu_2_inputInteiroQ30 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 31  ? values.Pneu_2_inputInteiroQ31 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 32  ? values.Pneu_2_inputInteiroQ32 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 33  ? values.Pneu_2_inputInteiroQ33 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 34  ? values.Pneu_2_inputInteiroQ34 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 35  ? values.Pneu_2_inputInteiroQ35 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 36  ? values.Pneu_2_inputInteiroQ36 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 37  ? values.Pneu_2_inputInteiroQ37 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 38  ? values.Pneu_2_inputInteiroQ38 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 39  ? values.Pneu_2_inputInteiroQ39 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 40  ? values.Pneu_2_inputInteiroQ40 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 41  ? values.Pneu_2_inputInteiroQ41 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 42  ? values.Pneu_2_inputInteiroQ42 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 43  ? values.Pneu_2_inputInteiroQ43 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 44  ? values.Pneu_2_inputInteiroQ44 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 45  ? values.Pneu_2_inputInteiroQ45 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 46  ? values.Pneu_2_inputInteiroQ46 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 47  ? values.Pneu_2_inputInteiroQ47 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 48  ? values.Pneu_2_inputInteiroQ48 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 49  ? values.Pneu_2_inputInteiroQ49 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 50  ? values.Pneu_2_inputInteiroQ50 :

																								//PNEU 3
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 1 ? values.Pneu_3_inputInteiroQ1 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 2 ? values.Pneu_3_inputInteiroQ2 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 3 ? values.Pneu_3_inputInteiroQ3 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 4 ? values.Pneu_3_inputInteiroQ4 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 5 ? values.Pneu_3_inputInteiroQ5 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 6 ? values.Pneu_3_inputInteiroQ6 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 7 ? values.Pneu_3_inputInteiroQ7 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 8 ? values.Pneu_3_inputInteiroQ8 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 9 ? values.Pneu_3_inputInteiroQ9 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 10  ? values.Pneu_3_inputInteiroQ10 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 11  ? values.Pneu_3_inputInteiroQ11 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 12  ? values.Pneu_3_inputInteiroQ12 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 13  ? values.Pneu_3_inputInteiroQ13 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 14  ? values.Pneu_3_inputInteiroQ14 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 15  ? values.Pneu_3_inputInteiroQ15 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 16  ? values.Pneu_3_inputInteiroQ16 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 17  ? values.Pneu_3_inputInteiroQ17 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 18  ? values.Pneu_3_inputInteiroQ18 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 19  ? values.Pneu_3_inputInteiroQ19 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 20  ? values.Pneu_3_inputInteiroQ20 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 21  ? values.Pneu_3_inputInteiroQ21 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 22  ? values.Pneu_3_inputInteiroQ22 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 23  ? values.Pneu_3_inputInteiroQ23 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 24  ? values.Pneu_3_inputInteiroQ24 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 25  ? values.Pneu_3_inputInteiroQ25 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 26  ? values.Pneu_3_inputInteiroQ26 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 27  ? values.Pneu_3_inputInteiroQ27 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 28  ? values.Pneu_3_inputInteiroQ28 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 29  ? values.Pneu_3_inputInteiroQ29 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 30  ? values.Pneu_3_inputInteiroQ30 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 31  ? values.Pneu_3_inputInteiroQ31 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 32  ? values.Pneu_3_inputInteiroQ32 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 33  ? values.Pneu_3_inputInteiroQ33 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 34  ? values.Pneu_3_inputInteiroQ34 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 35  ? values.Pneu_3_inputInteiroQ35 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 36  ? values.Pneu_3_inputInteiroQ36 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 37  ? values.Pneu_3_inputInteiroQ37 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 38  ? values.Pneu_3_inputInteiroQ38 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 39  ? values.Pneu_3_inputInteiroQ39 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 40  ? values.Pneu_3_inputInteiroQ40 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 41  ? values.Pneu_3_inputInteiroQ41 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 42  ? values.Pneu_3_inputInteiroQ42 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 43  ? values.Pneu_3_inputInteiroQ43 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 44  ? values.Pneu_3_inputInteiroQ44 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 45  ? values.Pneu_3_inputInteiroQ45 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 46  ? values.Pneu_3_inputInteiroQ46 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 47  ? values.Pneu_3_inputInteiroQ47 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 48  ? values.Pneu_3_inputInteiroQ48 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 49  ? values.Pneu_3_inputInteiroQ49 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 50  ? values.Pneu_3_inputInteiroQ50 :

																								//PNEU 4
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 1 ? values.Pneu_4_inputInteiroQ1 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 2 ? values.Pneu_4_inputInteiroQ2 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 3 ? values.Pneu_4_inputInteiroQ3 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 4 ? values.Pneu_4_inputInteiroQ4 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 5 ? values.Pneu_4_inputInteiroQ5 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 6 ? values.Pneu_4_inputInteiroQ6 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 7 ? values.Pneu_4_inputInteiroQ7 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 8 ? values.Pneu_4_inputInteiroQ8 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 9 ? values.Pneu_4_inputInteiroQ9 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 10  ? values.Pneu_4_inputInteiroQ10 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 11  ? values.Pneu_4_inputInteiroQ11 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 12  ? values.Pneu_4_inputInteiroQ12 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 14  ? values.Pneu_4_inputInteiroQ14 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 14  ? values.Pneu_4_inputInteiroQ14 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 15  ? values.Pneu_4_inputInteiroQ15 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 16  ? values.Pneu_4_inputInteiroQ16 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 17  ? values.Pneu_4_inputInteiroQ17 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 18  ? values.Pneu_4_inputInteiroQ18 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 19  ? values.Pneu_4_inputInteiroQ19 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 20  ? values.Pneu_4_inputInteiroQ20 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 21  ? values.Pneu_4_inputInteiroQ21 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 22  ? values.Pneu_4_inputInteiroQ22 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 23  ? values.Pneu_4_inputInteiroQ24 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 24  ? values.Pneu_4_inputInteiroQ24 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 25  ? values.Pneu_4_inputInteiroQ25 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 26  ? values.Pneu_4_inputInteiroQ26 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 27  ? values.Pneu_4_inputInteiroQ27 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 28  ? values.Pneu_4_inputInteiroQ28 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 29  ? values.Pneu_4_inputInteiroQ29 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 30  ? values.Pneu_4_inputInteiroQ30 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 31  ? values.Pneu_4_inputInteiroQ31 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 32  ? values.Pneu_4_inputInteiroQ32 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 33  ? values.Pneu_4_inputInteiroQ33 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 34  ? values.Pneu_4_inputInteiroQ34 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 35  ? values.Pneu_4_inputInteiroQ35 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 36  ? values.Pneu_4_inputInteiroQ36 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 37  ? values.Pneu_4_inputInteiroQ37 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 38  ? values.Pneu_4_inputInteiroQ38 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 39  ? values.Pneu_4_inputInteiroQ39 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 40  ? values.Pneu_4_inputInteiroQ40 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 41  ? values.Pneu_4_inputInteiroQ41 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 42  ? values.Pneu_4_inputInteiroQ42 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 43  ? values.Pneu_4_inputInteiroQ43 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 44  ? values.Pneu_4_inputInteiroQ44 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 45  ? values.Pneu_4_inputInteiroQ45 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 46  ? values.Pneu_4_inputInteiroQ46 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 47  ? values.Pneu_4_inputInteiroQ47 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 48  ? values.Pneu_4_inputInteiroQ48 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 49  ? values.Pneu_4_inputInteiroQ49 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 50  ? values.Pneu_4_inputInteiroQ50 :

																								//PNEU 5
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 1 ? values.Pneu_5_inputInteiroQ1 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 2 ? values.Pneu_5_inputInteiroQ2 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 3 ? values.Pneu_5_inputInteiroQ3 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 4 ? values.Pneu_5_inputInteiroQ4 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 5 ? values.Pneu_5_inputInteiroQ5 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 6 ? values.Pneu_5_inputInteiroQ6 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 7 ? values.Pneu_5_inputInteiroQ7 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 8 ? values.Pneu_5_inputInteiroQ8 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 9 ? values.Pneu_5_inputInteiroQ9 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 10  ? values.Pneu_5_inputInteiroQ10 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 11  ? values.Pneu_5_inputInteiroQ11 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 12  ? values.Pneu_5_inputInteiroQ12 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 13  ? values.Pneu_5_inputInteiroQ13 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 14  ? values.Pneu_5_inputInteiroQ14 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 15  ? values.Pneu_5_inputInteiroQ15 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 16  ? values.Pneu_5_inputInteiroQ16 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 17  ? values.Pneu_5_inputInteiroQ17 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 18  ? values.Pneu_5_inputInteiroQ18 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 19  ? values.Pneu_5_inputInteiroQ19 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 20  ? values.Pneu_5_inputInteiroQ20 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 21  ? values.Pneu_5_inputInteiroQ21 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 22  ? values.Pneu_5_inputInteiroQ22 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 23  ? values.Pneu_5_inputInteiroQ23 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 24  ? values.Pneu_5_inputInteiroQ24 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 25  ? values.Pneu_5_inputInteiroQ25 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 26  ? values.Pneu_5_inputInteiroQ26 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 27  ? values.Pneu_5_inputInteiroQ27 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 28  ? values.Pneu_5_inputInteiroQ28 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 29  ? values.Pneu_5_inputInteiroQ29 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 30  ? values.Pneu_5_inputInteiroQ30 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 31  ? values.Pneu_5_inputInteiroQ31 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 32  ? values.Pneu_5_inputInteiroQ32 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 33  ? values.Pneu_5_inputInteiroQ33 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 34  ? values.Pneu_5_inputInteiroQ34 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 35  ? values.Pneu_5_inputInteiroQ35 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 36  ? values.Pneu_5_inputInteiroQ36 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 37  ? values.Pneu_5_inputInteiroQ37 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 38  ? values.Pneu_5_inputInteiroQ38 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 39  ? values.Pneu_5_inputInteiroQ39 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 40  ? values.Pneu_5_inputInteiroQ40 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 41  ? values.Pneu_5_inputInteiroQ41 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 42  ? values.Pneu_5_inputInteiroQ42 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 43  ? values.Pneu_5_inputInteiroQ43 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 44  ? values.Pneu_5_inputInteiroQ44 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 45  ? values.Pneu_5_inputInteiroQ45 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 46  ? values.Pneu_5_inputInteiroQ46 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 47  ? values.Pneu_5_inputInteiroQ47 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 48  ? values.Pneu_5_inputInteiroQ48 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 49  ? values.Pneu_5_inputInteiroQ49 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 50  ? values.Pneu_5_inputInteiroQ50 :

																								//PNEU 6
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 1 ? values.Pneu_6_inputInteiroQ1 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 2 ? values.Pneu_6_inputInteiroQ2 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 3 ? values.Pneu_6_inputInteiroQ3 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 4 ? values.Pneu_6_inputInteiroQ4 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 5 ? values.Pneu_6_inputInteiroQ5 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 6 ? values.Pneu_6_inputInteiroQ6 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 7 ? values.Pneu_6_inputInteiroQ7 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 8 ? values.Pneu_6_inputInteiroQ8 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 9 ? values.Pneu_6_inputInteiroQ9 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 10  ? values.Pneu_6_inputInteiroQ10 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 11  ? values.Pneu_6_inputInteiroQ11 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 12  ? values.Pneu_6_inputInteiroQ12 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 13  ? values.Pneu_6_inputInteiroQ13 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 14  ? values.Pneu_6_inputInteiroQ14 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 15  ? values.Pneu_6_inputInteiroQ15 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 16  ? values.Pneu_6_inputInteiroQ16 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 17  ? values.Pneu_6_inputInteiroQ17 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 18  ? values.Pneu_6_inputInteiroQ18 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 19  ? values.Pneu_6_inputInteiroQ19 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 20  ? values.Pneu_6_inputInteiroQ20 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 21  ? values.Pneu_6_inputInteiroQ21 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 22  ? values.Pneu_6_inputInteiroQ22 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 23  ? values.Pneu_6_inputInteiroQ23 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 24  ? values.Pneu_6_inputInteiroQ24 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 25  ? values.Pneu_6_inputInteiroQ25 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 26  ? values.Pneu_6_inputInteiroQ26 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 27  ? values.Pneu_6_inputInteiroQ27 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 28  ? values.Pneu_6_inputInteiroQ28 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 29  ? values.Pneu_6_inputInteiroQ29 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 30  ? values.Pneu_6_inputInteiroQ30 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 31  ? values.Pneu_6_inputInteiroQ31 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 32  ? values.Pneu_6_inputInteiroQ32 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 33  ? values.Pneu_6_inputInteiroQ33 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 34  ? values.Pneu_6_inputInteiroQ34 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 35  ? values.Pneu_6_inputInteiroQ35 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 36  ? values.Pneu_6_inputInteiroQ36 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 37  ? values.Pneu_6_inputInteiroQ37 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 38  ? values.Pneu_6_inputInteiroQ38 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 39  ? values.Pneu_6_inputInteiroQ39 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 40  ? values.Pneu_6_inputInteiroQ40 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 41  ? values.Pneu_6_inputInteiroQ41 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 42  ? values.Pneu_6_inputInteiroQ42 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 43  ? values.Pneu_6_inputInteiroQ43 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 44  ? values.Pneu_6_inputInteiroQ44 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 45  ? values.Pneu_6_inputInteiroQ45 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 46  ? values.Pneu_6_inputInteiroQ46 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 47  ? values.Pneu_6_inputInteiroQ47 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 48  ? values.Pneu_6_inputInteiroQ48 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 49  ? values.Pneu_6_inputInteiroQ49 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 50  ? values.Pneu_6_inputInteiroQ50 :

																								false
																							}
																						/>
																						</>
																					)
																				}
																				{
																					//INPUT DECIMAL PNEU
																					quesito.IND_DECIMAL == true && quesito.IND_ATIVO == true && 
																					(	
																						<>
																						<Input 
																							onChangeText={handleChange('Pneu_'+listbox.COD_OPCAO+'_inputDecimalQ'+quesito.COD_ITEM)}
																							onBlur={handleBlur('Pneu_'+listbox.COD_OPCAO+'_inputDecimalQ'+quesito.COD_ITEM)}
																							placeholder='Valor'
																							value={
																								//PNEU 1
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 1 ? values.Pneu_1_inputDecimalQ1 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 2 ? values.Pneu_1_inputDecimalQ2 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 3 ? values.Pneu_1_inputDecimalQ3 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 4 ? values.Pneu_1_inputDecimalQ4 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 5 ? values.Pneu_1_inputDecimalQ5 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 6 ? values.Pneu_1_inputDecimalQ6 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 7 ? values.Pneu_1_inputDecimalQ7 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 8 ? values.Pneu_1_inputDecimalQ8 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 9 ? values.Pneu_1_inputDecimalQ9 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 10  ? values.Pneu_1_inputDecimalQ10 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 11  ? values.Pneu_1_inputDecimalQ11 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 12  ? values.Pneu_1_inputDecimalQ12 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 13  ? values.Pneu_1_inputDecimalQ13 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 14  ? values.Pneu_1_inputDecimalQ14 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 15  ? values.Pneu_1_inputDecimalQ15 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 16  ? values.Pneu_1_inputDecimalQ16 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 17  ? values.Pneu_1_inputDecimalQ17 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 18  ? values.Pneu_1_inputDecimalQ18 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 19  ? values.Pneu_1_inputDecimalQ19 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 20  ? values.Pneu_1_inputDecimalQ20 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 21  ? values.Pneu_1_inputDecimalQ21 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 22  ? values.Pneu_1_inputDecimalQ22 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 23  ? values.Pneu_1_inputDecimalQ23 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 24  ? values.Pneu_1_inputDecimalQ24 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 25  ? values.Pneu_1_inputDecimalQ25 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 26  ? values.Pneu_1_inputDecimalQ26 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 27  ? values.Pneu_1_inputDecimalQ27 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 28  ? values.Pneu_1_inputDecimalQ28 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 29  ? values.Pneu_1_inputDecimalQ29 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 30  ? values.Pneu_1_inputDecimalQ30 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 31  ? values.Pneu_1_inputDecimalQ31 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 32  ? values.Pneu_1_inputDecimalQ32 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 33  ? values.Pneu_1_inputDecimalQ33 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 34  ? values.Pneu_1_inputDecimalQ34 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 35  ? values.Pneu_1_inputDecimalQ35 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 36  ? values.Pneu_1_inputDecimalQ36 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 37  ? values.Pneu_1_inputDecimalQ37 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 38  ? values.Pneu_1_inputDecimalQ38 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 39  ? values.Pneu_1_inputDecimalQ39 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 40  ? values.Pneu_1_inputDecimalQ40 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 41  ? values.Pneu_1_inputDecimalQ41 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 42  ? values.Pneu_1_inputDecimalQ42 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 43  ? values.Pneu_1_inputDecimalQ43 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 44  ? values.Pneu_1_inputDecimalQ44 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 45  ? values.Pneu_1_inputDecimalQ45 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 46  ? values.Pneu_1_inputDecimalQ46 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 47  ? values.Pneu_1_inputDecimalQ47 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 48  ? values.Pneu_1_inputDecimalQ48 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 49  ? values.Pneu_1_inputDecimalQ49 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 50  ? values.Pneu_1_inputDecimalQ50 :

																								//PNEU 2
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 1 ? values.Pneu_2_inputDecimalQ1 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 2 ? values.Pneu_2_inputDecimalQ2 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 3 ? values.Pneu_2_inputDecimalQ3 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 4 ? values.Pneu_2_inputDecimalQ4 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 5 ? values.Pneu_2_inputDecimalQ5 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 6 ? values.Pneu_2_inputDecimalQ6 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 7 ? values.Pneu_2_inputDecimalQ7 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 8 ? values.Pneu_2_inputDecimalQ8 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 9 ? values.Pneu_2_inputDecimalQ9 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 10  ? values.Pneu_2_inputDecimalQ10 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 11  ? values.Pneu_2_inputDecimalQ11 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 12  ? values.Pneu_2_inputDecimalQ12 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 13  ? values.Pneu_2_inputDecimalQ13 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 14  ? values.Pneu_2_inputDecimalQ14 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 15  ? values.Pneu_2_inputDecimalQ15 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 16  ? values.Pneu_2_inputDecimalQ16 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 17  ? values.Pneu_2_inputDecimalQ17 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 18  ? values.Pneu_2_inputDecimalQ18 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 19  ? values.Pneu_2_inputDecimalQ19 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 20  ? values.Pneu_2_inputDecimalQ20 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 21  ? values.Pneu_2_inputDecimalQ21 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 22  ? values.Pneu_2_inputDecimalQ22 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 23  ? values.Pneu_2_inputDecimalQ23 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 24  ? values.Pneu_2_inputDecimalQ24 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 25  ? values.Pneu_2_inputDecimalQ25 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 26  ? values.Pneu_2_inputDecimalQ26 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 27  ? values.Pneu_2_inputDecimalQ27 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 28  ? values.Pneu_2_inputDecimalQ28 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 29  ? values.Pneu_2_inputDecimalQ29 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 30  ? values.Pneu_2_inputDecimalQ30 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 31  ? values.Pneu_2_inputDecimalQ31 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 32  ? values.Pneu_2_inputDecimalQ32 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 33  ? values.Pneu_2_inputDecimalQ33 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 34  ? values.Pneu_2_inputDecimalQ34 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 35  ? values.Pneu_2_inputDecimalQ35 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 36  ? values.Pneu_2_inputDecimalQ36 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 37  ? values.Pneu_2_inputDecimalQ37 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 38  ? values.Pneu_2_inputDecimalQ38 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 39  ? values.Pneu_2_inputDecimalQ39 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 40  ? values.Pneu_2_inputDecimalQ40 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 41  ? values.Pneu_2_inputDecimalQ41 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 42  ? values.Pneu_2_inputDecimalQ42 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 43  ? values.Pneu_2_inputDecimalQ43 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 44  ? values.Pneu_2_inputDecimalQ44 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 45  ? values.Pneu_2_inputDecimalQ45 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 46  ? values.Pneu_2_inputDecimalQ46 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 47  ? values.Pneu_2_inputDecimalQ47 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 48  ? values.Pneu_2_inputDecimalQ48 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 49  ? values.Pneu_2_inputDecimalQ49 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 50  ? values.Pneu_2_inputDecimalQ50 :

																								//PNEU 3
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 1 ? values.Pneu_3_inputDecimalQ1 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 2 ? values.Pneu_3_inputDecimalQ2 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 3 ? values.Pneu_3_inputDecimalQ3 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 4 ? values.Pneu_3_inputDecimalQ4 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 5 ? values.Pneu_3_inputDecimalQ5 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 6 ? values.Pneu_3_inputDecimalQ6 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 7 ? values.Pneu_3_inputDecimalQ7 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 8 ? values.Pneu_3_inputDecimalQ8 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 9 ? values.Pneu_3_inputDecimalQ9 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 10  ? values.Pneu_3_inputDecimalQ10 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 11  ? values.Pneu_3_inputDecimalQ11 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 12  ? values.Pneu_3_inputDecimalQ12 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 13  ? values.Pneu_3_inputDecimalQ13 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 14  ? values.Pneu_3_inputDecimalQ14 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 15  ? values.Pneu_3_inputDecimalQ15 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 16  ? values.Pneu_3_inputDecimalQ16 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 17  ? values.Pneu_3_inputDecimalQ17 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 18  ? values.Pneu_3_inputDecimalQ18 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 19  ? values.Pneu_3_inputDecimalQ19 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 20  ? values.Pneu_3_inputDecimalQ20 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 21  ? values.Pneu_3_inputDecimalQ21 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 22  ? values.Pneu_3_inputDecimalQ22 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 23  ? values.Pneu_3_inputDecimalQ23 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 24  ? values.Pneu_3_inputDecimalQ24 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 25  ? values.Pneu_3_inputDecimalQ25 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 26  ? values.Pneu_3_inputDecimalQ26 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 27  ? values.Pneu_3_inputDecimalQ27 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 28  ? values.Pneu_3_inputDecimalQ28 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 29  ? values.Pneu_3_inputDecimalQ29 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 30  ? values.Pneu_3_inputDecimalQ30 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 31  ? values.Pneu_3_inputDecimalQ31 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 32  ? values.Pneu_3_inputDecimalQ32 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 33  ? values.Pneu_3_inputDecimalQ33 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 34  ? values.Pneu_3_inputDecimalQ34 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 35  ? values.Pneu_3_inputDecimalQ35 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 36  ? values.Pneu_3_inputDecimalQ36 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 37  ? values.Pneu_3_inputDecimalQ37 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 38  ? values.Pneu_3_inputDecimalQ38 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 39  ? values.Pneu_3_inputDecimalQ39 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 40  ? values.Pneu_3_inputDecimalQ40 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 41  ? values.Pneu_3_inputDecimalQ41 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 42  ? values.Pneu_3_inputDecimalQ42 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 43  ? values.Pneu_3_inputDecimalQ43 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 44  ? values.Pneu_3_inputDecimalQ44 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 45  ? values.Pneu_3_inputDecimalQ45 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 46  ? values.Pneu_3_inputDecimalQ46 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 47  ? values.Pneu_3_inputDecimalQ47 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 48  ? values.Pneu_3_inputDecimalQ48 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 49  ? values.Pneu_3_inputDecimalQ49 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 50  ? values.Pneu_3_inputDecimalQ50 :

																								//PNEU 4
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 1 ? values.Pneu_4_inputDecimalQ1 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 2 ? values.Pneu_4_inputDecimalQ2 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 3 ? values.Pneu_4_inputDecimalQ3 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 4 ? values.Pneu_4_inputDecimalQ4 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 5 ? values.Pneu_4_inputDecimalQ5 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 6 ? values.Pneu_4_inputDecimalQ6 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 7 ? values.Pneu_4_inputDecimalQ7 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 8 ? values.Pneu_4_inputDecimalQ8 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 9 ? values.Pneu_4_inputDecimalQ9 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 10  ? values.Pneu_4_inputDecimalQ10 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 11  ? values.Pneu_4_inputDecimalQ11 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 12  ? values.Pneu_4_inputDecimalQ12 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 14  ? values.Pneu_4_inputDecimalQ14 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 14  ? values.Pneu_4_inputDecimalQ14 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 15  ? values.Pneu_4_inputDecimalQ15 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 16  ? values.Pneu_4_inputDecimalQ16 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 17  ? values.Pneu_4_inputDecimalQ17 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 18  ? values.Pneu_4_inputDecimalQ18 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 19  ? values.Pneu_4_inputDecimalQ19 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 20  ? values.Pneu_4_inputDecimalQ20 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 21  ? values.Pneu_4_inputDecimalQ21 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 22  ? values.Pneu_4_inputDecimalQ22 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 23  ? values.Pneu_4_inputDecimalQ24 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 24  ? values.Pneu_4_inputDecimalQ24 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 25  ? values.Pneu_4_inputDecimalQ25 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 26  ? values.Pneu_4_inputDecimalQ26 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 27  ? values.Pneu_4_inputDecimalQ27 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 28  ? values.Pneu_4_inputDecimalQ28 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 29  ? values.Pneu_4_inputDecimalQ29 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 30  ? values.Pneu_4_inputDecimalQ30 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 31  ? values.Pneu_4_inputDecimalQ31 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 32  ? values.Pneu_4_inputDecimalQ32 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 33  ? values.Pneu_4_inputDecimalQ33 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 34  ? values.Pneu_4_inputDecimalQ34 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 35  ? values.Pneu_4_inputDecimalQ35 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 36  ? values.Pneu_4_inputDecimalQ36 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 37  ? values.Pneu_4_inputDecimalQ37 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 38  ? values.Pneu_4_inputDecimalQ38 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 39  ? values.Pneu_4_inputDecimalQ39 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 40  ? values.Pneu_4_inputDecimalQ40 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 41  ? values.Pneu_4_inputDecimalQ41 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 42  ? values.Pneu_4_inputDecimalQ42 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 43  ? values.Pneu_4_inputDecimalQ43 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 44  ? values.Pneu_4_inputDecimalQ44 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 45  ? values.Pneu_4_inputDecimalQ45 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 46  ? values.Pneu_4_inputDecimalQ46 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 47  ? values.Pneu_4_inputDecimalQ47 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 48  ? values.Pneu_4_inputDecimalQ48 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 49  ? values.Pneu_4_inputDecimalQ49 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 50  ? values.Pneu_4_inputDecimalQ50 :

																								//PNEU 5
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 1 ? values.Pneu_5_inputDecimalQ1 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 2 ? values.Pneu_5_inputDecimalQ2 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 3 ? values.Pneu_5_inputDecimalQ3 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 4 ? values.Pneu_5_inputDecimalQ4 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 5 ? values.Pneu_5_inputDecimalQ5 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 6 ? values.Pneu_5_inputDecimalQ6 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 7 ? values.Pneu_5_inputDecimalQ7 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 8 ? values.Pneu_5_inputDecimalQ8 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 9 ? values.Pneu_5_inputDecimalQ9 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 10  ? values.Pneu_5_inputDecimalQ10 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 11  ? values.Pneu_5_inputDecimalQ11 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 12  ? values.Pneu_5_inputDecimalQ12 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 13  ? values.Pneu_5_inputDecimalQ13 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 14  ? values.Pneu_5_inputDecimalQ14 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 15  ? values.Pneu_5_inputDecimalQ15 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 16  ? values.Pneu_5_inputDecimalQ16 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 17  ? values.Pneu_5_inputDecimalQ17 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 18  ? values.Pneu_5_inputDecimalQ18 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 19  ? values.Pneu_5_inputDecimalQ19 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 20  ? values.Pneu_5_inputDecimalQ20 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 21  ? values.Pneu_5_inputDecimalQ21 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 22  ? values.Pneu_5_inputDecimalQ22 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 23  ? values.Pneu_5_inputDecimalQ23 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 24  ? values.Pneu_5_inputDecimalQ24 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 25  ? values.Pneu_5_inputDecimalQ25 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 26  ? values.Pneu_5_inputDecimalQ26 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 27  ? values.Pneu_5_inputDecimalQ27 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 28  ? values.Pneu_5_inputDecimalQ28 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 29  ? values.Pneu_5_inputDecimalQ29 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 30  ? values.Pneu_5_inputDecimalQ30 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 31  ? values.Pneu_5_inputDecimalQ31 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 32  ? values.Pneu_5_inputDecimalQ32 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 33  ? values.Pneu_5_inputDecimalQ33 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 34  ? values.Pneu_5_inputDecimalQ34 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 35  ? values.Pneu_5_inputDecimalQ35 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 36  ? values.Pneu_5_inputDecimalQ36 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 37  ? values.Pneu_5_inputDecimalQ37 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 38  ? values.Pneu_5_inputDecimalQ38 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 39  ? values.Pneu_5_inputDecimalQ39 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 40  ? values.Pneu_5_inputDecimalQ40 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 41  ? values.Pneu_5_inputDecimalQ41 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 42  ? values.Pneu_5_inputDecimalQ42 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 43  ? values.Pneu_5_inputDecimalQ43 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 44  ? values.Pneu_5_inputDecimalQ44 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 45  ? values.Pneu_5_inputDecimalQ45 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 46  ? values.Pneu_5_inputDecimalQ46 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 47  ? values.Pneu_5_inputDecimalQ47 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 48  ? values.Pneu_5_inputDecimalQ48 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 49  ? values.Pneu_5_inputDecimalQ49 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 50  ? values.Pneu_5_inputDecimalQ50 :

																								//PNEU 6
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 1 ? values.Pneu_6_inputDecimalQ1 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 2 ? values.Pneu_6_inputDecimalQ2 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 3 ? values.Pneu_6_inputDecimalQ3 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 4 ? values.Pneu_6_inputDecimalQ4 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 5 ? values.Pneu_6_inputDecimalQ5 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 6 ? values.Pneu_6_inputDecimalQ6 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 7 ? values.Pneu_6_inputDecimalQ7 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 8 ? values.Pneu_6_inputDecimalQ8 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 9 ? values.Pneu_6_inputDecimalQ9 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 10  ? values.Pneu_6_inputDecimalQ10 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 11  ? values.Pneu_6_inputDecimalQ11 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 12  ? values.Pneu_6_inputDecimalQ12 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 13  ? values.Pneu_6_inputDecimalQ13 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 14  ? values.Pneu_6_inputDecimalQ14 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 15  ? values.Pneu_6_inputDecimalQ15 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 16  ? values.Pneu_6_inputDecimalQ16 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 17  ? values.Pneu_6_inputDecimalQ17 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 18  ? values.Pneu_6_inputDecimalQ18 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 19  ? values.Pneu_6_inputDecimalQ19 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 20  ? values.Pneu_6_inputDecimalQ20 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 21  ? values.Pneu_6_inputDecimalQ21 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 22  ? values.Pneu_6_inputDecimalQ22 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 23  ? values.Pneu_6_inputDecimalQ23 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 24  ? values.Pneu_6_inputDecimalQ24 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 25  ? values.Pneu_6_inputDecimalQ25 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 26  ? values.Pneu_6_inputDecimalQ26 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 27  ? values.Pneu_6_inputDecimalQ27 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 28  ? values.Pneu_6_inputDecimalQ28 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 29  ? values.Pneu_6_inputDecimalQ29 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 30  ? values.Pneu_6_inputDecimalQ30 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 31  ? values.Pneu_6_inputDecimalQ31 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 32  ? values.Pneu_6_inputDecimalQ32 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 33  ? values.Pneu_6_inputDecimalQ33 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 34  ? values.Pneu_6_inputDecimalQ34 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 35  ? values.Pneu_6_inputDecimalQ35 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 36  ? values.Pneu_6_inputDecimalQ36 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 37  ? values.Pneu_6_inputDecimalQ37 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 38  ? values.Pneu_6_inputDecimalQ38 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 39  ? values.Pneu_6_inputDecimalQ39 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 40  ? values.Pneu_6_inputDecimalQ40 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 41  ? values.Pneu_6_inputDecimalQ41 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 42  ? values.Pneu_6_inputDecimalQ42 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 43  ? values.Pneu_6_inputDecimalQ43 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 44  ? values.Pneu_6_inputDecimalQ44 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 45  ? values.Pneu_6_inputDecimalQ45 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 46  ? values.Pneu_6_inputDecimalQ46 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 47  ? values.Pneu_6_inputDecimalQ47 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 48  ? values.Pneu_6_inputDecimalQ48 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 49  ? values.Pneu_6_inputDecimalQ49 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 50  ? values.Pneu_6_inputDecimalQ50 :

																								false
																							}
																						/>
																						</>
																					)
																				}
																				{
																					//INPUT TEXTO PNEU
																					 quesito.IND_TEXTO == true && quesito.IND_ATIVO == true && 
																					(	
																						<>
																						<Input 
																							onChangeText={handleChange('Pneu_'+listbox.COD_OPCAO+'_inputTextoQ'+quesito.COD_ITEM)}
																							onBlur={handleBlur('Pneu_'+listbox.COD_OPCAO+'_inputTextoQ'+quesito.COD_ITEM)}
																							placeholder='Observação'
																							value={
																								//PNEU 1
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 1 ? values.Pneu_1_inputTextoQ1 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 2 ? values.Pneu_1_inputTextoQ2 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 3 ? values.Pneu_1_inputTextoQ3 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 4 ? values.Pneu_1_inputTextoQ4 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 5 ? values.Pneu_1_inputTextoQ5 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 6 ? values.Pneu_1_inputTextoQ6 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 7 ? values.Pneu_1_inputTextoQ7 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 8 ? values.Pneu_1_inputTextoQ8 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 9 ? values.Pneu_1_inputTextoQ9 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 10  ? values.Pneu_1_inputTextoQ10 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 11  ? values.Pneu_1_inputTextoQ11 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 12  ? values.Pneu_1_inputTextoQ12 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 13  ? values.Pneu_1_inputTextoQ13 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 14  ? values.Pneu_1_inputTextoQ14 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 15  ? values.Pneu_1_inputTextoQ15 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 16  ? values.Pneu_1_inputTextoQ16 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 17  ? values.Pneu_1_inputTextoQ17 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 18  ? values.Pneu_1_inputTextoQ18 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 19  ? values.Pneu_1_inputTextoQ19 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 20  ? values.Pneu_1_inputTextoQ20 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 21  ? values.Pneu_1_inputTextoQ21 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 22  ? values.Pneu_1_inputTextoQ22 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 23  ? values.Pneu_1_inputTextoQ23 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 24  ? values.Pneu_1_inputTextoQ24 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 25  ? values.Pneu_1_inputTextoQ25 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 26  ? values.Pneu_1_inputTextoQ26 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 27  ? values.Pneu_1_inputTextoQ27 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 28  ? values.Pneu_1_inputTextoQ28 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 29  ? values.Pneu_1_inputTextoQ29 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 30  ? values.Pneu_1_inputTextoQ30 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 31  ? values.Pneu_1_inputTextoQ31 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 32  ? values.Pneu_1_inputTextoQ32 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 33  ? values.Pneu_1_inputTextoQ33 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 34  ? values.Pneu_1_inputTextoQ34 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 35  ? values.Pneu_1_inputTextoQ35 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 36  ? values.Pneu_1_inputTextoQ36 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 37  ? values.Pneu_1_inputTextoQ37 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 38  ? values.Pneu_1_inputTextoQ38 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 39  ? values.Pneu_1_inputTextoQ39 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 40  ? values.Pneu_1_inputTextoQ40 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 41  ? values.Pneu_1_inputTextoQ41 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 42  ? values.Pneu_1_inputTextoQ42 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 43  ? values.Pneu_1_inputTextoQ43 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 44  ? values.Pneu_1_inputTextoQ44 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 45  ? values.Pneu_1_inputTextoQ45 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 46  ? values.Pneu_1_inputTextoQ46 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 47  ? values.Pneu_1_inputTextoQ47 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 48  ? values.Pneu_1_inputTextoQ48 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 49  ? values.Pneu_1_inputTextoQ49 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 50  ? values.Pneu_1_inputTextoQ50 :

																								//PNEU 2
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 1 ? values.Pneu_2_inputTextoQ1 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 2 ? values.Pneu_2_inputTextoQ2 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 3 ? values.Pneu_2_inputTextoQ3 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 4 ? values.Pneu_2_inputTextoQ4 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 5 ? values.Pneu_2_inputTextoQ5 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 6 ? values.Pneu_2_inputTextoQ6 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 7 ? values.Pneu_2_inputTextoQ7 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 8 ? values.Pneu_2_inputTextoQ8 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 9 ? values.Pneu_2_inputTextoQ9 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 10  ? values.Pneu_2_inputTextoQ10 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 11  ? values.Pneu_2_inputTextoQ11 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 12  ? values.Pneu_2_inputTextoQ12 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 13  ? values.Pneu_2_inputTextoQ13 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 14  ? values.Pneu_2_inputTextoQ14 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 15  ? values.Pneu_2_inputTextoQ15 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 16  ? values.Pneu_2_inputTextoQ16 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 17  ? values.Pneu_2_inputTextoQ17 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 18  ? values.Pneu_2_inputTextoQ18 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 19  ? values.Pneu_2_inputTextoQ19 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 20  ? values.Pneu_2_inputTextoQ20 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 21  ? values.Pneu_2_inputTextoQ21 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 22  ? values.Pneu_2_inputTextoQ22 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 23  ? values.Pneu_2_inputTextoQ23 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 24  ? values.Pneu_2_inputTextoQ24 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 25  ? values.Pneu_2_inputTextoQ25 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 26  ? values.Pneu_2_inputTextoQ26 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 27  ? values.Pneu_2_inputTextoQ27 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 28  ? values.Pneu_2_inputTextoQ28 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 29  ? values.Pneu_2_inputTextoQ29 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 30  ? values.Pneu_2_inputTextoQ30 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 31  ? values.Pneu_2_inputTextoQ31 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 32  ? values.Pneu_2_inputTextoQ32 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 33  ? values.Pneu_2_inputTextoQ33 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 34  ? values.Pneu_2_inputTextoQ34 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 35  ? values.Pneu_2_inputTextoQ35 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 36  ? values.Pneu_2_inputTextoQ36 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 37  ? values.Pneu_2_inputTextoQ37 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 38  ? values.Pneu_2_inputTextoQ38 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 39  ? values.Pneu_2_inputTextoQ39 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 40  ? values.Pneu_2_inputTextoQ40 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 41  ? values.Pneu_2_inputTextoQ41 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 42  ? values.Pneu_2_inputTextoQ42 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 43  ? values.Pneu_2_inputTextoQ43 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 44  ? values.Pneu_2_inputTextoQ44 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 45  ? values.Pneu_2_inputTextoQ45 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 46  ? values.Pneu_2_inputTextoQ46 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 47  ? values.Pneu_2_inputTextoQ47 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 48  ? values.Pneu_2_inputTextoQ48 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 49  ? values.Pneu_2_inputTextoQ49 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 50  ? values.Pneu_2_inputTextoQ50 :

																								//PNEU 3
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 1 ? values.Pneu_3_inputTextoQ1 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 2 ? values.Pneu_3_inputTextoQ2 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 3 ? values.Pneu_3_inputTextoQ3 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 4 ? values.Pneu_3_inputTextoQ4 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 5 ? values.Pneu_3_inputTextoQ5 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 6 ? values.Pneu_3_inputTextoQ6 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 7 ? values.Pneu_3_inputTextoQ7 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 8 ? values.Pneu_3_inputTextoQ8 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 9 ? values.Pneu_3_inputTextoQ9 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 10  ? values.Pneu_3_inputTextoQ10 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 11  ? values.Pneu_3_inputTextoQ11 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 12  ? values.Pneu_3_inputTextoQ12 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 13  ? values.Pneu_3_inputTextoQ13 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 14  ? values.Pneu_3_inputTextoQ14 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 15  ? values.Pneu_3_inputTextoQ15 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 16  ? values.Pneu_3_inputTextoQ16 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 17  ? values.Pneu_3_inputTextoQ17 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 18  ? values.Pneu_3_inputTextoQ18 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 19  ? values.Pneu_3_inputTextoQ19 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 20  ? values.Pneu_3_inputTextoQ20 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 21  ? values.Pneu_3_inputTextoQ21 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 22  ? values.Pneu_3_inputTextoQ22 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 23  ? values.Pneu_3_inputTextoQ23 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 24  ? values.Pneu_3_inputTextoQ24 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 25  ? values.Pneu_3_inputTextoQ25 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 26  ? values.Pneu_3_inputTextoQ26 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 27  ? values.Pneu_3_inputTextoQ27 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 28  ? values.Pneu_3_inputTextoQ28 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 29  ? values.Pneu_3_inputTextoQ29 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 30  ? values.Pneu_3_inputTextoQ30 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 31  ? values.Pneu_3_inputTextoQ31 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 32  ? values.Pneu_3_inputTextoQ32 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 33  ? values.Pneu_3_inputTextoQ33 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 34  ? values.Pneu_3_inputTextoQ34 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 35  ? values.Pneu_3_inputTextoQ35 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 36  ? values.Pneu_3_inputTextoQ36 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 37  ? values.Pneu_3_inputTextoQ37 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 38  ? values.Pneu_3_inputTextoQ38 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 39  ? values.Pneu_3_inputTextoQ39 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 40  ? values.Pneu_3_inputTextoQ40 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 41  ? values.Pneu_3_inputTextoQ41 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 42  ? values.Pneu_3_inputTextoQ42 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 43  ? values.Pneu_3_inputTextoQ43 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 44  ? values.Pneu_3_inputTextoQ44 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 45  ? values.Pneu_3_inputTextoQ45 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 46  ? values.Pneu_3_inputTextoQ46 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 47  ? values.Pneu_3_inputTextoQ47 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 48  ? values.Pneu_3_inputTextoQ48 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 49  ? values.Pneu_3_inputTextoQ49 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 50  ? values.Pneu_3_inputTextoQ50 :

																								//PNEU 4
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 1 ? values.Pneu_4_inputTextoQ1 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 2 ? values.Pneu_4_inputTextoQ2 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 3 ? values.Pneu_4_inputTextoQ3 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 4 ? values.Pneu_4_inputTextoQ4 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 5 ? values.Pneu_4_inputTextoQ5 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 6 ? values.Pneu_4_inputTextoQ6 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 7 ? values.Pneu_4_inputTextoQ7 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 8 ? values.Pneu_4_inputTextoQ8 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 9 ? values.Pneu_4_inputTextoQ9 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 10  ? values.Pneu_4_inputTextoQ10 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 11  ? values.Pneu_4_inputTextoQ11 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 12  ? values.Pneu_4_inputTextoQ12 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 13  ? values.Pneu_4_inputTextoQ13 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 14  ? values.Pneu_4_inputTextoQ14 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 15  ? values.Pneu_4_inputTextoQ15 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 16  ? values.Pneu_4_inputTextoQ16 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 17  ? values.Pneu_4_inputTextoQ17 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 18  ? values.Pneu_4_inputTextoQ18 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 19  ? values.Pneu_4_inputTextoQ19 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 20  ? values.Pneu_4_inputTextoQ20 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 21  ? values.Pneu_4_inputTextoQ21 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 22  ? values.Pneu_4_inputTextoQ22 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 23  ? values.Pneu_4_inputTextoQ24 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 24  ? values.Pneu_4_inputTextoQ24 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 25  ? values.Pneu_4_inputTextoQ25 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 26  ? values.Pneu_4_inputTextoQ26 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 27  ? values.Pneu_4_inputTextoQ27 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 28  ? values.Pneu_4_inputTextoQ28 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 29  ? values.Pneu_4_inputTextoQ29 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 30  ? values.Pneu_4_inputTextoQ30 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 31  ? values.Pneu_4_inputTextoQ31 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 32  ? values.Pneu_4_inputTextoQ32 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 33  ? values.Pneu_4_inputTextoQ33 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 34  ? values.Pneu_4_inputTextoQ34 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 35  ? values.Pneu_4_inputTextoQ35 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 36  ? values.Pneu_4_inputTextoQ36 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 37  ? values.Pneu_4_inputTextoQ37 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 38  ? values.Pneu_4_inputTextoQ38 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 39  ? values.Pneu_4_inputTextoQ39 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 40  ? values.Pneu_4_inputTextoQ40 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 41  ? values.Pneu_4_inputTextoQ41 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 42  ? values.Pneu_4_inputTextoQ42 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 43  ? values.Pneu_4_inputTextoQ43 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 44  ? values.Pneu_4_inputTextoQ44 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 45  ? values.Pneu_4_inputTextoQ45 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 46  ? values.Pneu_4_inputTextoQ46 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 47  ? values.Pneu_4_inputTextoQ47 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 48  ? values.Pneu_4_inputTextoQ48 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 49  ? values.Pneu_4_inputTextoQ49 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 50  ? values.Pneu_4_inputTextoQ50 :

																								//PNEU 5
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 1 ? values.Pneu_5_inputTextoQ1 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 2 ? values.Pneu_5_inputTextoQ2 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 3 ? values.Pneu_5_inputTextoQ3 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 4 ? values.Pneu_5_inputTextoQ4 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 5 ? values.Pneu_5_inputTextoQ5 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 6 ? values.Pneu_5_inputTextoQ6 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 7 ? values.Pneu_5_inputTextoQ7 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 8 ? values.Pneu_5_inputTextoQ8 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 9 ? values.Pneu_5_inputTextoQ9 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 10  ? values.Pneu_5_inputTextoQ10 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 11  ? values.Pneu_5_inputTextoQ11 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 12  ? values.Pneu_5_inputTextoQ12 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 13  ? values.Pneu_5_inputTextoQ13 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 14  ? values.Pneu_5_inputTextoQ14 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 15  ? values.Pneu_5_inputTextoQ15 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 16  ? values.Pneu_5_inputTextoQ16 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 17  ? values.Pneu_5_inputTextoQ17 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 18  ? values.Pneu_5_inputTextoQ18 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 19  ? values.Pneu_5_inputTextoQ19 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 20  ? values.Pneu_5_inputTextoQ20 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 21  ? values.Pneu_5_inputTextoQ21 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 22  ? values.Pneu_5_inputTextoQ22 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 23  ? values.Pneu_5_inputTextoQ23 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 24  ? values.Pneu_5_inputTextoQ24 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 25  ? values.Pneu_5_inputTextoQ25 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 26  ? values.Pneu_5_inputTextoQ26 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 27  ? values.Pneu_5_inputTextoQ27 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 28  ? values.Pneu_5_inputTextoQ28 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 29  ? values.Pneu_5_inputTextoQ29 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 30  ? values.Pneu_5_inputTextoQ30 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 31  ? values.Pneu_5_inputTextoQ31 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 32  ? values.Pneu_5_inputTextoQ32 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 33  ? values.Pneu_5_inputTextoQ33 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 34  ? values.Pneu_5_inputTextoQ34 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 35  ? values.Pneu_5_inputTextoQ35 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 36  ? values.Pneu_5_inputTextoQ36 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 37  ? values.Pneu_5_inputTextoQ37 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 38  ? values.Pneu_5_inputTextoQ38 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 39  ? values.Pneu_5_inputTextoQ39 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 40  ? values.Pneu_5_inputTextoQ40 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 41  ? values.Pneu_5_inputTextoQ41 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 42  ? values.Pneu_5_inputTextoQ42 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 43  ? values.Pneu_5_inputTextoQ43 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 44  ? values.Pneu_5_inputTextoQ44 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 45  ? values.Pneu_5_inputTextoQ45 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 46  ? values.Pneu_5_inputTextoQ46 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 47  ? values.Pneu_5_inputTextoQ47 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 48  ? values.Pneu_5_inputTextoQ48 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 49  ? values.Pneu_5_inputTextoQ49 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 50  ? values.Pneu_5_inputTextoQ50 :

																								//PNEU 6
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 1 ? values.Pneu_6_inputTextoQ1 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 2 ? values.Pneu_6_inputTextoQ2 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 3 ? values.Pneu_6_inputTextoQ3 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 4 ? values.Pneu_6_inputTextoQ4 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 5 ? values.Pneu_6_inputTextoQ5 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 6 ? values.Pneu_6_inputTextoQ6 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 7 ? values.Pneu_6_inputTextoQ7 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 8 ? values.Pneu_6_inputTextoQ8 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 9 ? values.Pneu_6_inputTextoQ9 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 10  ? values.Pneu_6_inputTextoQ10 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 11  ? values.Pneu_6_inputTextoQ11 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 12  ? values.Pneu_6_inputTextoQ12 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 13  ? values.Pneu_6_inputTextoQ13 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 14  ? values.Pneu_6_inputTextoQ14 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 15  ? values.Pneu_6_inputTextoQ15 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 16  ? values.Pneu_6_inputTextoQ16 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 17  ? values.Pneu_6_inputTextoQ17 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 18  ? values.Pneu_6_inputTextoQ18 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 19  ? values.Pneu_6_inputTextoQ19 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 20  ? values.Pneu_6_inputTextoQ20 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 21  ? values.Pneu_6_inputTextoQ21 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 22  ? values.Pneu_6_inputTextoQ22 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 23  ? values.Pneu_6_inputTextoQ23 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 24  ? values.Pneu_6_inputTextoQ24 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 25  ? values.Pneu_6_inputTextoQ25 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 26  ? values.Pneu_6_inputTextoQ26 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 27  ? values.Pneu_6_inputTextoQ27 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 28  ? values.Pneu_6_inputTextoQ28 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 29  ? values.Pneu_6_inputTextoQ29 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 30  ? values.Pneu_6_inputTextoQ30 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 31  ? values.Pneu_6_inputTextoQ31 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 32  ? values.Pneu_6_inputTextoQ32 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 33  ? values.Pneu_6_inputTextoQ33 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 34  ? values.Pneu_6_inputTextoQ34 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 35  ? values.Pneu_6_inputTextoQ35 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 36  ? values.Pneu_6_inputTextoQ36 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 37  ? values.Pneu_6_inputTextoQ37 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 38  ? values.Pneu_6_inputTextoQ38 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 39  ? values.Pneu_6_inputTextoQ39 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 40  ? values.Pneu_6_inputTextoQ40 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 41  ? values.Pneu_6_inputTextoQ41 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 42  ? values.Pneu_6_inputTextoQ42 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 43  ? values.Pneu_6_inputTextoQ43 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 44  ? values.Pneu_6_inputTextoQ44 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 45  ? values.Pneu_6_inputTextoQ45 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 46  ? values.Pneu_6_inputTextoQ46 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 47  ? values.Pneu_6_inputTextoQ47 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 48  ? values.Pneu_6_inputTextoQ48 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 49  ? values.Pneu_6_inputTextoQ49 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 50  ? values.Pneu_6_inputTextoQ50 :

																								false
																							}
																						/>
																						</>
																					)
																				}
																				</View>
																			)
																			
																		})
																	)
																}
															</CollapseBody>
														</Collapse>
													);
												})
											)
										}
										{
											//LATARIA TRUE
											grupo.IND_LATARIA == true && (
												quesitos.LISTA_LATARIA.map((listbox, i) => {
													return ( 
														<Collapse 
																key={listbox.DES_OPCAO}
																isExpanded={false}
																>
																<CollapseHeader>
																	<Separator style={{ backgroundColor: '#C4C4C4', height: 45, marginTop: 3, marginLeft: 20, marginRight: 20  }} bordered >
																	<Text > 
																	&nbsp;&nbsp;{listbox.DES_OPCAO}
																	</Text>
																	</Separator>
																</CollapseHeader>
																<CollapseBody style={{ marginLeft: 10 }} >
																{
																	grupo.QUESITOS != undefined &&(
																		grupo.QUESITOS.map((quesito, q) => {
																			return(
																				<View key={quesito.QUESITO}>
																				
																				<Text style={{fontSize: 20, marginLeft: 10, marginTop: 10, fontWeight: 'bold' }}>{quesito.COD_ITEM+'. '+quesito.QUESITO}</Text>
																				{
																					//LIST BOX
																					quesito.IND_LISTA == true && quesito.IND_ATIVO == true &&
																					(
																						<Picker
																								selectedValue={
																									//Lataria 1
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 1 ? values.Lataria_1_lbQ1 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 2 ? values.Lataria_1_lbQ2 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 3 ? values.Lataria_1_lbQ3 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 4 ? values.Lataria_1_lbQ4 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 5 ? values.Lataria_1_lbQ5 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 6 ? values.Lataria_1_lbQ6 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 7 ? values.Lataria_1_lbQ7 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 8 ? values.Lataria_1_lbQ8 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 9 ? values.Lataria_1_lbQ9 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 10  ? values.Lataria_1_lbQ10 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 11  ? values.Lataria_1_lbQ11 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 12  ? values.Lataria_1_lbQ12 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 13  ? values.Lataria_1_lbQ13 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 14  ? values.Lataria_1_lbQ14 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 15  ? values.Lataria_1_lbQ15 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 16  ? values.Lataria_1_lbQ16 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 17  ? values.Lataria_1_lbQ17 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 18  ? values.Lataria_1_lbQ18 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 19  ? values.Lataria_1_lbQ19 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 20  ? values.Lataria_1_lbQ20 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 21  ? values.Lataria_1_lbQ21 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 22  ? values.Lataria_1_lbQ22 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 23  ? values.Lataria_1_lbQ23 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 24  ? values.Lataria_1_lbQ24 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 25  ? values.Lataria_1_lbQ25 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 26  ? values.Lataria_1_lbQ26 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 27  ? values.Lataria_1_lbQ27 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 28  ? values.Lataria_1_lbQ28 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 29  ? values.Lataria_1_lbQ29 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 30  ? values.Lataria_1_lbQ30 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 31  ? values.Lataria_1_lbQ31 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 32  ? values.Lataria_1_lbQ32 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 33  ? values.Lataria_1_lbQ33 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 34  ? values.Lataria_1_lbQ34 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 35  ? values.Lataria_1_lbQ35 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 36  ? values.Lataria_1_lbQ36 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 37  ? values.Lataria_1_lbQ37 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 38  ? values.Lataria_1_lbQ38 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 39  ? values.Lataria_1_lbQ39 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 40  ? values.Lataria_1_lbQ40 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 41  ? values.Lataria_1_lbQ41 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 42  ? values.Lataria_1_lbQ42 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 43  ? values.Lataria_1_lbQ43 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 44  ? values.Lataria_1_lbQ44 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 45  ? values.Lataria_1_lbQ45 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 46  ? values.Lataria_1_lbQ46 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 47  ? values.Lataria_1_lbQ47 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 48  ? values.Lataria_1_lbQ48 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 49  ? values.Lataria_1_lbQ49 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 50  ? values.Lataria_1_lbQ50 :

																									//Lataria 2
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 1 ? values.Lataria_2_lbQ1 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 2 ? values.Lataria_2_lbQ2 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 3 ? values.Lataria_2_lbQ3 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 4 ? values.Lataria_2_lbQ4 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 5 ? values.Lataria_2_lbQ5 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 6 ? values.Lataria_2_lbQ6 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 7 ? values.Lataria_2_lbQ7 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 8 ? values.Lataria_2_lbQ8 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 9 ? values.Lataria_2_lbQ9 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 10  ? values.Lataria_2_lbQ10 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 11  ? values.Lataria_2_lbQ11 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 12  ? values.Lataria_2_lbQ12 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 13  ? values.Lataria_2_lbQ13 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 14  ? values.Lataria_2_lbQ14 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 15  ? values.Lataria_2_lbQ15 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 16  ? values.Lataria_2_lbQ16 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 17  ? values.Lataria_2_lbQ17 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 18  ? values.Lataria_2_lbQ18 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 19  ? values.Lataria_2_lbQ19 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 20  ? values.Lataria_2_lbQ20 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 21  ? values.Lataria_2_lbQ21 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 22  ? values.Lataria_2_lbQ22 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 23  ? values.Lataria_2_lbQ23 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 24  ? values.Lataria_2_lbQ24 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 25  ? values.Lataria_2_lbQ25 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 26  ? values.Lataria_2_lbQ26 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 27  ? values.Lataria_2_lbQ27 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 28  ? values.Lataria_2_lbQ28 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 29  ? values.Lataria_2_lbQ29 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 30  ? values.Lataria_2_lbQ30 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 31  ? values.Lataria_2_lbQ31 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 32  ? values.Lataria_2_lbQ32 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 33  ? values.Lataria_2_lbQ33 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 34  ? values.Lataria_2_lbQ34 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 35  ? values.Lataria_2_lbQ35 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 36  ? values.Lataria_2_lbQ36 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 37  ? values.Lataria_2_lbQ37 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 38  ? values.Lataria_2_lbQ38 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 39  ? values.Lataria_2_lbQ39 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 40  ? values.Lataria_2_lbQ40 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 41  ? values.Lataria_2_lbQ41 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 42  ? values.Lataria_2_lbQ42 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 43  ? values.Lataria_2_lbQ43 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 44  ? values.Lataria_2_lbQ44 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 45  ? values.Lataria_2_lbQ45 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 46  ? values.Lataria_2_lbQ46 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 47  ? values.Lataria_2_lbQ47 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 48  ? values.Lataria_2_lbQ48 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 49  ? values.Lataria_2_lbQ49 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 50  ? values.Lataria_2_lbQ50 :

																									//Lataria 3
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 1 ? values.Lataria_3_lbQ1 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 2 ? values.Lataria_3_lbQ2 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 3 ? values.Lataria_3_lbQ3 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 4 ? values.Lataria_3_lbQ4 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 5 ? values.Lataria_3_lbQ5 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 6 ? values.Lataria_3_lbQ6 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 7 ? values.Lataria_3_lbQ7 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 8 ? values.Lataria_3_lbQ8 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 9 ? values.Lataria_3_lbQ9 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 10  ? values.Lataria_3_lbQ10 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 11  ? values.Lataria_3_lbQ11 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 12  ? values.Lataria_3_lbQ12 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 13  ? values.Lataria_3_lbQ13 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 14  ? values.Lataria_3_lbQ14 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 15  ? values.Lataria_3_lbQ15 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 16  ? values.Lataria_3_lbQ16 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 17  ? values.Lataria_3_lbQ17 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 18  ? values.Lataria_3_lbQ18 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 19  ? values.Lataria_3_lbQ19 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 20  ? values.Lataria_3_lbQ20 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 21  ? values.Lataria_3_lbQ21 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 22  ? values.Lataria_3_lbQ22 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 23  ? values.Lataria_3_lbQ23 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 24  ? values.Lataria_3_lbQ24 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 25  ? values.Lataria_3_lbQ25 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 26  ? values.Lataria_3_lbQ26 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 27  ? values.Lataria_3_lbQ27 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 28  ? values.Lataria_3_lbQ28 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 29  ? values.Lataria_3_lbQ29 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 30  ? values.Lataria_3_lbQ30 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 31  ? values.Lataria_3_lbQ31 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 32  ? values.Lataria_3_lbQ32 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 33  ? values.Lataria_3_lbQ33 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 34  ? values.Lataria_3_lbQ34 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 35  ? values.Lataria_3_lbQ35 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 36  ? values.Lataria_3_lbQ36 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 37  ? values.Lataria_3_lbQ37 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 38  ? values.Lataria_3_lbQ38 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 39  ? values.Lataria_3_lbQ39 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 40  ? values.Lataria_3_lbQ40 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 41  ? values.Lataria_3_lbQ41 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 42  ? values.Lataria_3_lbQ42 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 43  ? values.Lataria_3_lbQ43 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 44  ? values.Lataria_3_lbQ44 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 45  ? values.Lataria_3_lbQ45 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 46  ? values.Lataria_3_lbQ46 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 47  ? values.Lataria_3_lbQ47 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 48  ? values.Lataria_3_lbQ48 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 49  ? values.Lataria_3_lbQ49 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 50  ? values.Lataria_3_lbQ50 :

																									//Lataria 4
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 1 ? values.Lataria_4_lbQ1 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 2 ? values.Lataria_4_lbQ2 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 3 ? values.Lataria_4_lbQ3 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 4 ? values.Lataria_4_lbQ4 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 5 ? values.Lataria_4_lbQ5 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 6 ? values.Lataria_4_lbQ6 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 7 ? values.Lataria_4_lbQ7 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 8 ? values.Lataria_4_lbQ8 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 9 ? values.Lataria_4_lbQ9 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 10  ? values.Lataria_4_lbQ10 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 11  ? values.Lataria_4_lbQ11 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 12  ? values.Lataria_4_lbQ12 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 13  ? values.Lataria_4_lbQ13 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 14  ? values.Lataria_4_lbQ14 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 15  ? values.Lataria_4_lbQ15 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 16  ? values.Lataria_4_lbQ16 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 17  ? values.Lataria_4_lbQ17 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 18  ? values.Lataria_4_lbQ18 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 19  ? values.Lataria_4_lbQ19 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 20  ? values.Lataria_4_lbQ20 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 21  ? values.Lataria_4_lbQ21 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 22  ? values.Lataria_4_lbQ22 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 23  ? values.Lataria_4_lbQ23 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 24  ? values.Lataria_4_lbQ24 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 25  ? values.Lataria_4_lbQ25 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 26  ? values.Lataria_4_lbQ26 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 27  ? values.Lataria_4_lbQ27 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 28  ? values.Lataria_4_lbQ28 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 29  ? values.Lataria_4_lbQ29 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 30  ? values.Lataria_4_lbQ30 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 31  ? values.Lataria_4_lbQ31 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 32  ? values.Lataria_4_lbQ32 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 33  ? values.Lataria_4_lbQ33 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 34  ? values.Lataria_4_lbQ34 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 35  ? values.Lataria_4_lbQ35 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 36  ? values.Lataria_4_lbQ36 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 37  ? values.Lataria_4_lbQ37 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 38  ? values.Lataria_4_lbQ38 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 39  ? values.Lataria_4_lbQ39 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 40  ? values.Lataria_4_lbQ40 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 41  ? values.Lataria_4_lbQ41 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 42  ? values.Lataria_4_lbQ42 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 43  ? values.Lataria_4_lbQ43 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 44  ? values.Lataria_4_lbQ44 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 45  ? values.Lataria_4_lbQ45 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 46  ? values.Lataria_4_lbQ46 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 47  ? values.Lataria_4_lbQ47 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 48  ? values.Lataria_4_lbQ48 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 49  ? values.Lataria_4_lbQ49 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 50  ? values.Lataria_4_lbQ50 :

																									//Lataria 5
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 1 ? values.Lataria_5_lbQ1 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 2 ? values.Lataria_5_lbQ2 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 3 ? values.Lataria_5_lbQ3 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 4 ? values.Lataria_5_lbQ4 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 5 ? values.Lataria_5_lbQ5 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 6 ? values.Lataria_5_lbQ6 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 7 ? values.Lataria_5_lbQ7 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 8 ? values.Lataria_5_lbQ8 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 9 ? values.Lataria_5_lbQ9 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 10  ? values.Lataria_5_lbQ10 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 11  ? values.Lataria_5_lbQ11 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 12  ? values.Lataria_5_lbQ12 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 13  ? values.Lataria_5_lbQ13 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 14  ? values.Lataria_5_lbQ14 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 15  ? values.Lataria_5_lbQ15 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 16  ? values.Lataria_5_lbQ16 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 17  ? values.Lataria_5_lbQ17 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 18  ? values.Lataria_5_lbQ18 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 19  ? values.Lataria_5_lbQ19 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 20  ? values.Lataria_5_lbQ20 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 21  ? values.Lataria_5_lbQ21 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 22  ? values.Lataria_5_lbQ22 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 23  ? values.Lataria_5_lbQ23 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 24  ? values.Lataria_5_lbQ24 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 25  ? values.Lataria_5_lbQ25 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 26  ? values.Lataria_5_lbQ26 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 27  ? values.Lataria_5_lbQ27 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 28  ? values.Lataria_5_lbQ28 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 29  ? values.Lataria_5_lbQ29 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 30  ? values.Lataria_5_lbQ30 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 31  ? values.Lataria_5_lbQ31 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 32  ? values.Lataria_5_lbQ32 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 33  ? values.Lataria_5_lbQ33 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 34  ? values.Lataria_5_lbQ34 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 35  ? values.Lataria_5_lbQ35 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 36  ? values.Lataria_5_lbQ36 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 37  ? values.Lataria_5_lbQ37 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 38  ? values.Lataria_5_lbQ38 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 39  ? values.Lataria_5_lbQ39 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 40  ? values.Lataria_5_lbQ40 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 41  ? values.Lataria_5_lbQ41 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 42  ? values.Lataria_5_lbQ42 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 43  ? values.Lataria_5_lbQ43 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 44  ? values.Lataria_5_lbQ44 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 45  ? values.Lataria_5_lbQ45 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 46  ? values.Lataria_5_lbQ46 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 47  ? values.Lataria_5_lbQ47 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 48  ? values.Lataria_5_lbQ48 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 49  ? values.Lataria_5_lbQ49 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 50  ? values.Lataria_5_lbQ50 :

																									false
																								}
																								style={{ height: 50, margin:5, width: '100%'}}
																								onValueChange={(itemValue, itemIndex) => setFieldValue('Lataria_'+listbox.COD_OPCAO+'_lbQ'+quesito.COD_ITEM, itemValue )}
																						>
																							<Picker.Item 
																								label={'Selecione um item'} 
																								value={0} 
																							/>
																						{
																							quesito.componentes.listbox.OPCOES.map((listbox, i) => {
																								return (
																									<Picker.Item 
																										key={listbox.DES_OPCAO}
																										label={listbox.DES_OPCAO} 
																										value={listbox.COD_OPCAO} 
																									/>
																								);
																							})
																						}
																						</Picker>
																					)
																				}
																				{
																					//RADIO BUTTON Lataria
																					quesito.IND_RADIO == true && quesito.IND_ATIVO == true &&
																					(
																						quesito.componentes.radio.OPCOES.map((radio, i) => {
																							return (
																								<ListItem 
																									key={radio.DES_OPCAO}
																									onPress={ () => setFieldValue('Lataria_'+listbox.COD_OPCAO+'_rbQ'+quesito.COD_ITEM, radio.COD_OPCAO) }
																									>
																									<Radio
																										onPress={ () => setFieldValue('Lataria_'+listbox.COD_OPCAO+'_rbQ'+quesito.COD_ITEM, radio.COD_OPCAO) }
																										color={"#f0ad4e"}
																										selectedColor={"#5cb85c"}
																										selected={ 
																											
																											//Lataria 1
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 1 ? values.Lataria_1_rbQ1 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 2 ? values.Lataria_1_rbQ2 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 3 ? values.Lataria_1_rbQ3 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 4 ? values.Lataria_1_rbQ4 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 5 ? values.Lataria_1_rbQ5 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 6 ? values.Lataria_1_rbQ6 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 7 ? values.Lataria_1_rbQ7 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 8 ? values.Lataria_1_rbQ8 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 9 ? values.Lataria_1_rbQ9 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 10  ? values.Lataria_1_rbQ10 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 11  ? values.Lataria_1_rbQ11 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 12  ? values.Lataria_1_rbQ12 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 13  ? values.Lataria_1_rbQ13 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 14  ? values.Lataria_1_rbQ14 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 15  ? values.Lataria_1_rbQ15 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 16  ? values.Lataria_1_rbQ16 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 17  ? values.Lataria_1_rbQ17 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 18  ? values.Lataria_1_rbQ18 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 19  ? values.Lataria_1_rbQ19 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 20  ? values.Lataria_1_rbQ20 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 21  ? values.Lataria_1_rbQ21 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 22  ? values.Lataria_1_rbQ22 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 23  ? values.Lataria_1_rbQ23 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 24  ? values.Lataria_1_rbQ24 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 25  ? values.Lataria_1_rbQ25 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 26  ? values.Lataria_1_rbQ26 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 27  ? values.Lataria_1_rbQ27 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 28  ? values.Lataria_1_rbQ28 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 29  ? values.Lataria_1_rbQ29 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 30  ? values.Lataria_1_rbQ30 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 31  ? values.Lataria_1_rbQ31 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 32  ? values.Lataria_1_rbQ32 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 33  ? values.Lataria_1_rbQ33 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 34  ? values.Lataria_1_rbQ34 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 35  ? values.Lataria_1_rbQ35 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 36  ? values.Lataria_1_rbQ36 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 37  ? values.Lataria_1_rbQ37 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 38  ? values.Lataria_1_rbQ38 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 39  ? values.Lataria_1_rbQ39 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 40  ? values.Lataria_1_rbQ40 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 41  ? values.Lataria_1_rbQ41 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 42  ? values.Lataria_1_rbQ42 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 43  ? values.Lataria_1_rbQ43 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 44  ? values.Lataria_1_rbQ44 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 45  ? values.Lataria_1_rbQ45 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 46  ? values.Lataria_1_rbQ46 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 47  ? values.Lataria_1_rbQ47 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 48  ? values.Lataria_1_rbQ48 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 49  ? values.Lataria_1_rbQ49 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 50  ? values.Lataria_1_rbQ50 == radio.COD_OPCAO ? true : false :

																											//Lataria 2
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 1 ? values.Lataria_2_rbQ1 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 2 ? values.Lataria_2_rbQ2 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 3 ? values.Lataria_2_rbQ3 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 4 ? values.Lataria_2_rbQ4 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 5 ? values.Lataria_2_rbQ5 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 6 ? values.Lataria_2_rbQ6 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 7 ? values.Lataria_2_rbQ7 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 8 ? values.Lataria_2_rbQ8 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 9 ? values.Lataria_2_rbQ9 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 10  ? values.Lataria_2_rbQ10 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 11  ? values.Lataria_2_rbQ11 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 12  ? values.Lataria_2_rbQ12 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 13  ? values.Lataria_2_rbQ13 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 14  ? values.Lataria_2_rbQ14 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 15  ? values.Lataria_2_rbQ15 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 16  ? values.Lataria_2_rbQ16 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 17  ? values.Lataria_2_rbQ17 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 18  ? values.Lataria_2_rbQ18 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 19  ? values.Lataria_2_rbQ19 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 20  ? values.Lataria_2_rbQ20 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 21  ? values.Lataria_2_rbQ21 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 22  ? values.Lataria_2_rbQ22 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 23  ? values.Lataria_2_rbQ23 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 24  ? values.Lataria_2_rbQ24 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 25  ? values.Lataria_2_rbQ25 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 26  ? values.Lataria_2_rbQ26 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 27  ? values.Lataria_2_rbQ27 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 28  ? values.Lataria_2_rbQ28 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 29  ? values.Lataria_2_rbQ29 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 30  ? values.Lataria_2_rbQ30 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 31  ? values.Lataria_2_rbQ31 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 32  ? values.Lataria_2_rbQ32 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 33  ? values.Lataria_2_rbQ33 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 34  ? values.Lataria_2_rbQ34 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 35  ? values.Lataria_2_rbQ35 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 36  ? values.Lataria_2_rbQ36 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 37  ? values.Lataria_2_rbQ37 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 38  ? values.Lataria_2_rbQ38 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 39  ? values.Lataria_2_rbQ39 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 40  ? values.Lataria_2_rbQ40 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 41  ? values.Lataria_2_rbQ41 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 42  ? values.Lataria_2_rbQ42 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 43  ? values.Lataria_2_rbQ43 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 44  ? values.Lataria_2_rbQ44 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 45  ? values.Lataria_2_rbQ45 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 46  ? values.Lataria_2_rbQ46 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 47  ? values.Lataria_2_rbQ47 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 48  ? values.Lataria_2_rbQ48 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 49  ? values.Lataria_2_rbQ49 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 50  ? values.Lataria_2_rbQ50 == radio.COD_OPCAO ? true : false :

																											//Lataria 3
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 1 ? values.Lataria_3_rbQ1 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 2 ? values.Lataria_3_rbQ2 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 3 ? values.Lataria_3_rbQ3 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 4 ? values.Lataria_3_rbQ4 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 5 ? values.Lataria_3_rbQ5 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 6 ? values.Lataria_3_rbQ6 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 7 ? values.Lataria_3_rbQ7 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 8 ? values.Lataria_3_rbQ8 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 9 ? values.Lataria_3_rbQ9 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 10  ? values.Lataria_3_rbQ10 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 11  ? values.Lataria_3_rbQ11 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 12  ? values.Lataria_3_rbQ12 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 13  ? values.Lataria_3_rbQ13 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 14  ? values.Lataria_3_rbQ14 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 15  ? values.Lataria_3_rbQ15 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 16  ? values.Lataria_3_rbQ16 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 17  ? values.Lataria_3_rbQ17 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 18  ? values.Lataria_3_rbQ18 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 19  ? values.Lataria_3_rbQ19 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 20  ? values.Lataria_3_rbQ20 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 21  ? values.Lataria_3_rbQ21 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 22  ? values.Lataria_3_rbQ22 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 23  ? values.Lataria_3_rbQ23 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 24  ? values.Lataria_3_rbQ24 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 25  ? values.Lataria_3_rbQ25 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 26  ? values.Lataria_3_rbQ26 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 27  ? values.Lataria_3_rbQ27 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 28  ? values.Lataria_3_rbQ28 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 29  ? values.Lataria_3_rbQ29 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 30  ? values.Lataria_3_rbQ30 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 31  ? values.Lataria_3_rbQ31 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 32  ? values.Lataria_3_rbQ32 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 33  ? values.Lataria_3_rbQ33 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 34  ? values.Lataria_3_rbQ34 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 35  ? values.Lataria_3_rbQ35 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 36  ? values.Lataria_3_rbQ36 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 37  ? values.Lataria_3_rbQ37 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 38  ? values.Lataria_3_rbQ38 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 39  ? values.Lataria_3_rbQ39 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 40  ? values.Lataria_3_rbQ40 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 41  ? values.Lataria_3_rbQ41 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 42  ? values.Lataria_3_rbQ42 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 43  ? values.Lataria_3_rbQ43 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 44  ? values.Lataria_3_rbQ44 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 45  ? values.Lataria_3_rbQ45 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 46  ? values.Lataria_3_rbQ46 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 47  ? values.Lataria_3_rbQ47 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 48  ? values.Lataria_3_rbQ48 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 49  ? values.Lataria_3_rbQ49 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 50  ? values.Lataria_3_rbQ50 == radio.COD_OPCAO ? true : false :

																											//Lataria 4
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 1 ? values.Lataria_4_rbQ1 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 2 ? values.Lataria_4_rbQ2 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 3 ? values.Lataria_4_rbQ3 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 4 ? values.Lataria_4_rbQ4 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 5 ? values.Lataria_4_rbQ5 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 6 ? values.Lataria_4_rbQ6 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 7 ? values.Lataria_4_rbQ7 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 8 ? values.Lataria_4_rbQ8 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 9 ? values.Lataria_4_rbQ9 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 10  ? values.Lataria_4_rbQ10 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 11  ? values.Lataria_4_rbQ11 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 12  ? values.Lataria_4_rbQ12 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 13  ? values.Lataria_4_rbQ13 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 14  ? values.Lataria_4_rbQ14 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 15  ? values.Lataria_4_rbQ15 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 16  ? values.Lataria_4_rbQ16 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 17  ? values.Lataria_4_rbQ17 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 18  ? values.Lataria_4_rbQ18 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 19  ? values.Lataria_4_rbQ19 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 20  ? values.Lataria_4_rbQ20 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 21  ? values.Lataria_4_rbQ21 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 22  ? values.Lataria_4_rbQ22 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 23  ? values.Lataria_4_rbQ24 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 24  ? values.Lataria_4_rbQ24 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 25  ? values.Lataria_4_rbQ25 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 26  ? values.Lataria_4_rbQ26 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 27  ? values.Lataria_4_rbQ27 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 28  ? values.Lataria_4_rbQ28 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 29  ? values.Lataria_4_rbQ29 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 30  ? values.Lataria_4_rbQ30 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 31  ? values.Lataria_4_rbQ31 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 32  ? values.Lataria_4_rbQ32 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 33  ? values.Lataria_4_rbQ33 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 34  ? values.Lataria_4_rbQ34 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 35  ? values.Lataria_4_rbQ35 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 36  ? values.Lataria_4_rbQ36 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 37  ? values.Lataria_4_rbQ37 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 38  ? values.Lataria_4_rbQ38 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 39  ? values.Lataria_4_rbQ39 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 40  ? values.Lataria_4_rbQ40 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 41  ? values.Lataria_4_rbQ41 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 42  ? values.Lataria_4_rbQ42 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 43  ? values.Lataria_4_rbQ43 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 44  ? values.Lataria_4_rbQ44 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 45  ? values.Lataria_4_rbQ45 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 46  ? values.Lataria_4_rbQ46 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 47  ? values.Lataria_4_rbQ47 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 48  ? values.Lataria_4_rbQ48 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 49  ? values.Lataria_4_rbQ49 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 50  ? values.Lataria_4_rbQ50 == radio.COD_OPCAO ? true : false :

																											//Lataria 5
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 1 ? values.Lataria_5_rbQ1 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 2 ? values.Lataria_5_rbQ2 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 3 ? values.Lataria_5_rbQ3 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 4 ? values.Lataria_5_rbQ4 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 5 ? values.Lataria_5_rbQ5 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 6 ? values.Lataria_5_rbQ6 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 7 ? values.Lataria_5_rbQ7 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 8 ? values.Lataria_5_rbQ8 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 9 ? values.Lataria_5_rbQ9 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 10  ? values.Lataria_5_rbQ10 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 11  ? values.Lataria_5_rbQ11 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 12  ? values.Lataria_5_rbQ12 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 13  ? values.Lataria_5_rbQ13 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 14  ? values.Lataria_5_rbQ14 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 15  ? values.Lataria_5_rbQ15 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 16  ? values.Lataria_5_rbQ16 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 17  ? values.Lataria_5_rbQ17 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 18  ? values.Lataria_5_rbQ18 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 19  ? values.Lataria_5_rbQ19 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 20  ? values.Lataria_5_rbQ20 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 21  ? values.Lataria_5_rbQ21 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 22  ? values.Lataria_5_rbQ22 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 23  ? values.Lataria_5_rbQ23 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 24  ? values.Lataria_5_rbQ24 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 25  ? values.Lataria_5_rbQ25 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 26  ? values.Lataria_5_rbQ26 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 27  ? values.Lataria_5_rbQ27 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 28  ? values.Lataria_5_rbQ28 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 29  ? values.Lataria_5_rbQ29 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 30  ? values.Lataria_5_rbQ30 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 31  ? values.Lataria_5_rbQ31 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 32  ? values.Lataria_5_rbQ32 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 33  ? values.Lataria_5_rbQ33 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 34  ? values.Lataria_5_rbQ34 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 35  ? values.Lataria_5_rbQ35 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 36  ? values.Lataria_5_rbQ36 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 37  ? values.Lataria_5_rbQ37 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 38  ? values.Lataria_5_rbQ38 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 39  ? values.Lataria_5_rbQ39 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 40  ? values.Lataria_5_rbQ40 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 41  ? values.Lataria_5_rbQ41 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 42  ? values.Lataria_5_rbQ42 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 43  ? values.Lataria_5_rbQ43 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 44  ? values.Lataria_5_rbQ44 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 45  ? values.Lataria_5_rbQ45 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 46  ? values.Lataria_5_rbQ46 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 47  ? values.Lataria_5_rbQ47 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 48  ? values.Lataria_5_rbQ48 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 49  ? values.Lataria_5_rbQ49 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 50  ? values.Lataria_5_rbQ50 == radio.COD_OPCAO ? true : false :

																											false
																										}
																									/>
																									<Text>{radio.DES_OPCAO}</Text>
																								</ListItem>
																							);
																						})
																					)
																				}
																				{
																					//CHECKBOX
																					quesito.IND_CHECKBOX == true && quesito.IND_ATIVO == true && 
																					(
																						<ListItem>
																							<Switch
																								trackColor={{ false: "#C4C4C4", true: "#C5DB5F" }}
																								thumbColor={ "#fff"}
																								ios_backgroundColor="#fff"
																								onValueChange={ (previousState) => setFieldValue('Lataria_'+listbox.COD_OPCAO+'_cbQ'+quesito.COD_ITEM, previousState ) }
																								value={
																									//Lataria 1
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 1 ? values.Lataria_1_cbQ1 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 2 ? values.Lataria_1_cbQ2 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 3 ? values.Lataria_1_cbQ3 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 4 ? values.Lataria_1_cbQ4 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 5 ? values.Lataria_1_cbQ5 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 6 ? values.Lataria_1_cbQ6 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 7 ? values.Lataria_1_cbQ7 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 8 ? values.Lataria_1_cbQ8 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 9 ? values.Lataria_1_cbQ9 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 10  ? values.Lataria_1_cbQ10 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 11  ? values.Lataria_1_cbQ11 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 12  ? values.Lataria_1_cbQ12 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 13  ? values.Lataria_1_cbQ13 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 14  ? values.Lataria_1_cbQ14 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 15  ? values.Lataria_1_cbQ15 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 16  ? values.Lataria_1_cbQ16 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 17  ? values.Lataria_1_cbQ17 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 18  ? values.Lataria_1_cbQ18 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 19  ? values.Lataria_1_cbQ19 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 20  ? values.Lataria_1_cbQ20 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 21  ? values.Lataria_1_cbQ21 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 22  ? values.Lataria_1_cbQ22 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 23  ? values.Lataria_1_cbQ23 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 24  ? values.Lataria_1_cbQ24 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 25  ? values.Lataria_1_cbQ25 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 26  ? values.Lataria_1_cbQ26 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 27  ? values.Lataria_1_cbQ27 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 28  ? values.Lataria_1_cbQ28 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 29  ? values.Lataria_1_cbQ29 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 30  ? values.Lataria_1_cbQ30 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 31  ? values.Lataria_1_cbQ31 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 32  ? values.Lataria_1_cbQ32 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 33  ? values.Lataria_1_cbQ33 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 34  ? values.Lataria_1_cbQ34 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 35  ? values.Lataria_1_cbQ35 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 36  ? values.Lataria_1_cbQ36 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 37  ? values.Lataria_1_cbQ37 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 38  ? values.Lataria_1_cbQ38 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 39  ? values.Lataria_1_cbQ39 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 40  ? values.Lataria_1_cbQ40 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 41  ? values.Lataria_1_cbQ41 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 42  ? values.Lataria_1_cbQ42 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 43  ? values.Lataria_1_cbQ43 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 44  ? values.Lataria_1_cbQ44 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 45  ? values.Lataria_1_cbQ45 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 46  ? values.Lataria_1_cbQ46 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 47  ? values.Lataria_1_cbQ47 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 48  ? values.Lataria_1_cbQ48 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 49  ? values.Lataria_1_cbQ49 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 50  ? values.Lataria_1_cbQ50 :

																									//Lataria 2
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 1 ? values.Lataria_2_cbQ1 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 2 ? values.Lataria_2_cbQ2 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 3 ? values.Lataria_2_cbQ3 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 4 ? values.Lataria_2_cbQ4 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 5 ? values.Lataria_2_cbQ5 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 6 ? values.Lataria_2_cbQ6 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 7 ? values.Lataria_2_cbQ7 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 8 ? values.Lataria_2_cbQ8 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 9 ? values.Lataria_2_cbQ9 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 10  ? values.Lataria_2_cbQ10 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 11  ? values.Lataria_2_cbQ11 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 12  ? values.Lataria_2_cbQ12 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 13  ? values.Lataria_2_cbQ13 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 14  ? values.Lataria_2_cbQ14 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 15  ? values.Lataria_2_cbQ15 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 16  ? values.Lataria_2_cbQ16 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 17  ? values.Lataria_2_cbQ17 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 18  ? values.Lataria_2_cbQ18 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 19  ? values.Lataria_2_cbQ19 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 20  ? values.Lataria_2_cbQ20 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 21  ? values.Lataria_2_cbQ21 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 22  ? values.Lataria_2_cbQ22 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 23  ? values.Lataria_2_cbQ23 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 24  ? values.Lataria_2_cbQ24 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 25  ? values.Lataria_2_cbQ25 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 26  ? values.Lataria_2_cbQ26 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 27  ? values.Lataria_2_cbQ27 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 28  ? values.Lataria_2_cbQ28 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 29  ? values.Lataria_2_cbQ29 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 30  ? values.Lataria_2_cbQ30 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 31  ? values.Lataria_2_cbQ31 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 32  ? values.Lataria_2_cbQ32 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 33  ? values.Lataria_2_cbQ33 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 34  ? values.Lataria_2_cbQ34 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 35  ? values.Lataria_2_cbQ35 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 36  ? values.Lataria_2_cbQ36 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 37  ? values.Lataria_2_cbQ37 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 38  ? values.Lataria_2_cbQ38 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 39  ? values.Lataria_2_cbQ39 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 40  ? values.Lataria_2_cbQ40 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 41  ? values.Lataria_2_cbQ41 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 42  ? values.Lataria_2_cbQ42 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 43  ? values.Lataria_2_cbQ43 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 44  ? values.Lataria_2_cbQ44 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 45  ? values.Lataria_2_cbQ45 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 46  ? values.Lataria_2_cbQ46 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 47  ? values.Lataria_2_cbQ47 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 48  ? values.Lataria_2_cbQ48 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 49  ? values.Lataria_2_cbQ49 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 50  ? values.Lataria_2_cbQ50 :

																									//Lataria 3
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 1 ? values.Lataria_3_cbQ1 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 2 ? values.Lataria_3_cbQ2 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 3 ? values.Lataria_3_cbQ3 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 4 ? values.Lataria_3_cbQ4 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 5 ? values.Lataria_3_cbQ5 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 6 ? values.Lataria_3_cbQ6 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 7 ? values.Lataria_3_cbQ7 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 8 ? values.Lataria_3_cbQ8 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 9 ? values.Lataria_3_cbQ9 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 10  ? values.Lataria_3_cbQ10 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 11  ? values.Lataria_3_cbQ11 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 12  ? values.Lataria_3_cbQ12 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 13  ? values.Lataria_3_cbQ13 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 14  ? values.Lataria_3_cbQ14 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 15  ? values.Lataria_3_cbQ15 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 16  ? values.Lataria_3_cbQ16 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 17  ? values.Lataria_3_cbQ17 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 18  ? values.Lataria_3_cbQ18 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 19  ? values.Lataria_3_cbQ19 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 20  ? values.Lataria_3_cbQ20 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 21  ? values.Lataria_3_cbQ21 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 22  ? values.Lataria_3_cbQ22 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 23  ? values.Lataria_3_cbQ23 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 24  ? values.Lataria_3_cbQ24 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 25  ? values.Lataria_3_cbQ25 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 26  ? values.Lataria_3_cbQ26 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 27  ? values.Lataria_3_cbQ27 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 28  ? values.Lataria_3_cbQ28 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 29  ? values.Lataria_3_cbQ29 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 30  ? values.Lataria_3_cbQ30 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 31  ? values.Lataria_3_cbQ31 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 32  ? values.Lataria_3_cbQ32 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 33  ? values.Lataria_3_cbQ33 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 34  ? values.Lataria_3_cbQ34 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 35  ? values.Lataria_3_cbQ35 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 36  ? values.Lataria_3_cbQ36 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 37  ? values.Lataria_3_cbQ37 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 38  ? values.Lataria_3_cbQ38 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 39  ? values.Lataria_3_cbQ39 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 40  ? values.Lataria_3_cbQ40 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 41  ? values.Lataria_3_cbQ41 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 42  ? values.Lataria_3_cbQ42 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 43  ? values.Lataria_3_cbQ43 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 44  ? values.Lataria_3_cbQ44 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 45  ? values.Lataria_3_cbQ45 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 46  ? values.Lataria_3_cbQ46 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 47  ? values.Lataria_3_cbQ47 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 48  ? values.Lataria_3_cbQ48 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 49  ? values.Lataria_3_cbQ49 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 50  ? values.Lataria_3_cbQ50 :

																									//Lataria 4
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 1 ? values.Lataria_4_cbQ1 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 2 ? values.Lataria_4_cbQ2 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 3 ? values.Lataria_4_cbQ3 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 4 ? values.Lataria_4_cbQ4 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 5 ? values.Lataria_4_cbQ5 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 6 ? values.Lataria_4_cbQ6 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 7 ? values.Lataria_4_cbQ7 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 8 ? values.Lataria_4_cbQ8 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 9 ? values.Lataria_4_cbQ9 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 10  ? values.Lataria_4_cbQ10 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 11  ? values.Lataria_4_cbQ11 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 12  ? values.Lataria_4_cbQ12 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 13  ? values.Lataria_4_cbQ13 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 14  ? values.Lataria_4_cbQ14 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 15  ? values.Lataria_4_cbQ15 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 16  ? values.Lataria_4_cbQ16 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 17  ? values.Lataria_4_cbQ17 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 18  ? values.Lataria_4_cbQ18 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 19  ? values.Lataria_4_cbQ19 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 20  ? values.Lataria_4_cbQ20 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 21  ? values.Lataria_4_cbQ21 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 22  ? values.Lataria_4_cbQ22 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 23  ? values.Lataria_4_cbQ23 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 24  ? values.Lataria_4_cbQ24 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 25  ? values.Lataria_4_cbQ25 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 26  ? values.Lataria_4_cbQ26 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 27  ? values.Lataria_4_cbQ27 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 28  ? values.Lataria_4_cbQ28 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 29  ? values.Lataria_4_cbQ29 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 30  ? values.Lataria_4_cbQ30 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 31  ? values.Lataria_4_cbQ31 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 32  ? values.Lataria_4_cbQ32 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 33  ? values.Lataria_4_cbQ33 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 34  ? values.Lataria_4_cbQ34 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 35  ? values.Lataria_4_cbQ35 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 36  ? values.Lataria_4_cbQ36 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 37  ? values.Lataria_4_cbQ37 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 38  ? values.Lataria_4_cbQ38 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 39  ? values.Lataria_4_cbQ39 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 40  ? values.Lataria_4_cbQ40 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 41  ? values.Lataria_4_cbQ41 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 42  ? values.Lataria_4_cbQ42 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 43  ? values.Lataria_4_cbQ43 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 44  ? values.Lataria_4_cbQ44 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 45  ? values.Lataria_4_cbQ45 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 46  ? values.Lataria_4_cbQ46 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 47  ? values.Lataria_4_cbQ47 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 48  ? values.Lataria_4_cbQ48 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 49  ? values.Lataria_4_cbQ49 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 50  ? values.Lataria_4_cbQ50 :

																									//Lataria 5
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 1 ? values.Lataria_5_cbQ1 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 2 ? values.Lataria_5_cbQ2 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 3 ? values.Lataria_5_cbQ3 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 4 ? values.Lataria_5_cbQ4 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 5 ? values.Lataria_5_cbQ5 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 6 ? values.Lataria_5_cbQ6 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 7 ? values.Lataria_5_cbQ7 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 8 ? values.Lataria_5_cbQ8 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 9 ? values.Lataria_5_cbQ9 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 10  ? values.Lataria_5_cbQ10 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 11  ? values.Lataria_5_cbQ11 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 12  ? values.Lataria_5_cbQ12 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 13  ? values.Lataria_5_cbQ13 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 14  ? values.Lataria_5_cbQ14 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 15  ? values.Lataria_5_cbQ15 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 16  ? values.Lataria_5_cbQ16 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 17  ? values.Lataria_5_cbQ17 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 18  ? values.Lataria_5_cbQ18 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 19  ? values.Lataria_5_cbQ19 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 20  ? values.Lataria_5_cbQ20 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 21  ? values.Lataria_5_cbQ21 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 22  ? values.Lataria_5_cbQ22 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 23  ? values.Lataria_5_cbQ23 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 24  ? values.Lataria_5_cbQ24 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 25  ? values.Lataria_5_cbQ25 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 26  ? values.Lataria_5_cbQ26 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 27  ? values.Lataria_5_cbQ27 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 28  ? values.Lataria_5_cbQ28 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 29  ? values.Lataria_5_cbQ29 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 30  ? values.Lataria_5_cbQ30 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 31  ? values.Lataria_5_cbQ31 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 32  ? values.Lataria_5_cbQ32 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 33  ? values.Lataria_5_cbQ33 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 34  ? values.Lataria_5_cbQ34 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 35  ? values.Lataria_5_cbQ35 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 36  ? values.Lataria_5_cbQ36 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 37  ? values.Lataria_5_cbQ37 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 38  ? values.Lataria_5_cbQ38 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 39  ? values.Lataria_5_cbQ39 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 40  ? values.Lataria_5_cbQ50 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 41  ? values.Lataria_5_cbQ51 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 42  ? values.Lataria_5_cbQ42 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 43  ? values.Lataria_5_cbQ43 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 44  ? values.Lataria_5_cbQ44 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 45  ? values.Lataria_5_cbQ45 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 46  ? values.Lataria_5_cbQ46 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 47  ? values.Lataria_5_cbQ47 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 48  ? values.Lataria_5_cbQ48 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 49  ? values.Lataria_5_cbQ49 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 50  ? values.Lataria_5_cbQ50 :

																									false
																								}
																							/>
																						</ListItem>	
																					)
																				}
																				{
																					//INPUT INTEIRO Lataria
																					quesito.IND_INTEIRO == true && quesito.IND_ATIVO == true && 
																					(	
																						<>
																						<Input 
																							onChangeText={handleChange('Lataria_'+listbox.COD_OPCAO+'_inputInteiroQ'+quesito.COD_ITEM)}
																							onBlur={handleBlur('Lataria_'+listbox.COD_OPCAO+'_inputInteiroQ'+quesito.COD_ITEM)}
																							placeholder='Valor'
																							value={
																								//Lataria 1
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 1 ? values.Lataria_1_inputInteiroQ1 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 2 ? values.Lataria_1_inputInteiroQ2 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 3 ? values.Lataria_1_inputInteiroQ3 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 4 ? values.Lataria_1_inputInteiroQ4 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 5 ? values.Lataria_1_inputInteiroQ5 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 6 ? values.Lataria_1_inputInteiroQ6 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 7 ? values.Lataria_1_inputInteiroQ7 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 8 ? values.Lataria_1_inputInteiroQ8 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 9 ? values.Lataria_1_inputInteiroQ9 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 10  ? values.Lataria_1_inputInteiroQ10 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 11  ? values.Lataria_1_inputInteiroQ11 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 12  ? values.Lataria_1_inputInteiroQ12 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 13  ? values.Lataria_1_inputInteiroQ13 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 14  ? values.Lataria_1_inputInteiroQ14 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 15  ? values.Lataria_1_inputInteiroQ15 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 16  ? values.Lataria_1_inputInteiroQ16 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 17  ? values.Lataria_1_inputInteiroQ17 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 18  ? values.Lataria_1_inputInteiroQ18 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 19  ? values.Lataria_1_inputInteiroQ19 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 20  ? values.Lataria_1_inputInteiroQ20 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 21  ? values.Lataria_1_inputInteiroQ21 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 22  ? values.Lataria_1_inputInteiroQ22 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 23  ? values.Lataria_1_inputInteiroQ23 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 24  ? values.Lataria_1_inputInteiroQ24 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 25  ? values.Lataria_1_inputInteiroQ25 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 26  ? values.Lataria_1_inputInteiroQ26 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 27  ? values.Lataria_1_inputInteiroQ27 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 28  ? values.Lataria_1_inputInteiroQ28 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 29  ? values.Lataria_1_inputInteiroQ29 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 30  ? values.Lataria_1_inputInteiroQ30 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 31  ? values.Lataria_1_inputInteiroQ31 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 32  ? values.Lataria_1_inputInteiroQ32 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 33  ? values.Lataria_1_inputInteiroQ33 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 34  ? values.Lataria_1_inputInteiroQ34 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 35  ? values.Lataria_1_inputInteiroQ35 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 36  ? values.Lataria_1_inputInteiroQ36 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 37  ? values.Lataria_1_inputInteiroQ37 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 38  ? values.Lataria_1_inputInteiroQ38 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 39  ? values.Lataria_1_inputInteiroQ39 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 40  ? values.Lataria_1_inputInteiroQ40 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 41  ? values.Lataria_1_inputInteiroQ41 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 42  ? values.Lataria_1_inputInteiroQ42 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 43  ? values.Lataria_1_inputInteiroQ43 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 44  ? values.Lataria_1_inputInteiroQ44 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 45  ? values.Lataria_1_inputInteiroQ45 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 46  ? values.Lataria_1_inputInteiroQ46 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 47  ? values.Lataria_1_inputInteiroQ47 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 48  ? values.Lataria_1_inputInteiroQ48 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 49  ? values.Lataria_1_inputInteiroQ49 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 50  ? values.Lataria_1_inputInteiroQ50 :

																								//Lataria 2
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 1 ? values.Lataria_2_inputInteiroQ1 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 2 ? values.Lataria_2_inputInteiroQ2 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 3 ? values.Lataria_2_inputInteiroQ3 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 4 ? values.Lataria_2_inputInteiroQ4 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 5 ? values.Lataria_2_inputInteiroQ5 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 6 ? values.Lataria_2_inputInteiroQ6 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 7 ? values.Lataria_2_inputInteiroQ7 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 8 ? values.Lataria_2_inputInteiroQ8 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 9 ? values.Lataria_2_inputInteiroQ9 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 10  ? values.Lataria_2_inputInteiroQ10 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 11  ? values.Lataria_2_inputInteiroQ11 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 12  ? values.Lataria_2_inputInteiroQ12 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 13  ? values.Lataria_2_inputInteiroQ13 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 14  ? values.Lataria_2_inputInteiroQ14 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 15  ? values.Lataria_2_inputInteiroQ15 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 16  ? values.Lataria_2_inputInteiroQ16 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 17  ? values.Lataria_2_inputInteiroQ17 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 18  ? values.Lataria_2_inputInteiroQ18 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 19  ? values.Lataria_2_inputInteiroQ19 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 20  ? values.Lataria_2_inputInteiroQ20 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 21  ? values.Lataria_2_inputInteiroQ21 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 22  ? values.Lataria_2_inputInteiroQ22 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 23  ? values.Lataria_2_inputInteiroQ23 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 24  ? values.Lataria_2_inputInteiroQ24 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 25  ? values.Lataria_2_inputInteiroQ25 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 26  ? values.Lataria_2_inputInteiroQ26 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 27  ? values.Lataria_2_inputInteiroQ27 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 28  ? values.Lataria_2_inputInteiroQ28 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 29  ? values.Lataria_2_inputInteiroQ29 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 30  ? values.Lataria_2_inputInteiroQ30 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 31  ? values.Lataria_2_inputInteiroQ31 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 32  ? values.Lataria_2_inputInteiroQ32 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 33  ? values.Lataria_2_inputInteiroQ33 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 34  ? values.Lataria_2_inputInteiroQ34 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 35  ? values.Lataria_2_inputInteiroQ35 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 36  ? values.Lataria_2_inputInteiroQ36 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 37  ? values.Lataria_2_inputInteiroQ37 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 38  ? values.Lataria_2_inputInteiroQ38 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 39  ? values.Lataria_2_inputInteiroQ39 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 40  ? values.Lataria_2_inputInteiroQ40 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 41  ? values.Lataria_2_inputInteiroQ41 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 42  ? values.Lataria_2_inputInteiroQ42 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 43  ? values.Lataria_2_inputInteiroQ43 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 44  ? values.Lataria_2_inputInteiroQ44 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 45  ? values.Lataria_2_inputInteiroQ45 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 46  ? values.Lataria_2_inputInteiroQ46 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 47  ? values.Lataria_2_inputInteiroQ47 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 48  ? values.Lataria_2_inputInteiroQ48 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 49  ? values.Lataria_2_inputInteiroQ49 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 50  ? values.Lataria_2_inputInteiroQ50 :

																								//Lataria 3
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 1 ? values.Lataria_3_inputInteiroQ1 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 2 ? values.Lataria_3_inputInteiroQ2 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 3 ? values.Lataria_3_inputInteiroQ3 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 4 ? values.Lataria_3_inputInteiroQ4 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 5 ? values.Lataria_3_inputInteiroQ5 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 6 ? values.Lataria_3_inputInteiroQ6 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 7 ? values.Lataria_3_inputInteiroQ7 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 8 ? values.Lataria_3_inputInteiroQ8 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 9 ? values.Lataria_3_inputInteiroQ9 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 10  ? values.Lataria_3_inputInteiroQ10 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 11  ? values.Lataria_3_inputInteiroQ11 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 12  ? values.Lataria_3_inputInteiroQ12 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 13  ? values.Lataria_3_inputInteiroQ13 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 14  ? values.Lataria_3_inputInteiroQ14 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 15  ? values.Lataria_3_inputInteiroQ15 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 16  ? values.Lataria_3_inputInteiroQ16 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 17  ? values.Lataria_3_inputInteiroQ17 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 18  ? values.Lataria_3_inputInteiroQ18 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 19  ? values.Lataria_3_inputInteiroQ19 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 20  ? values.Lataria_3_inputInteiroQ20 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 21  ? values.Lataria_3_inputInteiroQ21 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 22  ? values.Lataria_3_inputInteiroQ22 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 23  ? values.Lataria_3_inputInteiroQ23 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 24  ? values.Lataria_3_inputInteiroQ24 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 25  ? values.Lataria_3_inputInteiroQ25 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 26  ? values.Lataria_3_inputInteiroQ26 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 27  ? values.Lataria_3_inputInteiroQ27 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 28  ? values.Lataria_3_inputInteiroQ28 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 29  ? values.Lataria_3_inputInteiroQ29 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 30  ? values.Lataria_3_inputInteiroQ30 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 31  ? values.Lataria_3_inputInteiroQ31 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 32  ? values.Lataria_3_inputInteiroQ32 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 33  ? values.Lataria_3_inputInteiroQ33 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 34  ? values.Lataria_3_inputInteiroQ34 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 35  ? values.Lataria_3_inputInteiroQ35 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 36  ? values.Lataria_3_inputInteiroQ36 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 37  ? values.Lataria_3_inputInteiroQ37 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 38  ? values.Lataria_3_inputInteiroQ38 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 39  ? values.Lataria_3_inputInteiroQ39 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 40  ? values.Lataria_3_inputInteiroQ40 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 41  ? values.Lataria_3_inputInteiroQ41 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 42  ? values.Lataria_3_inputInteiroQ42 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 43  ? values.Lataria_3_inputInteiroQ43 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 44  ? values.Lataria_3_inputInteiroQ44 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 45  ? values.Lataria_3_inputInteiroQ45 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 46  ? values.Lataria_3_inputInteiroQ46 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 47  ? values.Lataria_3_inputInteiroQ47 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 48  ? values.Lataria_3_inputInteiroQ48 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 49  ? values.Lataria_3_inputInteiroQ49 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 50  ? values.Lataria_3_inputInteiroQ50 :

																								//Lataria 4
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 1 ? values.Lataria_4_inputInteiroQ1 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 2 ? values.Lataria_4_inputInteiroQ2 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 3 ? values.Lataria_4_inputInteiroQ3 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 4 ? values.Lataria_4_inputInteiroQ4 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 5 ? values.Lataria_4_inputInteiroQ5 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 6 ? values.Lataria_4_inputInteiroQ6 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 7 ? values.Lataria_4_inputInteiroQ7 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 8 ? values.Lataria_4_inputInteiroQ8 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 9 ? values.Lataria_4_inputInteiroQ9 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 10  ? values.Lataria_4_inputInteiroQ10 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 11  ? values.Lataria_4_inputInteiroQ11 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 12  ? values.Lataria_4_inputInteiroQ12 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 14  ? values.Lataria_4_inputInteiroQ14 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 14  ? values.Lataria_4_inputInteiroQ14 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 15  ? values.Lataria_4_inputInteiroQ15 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 16  ? values.Lataria_4_inputInteiroQ16 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 17  ? values.Lataria_4_inputInteiroQ17 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 18  ? values.Lataria_4_inputInteiroQ18 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 19  ? values.Lataria_4_inputInteiroQ19 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 20  ? values.Lataria_4_inputInteiroQ20 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 21  ? values.Lataria_4_inputInteiroQ21 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 22  ? values.Lataria_4_inputInteiroQ22 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 23  ? values.Lataria_4_inputInteiroQ24 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 24  ? values.Lataria_4_inputInteiroQ24 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 25  ? values.Lataria_4_inputInteiroQ25 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 26  ? values.Lataria_4_inputInteiroQ26 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 27  ? values.Lataria_4_inputInteiroQ27 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 28  ? values.Lataria_4_inputInteiroQ28 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 29  ? values.Lataria_4_inputInteiroQ29 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 30  ? values.Lataria_4_inputInteiroQ30 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 31  ? values.Lataria_4_inputInteiroQ31 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 32  ? values.Lataria_4_inputInteiroQ32 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 33  ? values.Lataria_4_inputInteiroQ33 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 34  ? values.Lataria_4_inputInteiroQ34 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 35  ? values.Lataria_4_inputInteiroQ35 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 36  ? values.Lataria_4_inputInteiroQ36 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 37  ? values.Lataria_4_inputInteiroQ37 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 38  ? values.Lataria_4_inputInteiroQ38 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 39  ? values.Lataria_4_inputInteiroQ39 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 40  ? values.Lataria_4_inputInteiroQ40 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 41  ? values.Lataria_4_inputInteiroQ41 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 42  ? values.Lataria_4_inputInteiroQ42 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 43  ? values.Lataria_4_inputInteiroQ43 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 44  ? values.Lataria_4_inputInteiroQ44 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 45  ? values.Lataria_4_inputInteiroQ45 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 46  ? values.Lataria_4_inputInteiroQ46 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 47  ? values.Lataria_4_inputInteiroQ47 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 48  ? values.Lataria_4_inputInteiroQ48 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 49  ? values.Lataria_4_inputInteiroQ49 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 50  ? values.Lataria_4_inputInteiroQ50 :

																								//Lataria 5
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 1 ? values.Lataria_5_inputInteiroQ1 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 2 ? values.Lataria_5_inputInteiroQ2 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 3 ? values.Lataria_5_inputInteiroQ3 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 4 ? values.Lataria_5_inputInteiroQ4 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 5 ? values.Lataria_5_inputInteiroQ5 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 6 ? values.Lataria_5_inputInteiroQ6 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 7 ? values.Lataria_5_inputInteiroQ7 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 8 ? values.Lataria_5_inputInteiroQ8 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 9 ? values.Lataria_5_inputInteiroQ9 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 10  ? values.Lataria_5_inputInteiroQ10 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 11  ? values.Lataria_5_inputInteiroQ11 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 12  ? values.Lataria_5_inputInteiroQ12 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 13  ? values.Lataria_5_inputInteiroQ13 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 14  ? values.Lataria_5_inputInteiroQ14 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 15  ? values.Lataria_5_inputInteiroQ15 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 16  ? values.Lataria_5_inputInteiroQ16 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 17  ? values.Lataria_5_inputInteiroQ17 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 18  ? values.Lataria_5_inputInteiroQ18 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 19  ? values.Lataria_5_inputInteiroQ19 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 20  ? values.Lataria_5_inputInteiroQ20 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 21  ? values.Lataria_5_inputInteiroQ21 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 22  ? values.Lataria_5_inputInteiroQ22 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 23  ? values.Lataria_5_inputInteiroQ23 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 24  ? values.Lataria_5_inputInteiroQ24 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 25  ? values.Lataria_5_inputInteiroQ25 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 26  ? values.Lataria_5_inputInteiroQ26 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 27  ? values.Lataria_5_inputInteiroQ27 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 28  ? values.Lataria_5_inputInteiroQ28 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 29  ? values.Lataria_5_inputInteiroQ29 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 30  ? values.Lataria_5_inputInteiroQ30 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 31  ? values.Lataria_5_inputInteiroQ31 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 32  ? values.Lataria_5_inputInteiroQ32 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 33  ? values.Lataria_5_inputInteiroQ33 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 34  ? values.Lataria_5_inputInteiroQ34 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 35  ? values.Lataria_5_inputInteiroQ35 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 36  ? values.Lataria_5_inputInteiroQ36 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 37  ? values.Lataria_5_inputInteiroQ37 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 38  ? values.Lataria_5_inputInteiroQ38 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 39  ? values.Lataria_5_inputInteiroQ39 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 40  ? values.Lataria_5_inputInteiroQ40 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 41  ? values.Lataria_5_inputInteiroQ41 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 42  ? values.Lataria_5_inputInteiroQ42 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 43  ? values.Lataria_5_inputInteiroQ43 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 45  ? values.Lataria_5_inputInteiroQ44 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 45  ? values.Lataria_5_inputInteiroQ45 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 46  ? values.Lataria_5_inputInteiroQ46 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 47  ? values.Lataria_5_inputInteiroQ47 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 48  ? values.Lataria_5_inputInteiroQ48 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 49  ? values.Lataria_5_inputInteiroQ49 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 50  ? values.Lataria_5_inputInteiroQ50 :

																								false
																							}
																						/>
																						</>
																					)
																				}
																				{
																					//INPUT DECIMAL Lataria
																					quesito.IND_DECIMAL == true && quesito.IND_ATIVO == true && 
																					(	
																						<>
																						<Input 
																							onChangeText={handleChange('Lataria_'+listbox.COD_OPCAO+'_inputDecimalQ'+quesito.COD_ITEM)}
																							onBlur={handleBlur('Lataria_'+listbox.COD_OPCAO+'_inputDecimalQ'+quesito.COD_ITEM)}
																							placeholder='Valor'
																							value={
																								//Lataria 1
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 1 ? values.Lataria_1_inputDecimalQ1 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 2 ? values.Lataria_1_inputDecimalQ2 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 3 ? values.Lataria_1_inputDecimalQ3 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 4 ? values.Lataria_1_inputDecimalQ4 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 5 ? values.Lataria_1_inputDecimalQ5 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 6 ? values.Lataria_1_inputDecimalQ6 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 7 ? values.Lataria_1_inputDecimalQ7 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 8 ? values.Lataria_1_inputDecimalQ8 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 9 ? values.Lataria_1_inputDecimalQ9 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 10  ? values.Lataria_1_inputDecimalQ10 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 11  ? values.Lataria_1_inputDecimalQ11 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 12  ? values.Lataria_1_inputDecimalQ12 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 13  ? values.Lataria_1_inputDecimalQ13 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 14  ? values.Lataria_1_inputDecimalQ14 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 15  ? values.Lataria_1_inputDecimalQ15 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 16  ? values.Lataria_1_inputDecimalQ16 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 17  ? values.Lataria_1_inputDecimalQ17 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 18  ? values.Lataria_1_inputDecimalQ18 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 19  ? values.Lataria_1_inputDecimalQ19 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 20  ? values.Lataria_1_inputDecimalQ20 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 21  ? values.Lataria_1_inputDecimalQ21 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 22  ? values.Lataria_1_inputDecimalQ22 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 23  ? values.Lataria_1_inputDecimalQ23 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 24  ? values.Lataria_1_inputDecimalQ24 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 25  ? values.Lataria_1_inputDecimalQ25 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 26  ? values.Lataria_1_inputDecimalQ26 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 27  ? values.Lataria_1_inputDecimalQ27 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 28  ? values.Lataria_1_inputDecimalQ28 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 29  ? values.Lataria_1_inputDecimalQ29 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 30  ? values.Lataria_1_inputDecimalQ30 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 31  ? values.Lataria_1_inputDecimalQ31 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 32  ? values.Lataria_1_inputDecimalQ32 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 33  ? values.Lataria_1_inputDecimalQ33 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 34  ? values.Lataria_1_inputDecimalQ34 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 35  ? values.Lataria_1_inputDecimalQ35 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 36  ? values.Lataria_1_inputDecimalQ36 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 37  ? values.Lataria_1_inputDecimalQ37 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 38  ? values.Lataria_1_inputDecimalQ38 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 39  ? values.Lataria_1_inputDecimalQ39 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 40  ? values.Lataria_1_inputDecimalQ40 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 41  ? values.Lataria_1_inputDecimalQ41 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 42  ? values.Lataria_1_inputDecimalQ42 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 43  ? values.Lataria_1_inputDecimalQ43 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 44  ? values.Lataria_1_inputDecimalQ44 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 45  ? values.Lataria_1_inputDecimalQ45 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 46  ? values.Lataria_1_inputDecimalQ46 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 47  ? values.Lataria_1_inputDecimalQ47 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 48  ? values.Lataria_1_inputDecimalQ48 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 49  ? values.Lataria_1_inputDecimalQ49 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 50  ? values.Lataria_1_inputDecimalQ50 :


																								//Lataria 2
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 1 ? values.Lataria_2_inputDecimalQ1 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 2 ? values.Lataria_2_inputDecimalQ2 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 3 ? values.Lataria_2_inputDecimalQ3 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 4 ? values.Lataria_2_inputDecimalQ4 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 5 ? values.Lataria_2_inputDecimalQ5 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 6 ? values.Lataria_2_inputDecimalQ6 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 7 ? values.Lataria_2_inputDecimalQ7 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 8 ? values.Lataria_2_inputDecimalQ8 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 9 ? values.Lataria_2_inputDecimalQ9 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 10  ? values.Lataria_2_inputDecimalQ10 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 11  ? values.Lataria_2_inputDecimalQ11 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 12  ? values.Lataria_2_inputDecimalQ12 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 13  ? values.Lataria_2_inputDecimalQ13 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 14  ? values.Lataria_2_inputDecimalQ14 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 15  ? values.Lataria_2_inputDecimalQ15 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 16  ? values.Lataria_2_inputDecimalQ16 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 17  ? values.Lataria_2_inputDecimalQ17 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 18  ? values.Lataria_2_inputDecimalQ18 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 19  ? values.Lataria_2_inputDecimalQ19 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 20  ? values.Lataria_2_inputDecimalQ20 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 21  ? values.Lataria_2_inputDecimalQ21 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 22  ? values.Lataria_2_inputDecimalQ22 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 23  ? values.Lataria_2_inputDecimalQ23 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 24  ? values.Lataria_2_inputDecimalQ24 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 25  ? values.Lataria_2_inputDecimalQ25 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 26  ? values.Lataria_2_inputDecimalQ26 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 27  ? values.Lataria_2_inputDecimalQ27 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 28  ? values.Lataria_2_inputDecimalQ28 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 29  ? values.Lataria_2_inputDecimalQ29 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 30  ? values.Lataria_2_inputDecimalQ30 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 31  ? values.Lataria_2_inputDecimalQ31 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 32  ? values.Lataria_2_inputDecimalQ32 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 33  ? values.Lataria_2_inputDecimalQ33 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 34  ? values.Lataria_2_inputDecimalQ34 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 35  ? values.Lataria_2_inputDecimalQ35 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 36  ? values.Lataria_2_inputDecimalQ36 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 37  ? values.Lataria_2_inputDecimalQ37 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 38  ? values.Lataria_2_inputDecimalQ38 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 39  ? values.Lataria_2_inputDecimalQ39 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 40  ? values.Lataria_2_inputDecimalQ40 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 41  ? values.Lataria_2_inputDecimalQ41 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 42  ? values.Lataria_2_inputDecimalQ42 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 43  ? values.Lataria_2_inputDecimalQ43 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 44  ? values.Lataria_2_inputDecimalQ44 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 45  ? values.Lataria_2_inputDecimalQ45 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 46  ? values.Lataria_2_inputDecimalQ46 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 47  ? values.Lataria_2_inputDecimalQ47 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 48  ? values.Lataria_2_inputDecimalQ48 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 49  ? values.Lataria_2_inputDecimalQ49 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 50  ? values.Lataria_2_inputDecimalQ50 :

																								//Lataria 3
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 1 ? values.Lataria_3_inputDecimalQ1 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 2 ? values.Lataria_3_inputDecimalQ2 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 3 ? values.Lataria_3_inputDecimalQ3 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 4 ? values.Lataria_3_inputDecimalQ4 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 5 ? values.Lataria_3_inputDecimalQ5 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 6 ? values.Lataria_3_inputDecimalQ6 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 7 ? values.Lataria_3_inputDecimalQ7 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 8 ? values.Lataria_3_inputDecimalQ8 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 9 ? values.Lataria_3_inputDecimalQ9 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 10  ? values.Lataria_3_inputDecimalQ10 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 11  ? values.Lataria_3_inputDecimalQ11 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 12  ? values.Lataria_3_inputDecimalQ12 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 13  ? values.Lataria_3_inputDecimalQ13 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 14  ? values.Lataria_3_inputDecimalQ14 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 15  ? values.Lataria_3_inputDecimalQ15 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 16  ? values.Lataria_3_inputDecimalQ16 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 17  ? values.Lataria_3_inputDecimalQ17 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 18  ? values.Lataria_3_inputDecimalQ18 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 19  ? values.Lataria_3_inputDecimalQ19 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 20  ? values.Lataria_3_inputDecimalQ20 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 21  ? values.Lataria_3_inputDecimalQ21 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 22  ? values.Lataria_3_inputDecimalQ22 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 23  ? values.Lataria_3_inputDecimalQ23 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 24  ? values.Lataria_3_inputDecimalQ24 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 25  ? values.Lataria_3_inputDecimalQ25 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 26  ? values.Lataria_3_inputDecimalQ26 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 27  ? values.Lataria_3_inputDecimalQ27 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 28  ? values.Lataria_3_inputDecimalQ28 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 29  ? values.Lataria_3_inputDecimalQ29 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 30  ? values.Lataria_3_inputDecimalQ30 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 31  ? values.Lataria_3_inputDecimalQ31 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 32  ? values.Lataria_3_inputDecimalQ32 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 33  ? values.Lataria_3_inputDecimalQ33 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 34  ? values.Lataria_3_inputDecimalQ34 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 35  ? values.Lataria_3_inputDecimalQ35 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 36  ? values.Lataria_3_inputDecimalQ36 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 37  ? values.Lataria_3_inputDecimalQ37 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 38  ? values.Lataria_3_inputDecimalQ38 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 39  ? values.Lataria_3_inputDecimalQ39 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 40  ? values.Lataria_3_inputDecimalQ40 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 41  ? values.Lataria_3_inputDecimalQ41 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 42  ? values.Lataria_3_inputDecimalQ42 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 43  ? values.Lataria_3_inputDecimalQ43 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 44  ? values.Lataria_3_inputDecimalQ44 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 45  ? values.Lataria_3_inputDecimalQ45 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 46  ? values.Lataria_3_inputDecimalQ46 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 47  ? values.Lataria_3_inputDecimalQ47 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 48  ? values.Lataria_3_inputDecimalQ48 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 49  ? values.Lataria_3_inputDecimalQ49 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 50  ? values.Lataria_3_inputDecimalQ50 :

																								//Lataria 4
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 1 ? values.Lataria_4_inputDecimalQ1 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 2 ? values.Lataria_4_inputDecimalQ2 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 3 ? values.Lataria_4_inputDecimalQ3 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 4 ? values.Lataria_4_inputDecimalQ4 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 5 ? values.Lataria_4_inputDecimalQ5 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 6 ? values.Lataria_4_inputDecimalQ6 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 7 ? values.Lataria_4_inputDecimalQ7 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 8 ? values.Lataria_4_inputDecimalQ8 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 9 ? values.Lataria_4_inputDecimalQ9 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 10  ? values.Lataria_4_inputDecimalQ10 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 11  ? values.Lataria_4_inputDecimalQ11 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 12  ? values.Lataria_4_inputDecimalQ12 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 14  ? values.Lataria_4_inputDecimalQ14 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 14  ? values.Lataria_4_inputDecimalQ14 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 15  ? values.Lataria_4_inputDecimalQ15 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 16  ? values.Lataria_4_inputDecimalQ16 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 17  ? values.Lataria_4_inputDecimalQ17 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 18  ? values.Lataria_4_inputDecimalQ18 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 19  ? values.Lataria_4_inputDecimalQ19 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 20  ? values.Lataria_4_inputDecimalQ20 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 21  ? values.Lataria_4_inputDecimalQ21 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 22  ? values.Lataria_4_inputDecimalQ22 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 23  ? values.Lataria_4_inputDecimalQ24 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 24  ? values.Lataria_4_inputDecimalQ24 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 25  ? values.Lataria_4_inputDecimalQ25 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 26  ? values.Lataria_4_inputDecimalQ26 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 27  ? values.Lataria_4_inputDecimalQ27 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 28  ? values.Lataria_4_inputDecimalQ28 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 29  ? values.Lataria_4_inputDecimalQ29 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 30  ? values.Lataria_4_inputDecimalQ30 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 31  ? values.Lataria_4_inputDecimalQ31 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 32  ? values.Lataria_4_inputDecimalQ32 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 33  ? values.Lataria_4_inputDecimalQ33 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 34  ? values.Lataria_4_inputDecimalQ34 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 35  ? values.Lataria_4_inputDecimalQ35 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 36  ? values.Lataria_4_inputDecimalQ36 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 37  ? values.Lataria_4_inputDecimalQ37 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 38  ? values.Lataria_4_inputDecimalQ38 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 39  ? values.Lataria_4_inputDecimalQ39 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 40  ? values.Lataria_4_inputDecimalQ40 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 41  ? values.Lataria_4_inputDecimalQ41 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 42  ? values.Lataria_4_inputDecimalQ42 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 43  ? values.Lataria_4_inputDecimalQ43 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 44  ? values.Lataria_4_inputDecimalQ44 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 45  ? values.Lataria_4_inputDecimalQ45 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 46  ? values.Lataria_4_inputDecimalQ46 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 47  ? values.Lataria_4_inputDecimalQ47 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 48  ? values.Lataria_4_inputDecimalQ48 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 49  ? values.Lataria_4_inputDecimalQ49 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 50  ? values.Lataria_4_inputDecimalQ50 :

																								//Lataria 5
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 1 ? values.Lataria_5_inputDecimalQ1 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 2 ? values.Lataria_5_inputDecimalQ2 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 3 ? values.Lataria_5_inputDecimalQ3 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 4 ? values.Lataria_5_inputDecimalQ4 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 5 ? values.Lataria_5_inputDecimalQ5 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 6 ? values.Lataria_5_inputDecimalQ6 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 7 ? values.Lataria_5_inputDecimalQ7 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 8 ? values.Lataria_5_inputDecimalQ8 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 9 ? values.Lataria_5_inputDecimalQ9 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 10  ? values.Lataria_5_inputDecimalQ10 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 11  ? values.Lataria_5_inputDecimalQ11 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 12  ? values.Lataria_5_inputDecimalQ12 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 13  ? values.Lataria_5_inputDecimalQ13 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 14  ? values.Lataria_5_inputDecimalQ14 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 15  ? values.Lataria_5_inputDecimalQ15 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 16  ? values.Lataria_5_inputDecimalQ16 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 17  ? values.Lataria_5_inputDecimalQ17 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 18  ? values.Lataria_5_inputDecimalQ18 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 19  ? values.Lataria_5_inputDecimalQ19 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 20  ? values.Lataria_5_inputDecimalQ20 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 21  ? values.Lataria_5_inputDecimalQ21 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 22  ? values.Lataria_5_inputDecimalQ22 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 23  ? values.Lataria_5_inputDecimalQ23 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 24  ? values.Lataria_5_inputDecimalQ24 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 25  ? values.Lataria_5_inputDecimalQ25 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 26  ? values.Lataria_5_inputDecimalQ26 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 27  ? values.Lataria_5_inputDecimalQ27 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 28  ? values.Lataria_5_inputDecimalQ28 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 29  ? values.Lataria_5_inputDecimalQ29 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 30  ? values.Lataria_5_inputDecimalQ30 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 31  ? values.Lataria_5_inputDecimalQ31 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 32  ? values.Lataria_5_inputDecimalQ32 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 33  ? values.Lataria_5_inputDecimalQ33 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 34  ? values.Lataria_5_inputDecimalQ34 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 35  ? values.Lataria_5_inputDecimalQ35 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 36  ? values.Lataria_5_inputDecimalQ36 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 37  ? values.Lataria_5_inputDecimalQ37 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 38  ? values.Lataria_5_inputDecimalQ38 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 39  ? values.Lataria_5_inputDecimalQ39 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 40  ? values.Lataria_5_inputDecimalQ40 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 41  ? values.Lataria_5_inputDecimalQ41 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 42  ? values.Lataria_5_inputDecimalQ42 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 43  ? values.Lataria_5_inputDecimalQ43 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 44  ? values.Lataria_5_inputDecimalQ44 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 45  ? values.Lataria_5_inputDecimalQ45 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 46  ? values.Lataria_5_inputDecimalQ46 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 47  ? values.Lataria_5_inputDecimalQ47 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 48  ? values.Lataria_5_inputDecimalQ48 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 49  ? values.Lataria_5_inputDecimalQ49 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 50  ? values.Lataria_5_inputDecimalQ50 :

																								false
																							}
																						/>
																						</>
																					)
																				}
																				{
																					//INPUT TEXTO Lataria
																					quesito.IND_TEXTO == true && quesito.IND_ATIVO == true && 
																					(	
																						<>
																						<Input 
																							onChangeText={handleChange('Lataria_'+listbox.COD_OPCAO+'_inputTextoQ'+quesito.COD_ITEM)}
																							onBlur={handleBlur('Lataria_'+listbox.COD_OPCAO+'_inputTextoQ'+quesito.COD_ITEM)}
																							placeholder='Observação'
																							value={
																								//Lataria 1
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 1 ? values.Lataria_1_inputTextoQ1 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 2 ? values.Lataria_1_inputTextoQ2 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 3 ? values.Lataria_1_inputTextoQ3 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 4 ? values.Lataria_1_inputTextoQ4 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 5 ? values.Lataria_1_inputTextoQ5 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 6 ? values.Lataria_1_inputTextoQ6 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 7 ? values.Lataria_1_inputTextoQ7 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 8 ? values.Lataria_1_inputTextoQ8 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 9 ? values.Lataria_1_inputTextoQ9 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 10  ? values.Lataria_1_inputTextoQ10 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 11  ? values.Lataria_1_inputTextoQ11 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 12  ? values.Lataria_1_inputTextoQ12 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 13  ? values.Lataria_1_inputTextoQ13 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 14  ? values.Lataria_1_inputTextoQ14 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 15  ? values.Lataria_1_inputTextoQ15 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 16  ? values.Lataria_1_inputTextoQ16 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 17  ? values.Lataria_1_inputTextoQ17 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 18  ? values.Lataria_1_inputTextoQ18 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 19  ? values.Lataria_1_inputTextoQ19 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 20  ? values.Lataria_1_inputTextoQ20 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 21  ? values.Lataria_1_inputTextoQ21 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 22  ? values.Lataria_1_inputTextoQ22 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 23  ? values.Lataria_1_inputTextoQ23 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 24  ? values.Lataria_1_inputTextoQ24 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 25  ? values.Lataria_1_inputTextoQ25 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 26  ? values.Lataria_1_inputTextoQ26 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 27  ? values.Lataria_1_inputTextoQ27 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 28  ? values.Lataria_1_inputTextoQ28 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 29  ? values.Lataria_1_inputTextoQ29 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 30  ? values.Lataria_1_inputTextoQ30 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 31  ? values.Lataria_1_inputTextoQ31 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 32  ? values.Lataria_1_inputTextoQ32 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 33  ? values.Lataria_1_inputTextoQ33 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 34  ? values.Lataria_1_inputTextoQ34 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 35  ? values.Lataria_1_inputTextoQ35 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 36  ? values.Lataria_1_inputTextoQ36 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 37  ? values.Lataria_1_inputTextoQ37 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 38  ? values.Lataria_1_inputTextoQ38 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 39  ? values.Lataria_1_inputTextoQ39 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 40  ? values.Lataria_1_inputTextoQ40 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 41  ? values.Lataria_1_inputTextoQ41 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 42  ? values.Lataria_1_inputTextoQ42 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 43  ? values.Lataria_1_inputTextoQ43 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 44  ? values.Lataria_1_inputTextoQ44 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 45  ? values.Lataria_1_inputTextoQ45 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 46  ? values.Lataria_1_inputTextoQ46 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 47  ? values.Lataria_1_inputTextoQ47 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 48  ? values.Lataria_1_inputTextoQ48 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 49  ? values.Lataria_1_inputTextoQ49 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 50  ? values.Lataria_1_inputTextoQ50 :

																								//Lataria 2
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 1 ? values.Lataria_2_inputTextoQ1 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 2 ? values.Lataria_2_inputTextoQ2 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 3 ? values.Lataria_2_inputTextoQ3 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 4 ? values.Lataria_2_inputTextoQ4 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 5 ? values.Lataria_2_inputTextoQ5 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 6 ? values.Lataria_2_inputTextoQ6 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 7 ? values.Lataria_2_inputTextoQ7 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 8 ? values.Lataria_2_inputTextoQ8 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 9 ? values.Lataria_2_inputTextoQ9 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 10  ? values.Lataria_2_inputTextoQ10 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 11  ? values.Lataria_2_inputTextoQ11 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 12  ? values.Lataria_2_inputTextoQ12 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 13  ? values.Lataria_2_inputTextoQ13 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 14  ? values.Lataria_2_inputTextoQ14 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 15  ? values.Lataria_2_inputTextoQ15 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 16  ? values.Lataria_2_inputTextoQ16 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 17  ? values.Lataria_2_inputTextoQ17 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 18  ? values.Lataria_2_inputTextoQ18 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 19  ? values.Lataria_2_inputTextoQ19 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 20  ? values.Lataria_2_inputTextoQ20 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 21  ? values.Lataria_2_inputTextoQ21 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 22  ? values.Lataria_2_inputTextoQ22 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 23  ? values.Lataria_2_inputTextoQ23 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 24  ? values.Lataria_2_inputTextoQ24 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 25  ? values.Lataria_2_inputTextoQ25 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 26  ? values.Lataria_2_inputTextoQ26 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 27  ? values.Lataria_2_inputTextoQ27 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 28  ? values.Lataria_2_inputTextoQ28 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 29  ? values.Lataria_2_inputTextoQ29 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 30  ? values.Lataria_2_inputTextoQ30 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 31  ? values.Lataria_2_inputTextoQ31 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 32  ? values.Lataria_2_inputTextoQ32 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 33  ? values.Lataria_2_inputTextoQ33 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 34  ? values.Lataria_2_inputTextoQ34 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 35  ? values.Lataria_2_inputTextoQ35 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 36  ? values.Lataria_2_inputTextoQ36 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 37  ? values.Lataria_2_inputTextoQ37 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 38  ? values.Lataria_2_inputTextoQ38 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 39  ? values.Lataria_2_inputTextoQ39 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 40  ? values.Lataria_2_inputTextoQ40 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 41  ? values.Lataria_2_inputTextoQ41 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 42  ? values.Lataria_2_inputTextoQ42 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 43  ? values.Lataria_2_inputTextoQ43 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 44  ? values.Lataria_2_inputTextoQ44 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 45  ? values.Lataria_2_inputTextoQ45 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 46  ? values.Lataria_2_inputTextoQ46 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 47  ? values.Lataria_2_inputTextoQ47 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 48  ? values.Lataria_2_inputTextoQ48 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 49  ? values.Lataria_2_inputTextoQ49 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 50  ? values.Lataria_2_inputTextoQ50 :

																								//Lataria 3
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 1 ? values.Lataria_3_inputTextoQ1 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 2 ? values.Lataria_3_inputTextoQ2 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 3 ? values.Lataria_3_inputTextoQ3 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 4 ? values.Lataria_3_inputTextoQ4 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 5 ? values.Lataria_3_inputTextoQ5 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 6 ? values.Lataria_3_inputTextoQ6 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 7 ? values.Lataria_3_inputTextoQ7 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 8 ? values.Lataria_3_inputTextoQ8 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 9 ? values.Lataria_3_inputTextoQ9 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 10  ? values.Lataria_3_inputTextoQ10 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 11  ? values.Lataria_3_inputTextoQ11 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 12  ? values.Lataria_3_inputTextoQ12 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 13  ? values.Lataria_3_inputTextoQ13 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 14  ? values.Lataria_3_inputTextoQ14 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 15  ? values.Lataria_3_inputTextoQ15 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 16  ? values.Lataria_3_inputTextoQ16 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 17  ? values.Lataria_3_inputTextoQ17 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 18  ? values.Lataria_3_inputTextoQ18 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 19  ? values.Lataria_3_inputTextoQ19 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 20  ? values.Lataria_3_inputTextoQ20 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 21  ? values.Lataria_3_inputTextoQ21 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 22  ? values.Lataria_3_inputTextoQ22 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 23  ? values.Lataria_3_inputTextoQ23 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 24  ? values.Lataria_3_inputTextoQ24 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 25  ? values.Lataria_3_inputTextoQ25 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 26  ? values.Lataria_3_inputTextoQ26 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 27  ? values.Lataria_3_inputTextoQ27 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 28  ? values.Lataria_3_inputTextoQ28 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 29  ? values.Lataria_3_inputTextoQ29 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 30  ? values.Lataria_3_inputTextoQ30 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 31  ? values.Lataria_3_inputTextoQ31 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 32  ? values.Lataria_3_inputTextoQ32 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 33  ? values.Lataria_3_inputTextoQ33 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 34  ? values.Lataria_3_inputTextoQ34 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 35  ? values.Lataria_3_inputTextoQ35 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 36  ? values.Lataria_3_inputTextoQ36 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 37  ? values.Lataria_3_inputTextoQ37 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 38  ? values.Lataria_3_inputTextoQ38 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 39  ? values.Lataria_3_inputTextoQ39 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 40  ? values.Lataria_3_inputTextoQ40 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 41  ? values.Lataria_3_inputTextoQ41 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 42  ? values.Lataria_3_inputTextoQ42 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 43  ? values.Lataria_3_inputTextoQ43 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 44  ? values.Lataria_3_inputTextoQ44 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 45  ? values.Lataria_3_inputTextoQ45 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 46  ? values.Lataria_3_inputTextoQ46 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 47  ? values.Lataria_3_inputTextoQ47 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 48  ? values.Lataria_3_inputTextoQ48 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 49  ? values.Lataria_3_inputTextoQ49 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 50  ? values.Lataria_3_inputTextoQ50 :

																								//Lataria 4
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 1 ? values.Lataria_4_inputTextoQ1 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 2 ? values.Lataria_4_inputTextoQ2 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 3 ? values.Lataria_4_inputTextoQ3 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 4 ? values.Lataria_4_inputTextoQ4 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 5 ? values.Lataria_4_inputTextoQ5 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 6 ? values.Lataria_4_inputTextoQ6 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 7 ? values.Lataria_4_inputTextoQ7 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 8 ? values.Lataria_4_inputTextoQ8 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 9 ? values.Lataria_4_inputTextoQ9 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 10  ? values.Lataria_4_inputTextoQ10 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 11  ? values.Lataria_4_inputTextoQ11 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 12  ? values.Lataria_4_inputTextoQ12 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 14  ? values.Lataria_4_inputTextoQ14 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 14  ? values.Lataria_4_inputTextoQ14 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 15  ? values.Lataria_4_inputTextoQ15 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 16  ? values.Lataria_4_inputTextoQ16 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 17  ? values.Lataria_4_inputTextoQ17 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 18  ? values.Lataria_4_inputTextoQ18 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 19  ? values.Lataria_4_inputTextoQ19 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 20  ? values.Lataria_4_inputTextoQ20 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 21  ? values.Lataria_4_inputTextoQ21 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 22  ? values.Lataria_4_inputTextoQ22 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 23  ? values.Lataria_4_inputTextoQ24 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 24  ? values.Lataria_4_inputTextoQ24 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 25  ? values.Lataria_4_inputTextoQ25 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 26  ? values.Lataria_4_inputTextoQ26 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 27  ? values.Lataria_4_inputTextoQ27 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 28  ? values.Lataria_4_inputTextoQ28 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 29  ? values.Lataria_4_inputTextoQ29 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 30  ? values.Lataria_4_inputTextoQ30 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 31  ? values.Lataria_4_inputTextoQ31 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 32  ? values.Lataria_4_inputTextoQ32 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 33  ? values.Lataria_4_inputTextoQ33 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 34  ? values.Lataria_4_inputTextoQ34 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 35  ? values.Lataria_4_inputTextoQ35 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 36  ? values.Lataria_4_inputTextoQ36 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 37  ? values.Lataria_4_inputTextoQ37 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 38  ? values.Lataria_4_inputTextoQ38 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 39  ? values.Lataria_4_inputTextoQ39 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 40  ? values.Lataria_4_inputTextoQ40 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 41  ? values.Lataria_4_inputTextoQ41 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 42  ? values.Lataria_4_inputTextoQ42 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 43  ? values.Lataria_4_inputTextoQ43 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 44  ? values.Lataria_4_inputTextoQ44 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 45  ? values.Lataria_4_inputTextoQ45 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 46  ? values.Lataria_4_inputTextoQ46 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 47  ? values.Lataria_4_inputTextoQ47 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 48  ? values.Lataria_4_inputTextoQ48 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 49  ? values.Lataria_4_inputTextoQ49 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 50  ? values.Lataria_4_inputTextoQ50 :

																								//Lataria 5
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 1 ? values.Lataria_5_inputTextoQ1 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 2 ? values.Lataria_5_inputTextoQ2 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 3 ? values.Lataria_5_inputTextoQ3 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 4 ? values.Lataria_5_inputTextoQ4 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 5 ? values.Lataria_5_inputTextoQ5 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 6 ? values.Lataria_5_inputTextoQ6 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 7 ? values.Lataria_5_inputTextoQ7 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 8 ? values.Lataria_5_inputTextoQ8 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 9 ? values.Lataria_5_inputTextoQ9 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 10  ? values.Lataria_5_inputTextoQ10 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 11  ? values.Lataria_5_inputTextoQ11 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 12  ? values.Lataria_5_inputTextoQ12 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 13  ? values.Lataria_5_inputTextoQ13 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 14  ? values.Lataria_5_inputTextoQ14 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 15  ? values.Lataria_5_inputTextoQ15 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 16  ? values.Lataria_5_inputTextoQ16 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 17  ? values.Lataria_5_inputTextoQ17 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 18  ? values.Lataria_5_inputTextoQ18 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 19  ? values.Lataria_5_inputTextoQ19 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 20  ? values.Lataria_5_inputTextoQ20 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 21  ? values.Lataria_5_inputTextoQ21 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 22  ? values.Lataria_5_inputTextoQ22 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 23  ? values.Lataria_5_inputTextoQ23 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 24  ? values.Lataria_5_inputTextoQ24 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 25  ? values.Lataria_5_inputTextoQ25 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 26  ? values.Lataria_5_inputTextoQ26 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 27  ? values.Lataria_5_inputTextoQ27 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 28  ? values.Lataria_5_inputTextoQ28 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 29  ? values.Lataria_5_inputTextoQ29 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 30  ? values.Lataria_5_inputTextoQ30 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 31  ? values.Lataria_5_inputTextoQ31 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 32  ? values.Lataria_5_inputTextoQ32 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 33  ? values.Lataria_5_inputTextoQ33 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 34  ? values.Lataria_5_inputTextoQ34 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 35  ? values.Lataria_5_inputTextoQ35 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 36  ? values.Lataria_5_inputTextoQ36 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 37  ? values.Lataria_5_inputTextoQ37 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 38  ? values.Lataria_5_inputTextoQ38 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 39  ? values.Lataria_5_inputTextoQ39 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 40  ? values.Lataria_5_inputTextoQ40 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 41  ? values.Lataria_5_inputTextoQ41 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 42  ? values.Lataria_5_inputTextoQ42 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 43  ? values.Lataria_5_inputTextoQ43 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 44  ? values.Lataria_5_inputTextoQ44 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 45  ? values.Lataria_5_inputTextoQ45 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 46  ? values.Lataria_5_inputTextoQ46 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 47  ? values.Lataria_5_inputTextoQ47 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 48  ? values.Lataria_5_inputTextoQ48 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 49  ? values.Lataria_5_inputTextoQ49 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 50  ? values.Lataria_5_inputTextoQ50 :

																								false
																							}
																						/>
																						</>
																					)
																				}
																				</View>
																			)
																		})
																	)
																}
															</CollapseBody>
														</Collapse>
													);
												})
											)
										}
										{
											//PNEU FALSE - LATARIA FALSE - VIDRO FALSE
											grupo.IND_PNEUS == false && (
												grupo.QUESITOS != undefined &&(
													grupo.QUESITOS.map((quesito, q) => {
														return(
															<View key={quesito.QUESITO}>
															{	
																//NOME QUESITO
																quesito.IND_PNEU == false && quesito.IND_LATARIA == false && (
																	<Text style={{fontSize: 20, marginLeft: 10, marginTop: 10, fontWeight: 'bold', color: '#1A237C' }}>{quesito.COD_ITEM+'. '+quesito.QUESITO}</Text>
																)
															}
															{
																//LIST BOX
																quesito.IND_PNEU == false && quesito.IND_LATARIA == false && quesito.IND_LISTA == true && quesito.IND_ATIVO == true &&
																(
																	
																		<Picker
																			selectedValue={
																				quesito.COD_ITEM == 1 ? values.lbQuesito_1 :
																				quesito.COD_ITEM == 2 ? values.lbQuesito_2 :
																				quesito.COD_ITEM == 3 ? values.lbQuesito_3 :
																				quesito.COD_ITEM == 4 ? values.lbQuesito_4 :
																				quesito.COD_ITEM == 5 ? values.lbQuesito_5 :
																				quesito.COD_ITEM == 6 ? values.lbQuesito_6 :
																				quesito.COD_ITEM == 7 ? values.lbQuesito_7 :
																				quesito.COD_ITEM == 8 ? values.lbQuesito_8 :
																				quesito.COD_ITEM == 9 ? values.lbQuesito_9 :
																				quesito.COD_ITEM == 10 ? values.lbQuesito_10 : 
																				quesito.COD_ITEM == 11 ? values.lbQuesito_11 :
																				quesito.COD_ITEM == 12 ? values.lbQuesito_12 :
																				quesito.COD_ITEM == 13 ? values.lbQuesito_13 :
																				quesito.COD_ITEM == 14 ? values.lbQuesito_14 :
																				quesito.COD_ITEM == 15 ? values.lbQuesito_15 :
																				quesito.COD_ITEM == 16 ? values.lbQuesito_16 :
																				quesito.COD_ITEM == 17 ? values.lbQuesito_17 :
																				quesito.COD_ITEM == 18 ? values.lbQuesito_18 :
																				quesito.COD_ITEM == 19 ? values.lbQuesito_19 :
																				quesito.COD_ITEM == 20 ? values.lbQuesito_20 :
																				quesito.COD_ITEM == 21 ? values.lbQuesito_21 :
																				quesito.COD_ITEM == 22 ? values.lbQuesito_22 :
																				quesito.COD_ITEM == 23 ? values.lbQuesito_23 :
																				quesito.COD_ITEM == 24 ? values.lbQuesito_24 :
																				quesito.COD_ITEM == 25 ? values.lbQuesito_25 :
																				quesito.COD_ITEM == 26 ? values.lbQuesito_26 :
																				quesito.COD_ITEM == 27 ? values.lbQuesito_27 :
																				quesito.COD_ITEM == 28 ? values.lbQuesito_28 :
																				quesito.COD_ITEM == 29 ? values.lbQuesito_29 :
																				quesito.COD_ITEM == 30 ? values.lbQuesito_30 :
																				quesito.COD_ITEM == 31 ? values.lbQuesito_31 :
																				quesito.COD_ITEM == 32 ? values.lbQuesito_32 :
																				quesito.COD_ITEM == 33 ? values.lbQuesito_33 :
																				quesito.COD_ITEM == 34 ? values.lbQuesito_34 :
																				quesito.COD_ITEM == 35 ? values.lbQuesito_35 :
																				quesito.COD_ITEM == 36 ? values.lbQuesito_36 :
																				quesito.COD_ITEM == 37 ? values.lbQuesito_37 :
																				quesito.COD_ITEM == 38 ? values.lbQuesito_38 :
																				quesito.COD_ITEM == 39 ? values.lbQuesito_39 :
																				quesito.COD_ITEM == 40 ? values.lbQuesito_40 :
																				quesito.COD_ITEM == 41 ? values.lbQuesito_41 : 
																				quesito.COD_ITEM == 42 ? values.lbQuesito_42 : 
																				quesito.COD_ITEM == 43 ? values.lbQuesito_43 : 
																				quesito.COD_ITEM == 44 ? values.lbQuesito_44 : 
																				quesito.COD_ITEM == 45 ? values.lbQuesito_45 : 
																				quesito.COD_ITEM == 46 ? values.lbQuesito_46 : 
																				quesito.COD_ITEM == 47 ? values.lbQuesito_47 : 
																				quesito.COD_ITEM == 48 ? values.lbQuesito_48 : 
																				quesito.COD_ITEM == 49 ? values.lbQuesito_49 : 
																				quesito.COD_ITEM == 50 ? values.lbQuesito_50 : 
																				false
																			}
																			style={{ height: 50, margin:5, width: '100%'}}
																			onValueChange={(itemValue, itemIndex) => setFieldValue('lbQuesito_'+quesito.COD_ITEM, itemValue )}
																		>
																			<Picker.Item 
																				label={'Selecione um item'} 
																				value={0} 
																			/>
																		{
																			quesito.componentes.listbox.OPCOES.map((listbox, i) => {
																				return (
																					
																						<Picker.Item 
																							key={listbox.DES_OPCAO}
																							label={listbox.DES_OPCAO} 
																							value={listbox.COD_OPCAO} 
																						/>
																					
																				);
																			})
																		}
																		</Picker>
																)
															}
															{
																//RADIO BUTTON 
																quesito.IND_PNEU == false && quesito.IND_LATARIA == false && quesito.IND_RADIO == true && quesito.IND_ATIVO == true &&
																(
																	quesito.componentes.radio.OPCOES.map((radio, i) => {
																		return (
																			<ListItem 
																				key={radio.DES_OPCAO}
																				onPress={ () => setFieldValue('rbQuesito_'+quesito.COD_ITEM, radio.COD_OPCAO ) }
																				>
																					<Radio
																						onPress={ () => setFieldValue('rbQuesito_'+quesito.COD_ITEM, radio.COD_OPCAO ) }
																						color={"#f0ad4e"}
																						selectedColor={"#5cb85c"}
																						selected={ 
																							quesito.COD_ITEM == 1 ? values.rbQuesito_1 == radio.COD_OPCAO ? true : false :
																							quesito.COD_ITEM == 2 ? values.rbQuesito_2 == radio.COD_OPCAO ? true : false :
																							quesito.COD_ITEM == 3 ? values.rbQuesito_3 == radio.COD_OPCAO ? true : false :
																							quesito.COD_ITEM == 4 ? values.rbQuesito_4 == radio.COD_OPCAO ? true : false :
																							quesito.COD_ITEM == 5 ? values.rbQuesito_5 == radio.COD_OPCAO ? true : false :
																							quesito.COD_ITEM == 6 ? values.rbQuesito_6 == radio.COD_OPCAO ? true : false :
																							quesito.COD_ITEM == 7 ? values.rbQuesito_7 == radio.COD_OPCAO ? true : false :
																							quesito.COD_ITEM == 8 ? values.rbQuesito_8 == radio.COD_OPCAO ? true : false :
																							quesito.COD_ITEM == 9 ? values.rbQuesito_9 == radio.COD_OPCAO ? true : false :
																							quesito.COD_ITEM == 10 ? values.rbQuesito_10 == radio.COD_OPCAO ? true : false : 
																							quesito.COD_ITEM == 11 ? values.rbQuesito_11 == radio.COD_OPCAO ? true : false :
																							quesito.COD_ITEM == 12 ? values.rbQuesito_12 == radio.COD_OPCAO ? true : false :
																							quesito.COD_ITEM == 13 ? values.rbQuesito_13 == radio.COD_OPCAO ? true : false :
																							quesito.COD_ITEM == 14 ? values.rbQuesito_14 == radio.COD_OPCAO ? true : false :
																							quesito.COD_ITEM == 15 ? values.rbQuesito_15 == radio.COD_OPCAO ? true : false :
																							quesito.COD_ITEM == 16 ? values.rbQuesito_16 == radio.COD_OPCAO ? true : false :
																							quesito.COD_ITEM == 17 ? values.rbQuesito_17 == radio.COD_OPCAO ? true : false :
																							quesito.COD_ITEM == 18 ? values.rbQuesito_18 == radio.COD_OPCAO ? true : false :
																							quesito.COD_ITEM == 19 ? values.rbQuesito_19 == radio.COD_OPCAO ? true : false :
																							quesito.COD_ITEM == 20 ? values.rbQuesito_20 == radio.COD_OPCAO ? true : false :
																							quesito.COD_ITEM == 21 ? values.rbQuesito_21 == radio.COD_OPCAO ? true : false :
																							quesito.COD_ITEM == 22 ? values.rbQuesito_22 == radio.COD_OPCAO ? true : false :
																							quesito.COD_ITEM == 23 ? values.rbQuesito_23 == radio.COD_OPCAO ? true : false :
																							quesito.COD_ITEM == 24 ? values.rbQuesito_24 == radio.COD_OPCAO ? true : false :
																							quesito.COD_ITEM == 25 ? values.rbQuesito_25 == radio.COD_OPCAO ? true : false :
																							quesito.COD_ITEM == 26 ? values.rbQuesito_26 == radio.COD_OPCAO ? true : false :
																							quesito.COD_ITEM == 27 ? values.rbQuesito_27 == radio.COD_OPCAO ? true : false :
																							quesito.COD_ITEM == 28 ? values.rbQuesito_28 == radio.COD_OPCAO ? true : false :
																							quesito.COD_ITEM == 29 ? values.rbQuesito_29 == radio.COD_OPCAO ? true : false :
																							quesito.COD_ITEM == 30 ? values.rbQuesito_30 == radio.COD_OPCAO ? true : false :
																							quesito.COD_ITEM == 31 ? values.rbQuesito_31 == radio.COD_OPCAO ? true : false :
																							quesito.COD_ITEM == 32 ? values.rbQuesito_32 == radio.COD_OPCAO ? true : false :
																							quesito.COD_ITEM == 33 ? values.rbQuesito_33 == radio.COD_OPCAO ? true : false :
																							quesito.COD_ITEM == 34 ? values.rbQuesito_34 == radio.COD_OPCAO ? true : false :
																							quesito.COD_ITEM == 35 ? values.rbQuesito_35 == radio.COD_OPCAO ? true : false :
																							quesito.COD_ITEM == 36 ? values.rbQuesito_36 == radio.COD_OPCAO ? true : false :
																							quesito.COD_ITEM == 37 ? values.rbQuesito_37 == radio.COD_OPCAO ? true : false :
																							quesito.COD_ITEM == 38 ? values.rbQuesito_38 == radio.COD_OPCAO ? true : false :
																							quesito.COD_ITEM == 39 ? values.rbQuesito_39 == radio.COD_OPCAO ? true : false :
																							quesito.COD_ITEM == 40 ? values.rbQuesito_40 == radio.COD_OPCAO ? true : false :
																							quesito.COD_ITEM == 41 ? values.rbQuesito_41 == radio.COD_OPCAO ? true : false :
																							quesito.COD_ITEM == 42 ? values.rbQuesito_42 == radio.COD_OPCAO ? true : false :
																							quesito.COD_ITEM == 43 ? values.rbQuesito_43 == radio.COD_OPCAO ? true : false :
																							quesito.COD_ITEM == 44 ? values.rbQuesito_44 == radio.COD_OPCAO ? true : false :
																							quesito.COD_ITEM == 45 ? values.rbQuesito_45 == radio.COD_OPCAO ? true : false :
																							quesito.COD_ITEM == 46 ? values.rbQuesito_46 == radio.COD_OPCAO ? true : false :
																							quesito.COD_ITEM == 47 ? values.rbQuesito_47 == radio.COD_OPCAO ? true : false :
																							quesito.COD_ITEM == 48 ? values.rbQuesito_48 == radio.COD_OPCAO ? true : false :
																							quesito.COD_ITEM == 49 ? values.rbQuesito_49 == radio.COD_OPCAO ? true : false :
																							quesito.COD_ITEM == 50 ? values.rbQuesito_50 == radio.COD_OPCAO ? true : false :
																							false
																						}
																					/>
																				<Text>{'  '+radio.DES_OPCAO}</Text>
																			</ListItem>
																		);
																	})
																)
															}
															{	
																//CHECKBOX 
																quesito.IND_PNEU == false && quesito.IND_LATARIA == false && quesito.IND_CHECKBOX == true && quesito.IND_ATIVO == true && 
																(
																	<ListItem>
																		<Switch
																			trackColor={{ false: "#C4C4C4", true: "#C5DB5F" }}
																			thumbColor={ "#fff"}
																			ios_backgroundColor="#fff"
																			onValueChange={ (previousState) => setFieldValue('cbQuesito_'+quesito.COD_ITEM, previousState ) }
																			value={
																				quesito.COD_ITEM == 1 ? values.cbQuesito_1 :
																				quesito.COD_ITEM == 2 ? values.cbQuesito_2 :
																				quesito.COD_ITEM == 3 ? values.cbQuesito_3 :
																				quesito.COD_ITEM == 4 ? values.cbQuesito_4 :
																				quesito.COD_ITEM == 5 ? values.cbQuesito_5 :
																				quesito.COD_ITEM == 6 ? values.cbQuesito_6 :
																				quesito.COD_ITEM == 7 ? values.cbQuesito_7 :
																				quesito.COD_ITEM == 8 ? values.cbQuesito_8 :
																				quesito.COD_ITEM == 9 ? values.cbQuesito_9 :
																				quesito.COD_ITEM == 10 ? values.cbQuesito_10 :
																				quesito.COD_ITEM == 11 ? values.cbQuesito_11 :
																				quesito.COD_ITEM == 12 ? values.cbQuesito_12 :
																				quesito.COD_ITEM == 13 ? values.cbQuesito_13 :
																				quesito.COD_ITEM == 14 ? values.cbQuesito_14 :
																				quesito.COD_ITEM == 15 ? values.cbQuesito_15 :
																				quesito.COD_ITEM == 16 ? values.cbQuesito_16 :
																				quesito.COD_ITEM == 17 ? values.cbQuesito_17 :
																				quesito.COD_ITEM == 18 ? values.cbQuesito_18 :
																				quesito.COD_ITEM == 19 ? values.cbQuesito_19 :
																				quesito.COD_ITEM == 20 ? values.cbQuesito_20 :
																				quesito.COD_ITEM == 21 ? values.cbQuesito_21 :
																				quesito.COD_ITEM == 22 ? values.cbQuesito_22 :
																				quesito.COD_ITEM == 23 ? values.cbQuesito_23 :
																				quesito.COD_ITEM == 24 ? values.cbQuesito_24 :
																				quesito.COD_ITEM == 25 ? values.cbQuesito_25 :
																				quesito.COD_ITEM == 26 ? values.cbQuesito_26 :
																				quesito.COD_ITEM == 27 ? values.cbQuesito_27 :
																				quesito.COD_ITEM == 28 ? values.cbQuesito_28 :
																				quesito.COD_ITEM == 29 ? values.cbQuesito_29 :
																				quesito.COD_ITEM == 30 ? values.cbQuesito_30 :
																				quesito.COD_ITEM == 31 ? values.cbQuesito_31 :
																				quesito.COD_ITEM == 32 ? values.cbQuesito_32 :
																				quesito.COD_ITEM == 33 ? values.cbQuesito_33 :
																				quesito.COD_ITEM == 34 ? values.cbQuesito_34 :
																				quesito.COD_ITEM == 35 ? values.cbQuesito_35 :
																				quesito.COD_ITEM == 36 ? values.cbQuesito_36 :
																				quesito.COD_ITEM == 37 ? values.cbQuesito_37 :
																				quesito.COD_ITEM == 38 ? values.cbQuesito_38 :
																				quesito.COD_ITEM == 39 ? values.cbQuesito_39 :
																				quesito.COD_ITEM == 40 ? values.cbQuesito_40 :
																				quesito.COD_ITEM == 41 ? values.cbQuesito_41 :
																				quesito.COD_ITEM == 42 ? values.cbQuesito_42 :
																				quesito.COD_ITEM == 43 ? values.cbQuesito_43 :
																				quesito.COD_ITEM == 44 ? values.cbQuesito_44 :
																				quesito.COD_ITEM == 45 ? values.cbQuesito_45 :
																				quesito.COD_ITEM == 46 ? values.cbQuesito_46 :
																				quesito.COD_ITEM == 47 ? values.cbQuesito_47 :
																				quesito.COD_ITEM == 48 ? values.cbQuesito_48 :
																				quesito.COD_ITEM == 49 ? values.cbQuesito_49 :
																				quesito.COD_ITEM == 50 ? values.cbQuesito_50 :
																				false
																			}
																		/>
																		<Text style={{fontWeight: 'bold'}}>
																		{
																			/*quesito.COD_ITEM == 1 ? values.cbQuesito_1 == true ? 'Sim' : 'Não' :
																			quesito.COD_ITEM == 2 ? values.cbQuesito_2 == true ? 'Sim' : 'Não' :
																			quesito.COD_ITEM == 3 ? values.cbQuesito_3 == true ? 'Sim' : 'Não' :
																			quesito.COD_ITEM == 4 ? values.cbQuesito_4 == true ? 'Sim' : 'Não' :
																			quesito.COD_ITEM == 5 ? values.cbQuesito_5 == true ? 'Sim' : 'Não' :
																			quesito.COD_ITEM == 6 ? values.cbQuesito_6 == true ? 'Sim' : 'Não' :
																			quesito.COD_ITEM == 7 ? values.cbQuesito_7 == true ? 'Sim' : 'Não' :
																			quesito.COD_ITEM == 8 ? values.cbQuesito_8 == true ? 'Sim' : 'Não' :
																			quesito.COD_ITEM == 9 ? values.cbQuesito_9 == true ? 'Sim' : 'Não' :
																			quesito.COD_ITEM == 10 ? values.cbQuesito_10 == true ? 'Sim' : 'Não' :
																			quesito.COD_ITEM == 11 ? values.cbQuesito_11 == true ? 'Sim' : 'Não' :
																			quesito.COD_ITEM == 12 ? values.cbQuesito_12 == true ? 'Sim' : 'Não' :
																			quesito.COD_ITEM == 13 ? values.cbQuesito_13 == true ? 'Sim' : 'Não' :
																			quesito.COD_ITEM == 14 ? values.cbQuesito_14 == true ? 'Sim' : 'Não' :
																			quesito.COD_ITEM == 15 ? values.cbQuesito_15 == true ? 'Sim' : 'Não' :
																			quesito.COD_ITEM == 16 ? values.cbQuesito_16 == true ? 'Sim' : 'Não' :
																			quesito.COD_ITEM == 17 ? values.cbQuesito_17 == true ? 'Sim' : 'Não' :
																			quesito.COD_ITEM == 18 ? values.cbQuesito_18 == true ? 'Sim' : 'Não' :
																			quesito.COD_ITEM == 19 ? values.cbQuesito_19 == true ? 'Sim' : 'Não' :
																			quesito.COD_ITEM == 20 ? values.cbQuesito_20 == true ? 'Sim' : 'Não' :
																			quesito.COD_ITEM == 21 ? values.cbQuesito_21 == true ? 'Sim' : 'Não' :
																			quesito.COD_ITEM == 22 ? values.cbQuesito_22 == true ? 'Sim' : 'Não' :
																			quesito.COD_ITEM == 23 ? values.cbQuesito_23 == true ? 'Sim' : 'Não' :
																			quesito.COD_ITEM == 24 ? values.cbQuesito_24 == true ? 'Sim' : 'Não' :
																			quesito.COD_ITEM == 25 ? values.cbQuesito_25 == true ? 'Sim' : 'Não' :
																			quesito.COD_ITEM == 26 ? values.cbQuesito_26 == true ? 'Sim' : 'Não' :
																			quesito.COD_ITEM == 27 ? values.cbQuesito_27 == true ? 'Sim' : 'Não' :
																			quesito.COD_ITEM == 28 ? values.cbQuesito_28 == true ? 'Sim' : 'Não' :
																			quesito.COD_ITEM == 29 ? values.cbQuesito_29 == true ? 'Sim' : 'Não' :
																			quesito.COD_ITEM == 30 ? values.cbQuesito_30 == true ? 'Sim' : 'Não' :
																			quesito.COD_ITEM == 31 ? values.cbQuesito_31 == true ? 'Sim' : 'Não' :
																			quesito.COD_ITEM == 32 ? values.cbQuesito_32 == true ? 'Sim' : 'Não' :
																			quesito.COD_ITEM == 33 ? values.cbQuesito_33 == true ? 'Sim' : 'Não' :
																			quesito.COD_ITEM == 34 ? values.cbQuesito_34 == true ? 'Sim' : 'Não' :
																			quesito.COD_ITEM == 35 ? values.cbQuesito_35 == true ? 'Sim' : 'Não' :
																			quesito.COD_ITEM == 36 ? values.cbQuesito_36 == true ? 'Sim' : 'Não' :
																			quesito.COD_ITEM == 37 ? values.cbQuesito_37 == true ? 'Sim' : 'Não' :
																			quesito.COD_ITEM == 38 ? values.cbQuesito_38 == true ? 'Sim' : 'Não' :
																			quesito.COD_ITEM == 39 ? values.cbQuesito_39 == true ? 'Sim' : 'Não' :
																			quesito.COD_ITEM == 40 ? values.cbQuesito_40 == true ? 'Sim' : 'Não' :
																			quesito.COD_ITEM == 41 ? values.cbQuesito_41 == true ? 'Sim' : 'Não' :
																			quesito.COD_ITEM == 42 ? values.cbQuesito_42 == true ? 'Sim' : 'Não' :
																			quesito.COD_ITEM == 43 ? values.cbQuesito_43 == true ? 'Sim' : 'Não' :
																			quesito.COD_ITEM == 44 ? values.cbQuesito_44 == true ? 'Sim' : 'Não' :
																			quesito.COD_ITEM == 45 ? values.cbQuesito_45 == true ? 'Sim' : 'Não' :
																			quesito.COD_ITEM == 46 ? values.cbQuesito_46 == true ? 'Sim' : 'Não' :
																			quesito.COD_ITEM == 47 ? values.cbQuesito_47 == true ? 'Sim' : 'Não' :
																			quesito.COD_ITEM == 48 ? values.cbQuesito_48 == true ? 'Sim' : 'Não' :
																			quesito.COD_ITEM == 49 ? values.cbQuesito_49 == true ? 'Sim' : 'Não' :
																			quesito.COD_ITEM == 50 ? values.cbQuesito_50 == true ? 'Sim' : 'Não' :
																			false*/
																		}
																		</Text>
																	</ListItem>	
																)
															}
															{ 	
																//INPUT INTEIRO
																quesito.IND_PNEU == false && quesito.IND_LATARIA == false && quesito.IND_INTEIRO == true && quesito.IND_ATIVO == true && 
																(	
																	<Input 
																		onChangeText={handleChange('inputInteiroQuesito_'+quesito.COD_ITEM)}
																		onBlur={handleBlur('inputInteiroQuesito_'+quesito.COD_ITEM)}
																		placeholder='Valor'
																		value={
																			quesito.COD_ITEM == 1 ? values.inputInteiroQuesito_1 :
																			quesito.COD_ITEM == 2 ? values.inputInteiroQuesito_2 :
																			quesito.COD_ITEM == 3 ? values.inputInteiroQuesito_3 :
																			quesito.COD_ITEM == 4 ? values.inputInteiroQuesito_4 :
																			quesito.COD_ITEM == 5 ? values.inputInteiroQuesito_5 :
																			quesito.COD_ITEM == 6 ? values.inputInteiroQuesito_6 :
																			quesito.COD_ITEM == 7 ? values.inputInteiroQuesito_7 :
																			quesito.COD_ITEM == 8 ? values.inputInteiroQuesito_8 :
																			quesito.COD_ITEM == 9 ? values.inputInteiroQuesito_9 :
																			quesito.COD_ITEM == 10 ? values.inputInteiroQuesito_10 :
																			quesito.COD_ITEM == 11 ? values.inputInteiroQuesito_11 :
																			quesito.COD_ITEM == 12 ? values.inputInteiroQuesito_12 :
																			quesito.COD_ITEM == 13 ? values.inputInteiroQuesito_13 :
																			quesito.COD_ITEM == 14 ? values.inputInteiroQuesito_14 :
																			quesito.COD_ITEM == 15 ? values.inputInteiroQuesito_15 :
																			quesito.COD_ITEM == 16 ? values.inputInteiroQuesito_16 :
																			quesito.COD_ITEM == 17 ? values.inputInteiroQuesito_17 :
																			quesito.COD_ITEM == 18 ? values.inputInteiroQuesito_18 :
																			quesito.COD_ITEM == 19 ? values.inputInteiroQuesito_19 :
																			quesito.COD_ITEM == 20 ? values.inputInteiroQuesito_20 :
																			quesito.COD_ITEM == 21 ? values.inputInteiroQuesito_21 :
																			quesito.COD_ITEM == 22 ? values.inputInteiroQuesito_22 :
																			quesito.COD_ITEM == 23 ? values.inputInteiroQuesito_23 :
																			quesito.COD_ITEM == 24 ? values.inputInteiroQuesito_24 :
																			quesito.COD_ITEM == 25 ? values.inputInteiroQuesito_25 :
																			quesito.COD_ITEM == 26 ? values.inputInteiroQuesito_26 :
																			quesito.COD_ITEM == 27 ? values.inputInteiroQuesito_27 :
																			quesito.COD_ITEM == 28 ? values.inputInteiroQuesito_28 :
																			quesito.COD_ITEM == 29 ? values.inputInteiroQuesito_29 :
																			quesito.COD_ITEM == 30 ? values.inputInteiroQuesito_30 :
																			quesito.COD_ITEM == 31 ? values.inputInteiroQuesito_31 :
																			quesito.COD_ITEM == 32 ? values.inputInteiroQuesito_32 :
																			quesito.COD_ITEM == 33 ? values.inputInteiroQuesito_33 :
																			quesito.COD_ITEM == 34 ? values.inputInteiroQuesito_34 :
																			quesito.COD_ITEM == 35 ? values.inputInteiroQuesito_35 :
																			quesito.COD_ITEM == 36 ? values.inputInteiroQuesito_36 :
																			quesito.COD_ITEM == 37 ? values.inputInteiroQuesito_37 :
																			quesito.COD_ITEM == 38 ? values.inputInteiroQuesito_38 :
																			quesito.COD_ITEM == 39 ? values.inputInteiroQuesito_39 :
																			quesito.COD_ITEM == 40 ? values.inputInteiroQuesito_40 :
																			quesito.COD_ITEM == 41 ? values.inputInteiroQuesito_41 :
																			quesito.COD_ITEM == 42 ? values.inputInteiroQuesito_42 :
																			quesito.COD_ITEM == 43 ? values.inputInteiroQuesito_43 :
																			quesito.COD_ITEM == 44 ? values.inputInteiroQuesito_44 :
																			quesito.COD_ITEM == 45 ? values.inputInteiroQuesito_45 :
																			quesito.COD_ITEM == 46 ? values.inputInteiroQuesito_46 :
																			quesito.COD_ITEM == 47 ? values.inputInteiroQuesito_47 :
																			quesito.COD_ITEM == 48 ? values.inputInteiroQuesito_48 :
																			quesito.COD_ITEM == 49 ? values.inputInteiroQuesito_49 :
																			quesito.COD_ITEM == 50 ? values.inputInteiroQuesito_50 :
																			false
																		}
																	/>
																)
															}
															{ 	
																//INPUT DECIMAL
																quesito.IND_PNEU == false && quesito.IND_LATARIA == false && quesito.IND_DECIMAL == true && quesito.IND_ATIVO == true && 
																(	
																	<Input 
																		onChangeText={handleChange('inputDecimalQuesito_'+quesito.COD_ITEM)}
																		onBlur={handleBlur('inputDecimalQuesito_'+quesito.COD_ITEM)}
																		placeholder='Valor'
																		value={
																			quesito.COD_ITEM == 1 ? values.inputDecimalQuesito_1 :
																			quesito.COD_ITEM == 2 ? values.inputDecimalQuesito_2 :
																			quesito.COD_ITEM == 3 ? values.inputDecimalQuesito_3 :
																			quesito.COD_ITEM == 4 ? values.inputDecimalQuesito_4 :
																			quesito.COD_ITEM == 5 ? values.inputDecimalQuesito_5 :
																			quesito.COD_ITEM == 6 ? values.inputDecimalQuesito_6 :
																			quesito.COD_ITEM == 7 ? values.inputDecimalQuesito_7 :
																			quesito.COD_ITEM == 8 ? values.inputDecimalQuesito_8 :
																			quesito.COD_ITEM == 9 ? values.inputDecimalQuesito_9 :
																			quesito.COD_ITEM == 10 ? values.inputDecimalQuesito_10 :
																			quesito.COD_ITEM == 11 ? values.inputDecimalQuesito_11 :
																			quesito.COD_ITEM == 12 ? values.inputDecimalQuesito_12 :
																			quesito.COD_ITEM == 13 ? values.inputDecimalQuesito_13 :
																			quesito.COD_ITEM == 14 ? values.inputDecimalQuesito_14 :
																			quesito.COD_ITEM == 15 ? values.inputDecimalQuesito_15 :
																			quesito.COD_ITEM == 16 ? values.inputDecimalQuesito_16 :
																			quesito.COD_ITEM == 17 ? values.inputDecimalQuesito_17 :
																			quesito.COD_ITEM == 18 ? values.inputDecimalQuesito_18 :
																			quesito.COD_ITEM == 19 ? values.inputDecimalQuesito_19 :
																			quesito.COD_ITEM == 20 ? values.inputDecimalQuesito_20 :
																			quesito.COD_ITEM == 21 ? values.inputDecimalQuesito_21 :
																			quesito.COD_ITEM == 22 ? values.inputDecimalQuesito_22 :
																			quesito.COD_ITEM == 23 ? values.inputDecimalQuesito_23 :
																			quesito.COD_ITEM == 24 ? values.inputDecimalQuesito_24 :
																			quesito.COD_ITEM == 25 ? values.inputDecimalQuesito_25 :
																			quesito.COD_ITEM == 26 ? values.inputDecimalQuesito_26 :
																			quesito.COD_ITEM == 27 ? values.inputDecimalQuesito_27 :
																			quesito.COD_ITEM == 28 ? values.inputDecimalQuesito_28 :
																			quesito.COD_ITEM == 29 ? values.inputDecimalQuesito_29 :
																			quesito.COD_ITEM == 30 ? values.inputDecimalQuesito_30 :
																			quesito.COD_ITEM == 31 ? values.inputDecimalQuesito_31 :
																			quesito.COD_ITEM == 32 ? values.inputDecimalQuesito_32 :
																			quesito.COD_ITEM == 33 ? values.inputDecimalQuesito_33 :
																			quesito.COD_ITEM == 34 ? values.inputDecimalQuesito_34 :
																			quesito.COD_ITEM == 35 ? values.inputDecimalQuesito_35 :
																			quesito.COD_ITEM == 36 ? values.inputDecimalQuesito_36 :
																			quesito.COD_ITEM == 37 ? values.inputDecimalQuesito_37 :
																			quesito.COD_ITEM == 38 ? values.inputDecimalQuesito_38 :
																			quesito.COD_ITEM == 39 ? values.inputDecimalQuesito_39 :
																			quesito.COD_ITEM == 40 ? values.inputDecimalQuesito_40 :
																			quesito.COD_ITEM == 41 ? values.inputDecimalQuesito_41 :
																			quesito.COD_ITEM == 42 ? values.inputDecimalQuesito_42 :
																			quesito.COD_ITEM == 43 ? values.inputDecimalQuesito_43 :
																			quesito.COD_ITEM == 44 ? values.inputDecimalQuesito_44 :
																			quesito.COD_ITEM == 45 ? values.inputDecimalQuesito_45 :
																			quesito.COD_ITEM == 46 ? values.inputDecimalQuesito_46 :
																			quesito.COD_ITEM == 47 ? values.inputDecimalQuesito_47 :
																			quesito.COD_ITEM == 48 ? values.inputDecimalQuesito_48 :
																			quesito.COD_ITEM == 49 ? values.inputDecimalQuesito_49 :
																			quesito.COD_ITEM == 50 ? values.inputDecimalQuesito_50 : 
																			false
																		}
																	/>
																)
															}
															{ 	
																//INPUT TEXTO
																quesito.IND_PNEU == false && quesito.IND_LATARIA == false && quesito.IND_TEXTO == true && quesito.IND_ATIVO == true && 
																(	
																	<Input 
																		onChangeText={handleChange('inputTextoQuesito_'+quesito.COD_ITEM)}
																		onBlur={handleBlur('inputTextoQuesito_'+quesito.COD_ITEM)}
																		placeholder='Observação'
																		value={ 
																			quesito.COD_ITEM == 1 ? values.inputTextoQuesito_1 :
																			quesito.COD_ITEM == 2 ? values.inputTextoQuesito_2 :
																			quesito.COD_ITEM == 3 ? values.inputTextoQuesito_3 :
																			quesito.COD_ITEM == 4 ? values.inputTextoQuesito_4 :
																			quesito.COD_ITEM == 5 ? values.inputTextoQuesito_5 :
																			quesito.COD_ITEM == 6 ? values.inputTextoQuesito_6 :
																			quesito.COD_ITEM == 7 ? values.inputTextoQuesito_7 :
																			quesito.COD_ITEM == 8 ? values.inputTextoQuesito_8 :
																			quesito.COD_ITEM == 9 ? values.inputTextoQuesito_9 :
																			quesito.COD_ITEM == 10 ? values.inputTextoQuesito_10 :
																			quesito.COD_ITEM == 11 ? values.inputTextoQuesito_11 :
																			quesito.COD_ITEM == 12 ? values.inputTextoQuesito_12 :
																			quesito.COD_ITEM == 13 ? values.inputTextoQuesito_13 :
																			quesito.COD_ITEM == 14 ? values.inputTextoQuesito_14 :
																			quesito.COD_ITEM == 15 ? values.inputTextoQuesito_15 :
																			quesito.COD_ITEM == 16 ? values.inputTextoQuesito_16 :
																			quesito.COD_ITEM == 17 ? values.inputTextoQuesito_17 :
																			quesito.COD_ITEM == 18 ? values.inputTextoQuesito_18 :
																			quesito.COD_ITEM == 19 ? values.inputTextoQuesito_19 :
																			quesito.COD_ITEM == 20 ? values.inputTextoQuesito_20 :
																			quesito.COD_ITEM == 21 ? values.inputTextoQuesito_21 :
																			quesito.COD_ITEM == 22 ? values.inputTextoQuesito_22 :
																			quesito.COD_ITEM == 23 ? values.inputTextoQuesito_23 :
																			quesito.COD_ITEM == 24 ? values.inputTextoQuesito_24 :
																			quesito.COD_ITEM == 25 ? values.inputTextoQuesito_25 :
																			quesito.COD_ITEM == 26 ? values.inputTextoQuesito_26 :
																			quesito.COD_ITEM == 27 ? values.inputTextoQuesito_27 :
																			quesito.COD_ITEM == 28 ? values.inputTextoQuesito_28 :
																			quesito.COD_ITEM == 29 ? values.inputTextoQuesito_29 :
																			quesito.COD_ITEM == 30 ? values.inputTextoQuesito_30 :
																			quesito.COD_ITEM == 31 ? values.inputTextoQuesito_31 :
																			quesito.COD_ITEM == 32 ? values.inputTextoQuesito_32 :
																			quesito.COD_ITEM == 33 ? values.inputTextoQuesito_33 :
																			quesito.COD_ITEM == 34 ? values.inputTextoQuesito_34 :
																			quesito.COD_ITEM == 35 ? values.inputTextoQuesito_35 :
																			quesito.COD_ITEM == 36 ? values.inputTextoQuesito_36 :
																			quesito.COD_ITEM == 37 ? values.inputTextoQuesito_37 :
																			quesito.COD_ITEM == 38 ? values.inputTextoQuesito_38 :
																			quesito.COD_ITEM == 39 ? values.inputTextoQuesito_39 :
																			quesito.COD_ITEM == 40 ? values.inputTextoQuesito_40 :
																			quesito.COD_ITEM == 41 ? values.inputTextoQuesito_41 :
																			quesito.COD_ITEM == 42 ? values.inputTextoQuesito_42 :
																			quesito.COD_ITEM == 43 ? values.inputTextoQuesito_43 :
																			quesito.COD_ITEM == 44 ? values.inputTextoQuesito_44 :
																			quesito.COD_ITEM == 45 ? values.inputTextoQuesito_45 :
																			quesito.COD_ITEM == 46 ? values.inputTextoQuesito_46 :
																			quesito.COD_ITEM == 47 ? values.inputTextoQuesito_47 :
																			quesito.COD_ITEM == 48 ? values.inputTextoQuesito_48 :
																			quesito.COD_ITEM == 49 ? values.inputTextoQuesito_49 :
																			quesito.COD_ITEM == 50 ? values.inputTextoQuesito_50 : 
																			false
																		}
																	/>
																)
															}
															</View>
														)
													})
												)
											)
										}
										</CollapseBody>
									</Collapse>
								</View>
								);
							})
					)
				}
				<Button
					buttonStyle={styles.botao}
					title="REGISTRAR"
					onPress={ () => registrar(values) }
				/>
				<Text></Text>
				<Text></Text>
			</View>
			)}
		</Formik>
		<LoadingItem visible={loading} />
		</ScrollView>
  );
}

Checklist.navigationOptions = {
	title: 'Checklist'
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
		textAlign: "left",
		fontSize: 26,
		fontWeight: 'bold',
		paddingLeft:5
	},
	textoTipoEquipamento: {
		textAlign: "left",
		fontSize: 16,
		fontWeight: 'bold',
		paddingLeft:5
	},
	textoCliente: {
		textAlign: "left",
		fontSize: 14,
		fontWeight: 'bold',
		paddingLeft:5
	},
	containerImg: {
		padding: 10,
		justifyContent: 'center',
		alignItems: 'center',
	},
	img:{
		height: 70,
		width: 70,
		resizeMode: 'cover',
	},
	botao: {
		marginTop: 20,
		marginBottom:30,
		backgroundColor: 'rgb(0,86,112)',
	},
});
