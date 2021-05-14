import { StatusBar } from 'expo-status-bar';
import React, {useEffect, useState} from 'react';
import { StyleSheet, View, ScrollView, Switch, Alert, Picker } from 'react-native';
import {buscarQuesitos} from '../services/api';
import { Separator, Radio, Right, Left, Center, ListItem } from 'native-base';
import {Collapse,CollapseHeader, CollapseBody, AccordionList} from 'accordion-collapse-react-native';
import LoadingItem from '../components/LoadingItem';
import { RadioButton } from 'react-native-paper';
import { Button, Text, Input } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';

import NetInfo from "@react-native-community/netinfo";

import { Formik } from 'formik';

export default function Checklist(props) {

	const [nomeEquipamento, setNomeEquipamento] = useState('');
	const [qrCodeEquipamento, setQrCodeEquipamento] = useState('');
	const [loading, setloading] = useState(false);
	const [ultimoCheckup, setUltimoCheckup] = useState('');
	const [ultimoHorimetro, setUltimoHorimetro] = useState('');
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
			//let respostaQuesitos = await buscarQuesitos(dominio, props.navigation.getParam('qrCodeEquipamento'));
			let respostaQuesitos = await buscarQuesitos(dominio, 2000);
			
			if(respostaQuesitos.status){
				if(respostaQuesitos.resultado == "Chave invalida."){
					setloading(false);
					Alert.alert('Aviso', 'Chave de autenticação inválida.');
				}
				setloading(false);
				setQuesitos(respostaQuesitos.resultado.data.draw);
				setUltimoCheckup(respostaQuesitos.resultado.data.draw.ULT_CHECKUP);
				setUltimoHorimetro(respostaQuesitos.resultado.data.draw.ULT_HORIMETRO);
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
			  Alert.alert('Aviso', 'Dispositivo sem conexÃ£o com a internet.');
			}
		});
		
		
	}, []);
	
	
  return (
    	<ScrollView style={styles.container}>

		<Text style={styles.textoEquipamento}>{'QR Code: '+qrCodeEquipamento }</Text>
		<Text style={styles.textoEquipamento}>{'Equipamento: '+nomeEquipamento}</Text>
		<Text style={{ padding: 5}}>{'Último checkup: '+ultimoCheckup}</Text>
		<Text style={{ padding: 5}}>{'Último horí­metro: '+ultimoHorimetro}</Text>
		
		<Formik
			initialValues={{}}
			onSubmit={values => console.log(values)}
		>
			{({ handleChange, handleBlur, handleSubmit, setFieldValue, values }) => (
			<View>
				{
					quesitos.GRUPO != undefined && (
						quesitos.GRUPO.map((grupo, g) => {
							return (
								<View key={grupo.COD_GRUPO}>
									<Collapse>
										<CollapseHeader>
											<Separator style={{ backgroundColor: 'rgb(250,184,29)', height: 45, marginTop: 3 }} bordered >
											<Text>
											<Icon
												name= 'plus'
												size={15}
												color="black"
											/>
											&nbsp;&nbsp;{grupo.DES_GRUPO}
											</Text>
											</Separator>
										</CollapseHeader>
										<CollapseBody>
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
																	<Separator style={{ backgroundColor: 'rgb(200, 251, 88)', height: 45, marginTop: 3, marginLeft: 20, marginRight: 20  }} bordered >
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
																					//CHECKBOX
																					quesito.IND_CHECKBOX == true && quesito.IND_ATIVO == true && 
																					(
																						<ListItem>
																							<Switch
																								trackColor={{ false: "red", true: "#C5DB5F" }}
																								thumbColor={ "#fff"}
																								ios_backgroundColor="#fff"
																								onValueChange={ (previousState) => setFieldValue('Pneu_'+listbox.COD_OPCAO+'_cbQuesito_'+quesito.COD_ITEM, previousState ) }
																								value={
																									//PNEU 1
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 1 ? values.Pneu_1_cbQuesito_1 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 2 ? values.Pneu_1_cbQuesito_2 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 3 ? values.Pneu_1_cbQuesito_3 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 4 ? values.Pneu_1_cbQuesito_4 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 5 ? values.Pneu_1_cbQuesito_5 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 6 ? values.Pneu_1_cbQuesito_6 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 7 ? values.Pneu_1_cbQuesito_7 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 8 ? values.Pneu_1_cbQuesito_8 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 9 ? values.Pneu_1_cbQuesito_9 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 10  ? values.Pneu_1_cbQuesito_10 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 11  ? values.Pneu_1_cbQuesito_11 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 12  ? values.Pneu_1_cbQuesito_12 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 13  ? values.Pneu_1_cbQuesito_13 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 14  ? values.Pneu_1_cbQuesito_14 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 15  ? values.Pneu_1_cbQuesito_15 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 16  ? values.Pneu_1_cbQuesito_16 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 17  ? values.Pneu_1_cbQuesito_17 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 18  ? values.Pneu_1_cbQuesito_18 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 19  ? values.Pneu_1_cbQuesito_19 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 20  ? values.Pneu_1_cbQuesito_20 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 21  ? values.Pneu_1_cbQuesito_21 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 22  ? values.Pneu_1_cbQuesito_22 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 23  ? values.Pneu_1_cbQuesito_23 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 24  ? values.Pneu_1_cbQuesito_24 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 25  ? values.Pneu_1_cbQuesito_25 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 26  ? values.Pneu_1_cbQuesito_26 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 27  ? values.Pneu_1_cbQuesito_27 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 28  ? values.Pneu_1_cbQuesito_28 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 29  ? values.Pneu_1_cbQuesito_29 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 30  ? values.Pneu_1_cbQuesito_30 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 31  ? values.Pneu_1_cbQuesito_31 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 32  ? values.Pneu_1_cbQuesito_32 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 33  ? values.Pneu_1_cbQuesito_33 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 34  ? values.Pneu_1_cbQuesito_34 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 35  ? values.Pneu_1_cbQuesito_35 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 36  ? values.Pneu_1_cbQuesito_36 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 37  ? values.Pneu_1_cbQuesito_37 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 38  ? values.Pneu_1_cbQuesito_38 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 39  ? values.Pneu_1_cbQuesito_39 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 40  ? values.Pneu_1_cbQuesito_40 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 41  ? values.Pneu_1_cbQuesito_41 :

																									//PNEU 2
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 1 ? values.Pneu_2_cbQuesito_1 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 2 ? values.Pneu_2_cbQuesito_2 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 3 ? values.Pneu_2_cbQuesito_3 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 4 ? values.Pneu_2_cbQuesito_4 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 5 ? values.Pneu_2_cbQuesito_5 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 6 ? values.Pneu_2_cbQuesito_6 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 7 ? values.Pneu_2_cbQuesito_7 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 8 ? values.Pneu_2_cbQuesito_8 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 9 ? values.Pneu_2_cbQuesito_9 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 10  ? values.Pneu_2_cbQuesito_10 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 11  ? values.Pneu_2_cbQuesito_11 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 12  ? values.Pneu_2_cbQuesito_12 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 13  ? values.Pneu_2_cbQuesito_13 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 14  ? values.Pneu_2_cbQuesito_14 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 15  ? values.Pneu_2_cbQuesito_15 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 16  ? values.Pneu_2_cbQuesito_16 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 17  ? values.Pneu_2_cbQuesito_17 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 18  ? values.Pneu_2_cbQuesito_18 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 19  ? values.Pneu_2_cbQuesito_19 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 20  ? values.Pneu_2_cbQuesito_20 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 21  ? values.Pneu_2_cbQuesito_21 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 22  ? values.Pneu_2_cbQuesito_22 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 23  ? values.Pneu_2_cbQuesito_23 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 24  ? values.Pneu_2_cbQuesito_24 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 25  ? values.Pneu_2_cbQuesito_25 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 26  ? values.Pneu_2_cbQuesito_26 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 27  ? values.Pneu_2_cbQuesito_27 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 28  ? values.Pneu_2_cbQuesito_28 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 29  ? values.Pneu_2_cbQuesito_29 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 30  ? values.Pneu_2_cbQuesito_30 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 31  ? values.Pneu_2_cbQuesito_31 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 32  ? values.Pneu_2_cbQuesito_32 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 33  ? values.Pneu_2_cbQuesito_33 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 34  ? values.Pneu_2_cbQuesito_34 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 35  ? values.Pneu_2_cbQuesito_35 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 36  ? values.Pneu_2_cbQuesito_36 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 37  ? values.Pneu_2_cbQuesito_37 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 38  ? values.Pneu_2_cbQuesito_38 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 39  ? values.Pneu_2_cbQuesito_39 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 40  ? values.Pneu_2_cbQuesito_40 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 41  ? values.Pneu_2_cbQuesito_41 :

																									//PNEU 3
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 1 ? values.Pneu_3_cbQuesito_1 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 2 ? values.Pneu_3_cbQuesito_2 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 3 ? values.Pneu_3_cbQuesito_3 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 4 ? values.Pneu_3_cbQuesito_4 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 5 ? values.Pneu_3_cbQuesito_5 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 6 ? values.Pneu_3_cbQuesito_6 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 7 ? values.Pneu_3_cbQuesito_7 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 8 ? values.Pneu_3_cbQuesito_8 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 9 ? values.Pneu_3_cbQuesito_9 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 10  ? values.Pneu_3_cbQuesito_10 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 11  ? values.Pneu_3_cbQuesito_11 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 12  ? values.Pneu_3_cbQuesito_12 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 13  ? values.Pneu_3_cbQuesito_13 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 14  ? values.Pneu_3_cbQuesito_14 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 15  ? values.Pneu_3_cbQuesito_15 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 16  ? values.Pneu_3_cbQuesito_16 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 17  ? values.Pneu_3_cbQuesito_17 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 18  ? values.Pneu_3_cbQuesito_18 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 19  ? values.Pneu_3_cbQuesito_19 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 20  ? values.Pneu_3_cbQuesito_20 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 21  ? values.Pneu_3_cbQuesito_21 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 22  ? values.Pneu_3_cbQuesito_22 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 23  ? values.Pneu_3_cbQuesito_23 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 24  ? values.Pneu_3_cbQuesito_24 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 25  ? values.Pneu_3_cbQuesito_25 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 26  ? values.Pneu_3_cbQuesito_26 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 27  ? values.Pneu_3_cbQuesito_27 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 28  ? values.Pneu_3_cbQuesito_28 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 29  ? values.Pneu_3_cbQuesito_29 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 30  ? values.Pneu_3_cbQuesito_30 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 31  ? values.Pneu_3_cbQuesito_31 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 32  ? values.Pneu_3_cbQuesito_32 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 33  ? values.Pneu_3_cbQuesito_33 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 34  ? values.Pneu_3_cbQuesito_34 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 35  ? values.Pneu_3_cbQuesito_35 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 36  ? values.Pneu_3_cbQuesito_36 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 37  ? values.Pneu_3_cbQuesito_37 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 38  ? values.Pneu_3_cbQuesito_38 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 39  ? values.Pneu_3_cbQuesito_39 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 40  ? values.Pneu_3_cbQuesito_40 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 41  ? values.Pneu_3_cbQuesito_41 :

																									//PNEU 4
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 1 ? values.Pneu_4_cbQuesito_1 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 2 ? values.Pneu_4_cbQuesito_2 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 3 ? values.Pneu_4_cbQuesito_3 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 4 ? values.Pneu_4_cbQuesito_4 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 5 ? values.Pneu_4_cbQuesito_5 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 6 ? values.Pneu_4_cbQuesito_6 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 7 ? values.Pneu_4_cbQuesito_7 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 8 ? values.Pneu_4_cbQuesito_8 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 9 ? values.Pneu_4_cbQuesito_9 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 10  ? values.Pneu_4_cbQuesito_10 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 11  ? values.Pneu_4_cbQuesito_11 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 12  ? values.Pneu_4_cbQuesito_12 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 13  ? values.Pneu_4_cbQuesito_13 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 14  ? values.Pneu_4_cbQuesito_14 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 15  ? values.Pneu_4_cbQuesito_15 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 16  ? values.Pneu_4_cbQuesito_16 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 17  ? values.Pneu_4_cbQuesito_17 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 18  ? values.Pneu_4_cbQuesito_18 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 19  ? values.Pneu_4_cbQuesito_19 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 20  ? values.Pneu_4_cbQuesito_20 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 21  ? values.Pneu_4_cbQuesito_21 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 22  ? values.Pneu_4_cbQuesito_22 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 23  ? values.Pneu_4_cbQuesito_23 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 24  ? values.Pneu_4_cbQuesito_24 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 25  ? values.Pneu_4_cbQuesito_25 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 26  ? values.Pneu_4_cbQuesito_26 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 27  ? values.Pneu_4_cbQuesito_27 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 28  ? values.Pneu_4_cbQuesito_28 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 29  ? values.Pneu_4_cbQuesito_29 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 30  ? values.Pneu_4_cbQuesito_30 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 31  ? values.Pneu_4_cbQuesito_31 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 32  ? values.Pneu_4_cbQuesito_32 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 33  ? values.Pneu_4_cbQuesito_33 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 34  ? values.Pneu_4_cbQuesito_34 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 35  ? values.Pneu_4_cbQuesito_35 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 36  ? values.Pneu_4_cbQuesito_36 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 37  ? values.Pneu_4_cbQuesito_37 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 38  ? values.Pneu_4_cbQuesito_38 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 39  ? values.Pneu_4_cbQuesito_39 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 40  ? values.Pneu_4_cbQuesito_40 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 41  ? values.Pneu_4_cbQuesito_41 :
																									
																									//PNEU 5
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 1 ? values.Pneu_5_cbQuesito_1 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 2 ? values.Pneu_5_cbQuesito_2 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 3 ? values.Pneu_5_cbQuesito_3 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 4 ? values.Pneu_5_cbQuesito_4 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 5 ? values.Pneu_5_cbQuesito_5 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 6 ? values.Pneu_5_cbQuesito_6 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 7 ? values.Pneu_5_cbQuesito_7 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 8 ? values.Pneu_5_cbQuesito_8 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 9 ? values.Pneu_5_cbQuesito_9 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 10  ? values.Pneu_5_cbQuesito_10 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 11  ? values.Pneu_5_cbQuesito_11 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 12  ? values.Pneu_5_cbQuesito_12 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 13  ? values.Pneu_5_cbQuesito_13 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 14  ? values.Pneu_5_cbQuesito_14 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 15  ? values.Pneu_5_cbQuesito_15 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 16  ? values.Pneu_5_cbQuesito_16 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 17  ? values.Pneu_5_cbQuesito_17 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 18  ? values.Pneu_5_cbQuesito_18 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 19  ? values.Pneu_5_cbQuesito_19 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 20  ? values.Pneu_5_cbQuesito_20 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 21  ? values.Pneu_5_cbQuesito_21 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 22  ? values.Pneu_5_cbQuesito_22 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 23  ? values.Pneu_5_cbQuesito_23 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 24  ? values.Pneu_5_cbQuesito_24 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 25  ? values.Pneu_5_cbQuesito_25 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 26  ? values.Pneu_5_cbQuesito_26 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 27  ? values.Pneu_5_cbQuesito_27 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 28  ? values.Pneu_5_cbQuesito_28 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 29  ? values.Pneu_5_cbQuesito_29 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 30  ? values.Pneu_5_cbQuesito_30 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 31  ? values.Pneu_5_cbQuesito_31 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 32  ? values.Pneu_5_cbQuesito_32 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 33  ? values.Pneu_5_cbQuesito_33 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 34  ? values.Pneu_5_cbQuesito_34 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 35  ? values.Pneu_5_cbQuesito_35 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 36  ? values.Pneu_5_cbQuesito_36 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 37  ? values.Pneu_5_cbQuesito_37 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 38  ? values.Pneu_5_cbQuesito_38 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 39  ? values.Pneu_5_cbQuesito_39 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 40  ? values.Pneu_5_cbQuesito_50 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 41  ? values.Pneu_5_cbQuesito_51 :

																									//PNEU 6
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 1 ? values.Pneu_6_cbQuesito_1 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 2 ? values.Pneu_6_cbQuesito_2 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 3 ? values.Pneu_6_cbQuesito_3 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 4 ? values.Pneu_6_cbQuesito_4 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 5 ? values.Pneu_6_cbQuesito_5 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 6 ? values.Pneu_6_cbQuesito_6 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 7 ? values.Pneu_6_cbQuesito_7 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 8 ? values.Pneu_6_cbQuesito_8 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 9 ? values.Pneu_6_cbQuesito_9 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 10  ? values.Pneu_6_cbQuesito_10 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 11  ? values.Pneu_6_cbQuesito_11 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 12  ? values.Pneu_6_cbQuesito_12 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 13  ? values.Pneu_6_cbQuesito_13 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 14  ? values.Pneu_6_cbQuesito_14 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 15  ? values.Pneu_6_cbQuesito_15 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 16  ? values.Pneu_6_cbQuesito_16 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 17  ? values.Pneu_6_cbQuesito_17 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 18  ? values.Pneu_6_cbQuesito_18 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 19  ? values.Pneu_6_cbQuesito_19 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 20  ? values.Pneu_6_cbQuesito_20 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 21  ? values.Pneu_6_cbQuesito_21 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 22  ? values.Pneu_6_cbQuesito_22 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 23  ? values.Pneu_6_cbQuesito_23 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 24  ? values.Pneu_6_cbQuesito_24 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 25  ? values.Pneu_6_cbQuesito_25 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 26  ? values.Pneu_6_cbQuesito_26 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 27  ? values.Pneu_6_cbQuesito_27 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 28  ? values.Pneu_6_cbQuesito_28 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 29  ? values.Pneu_6_cbQuesito_29 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 30  ? values.Pneu_6_cbQuesito_30 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 31  ? values.Pneu_6_cbQuesito_31 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 32  ? values.Pneu_6_cbQuesito_32 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 33  ? values.Pneu_6_cbQuesito_33 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 34  ? values.Pneu_6_cbQuesito_34 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 35  ? values.Pneu_6_cbQuesito_35 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 36  ? values.Pneu_6_cbQuesito_36 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 37  ? values.Pneu_6_cbQuesito_37 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 38  ? values.Pneu_6_cbQuesito_38 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 39  ? values.Pneu_6_cbQuesito_39 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 40  ? values.Pneu_6_cbQuesito_40 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 41  ? values.Pneu_6_cbQuesito_41 :

																									false
																								}
																							/>
																						</ListItem>	
																					)
																				}
																				{
																					//INPUT TEXTO PNEU
																					 quesito.IND_TEXTO == true && quesito.IND_ATIVO == true && 
																					(	
																						<>
																						<Input 
																							onChangeText={handleChange('Pneu_'+listbox.COD_OPCAO+'_inputTextoQuesito_'+quesito.COD_ITEM)}
																							onBlur={handleBlur('Pneu_'+listbox.COD_OPCAO+'_inputTextoQuesito_'+quesito.COD_ITEM)}
																							placeholder='Observação'
																							value={
																								//PNEU 1
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 1 ? values.Pneu_1_inputTextoQuesito_1 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 2 ? values.Pneu_1_inputTextoQuesito_2 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 3 ? values.Pneu_1_inputTextoQuesito_3 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 4 ? values.Pneu_1_inputTextoQuesito_4 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 5 ? values.Pneu_1_inputTextoQuesito_5 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 6 ? values.Pneu_1_inputTextoQuesito_6 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 7 ? values.Pneu_1_inputTextoQuesito_7 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 8 ? values.Pneu_1_inputTextoQuesito_8 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 9 ? values.Pneu_1_inputTextoQuesito_9 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 10  ? values.Pneu_1_inputTextoQuesito_10 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 11  ? values.Pneu_1_inputTextoQuesito_11 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 12  ? values.Pneu_1_inputTextoQuesito_12 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 13  ? values.Pneu_1_inputTextoQuesito_13 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 14  ? values.Pneu_1_inputTextoQuesito_14 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 15  ? values.Pneu_1_inputTextoQuesito_15 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 16  ? values.Pneu_1_inputTextoQuesito_16 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 17  ? values.Pneu_1_inputTextoQuesito_17 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 18  ? values.Pneu_1_inputTextoQuesito_18 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 19  ? values.Pneu_1_inputTextoQuesito_19 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 20  ? values.Pneu_1_inputTextoQuesito_20 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 21  ? values.Pneu_1_inputTextoQuesito_21 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 22  ? values.Pneu_1_inputTextoQuesito_22 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 23  ? values.Pneu_1_inputTextoQuesito_23 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 24  ? values.Pneu_1_inputTextoQuesito_24 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 25  ? values.Pneu_1_inputTextoQuesito_25 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 26  ? values.Pneu_1_inputTextoQuesito_26 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 27  ? values.Pneu_1_inputTextoQuesito_27 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 28  ? values.Pneu_1_inputTextoQuesito_28 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 29  ? values.Pneu_1_inputTextoQuesito_29 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 30  ? values.Pneu_1_inputTextoQuesito_30 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 31  ? values.Pneu_1_inputTextoQuesito_31 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 32  ? values.Pneu_1_inputTextoQuesito_32 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 33  ? values.Pneu_1_inputTextoQuesito_33 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 34  ? values.Pneu_1_inputTextoQuesito_34 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 35  ? values.Pneu_1_inputTextoQuesito_35 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 36  ? values.Pneu_1_inputTextoQuesito_36 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 37  ? values.Pneu_1_inputTextoQuesito_37 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 38  ? values.Pneu_1_inputTextoQuesito_38 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 39  ? values.Pneu_1_inputTextoQuesito_39 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 40  ? values.Pneu_1_inputTextoQuesito_40 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 41  ? values.Pneu_1_inputTextoQuesito_41 :

																								//PNEU 2
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 1 ? values.Pneu_2_inputTextoQuesito_1 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 2 ? values.Pneu_2_inputTextoQuesito_2 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 3 ? values.Pneu_2_inputTextoQuesito_3 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 4 ? values.Pneu_2_inputTextoQuesito_4 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 5 ? values.Pneu_2_inputTextoQuesito_5 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 6 ? values.Pneu_2_inputTextoQuesito_6 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 7 ? values.Pneu_2_inputTextoQuesito_7 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 8 ? values.Pneu_2_inputTextoQuesito_8 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 9 ? values.Pneu_2_inputTextoQuesito_9 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 10  ? values.Pneu_2_inputTextoQuesito_10 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 11  ? values.Pneu_2_inputTextoQuesito_11 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 12  ? values.Pneu_2_inputTextoQuesito_12 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 13  ? values.Pneu_2_inputTextoQuesito_13 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 14  ? values.Pneu_2_inputTextoQuesito_14 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 15  ? values.Pneu_2_inputTextoQuesito_15 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 16  ? values.Pneu_2_inputTextoQuesito_16 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 17  ? values.Pneu_2_inputTextoQuesito_17 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 18  ? values.Pneu_2_inputTextoQuesito_18 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 19  ? values.Pneu_2_inputTextoQuesito_19 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 20  ? values.Pneu_2_inputTextoQuesito_20 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 21  ? values.Pneu_2_inputTextoQuesito_21 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 22  ? values.Pneu_2_inputTextoQuesito_22 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 23  ? values.Pneu_2_inputTextoQuesito_23 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 24  ? values.Pneu_2_inputTextoQuesito_24 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 25  ? values.Pneu_2_inputTextoQuesito_25 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 26  ? values.Pneu_2_inputTextoQuesito_26 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 27  ? values.Pneu_2_inputTextoQuesito_27 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 28  ? values.Pneu_2_inputTextoQuesito_28 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 29  ? values.Pneu_2_inputTextoQuesito_29 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 30  ? values.Pneu_2_inputTextoQuesito_30 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 31  ? values.Pneu_2_inputTextoQuesito_31 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 32  ? values.Pneu_2_inputTextoQuesito_32 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 33  ? values.Pneu_2_inputTextoQuesito_33 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 34  ? values.Pneu_2_inputTextoQuesito_34 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 35  ? values.Pneu_2_inputTextoQuesito_35 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 36  ? values.Pneu_2_inputTextoQuesito_36 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 37  ? values.Pneu_2_inputTextoQuesito_37 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 38  ? values.Pneu_2_inputTextoQuesito_38 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 39  ? values.Pneu_2_inputTextoQuesito_39 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 40  ? values.Pneu_2_inputTextoQuesito_40 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 41  ? values.Pneu_2_inputTextoQuesito_41 :

																								//PNEU 3
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 1 ? values.Pneu_3_inputTextoQuesito_1 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 2 ? values.Pneu_3_inputTextoQuesito_2 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 3 ? values.Pneu_3_inputTextoQuesito_3 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 4 ? values.Pneu_3_inputTextoQuesito_4 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 5 ? values.Pneu_3_inputTextoQuesito_5 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 6 ? values.Pneu_3_inputTextoQuesito_6 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 7 ? values.Pneu_3_inputTextoQuesito_7 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 8 ? values.Pneu_3_inputTextoQuesito_8 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 9 ? values.Pneu_3_inputTextoQuesito_9 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 10  ? values.Pneu_3_inputTextoQuesito_10 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 11  ? values.Pneu_3_inputTextoQuesito_11 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 12  ? values.Pneu_3_inputTextoQuesito_12 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 13  ? values.Pneu_3_inputTextoQuesito_13 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 14  ? values.Pneu_3_inputTextoQuesito_14 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 15  ? values.Pneu_3_inputTextoQuesito_15 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 16  ? values.Pneu_3_inputTextoQuesito_16 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 17  ? values.Pneu_3_inputTextoQuesito_17 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 18  ? values.Pneu_3_inputTextoQuesito_18 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 19  ? values.Pneu_3_inputTextoQuesito_19 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 20  ? values.Pneu_3_inputTextoQuesito_20 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 21  ? values.Pneu_3_inputTextoQuesito_21 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 22  ? values.Pneu_3_inputTextoQuesito_22 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 23  ? values.Pneu_3_inputTextoQuesito_23 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 24  ? values.Pneu_3_inputTextoQuesito_24 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 25  ? values.Pneu_3_inputTextoQuesito_25 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 26  ? values.Pneu_3_inputTextoQuesito_26 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 27  ? values.Pneu_3_inputTextoQuesito_27 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 28  ? values.Pneu_3_inputTextoQuesito_28 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 29  ? values.Pneu_3_inputTextoQuesito_29 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 30  ? values.Pneu_3_inputTextoQuesito_30 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 31  ? values.Pneu_3_inputTextoQuesito_31 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 32  ? values.Pneu_3_inputTextoQuesito_32 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 33  ? values.Pneu_3_inputTextoQuesito_33 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 34  ? values.Pneu_3_inputTextoQuesito_34 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 35  ? values.Pneu_3_inputTextoQuesito_35 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 36  ? values.Pneu_3_inputTextoQuesito_36 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 37  ? values.Pneu_3_inputTextoQuesito_37 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 38  ? values.Pneu_3_inputTextoQuesito_38 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 39  ? values.Pneu_3_inputTextoQuesito_39 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 40  ? values.Pneu_3_inputTextoQuesito_40 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 41  ? values.Pneu_3_inputTextoQuesito_41 :

																								//PNEU 4
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 1 ? values.Pneu_4_inputTextoQuesito_1 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 2 ? values.Pneu_4_inputTextoQuesito_2 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 3 ? values.Pneu_4_inputTextoQuesito_3 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 4 ? values.Pneu_4_inputTextoQuesito_4 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 5 ? values.Pneu_4_inputTextoQuesito_5 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 6 ? values.Pneu_4_inputTextoQuesito_6 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 7 ? values.Pneu_4_inputTextoQuesito_7 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 8 ? values.Pneu_4_inputTextoQuesito_8 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 9 ? values.Pneu_4_inputTextoQuesito_9 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 10  ? values.Pneu_4_inputTextoQuesito_10 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 11  ? values.Pneu_4_inputTextoQuesito_11 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 12  ? values.Pneu_4_inputTextoQuesito_12 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 13  ? values.Pneu_4_inputTextoQuesito_13 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 14  ? values.Pneu_4_inputTextoQuesito_14 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 15  ? values.Pneu_4_inputTextoQuesito_15 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 16  ? values.Pneu_4_inputTextoQuesito_16 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 17  ? values.Pneu_4_inputTextoQuesito_17 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 18  ? values.Pneu_4_inputTextoQuesito_18 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 19  ? values.Pneu_4_inputTextoQuesito_19 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 20  ? values.Pneu_4_inputTextoQuesito_20 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 21  ? values.Pneu_4_inputTextoQuesito_21 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 22  ? values.Pneu_4_inputTextoQuesito_22 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 23  ? values.Pneu_4_inputTextoQuesito_24 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 24  ? values.Pneu_4_inputTextoQuesito_24 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 25  ? values.Pneu_4_inputTextoQuesito_25 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 26  ? values.Pneu_4_inputTextoQuesito_26 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 27  ? values.Pneu_4_inputTextoQuesito_27 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 28  ? values.Pneu_4_inputTextoQuesito_28 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 29  ? values.Pneu_4_inputTextoQuesito_29 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 30  ? values.Pneu_4_inputTextoQuesito_30 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 31  ? values.Pneu_4_inputTextoQuesito_31 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 32  ? values.Pneu_4_inputTextoQuesito_32 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 33  ? values.Pneu_4_inputTextoQuesito_33 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 34  ? values.Pneu_4_inputTextoQuesito_34 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 35  ? values.Pneu_4_inputTextoQuesito_35 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 36  ? values.Pneu_4_inputTextoQuesito_36 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 37  ? values.Pneu_4_inputTextoQuesito_37 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 38  ? values.Pneu_4_inputTextoQuesito_38 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 39  ? values.Pneu_4_inputTextoQuesito_39 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 40  ? values.Pneu_4_inputTextoQuesito_40 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 41  ? values.Pneu_4_inputTextoQuesito_41 :

																								//PNEU 5
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 1 ? values.Pneu_5_inputTextoQuesito_1 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 2 ? values.Pneu_5_inputTextoQuesito_2 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 3 ? values.Pneu_5_inputTextoQuesito_3 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 4 ? values.Pneu_5_inputTextoQuesito_4 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 5 ? values.Pneu_5_inputTextoQuesito_5 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 6 ? values.Pneu_5_inputTextoQuesito_6 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 7 ? values.Pneu_5_inputTextoQuesito_7 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 8 ? values.Pneu_5_inputTextoQuesito_8 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 9 ? values.Pneu_5_inputTextoQuesito_9 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 10  ? values.Pneu_5_inputTextoQuesito_10 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 11  ? values.Pneu_5_inputTextoQuesito_11 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 12  ? values.Pneu_5_inputTextoQuesito_12 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 13  ? values.Pneu_5_inputTextoQuesito_13 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 14  ? values.Pneu_5_inputTextoQuesito_14 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 15  ? values.Pneu_5_inputTextoQuesito_15 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 16  ? values.Pneu_5_inputTextoQuesito_16 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 17  ? values.Pneu_5_inputTextoQuesito_17 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 18  ? values.Pneu_5_inputTextoQuesito_18 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 19  ? values.Pneu_5_inputTextoQuesito_19 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 20  ? values.Pneu_5_inputTextoQuesito_20 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 21  ? values.Pneu_5_inputTextoQuesito_21 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 22  ? values.Pneu_5_inputTextoQuesito_22 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 23  ? values.Pneu_5_inputTextoQuesito_23 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 24  ? values.Pneu_5_inputTextoQuesito_24 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 25  ? values.Pneu_5_inputTextoQuesito_25 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 26  ? values.Pneu_5_inputTextoQuesito_26 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 27  ? values.Pneu_5_inputTextoQuesito_27 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 28  ? values.Pneu_5_inputTextoQuesito_28 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 29  ? values.Pneu_5_inputTextoQuesito_29 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 30  ? values.Pneu_5_inputTextoQuesito_30 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 31  ? values.Pneu_5_inputTextoQuesito_31 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 32  ? values.Pneu_5_inputTextoQuesito_32 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 33  ? values.Pneu_5_inputTextoQuesito_33 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 34  ? values.Pneu_5_inputTextoQuesito_34 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 35  ? values.Pneu_5_inputTextoQuesito_35 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 36  ? values.Pneu_5_inputTextoQuesito_36 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 37  ? values.Pneu_5_inputTextoQuesito_37 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 38  ? values.Pneu_5_inputTextoQuesito_38 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 39  ? values.Pneu_5_inputTextoQuesito_39 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 40  ? values.Pneu_5_inputTextoQuesito_40 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 41  ? values.Pneu_5_inputTextoQuesito_41 :

																								//PNEU 6
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 1 ? values.Pneu_6_inputTextoQuesito_1 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 2 ? values.Pneu_6_inputTextoQuesito_2 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 3 ? values.Pneu_6_inputTextoQuesito_3 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 4 ? values.Pneu_6_inputTextoQuesito_4 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 5 ? values.Pneu_6_inputTextoQuesito_5 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 6 ? values.Pneu_6_inputTextoQuesito_6 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 7 ? values.Pneu_6_inputTextoQuesito_7 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 8 ? values.Pneu_6_inputTextoQuesito_8 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 9 ? values.Pneu_6_inputTextoQuesito_9 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 10  ? values.Pneu_6_inputTextoQuesito_10 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 11  ? values.Pneu_6_inputTextoQuesito_11 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 12  ? values.Pneu_6_inputTextoQuesito_12 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 13  ? values.Pneu_6_inputTextoQuesito_13 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 14  ? values.Pneu_6_inputTextoQuesito_14 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 15  ? values.Pneu_6_inputTextoQuesito_15 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 16  ? values.Pneu_6_inputTextoQuesito_16 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 17  ? values.Pneu_6_inputTextoQuesito_17 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 18  ? values.Pneu_6_inputTextoQuesito_18 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 19  ? values.Pneu_6_inputTextoQuesito_19 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 20  ? values.Pneu_6_inputTextoQuesito_20 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 21  ? values.Pneu_6_inputTextoQuesito_21 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 22  ? values.Pneu_6_inputTextoQuesito_22 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 23  ? values.Pneu_6_inputTextoQuesito_23 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 24  ? values.Pneu_6_inputTextoQuesito_24 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 25  ? values.Pneu_6_inputTextoQuesito_25 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 26  ? values.Pneu_6_inputTextoQuesito_26 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 27  ? values.Pneu_6_inputTextoQuesito_27 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 28  ? values.Pneu_6_inputTextoQuesito_28 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 29  ? values.Pneu_6_inputTextoQuesito_29 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 30  ? values.Pneu_6_inputTextoQuesito_30 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 31  ? values.Pneu_6_inputTextoQuesito_31 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 32  ? values.Pneu_6_inputTextoQuesito_32 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 33  ? values.Pneu_6_inputTextoQuesito_33 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 34  ? values.Pneu_6_inputTextoQuesito_34 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 35  ? values.Pneu_6_inputTextoQuesito_35 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 36  ? values.Pneu_6_inputTextoQuesito_36 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 37  ? values.Pneu_6_inputTextoQuesito_37 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 38  ? values.Pneu_6_inputTextoQuesito_38 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 39  ? values.Pneu_6_inputTextoQuesito_39 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 40  ? values.Pneu_6_inputTextoQuesito_40 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 41  ? values.Pneu_6_inputTextoQuesito_41 :

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
																							onChangeText={handleChange('Pneu_'+listbox.COD_OPCAO+'_inputDecimalQuesito_'+quesito.COD_ITEM)}
																							onBlur={handleBlur('Pneu_'+listbox.COD_OPCAO+'_inputDecimalQuesito_'+quesito.COD_ITEM)}
																							placeholder='Decimal'
																							value={
																								//PNEU 1
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 1 ? values.Pneu_1_inputDecimalQuesito_1 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 2 ? values.Pneu_1_inputDecimalQuesito_2 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 3 ? values.Pneu_1_inputDecimalQuesito_3 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 4 ? values.Pneu_1_inputDecimalQuesito_4 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 5 ? values.Pneu_1_inputDecimalQuesito_5 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 6 ? values.Pneu_1_inputDecimalQuesito_6 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 7 ? values.Pneu_1_inputDecimalQuesito_7 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 8 ? values.Pneu_1_inputDecimalQuesito_8 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 9 ? values.Pneu_1_inputDecimalQuesito_9 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 10  ? values.Pneu_1_inputDecimalQuesito_10 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 11  ? values.Pneu_1_inputDecimalQuesito_11 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 12  ? values.Pneu_1_inputDecimalQuesito_12 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 13  ? values.Pneu_1_inputDecimalQuesito_13 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 14  ? values.Pneu_1_inputDecimalQuesito_14 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 15  ? values.Pneu_1_inputDecimalQuesito_15 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 16  ? values.Pneu_1_inputDecimalQuesito_16 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 17  ? values.Pneu_1_inputDecimalQuesito_17 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 18  ? values.Pneu_1_inputDecimalQuesito_18 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 19  ? values.Pneu_1_inputDecimalQuesito_19 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 20  ? values.Pneu_1_inputDecimalQuesito_20 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 21  ? values.Pneu_1_inputDecimalQuesito_21 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 22  ? values.Pneu_1_inputDecimalQuesito_22 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 23  ? values.Pneu_1_inputDecimalQuesito_23 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 24  ? values.Pneu_1_inputDecimalQuesito_24 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 25  ? values.Pneu_1_inputDecimalQuesito_25 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 26  ? values.Pneu_1_inputDecimalQuesito_26 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 27  ? values.Pneu_1_inputDecimalQuesito_27 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 28  ? values.Pneu_1_inputDecimalQuesito_28 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 29  ? values.Pneu_1_inputDecimalQuesito_29 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 30  ? values.Pneu_1_inputDecimalQuesito_30 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 31  ? values.Pneu_1_inputDecimalQuesito_31 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 32  ? values.Pneu_1_inputDecimalQuesito_32 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 33  ? values.Pneu_1_inputDecimalQuesito_33 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 34  ? values.Pneu_1_inputDecimalQuesito_34 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 35  ? values.Pneu_1_inputDecimalQuesito_35 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 36  ? values.Pneu_1_inputDecimalQuesito_36 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 37  ? values.Pneu_1_inputDecimalQuesito_37 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 38  ? values.Pneu_1_inputDecimalQuesito_38 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 39  ? values.Pneu_1_inputDecimalQuesito_39 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 40  ? values.Pneu_1_inputDecimalQuesito_40 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 41  ? values.Pneu_1_inputDecimalQuesito_41 :

																								//PNEU 2
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 1 ? values.Pneu_2_inputDecimalQuesito_1 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 2 ? values.Pneu_2_inputDecimalQuesito_2 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 3 ? values.Pneu_2_inputDecimalQuesito_3 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 4 ? values.Pneu_2_inputDecimalQuesito_4 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 5 ? values.Pneu_2_inputDecimalQuesito_5 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 6 ? values.Pneu_2_inputDecimalQuesito_6 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 7 ? values.Pneu_2_inputDecimalQuesito_7 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 8 ? values.Pneu_2_inputDecimalQuesito_8 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 9 ? values.Pneu_2_inputDecimalQuesito_9 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 10  ? values.Pneu_2_inputDecimalQuesito_10 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 11  ? values.Pneu_2_inputDecimalQuesito_11 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 12  ? values.Pneu_2_inputDecimalQuesito_12 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 13  ? values.Pneu_2_inputDecimalQuesito_13 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 14  ? values.Pneu_2_inputDecimalQuesito_14 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 15  ? values.Pneu_2_inputDecimalQuesito_15 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 16  ? values.Pneu_2_inputDecimalQuesito_16 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 17  ? values.Pneu_2_inputDecimalQuesito_17 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 18  ? values.Pneu_2_inputDecimalQuesito_18 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 19  ? values.Pneu_2_inputDecimalQuesito_19 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 20  ? values.Pneu_2_inputDecimalQuesito_20 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 21  ? values.Pneu_2_inputDecimalQuesito_21 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 22  ? values.Pneu_2_inputDecimalQuesito_22 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 23  ? values.Pneu_2_inputDecimalQuesito_23 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 24  ? values.Pneu_2_inputDecimalQuesito_24 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 25  ? values.Pneu_2_inputDecimalQuesito_25 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 26  ? values.Pneu_2_inputDecimalQuesito_26 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 27  ? values.Pneu_2_inputDecimalQuesito_27 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 28  ? values.Pneu_2_inputDecimalQuesito_28 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 29  ? values.Pneu_2_inputDecimalQuesito_29 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 30  ? values.Pneu_2_inputDecimalQuesito_30 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 31  ? values.Pneu_2_inputDecimalQuesito_31 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 32  ? values.Pneu_2_inputDecimalQuesito_32 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 33  ? values.Pneu_2_inputDecimalQuesito_33 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 34  ? values.Pneu_2_inputDecimalQuesito_34 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 35  ? values.Pneu_2_inputDecimalQuesito_35 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 36  ? values.Pneu_2_inputDecimalQuesito_36 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 37  ? values.Pneu_2_inputDecimalQuesito_37 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 38  ? values.Pneu_2_inputDecimalQuesito_38 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 39  ? values.Pneu_2_inputDecimalQuesito_39 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 40  ? values.Pneu_2_inputDecimalQuesito_40 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 41  ? values.Pneu_2_inputDecimalQuesito_41 :

																								//PNEU 3
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 1 ? values.Pneu_3_inputDecimalQuesito_1 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 2 ? values.Pneu_3_inputDecimalQuesito_2 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 3 ? values.Pneu_3_inputDecimalQuesito_3 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 4 ? values.Pneu_3_inputDecimalQuesito_4 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 5 ? values.Pneu_3_inputDecimalQuesito_5 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 6 ? values.Pneu_3_inputDecimalQuesito_6 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 7 ? values.Pneu_3_inputDecimalQuesito_7 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 8 ? values.Pneu_3_inputDecimalQuesito_8 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 9 ? values.Pneu_3_inputDecimalQuesito_9 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 10  ? values.Pneu_3_inputDecimalQuesito_10 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 11  ? values.Pneu_3_inputDecimalQuesito_11 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 12  ? values.Pneu_3_inputDecimalQuesito_12 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 13  ? values.Pneu_3_inputDecimalQuesito_13 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 14  ? values.Pneu_3_inputDecimalQuesito_14 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 15  ? values.Pneu_3_inputDecimalQuesito_15 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 16  ? values.Pneu_3_inputDecimalQuesito_16 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 17  ? values.Pneu_3_inputDecimalQuesito_17 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 18  ? values.Pneu_3_inputDecimalQuesito_18 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 19  ? values.Pneu_3_inputDecimalQuesito_19 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 20  ? values.Pneu_3_inputDecimalQuesito_20 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 21  ? values.Pneu_3_inputDecimalQuesito_21 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 22  ? values.Pneu_3_inputDecimalQuesito_22 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 23  ? values.Pneu_3_inputDecimalQuesito_23 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 24  ? values.Pneu_3_inputDecimalQuesito_24 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 25  ? values.Pneu_3_inputDecimalQuesito_25 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 26  ? values.Pneu_3_inputDecimalQuesito_26 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 27  ? values.Pneu_3_inputDecimalQuesito_27 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 28  ? values.Pneu_3_inputDecimalQuesito_28 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 29  ? values.Pneu_3_inputDecimalQuesito_29 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 30  ? values.Pneu_3_inputDecimalQuesito_30 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 31  ? values.Pneu_3_inputDecimalQuesito_31 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 32  ? values.Pneu_3_inputDecimalQuesito_32 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 33  ? values.Pneu_3_inputDecimalQuesito_33 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 34  ? values.Pneu_3_inputDecimalQuesito_34 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 35  ? values.Pneu_3_inputDecimalQuesito_35 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 36  ? values.Pneu_3_inputDecimalQuesito_36 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 37  ? values.Pneu_3_inputDecimalQuesito_37 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 38  ? values.Pneu_3_inputDecimalQuesito_38 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 39  ? values.Pneu_3_inputDecimalQuesito_39 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 40  ? values.Pneu_3_inputDecimalQuesito_40 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 41  ? values.Pneu_3_inputDecimalQuesito_41 :

																								//PNEU 4
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 1 ? values.Pneu_4_inputDecimalQuesito_1 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 2 ? values.Pneu_4_inputDecimalQuesito_2 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 3 ? values.Pneu_4_inputDecimalQuesito_3 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 4 ? values.Pneu_4_inputDecimalQuesito_4 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 5 ? values.Pneu_4_inputDecimalQuesito_5 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 6 ? values.Pneu_4_inputDecimalQuesito_6 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 7 ? values.Pneu_4_inputDecimalQuesito_7 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 8 ? values.Pneu_4_inputDecimalQuesito_8 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 9 ? values.Pneu_4_inputDecimalQuesito_9 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 10  ? values.Pneu_4_inputDecimalQuesito_10 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 11  ? values.Pneu_4_inputDecimalQuesito_11 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 12  ? values.Pneu_4_inputDecimalQuesito_12 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 14  ? values.Pneu_4_inputDecimalQuesito_14 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 14  ? values.Pneu_4_inputDecimalQuesito_14 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 15  ? values.Pneu_4_inputDecimalQuesito_15 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 16  ? values.Pneu_4_inputDecimalQuesito_16 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 17  ? values.Pneu_4_inputDecimalQuesito_17 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 18  ? values.Pneu_4_inputDecimalQuesito_18 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 19  ? values.Pneu_4_inputDecimalQuesito_19 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 20  ? values.Pneu_4_inputDecimalQuesito_20 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 21  ? values.Pneu_4_inputDecimalQuesito_21 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 22  ? values.Pneu_4_inputDecimalQuesito_22 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 23  ? values.Pneu_4_inputDecimalQuesito_24 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 24  ? values.Pneu_4_inputDecimalQuesito_24 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 25  ? values.Pneu_4_inputDecimalQuesito_25 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 26  ? values.Pneu_4_inputDecimalQuesito_26 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 27  ? values.Pneu_4_inputDecimalQuesito_27 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 28  ? values.Pneu_4_inputDecimalQuesito_28 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 29  ? values.Pneu_4_inputDecimalQuesito_29 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 30  ? values.Pneu_4_inputDecimalQuesito_30 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 31  ? values.Pneu_4_inputDecimalQuesito_31 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 32  ? values.Pneu_4_inputDecimalQuesito_32 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 33  ? values.Pneu_4_inputDecimalQuesito_33 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 34  ? values.Pneu_4_inputDecimalQuesito_34 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 35  ? values.Pneu_4_inputDecimalQuesito_35 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 36  ? values.Pneu_4_inputDecimalQuesito_36 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 37  ? values.Pneu_4_inputDecimalQuesito_37 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 38  ? values.Pneu_4_inputDecimalQuesito_38 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 39  ? values.Pneu_4_inputDecimalQuesito_39 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 40  ? values.Pneu_4_inputDecimalQuesito_40 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 41  ? values.Pneu_4_inputDecimalQuesito_41 :
																								
																								//PNEU 5
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 1 ? values.Pneu_5_inputDecimalQuesito_1 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 2 ? values.Pneu_5_inputDecimalQuesito_2 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 3 ? values.Pneu_5_inputDecimalQuesito_3 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 4 ? values.Pneu_5_inputDecimalQuesito_4 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 5 ? values.Pneu_5_inputDecimalQuesito_5 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 6 ? values.Pneu_5_inputDecimalQuesito_6 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 7 ? values.Pneu_5_inputDecimalQuesito_7 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 8 ? values.Pneu_5_inputDecimalQuesito_8 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 9 ? values.Pneu_5_inputDecimalQuesito_9 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 10  ? values.Pneu_5_inputDecimalQuesito_10 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 11  ? values.Pneu_5_inputDecimalQuesito_11 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 12  ? values.Pneu_5_inputDecimalQuesito_12 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 13  ? values.Pneu_5_inputDecimalQuesito_13 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 14  ? values.Pneu_5_inputDecimalQuesito_14 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 15  ? values.Pneu_5_inputDecimalQuesito_15 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 16  ? values.Pneu_5_inputDecimalQuesito_16 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 17  ? values.Pneu_5_inputDecimalQuesito_17 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 18  ? values.Pneu_5_inputDecimalQuesito_18 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 19  ? values.Pneu_5_inputDecimalQuesito_19 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 20  ? values.Pneu_5_inputDecimalQuesito_20 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 21  ? values.Pneu_5_inputDecimalQuesito_21 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 22  ? values.Pneu_5_inputDecimalQuesito_22 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 23  ? values.Pneu_5_inputDecimalQuesito_23 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 24  ? values.Pneu_5_inputDecimalQuesito_24 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 25  ? values.Pneu_5_inputDecimalQuesito_25 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 26  ? values.Pneu_5_inputDecimalQuesito_26 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 27  ? values.Pneu_5_inputDecimalQuesito_27 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 28  ? values.Pneu_5_inputDecimalQuesito_28 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 29  ? values.Pneu_5_inputDecimalQuesito_29 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 30  ? values.Pneu_5_inputDecimalQuesito_30 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 31  ? values.Pneu_5_inputDecimalQuesito_31 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 32  ? values.Pneu_5_inputDecimalQuesito_32 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 33  ? values.Pneu_5_inputDecimalQuesito_33 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 34  ? values.Pneu_5_inputDecimalQuesito_34 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 35  ? values.Pneu_5_inputDecimalQuesito_35 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 36  ? values.Pneu_5_inputDecimalQuesito_36 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 37  ? values.Pneu_5_inputDecimalQuesito_37 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 38  ? values.Pneu_5_inputDecimalQuesito_38 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 39  ? values.Pneu_5_inputDecimalQuesito_39 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 40  ? values.Pneu_5_inputDecimalQuesito_40 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 41  ? values.Pneu_5_inputDecimalQuesito_41 :

																								//PNEU 6
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 1 ? values.Pneu_6_inputDecimalQuesito_1 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 2 ? values.Pneu_6_inputDecimalQuesito_2 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 3 ? values.Pneu_6_inputDecimalQuesito_3 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 4 ? values.Pneu_6_inputDecimalQuesito_4 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 5 ? values.Pneu_6_inputDecimalQuesito_5 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 6 ? values.Pneu_6_inputDecimalQuesito_6 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 7 ? values.Pneu_6_inputDecimalQuesito_7 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 8 ? values.Pneu_6_inputDecimalQuesito_8 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 9 ? values.Pneu_6_inputDecimalQuesito_9 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 10  ? values.Pneu_6_inputDecimalQuesito_10 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 11  ? values.Pneu_6_inputDecimalQuesito_11 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 12  ? values.Pneu_6_inputDecimalQuesito_12 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 13  ? values.Pneu_6_inputDecimalQuesito_13 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 14  ? values.Pneu_6_inputDecimalQuesito_14 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 15  ? values.Pneu_6_inputDecimalQuesito_15 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 16  ? values.Pneu_6_inputDecimalQuesito_16 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 17  ? values.Pneu_6_inputDecimalQuesito_17 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 18  ? values.Pneu_6_inputDecimalQuesito_18 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 19  ? values.Pneu_6_inputDecimalQuesito_19 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 20  ? values.Pneu_6_inputDecimalQuesito_20 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 21  ? values.Pneu_6_inputDecimalQuesito_21 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 22  ? values.Pneu_6_inputDecimalQuesito_22 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 23  ? values.Pneu_6_inputDecimalQuesito_23 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 24  ? values.Pneu_6_inputDecimalQuesito_24 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 25  ? values.Pneu_6_inputDecimalQuesito_25 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 26  ? values.Pneu_6_inputDecimalQuesito_26 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 27  ? values.Pneu_6_inputDecimalQuesito_27 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 28  ? values.Pneu_6_inputDecimalQuesito_28 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 29  ? values.Pneu_6_inputDecimalQuesito_29 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 30  ? values.Pneu_6_inputDecimalQuesito_30 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 31  ? values.Pneu_6_inputDecimalQuesito_31 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 32  ? values.Pneu_6_inputDecimalQuesito_32 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 33  ? values.Pneu_6_inputDecimalQuesito_33 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 34  ? values.Pneu_6_inputDecimalQuesito_34 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 35  ? values.Pneu_6_inputDecimalQuesito_35 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 36  ? values.Pneu_6_inputDecimalQuesito_36 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 37  ? values.Pneu_6_inputDecimalQuesito_37 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 38  ? values.Pneu_6_inputDecimalQuesito_38 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 39  ? values.Pneu_6_inputDecimalQuesito_39 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 40  ? values.Pneu_6_inputDecimalQuesito_40 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 41  ? values.Pneu_6_inputDecimalQuesito_41 :

																								false
																							}
																						/>
																						</>
																					)
																				}
																				{
																					//INPUT INTEIRO PNEU
																					quesito.IND_INTEIRO == true && quesito.IND_ATIVO == true && 
																					(	
																						<>
																						<Input 
																							onChangeText={handleChange('Pneu_'+listbox.COD_OPCAO+'_inputInteiroQuesito_'+quesito.COD_ITEM)}
																							onBlur={handleBlur('Pneu_'+listbox.COD_OPCAO+'_inputInteiroQuesito_'+quesito.COD_ITEM)}
																							placeholder='Inteiro'
																							value={
																								//PNEU 1
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 1 ? values.Pneu_1_inputInteiroQuesito_1 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 2 ? values.Pneu_1_inputInteiroQuesito_2 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 3 ? values.Pneu_1_inputInteiroQuesito_3 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 4 ? values.Pneu_1_inputInteiroQuesito_4 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 5 ? values.Pneu_1_inputInteiroQuesito_5 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 6 ? values.Pneu_1_inputInteiroQuesito_6 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 7 ? values.Pneu_1_inputInteiroQuesito_7 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 8 ? values.Pneu_1_inputInteiroQuesito_8 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 9 ? values.Pneu_1_inputInteiroQuesito_9 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 10  ? values.Pneu_1_inputInteiroQuesito_10 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 11  ? values.Pneu_1_inputInteiroQuesito_11 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 12  ? values.Pneu_1_inputInteiroQuesito_12 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 13  ? values.Pneu_1_inputInteiroQuesito_13 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 14  ? values.Pneu_1_inputInteiroQuesito_14 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 15  ? values.Pneu_1_inputInteiroQuesito_15 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 16  ? values.Pneu_1_inputInteiroQuesito_16 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 17  ? values.Pneu_1_inputInteiroQuesito_17 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 18  ? values.Pneu_1_inputInteiroQuesito_18 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 19  ? values.Pneu_1_inputInteiroQuesito_19 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 20  ? values.Pneu_1_inputInteiroQuesito_20 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 21  ? values.Pneu_1_inputInteiroQuesito_21 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 22  ? values.Pneu_1_inputInteiroQuesito_22 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 23  ? values.Pneu_1_inputInteiroQuesito_23 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 24  ? values.Pneu_1_inputInteiroQuesito_24 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 25  ? values.Pneu_1_inputInteiroQuesito_25 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 26  ? values.Pneu_1_inputInteiroQuesito_26 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 27  ? values.Pneu_1_inputInteiroQuesito_27 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 28  ? values.Pneu_1_inputInteiroQuesito_28 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 29  ? values.Pneu_1_inputInteiroQuesito_29 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 30  ? values.Pneu_1_inputInteiroQuesito_30 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 31  ? values.Pneu_1_inputInteiroQuesito_31 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 32  ? values.Pneu_1_inputInteiroQuesito_32 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 33  ? values.Pneu_1_inputInteiroQuesito_33 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 34  ? values.Pneu_1_inputInteiroQuesito_34 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 35  ? values.Pneu_1_inputInteiroQuesito_35 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 36  ? values.Pneu_1_inputInteiroQuesito_36 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 37  ? values.Pneu_1_inputInteiroQuesito_37 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 38  ? values.Pneu_1_inputInteiroQuesito_38 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 39  ? values.Pneu_1_inputInteiroQuesito_39 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 40  ? values.Pneu_1_inputInteiroQuesito_40 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 41  ? values.Pneu_1_inputInteiroQuesito_41 :

																								//PNEU 2
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 1 ? values.Pneu_2_inputInteiroQuesito_1 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 2 ? values.Pneu_2_inputInteiroQuesito_2 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 3 ? values.Pneu_2_inputInteiroQuesito_3 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 4 ? values.Pneu_2_inputInteiroQuesito_4 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 5 ? values.Pneu_2_inputInteiroQuesito_5 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 6 ? values.Pneu_2_inputInteiroQuesito_6 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 7 ? values.Pneu_2_inputInteiroQuesito_7 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 8 ? values.Pneu_2_inputInteiroQuesito_8 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 9 ? values.Pneu_2_inputInteiroQuesito_9 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 10  ? values.Pneu_2_inputInteiroQuesito_10 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 11  ? values.Pneu_2_inputInteiroQuesito_11 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 12  ? values.Pneu_2_inputInteiroQuesito_12 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 13  ? values.Pneu_2_inputInteiroQuesito_13 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 14  ? values.Pneu_2_inputInteiroQuesito_14 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 15  ? values.Pneu_2_inputInteiroQuesito_15 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 16  ? values.Pneu_2_inputInteiroQuesito_16 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 17  ? values.Pneu_2_inputInteiroQuesito_17 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 18  ? values.Pneu_2_inputInteiroQuesito_18 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 19  ? values.Pneu_2_inputInteiroQuesito_19 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 20  ? values.Pneu_2_inputInteiroQuesito_20 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 21  ? values.Pneu_2_inputInteiroQuesito_21 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 22  ? values.Pneu_2_inputInteiroQuesito_22 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 23  ? values.Pneu_2_inputInteiroQuesito_23 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 24  ? values.Pneu_2_inputInteiroQuesito_24 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 25  ? values.Pneu_2_inputInteiroQuesito_25 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 26  ? values.Pneu_2_inputInteiroQuesito_26 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 27  ? values.Pneu_2_inputInteiroQuesito_27 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 28  ? values.Pneu_2_inputInteiroQuesito_28 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 29  ? values.Pneu_2_inputInteiroQuesito_29 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 30  ? values.Pneu_2_inputInteiroQuesito_30 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 31  ? values.Pneu_2_inputInteiroQuesito_31 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 32  ? values.Pneu_2_inputInteiroQuesito_32 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 33  ? values.Pneu_2_inputInteiroQuesito_33 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 34  ? values.Pneu_2_inputInteiroQuesito_34 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 35  ? values.Pneu_2_inputInteiroQuesito_35 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 36  ? values.Pneu_2_inputInteiroQuesito_36 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 37  ? values.Pneu_2_inputInteiroQuesito_37 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 38  ? values.Pneu_2_inputInteiroQuesito_38 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 39  ? values.Pneu_2_inputInteiroQuesito_39 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 40  ? values.Pneu_2_inputInteiroQuesito_40 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 41  ? values.Pneu_2_inputInteiroQuesito_41 :

																								//PNEU 3
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 1 ? values.Pneu_3_inputInteiroQuesito_1 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 2 ? values.Pneu_3_inputInteiroQuesito_2 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 3 ? values.Pneu_3_inputInteiroQuesito_3 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 4 ? values.Pneu_3_inputInteiroQuesito_4 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 5 ? values.Pneu_3_inputInteiroQuesito_5 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 6 ? values.Pneu_3_inputInteiroQuesito_6 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 7 ? values.Pneu_3_inputInteiroQuesito_7 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 8 ? values.Pneu_3_inputInteiroQuesito_8 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 9 ? values.Pneu_3_inputInteiroQuesito_9 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 10  ? values.Pneu_3_inputInteiroQuesito_10 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 11  ? values.Pneu_3_inputInteiroQuesito_11 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 12  ? values.Pneu_3_inputInteiroQuesito_12 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 13  ? values.Pneu_3_inputInteiroQuesito_13 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 14  ? values.Pneu_3_inputInteiroQuesito_14 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 15  ? values.Pneu_3_inputInteiroQuesito_15 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 16  ? values.Pneu_3_inputInteiroQuesito_16 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 17  ? values.Pneu_3_inputInteiroQuesito_17 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 18  ? values.Pneu_3_inputInteiroQuesito_18 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 19  ? values.Pneu_3_inputInteiroQuesito_19 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 20  ? values.Pneu_3_inputInteiroQuesito_20 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 21  ? values.Pneu_3_inputInteiroQuesito_21 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 22  ? values.Pneu_3_inputInteiroQuesito_22 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 23  ? values.Pneu_3_inputInteiroQuesito_23 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 24  ? values.Pneu_3_inputInteiroQuesito_24 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 25  ? values.Pneu_3_inputInteiroQuesito_25 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 26  ? values.Pneu_3_inputInteiroQuesito_26 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 27  ? values.Pneu_3_inputInteiroQuesito_27 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 28  ? values.Pneu_3_inputInteiroQuesito_28 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 29  ? values.Pneu_3_inputInteiroQuesito_29 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 30  ? values.Pneu_3_inputInteiroQuesito_30 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 31  ? values.Pneu_3_inputInteiroQuesito_31 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 32  ? values.Pneu_3_inputInteiroQuesito_32 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 33  ? values.Pneu_3_inputInteiroQuesito_33 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 34  ? values.Pneu_3_inputInteiroQuesito_34 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 35  ? values.Pneu_3_inputInteiroQuesito_35 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 36  ? values.Pneu_3_inputInteiroQuesito_36 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 37  ? values.Pneu_3_inputInteiroQuesito_37 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 38  ? values.Pneu_3_inputInteiroQuesito_38 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 39  ? values.Pneu_3_inputInteiroQuesito_39 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 40  ? values.Pneu_3_inputInteiroQuesito_40 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 41  ? values.Pneu_3_inputInteiroQuesito_41 :

																								//PNEU 4
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 1 ? values.Pneu_4_inputInteiroQuesito_1 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 2 ? values.Pneu_4_inputInteiroQuesito_2 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 3 ? values.Pneu_4_inputInteiroQuesito_3 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 4 ? values.Pneu_4_inputInteiroQuesito_4 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 5 ? values.Pneu_4_inputInteiroQuesito_5 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 6 ? values.Pneu_4_inputInteiroQuesito_6 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 7 ? values.Pneu_4_inputInteiroQuesito_7 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 8 ? values.Pneu_4_inputInteiroQuesito_8 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 9 ? values.Pneu_4_inputInteiroQuesito_9 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 10  ? values.Pneu_4_inputInteiroQuesito_10 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 11  ? values.Pneu_4_inputInteiroQuesito_11 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 12  ? values.Pneu_4_inputInteiroQuesito_12 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 14  ? values.Pneu_4_inputInteiroQuesito_14 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 14  ? values.Pneu_4_inputInteiroQuesito_14 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 15  ? values.Pneu_4_inputInteiroQuesito_15 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 16  ? values.Pneu_4_inputInteiroQuesito_16 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 17  ? values.Pneu_4_inputInteiroQuesito_17 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 18  ? values.Pneu_4_inputInteiroQuesito_18 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 19  ? values.Pneu_4_inputInteiroQuesito_19 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 20  ? values.Pneu_4_inputInteiroQuesito_20 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 21  ? values.Pneu_4_inputInteiroQuesito_21 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 22  ? values.Pneu_4_inputInteiroQuesito_22 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 23  ? values.Pneu_4_inputInteiroQuesito_24 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 24  ? values.Pneu_4_inputInteiroQuesito_24 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 25  ? values.Pneu_4_inputInteiroQuesito_25 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 26  ? values.Pneu_4_inputInteiroQuesito_26 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 27  ? values.Pneu_4_inputInteiroQuesito_27 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 28  ? values.Pneu_4_inputInteiroQuesito_28 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 29  ? values.Pneu_4_inputInteiroQuesito_29 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 30  ? values.Pneu_4_inputInteiroQuesito_30 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 31  ? values.Pneu_4_inputInteiroQuesito_31 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 32  ? values.Pneu_4_inputInteiroQuesito_32 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 33  ? values.Pneu_4_inputInteiroQuesito_33 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 34  ? values.Pneu_4_inputInteiroQuesito_34 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 35  ? values.Pneu_4_inputInteiroQuesito_35 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 36  ? values.Pneu_4_inputInteiroQuesito_36 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 37  ? values.Pneu_4_inputInteiroQuesito_37 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 38  ? values.Pneu_4_inputInteiroQuesito_38 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 39  ? values.Pneu_4_inputInteiroQuesito_39 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 40  ? values.Pneu_4_inputInteiroQuesito_40 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 41  ? values.Pneu_4_inputInteiroQuesito_41 :

																								//PNEU 5
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 1 ? values.Pneu_5_inputInteiroQuesito_1 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 2 ? values.Pneu_5_inputInteiroQuesito_2 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 3 ? values.Pneu_5_inputInteiroQuesito_3 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 4 ? values.Pneu_5_inputInteiroQuesito_4 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 5 ? values.Pneu_5_inputInteiroQuesito_5 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 6 ? values.Pneu_5_inputInteiroQuesito_6 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 7 ? values.Pneu_5_inputInteiroQuesito_7 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 8 ? values.Pneu_5_inputInteiroQuesito_8 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 9 ? values.Pneu_5_inputInteiroQuesito_9 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 10  ? values.Pneu_5_inputInteiroQuesito_10 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 11  ? values.Pneu_5_inputInteiroQuesito_11 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 12  ? values.Pneu_5_inputInteiroQuesito_12 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 13  ? values.Pneu_5_inputInteiroQuesito_13 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 14  ? values.Pneu_5_inputInteiroQuesito_14 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 15  ? values.Pneu_5_inputInteiroQuesito_15 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 16  ? values.Pneu_5_inputInteiroQuesito_16 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 17  ? values.Pneu_5_inputInteiroQuesito_17 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 18  ? values.Pneu_5_inputInteiroQuesito_18 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 19  ? values.Pneu_5_inputInteiroQuesito_19 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 20  ? values.Pneu_5_inputInteiroQuesito_20 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 21  ? values.Pneu_5_inputInteiroQuesito_21 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 22  ? values.Pneu_5_inputInteiroQuesito_22 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 23  ? values.Pneu_5_inputInteiroQuesito_23 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 24  ? values.Pneu_5_inputInteiroQuesito_24 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 25  ? values.Pneu_5_inputInteiroQuesito_25 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 26  ? values.Pneu_5_inputInteiroQuesito_26 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 27  ? values.Pneu_5_inputInteiroQuesito_27 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 28  ? values.Pneu_5_inputInteiroQuesito_28 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 29  ? values.Pneu_5_inputInteiroQuesito_29 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 30  ? values.Pneu_5_inputInteiroQuesito_30 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 31  ? values.Pneu_5_inputInteiroQuesito_31 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 32  ? values.Pneu_5_inputInteiroQuesito_32 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 33  ? values.Pneu_5_inputInteiroQuesito_33 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 34  ? values.Pneu_5_inputInteiroQuesito_34 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 35  ? values.Pneu_5_inputInteiroQuesito_35 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 36  ? values.Pneu_5_inputInteiroQuesito_36 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 37  ? values.Pneu_5_inputInteiroQuesito_37 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 38  ? values.Pneu_5_inputInteiroQuesito_38 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 39  ? values.Pneu_5_inputInteiroQuesito_39 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 40  ? values.Pneu_5_inputInteiroQuesito_40 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 41  ? values.Pneu_5_inputInteiroQuesito_41 :

																								//PNEU 6
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 1 ? values.Pneu_6_inputInteiroQuesito_1 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 2 ? values.Pneu_6_inputInteiroQuesito_2 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 3 ? values.Pneu_6_inputInteiroQuesito_3 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 4 ? values.Pneu_6_inputInteiroQuesito_4 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 5 ? values.Pneu_6_inputInteiroQuesito_5 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 6 ? values.Pneu_6_inputInteiroQuesito_6 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 7 ? values.Pneu_6_inputInteiroQuesito_7 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 8 ? values.Pneu_6_inputInteiroQuesito_8 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 9 ? values.Pneu_6_inputInteiroQuesito_9 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 10  ? values.Pneu_6_inputInteiroQuesito_10 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 11  ? values.Pneu_6_inputInteiroQuesito_11 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 12  ? values.Pneu_6_inputInteiroQuesito_12 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 13  ? values.Pneu_6_inputInteiroQuesito_13 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 14  ? values.Pneu_6_inputInteiroQuesito_14 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 15  ? values.Pneu_6_inputInteiroQuesito_15 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 16  ? values.Pneu_6_inputInteiroQuesito_16 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 17  ? values.Pneu_6_inputInteiroQuesito_17 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 18  ? values.Pneu_6_inputInteiroQuesito_18 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 19  ? values.Pneu_6_inputInteiroQuesito_19 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 20  ? values.Pneu_6_inputInteiroQuesito_20 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 21  ? values.Pneu_6_inputInteiroQuesito_21 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 22  ? values.Pneu_6_inputInteiroQuesito_22 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 23  ? values.Pneu_6_inputInteiroQuesito_23 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 24  ? values.Pneu_6_inputInteiroQuesito_24 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 25  ? values.Pneu_6_inputInteiroQuesito_25 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 26  ? values.Pneu_6_inputInteiroQuesito_26 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 27  ? values.Pneu_6_inputInteiroQuesito_27 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 28  ? values.Pneu_6_inputInteiroQuesito_28 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 29  ? values.Pneu_6_inputInteiroQuesito_29 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 30  ? values.Pneu_6_inputInteiroQuesito_30 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 31  ? values.Pneu_6_inputInteiroQuesito_31 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 32  ? values.Pneu_6_inputInteiroQuesito_32 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 33  ? values.Pneu_6_inputInteiroQuesito_33 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 34  ? values.Pneu_6_inputInteiroQuesito_34 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 35  ? values.Pneu_6_inputInteiroQuesito_35 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 36  ? values.Pneu_6_inputInteiroQuesito_36 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 37  ? values.Pneu_6_inputInteiroQuesito_37 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 38  ? values.Pneu_6_inputInteiroQuesito_38 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 39  ? values.Pneu_6_inputInteiroQuesito_39 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 40  ? values.Pneu_6_inputInteiroQuesito_40 :
																								listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 41  ? values.Pneu_6_inputInteiroQuesito_41 :

																								false
																							}
																						/>
																						</>
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
																									onPress={ () => setFieldValue('Pneu_'+listbox.COD_OPCAO+'_rbQuesito_'+quesito.COD_ITEM, radio.COD_OPCAO) }
																									>
																									<Radio
																										onPress={ () => setFieldValue('Pneu_'+listbox.COD_OPCAO+'_rbQuesito_'+quesito.COD_ITEM, radio.COD_OPCAO) }
																										color={"#f0ad4e"}
																										selectedColor={"#5cb85c"}
																										selected={ 
																											
																											//PNEU 1
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 1 ? values.Pneu_1_rbQuesito_1 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 2 ? values.Pneu_1_rbQuesito_2 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 3 ? values.Pneu_1_rbQuesito_3 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 4 ? values.Pneu_1_rbQuesito_4 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 5 ? values.Pneu_1_rbQuesito_5 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 6 ? values.Pneu_1_rbQuesito_6 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 7 ? values.Pneu_1_rbQuesito_7 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 8 ? values.Pneu_1_rbQuesito_8 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 9 ? values.Pneu_1_rbQuesito_9 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 10  ? values.Pneu_1_rbQuesito_10 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 11  ? values.Pneu_1_rbQuesito_11 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 12  ? values.Pneu_1_rbQuesito_12 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 13  ? values.Pneu_1_rbQuesito_13 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 14  ? values.Pneu_1_rbQuesito_14 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 15  ? values.Pneu_1_rbQuesito_15 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 16  ? values.Pneu_1_rbQuesito_16 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 17  ? values.Pneu_1_rbQuesito_17 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 18  ? values.Pneu_1_rbQuesito_18 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 19  ? values.Pneu_1_rbQuesito_19 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 20  ? values.Pneu_1_rbQuesito_20 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 21  ? values.Pneu_1_rbQuesito_21 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 22  ? values.Pneu_1_rbQuesito_22 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 23  ? values.Pneu_1_rbQuesito_23 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 24  ? values.Pneu_1_rbQuesito_24 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 25  ? values.Pneu_1_rbQuesito_25 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 26  ? values.Pneu_1_rbQuesito_26 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 27  ? values.Pneu_1_rbQuesito_27 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 28  ? values.Pneu_1_rbQuesito_28 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 29  ? values.Pneu_1_rbQuesito_29 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 30  ? values.Pneu_1_rbQuesito_30 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 31  ? values.Pneu_1_rbQuesito_31 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 32  ? values.Pneu_1_rbQuesito_32 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 33  ? values.Pneu_1_rbQuesito_33 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 34  ? values.Pneu_1_rbQuesito_34 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 35  ? values.Pneu_1_rbQuesito_35 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 36  ? values.Pneu_1_rbQuesito_36 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 37  ? values.Pneu_1_rbQuesito_37 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 38  ? values.Pneu_1_rbQuesito_38 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 39  ? values.Pneu_1_rbQuesito_39 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 40  ? values.Pneu_1_rbQuesito_40 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 41  ? values.Pneu_1_rbQuesito_41 == radio.COD_OPCAO ? true : false :
																											
																											//PNEU 2
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 1 ? values.Pneu_2_rbQuesito_1 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 2 ? values.Pneu_2_rbQuesito_2 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 3 ? values.Pneu_2_rbQuesito_3 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 4 ? values.Pneu_2_rbQuesito_4 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 5 ? values.Pneu_2_rbQuesito_5 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 6 ? values.Pneu_2_rbQuesito_6 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 7 ? values.Pneu_2_rbQuesito_7 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 8 ? values.Pneu_2_rbQuesito_8 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 9 ? values.Pneu_2_rbQuesito_9 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 10  ? values.Pneu_2_rbQuesito_10 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 11  ? values.Pneu_2_rbQuesito_11 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 12  ? values.Pneu_2_rbQuesito_12 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 13  ? values.Pneu_2_rbQuesito_13 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 14  ? values.Pneu_2_rbQuesito_14 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 15  ? values.Pneu_2_rbQuesito_15 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 16  ? values.Pneu_2_rbQuesito_16 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 17  ? values.Pneu_2_rbQuesito_17 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 18  ? values.Pneu_2_rbQuesito_18 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 19  ? values.Pneu_2_rbQuesito_19 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 20  ? values.Pneu_2_rbQuesito_20 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 21  ? values.Pneu_2_rbQuesito_21 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 22  ? values.Pneu_2_rbQuesito_22 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 23  ? values.Pneu_2_rbQuesito_23 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 24  ? values.Pneu_2_rbQuesito_24 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 25  ? values.Pneu_2_rbQuesito_25 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 26  ? values.Pneu_2_rbQuesito_26 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 27  ? values.Pneu_2_rbQuesito_27 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 28  ? values.Pneu_2_rbQuesito_28 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 29  ? values.Pneu_2_rbQuesito_29 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 30  ? values.Pneu_2_rbQuesito_30 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 31  ? values.Pneu_2_rbQuesito_31 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 32  ? values.Pneu_2_rbQuesito_32 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 33  ? values.Pneu_2_rbQuesito_33 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 34  ? values.Pneu_2_rbQuesito_34 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 35  ? values.Pneu_2_rbQuesito_35 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 36  ? values.Pneu_2_rbQuesito_36 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 37  ? values.Pneu_2_rbQuesito_37 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 38  ? values.Pneu_2_rbQuesito_38 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 39  ? values.Pneu_2_rbQuesito_39 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 40  ? values.Pneu_2_rbQuesito_40 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 41  ? values.Pneu_2_rbQuesito_41 == radio.COD_OPCAO ? true : false :
																											
																											//PNEU 3
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 1 ? values.Pneu_3_rbQuesito_1 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 2 ? values.Pneu_3_rbQuesito_2 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 3 ? values.Pneu_3_rbQuesito_3 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 4 ? values.Pneu_3_rbQuesito_4 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 5 ? values.Pneu_3_rbQuesito_5 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 6 ? values.Pneu_3_rbQuesito_6 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 7 ? values.Pneu_3_rbQuesito_7 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 8 ? values.Pneu_3_rbQuesito_8 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 9 ? values.Pneu_3_rbQuesito_9 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 10  ? values.Pneu_3_rbQuesito_10 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 11  ? values.Pneu_3_rbQuesito_11 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 12  ? values.Pneu_3_rbQuesito_12 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 13  ? values.Pneu_3_rbQuesito_13 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 14  ? values.Pneu_3_rbQuesito_14 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 15  ? values.Pneu_3_rbQuesito_15 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 16  ? values.Pneu_3_rbQuesito_16 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 17  ? values.Pneu_3_rbQuesito_17 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 18  ? values.Pneu_3_rbQuesito_18 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 19  ? values.Pneu_3_rbQuesito_19 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 20  ? values.Pneu_3_rbQuesito_20 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 21  ? values.Pneu_3_rbQuesito_21 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 22  ? values.Pneu_3_rbQuesito_22 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 23  ? values.Pneu_3_rbQuesito_23 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 24  ? values.Pneu_3_rbQuesito_24 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 25  ? values.Pneu_3_rbQuesito_25 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 26  ? values.Pneu_3_rbQuesito_26 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 27  ? values.Pneu_3_rbQuesito_27 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 28  ? values.Pneu_3_rbQuesito_28 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 29  ? values.Pneu_3_rbQuesito_29 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 30  ? values.Pneu_3_rbQuesito_30 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 31  ? values.Pneu_3_rbQuesito_31 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 32  ? values.Pneu_3_rbQuesito_32 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 33  ? values.Pneu_3_rbQuesito_33 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 34  ? values.Pneu_3_rbQuesito_34 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 35  ? values.Pneu_3_rbQuesito_35 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 36  ? values.Pneu_3_rbQuesito_36 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 37  ? values.Pneu_3_rbQuesito_37 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 38  ? values.Pneu_3_rbQuesito_38 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 39  ? values.Pneu_3_rbQuesito_39 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 40  ? values.Pneu_3_rbQuesito_40 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 41  ? values.Pneu_3_rbQuesito_41 == radio.COD_OPCAO ? true : false :

																											//PNEU 4
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 1 ? values.Pneu_4_rbQuesito_1 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 2 ? values.Pneu_4_rbQuesito_2 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 3 ? values.Pneu_4_rbQuesito_3 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 4 ? values.Pneu_4_rbQuesito_4 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 5 ? values.Pneu_4_rbQuesito_5 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 6 ? values.Pneu_4_rbQuesito_6 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 7 ? values.Pneu_4_rbQuesito_7 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 8 ? values.Pneu_4_rbQuesito_8 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 9 ? values.Pneu_4_rbQuesito_9 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 10  ? values.Pneu_4_rbQuesito_10 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 11  ? values.Pneu_4_rbQuesito_11 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 12  ? values.Pneu_4_rbQuesito_12 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 13  ? values.Pneu_4_rbQuesito_13 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 14  ? values.Pneu_4_rbQuesito_14 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 15  ? values.Pneu_4_rbQuesito_15 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 16  ? values.Pneu_4_rbQuesito_16 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 17  ? values.Pneu_4_rbQuesito_17 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 18  ? values.Pneu_4_rbQuesito_18 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 19  ? values.Pneu_4_rbQuesito_19 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 20  ? values.Pneu_4_rbQuesito_20 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 21  ? values.Pneu_4_rbQuesito_21 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 22  ? values.Pneu_4_rbQuesito_22 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 23  ? values.Pneu_4_rbQuesito_24 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 24  ? values.Pneu_4_rbQuesito_24 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 25  ? values.Pneu_4_rbQuesito_25 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 26  ? values.Pneu_4_rbQuesito_26 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 27  ? values.Pneu_4_rbQuesito_27 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 28  ? values.Pneu_4_rbQuesito_28 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 29  ? values.Pneu_4_rbQuesito_29 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 30  ? values.Pneu_4_rbQuesito_30 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 31  ? values.Pneu_4_rbQuesito_31 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 32  ? values.Pneu_4_rbQuesito_32 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 33  ? values.Pneu_4_rbQuesito_33 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 34  ? values.Pneu_4_rbQuesito_34 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 35  ? values.Pneu_4_rbQuesito_35 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 36  ? values.Pneu_4_rbQuesito_36 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 37  ? values.Pneu_4_rbQuesito_37 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 38  ? values.Pneu_4_rbQuesito_38 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 39  ? values.Pneu_4_rbQuesito_39 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 40  ? values.Pneu_4_rbQuesito_40 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 41  ? values.Pneu_4_rbQuesito_41 == radio.COD_OPCAO ? true : false :
																											
																											//PNEU 5
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 1 ? values.Pneu_5_rbQuesito_1 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 2 ? values.Pneu_5_rbQuesito_2 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 3 ? values.Pneu_5_rbQuesito_3 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 4 ? values.Pneu_5_rbQuesito_4 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 5 ? values.Pneu_5_rbQuesito_5 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 6 ? values.Pneu_5_rbQuesito_6 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 7 ? values.Pneu_5_rbQuesito_7 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 8 ? values.Pneu_5_rbQuesito_8 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 9 ? values.Pneu_5_rbQuesito_9 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 10  ? values.Pneu_5_rbQuesito_10 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 11  ? values.Pneu_5_rbQuesito_11 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 12  ? values.Pneu_5_rbQuesito_12 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 13  ? values.Pneu_5_rbQuesito_13 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 14  ? values.Pneu_5_rbQuesito_14 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 15  ? values.Pneu_5_rbQuesito_15 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 16  ? values.Pneu_5_rbQuesito_16 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 17  ? values.Pneu_5_rbQuesito_17 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 18  ? values.Pneu_5_rbQuesito_18 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 19  ? values.Pneu_5_rbQuesito_19 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 20  ? values.Pneu_5_rbQuesito_20 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 21  ? values.Pneu_5_rbQuesito_21 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 22  ? values.Pneu_5_rbQuesito_22 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 23  ? values.Pneu_5_rbQuesito_23 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 24  ? values.Pneu_5_rbQuesito_24 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 25  ? values.Pneu_5_rbQuesito_25 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 26  ? values.Pneu_5_rbQuesito_26 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 27  ? values.Pneu_5_rbQuesito_27 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 28  ? values.Pneu_5_rbQuesito_28 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 29  ? values.Pneu_5_rbQuesito_29 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 30  ? values.Pneu_5_rbQuesito_30 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 31  ? values.Pneu_5_rbQuesito_31 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 32  ? values.Pneu_5_rbQuesito_32 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 33  ? values.Pneu_5_rbQuesito_33 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 34  ? values.Pneu_5_rbQuesito_34 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 35  ? values.Pneu_5_rbQuesito_35 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 36  ? values.Pneu_5_rbQuesito_36 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 37  ? values.Pneu_5_rbQuesito_37 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 38  ? values.Pneu_5_rbQuesito_38 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 39  ? values.Pneu_5_rbQuesito_39 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 40  ? values.Pneu_5_rbQuesito_40 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 41  ? values.Pneu_5_rbQuesito_41 == radio.COD_OPCAO ? true : false :

																											//PNEU 6
																											listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 1 ? values.Pneu_6_rbQuesito_1 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 2 ? values.Pneu_6_rbQuesito_2 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 3 ? values.Pneu_6_rbQuesito_3 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 4 ? values.Pneu_6_rbQuesito_4 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 5 ? values.Pneu_6_rbQuesito_5 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 6 ? values.Pneu_6_rbQuesito_6 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 7 ? values.Pneu_6_rbQuesito_7 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 8 ? values.Pneu_6_rbQuesito_8 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 9 ? values.Pneu_6_rbQuesito_9 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 10  ? values.Pneu_6_rbQuesito_10 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 11  ? values.Pneu_6_rbQuesito_11 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 12  ? values.Pneu_6_rbQuesito_12 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 13  ? values.Pneu_6_rbQuesito_13 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 14  ? values.Pneu_6_rbQuesito_14 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 15  ? values.Pneu_6_rbQuesito_15 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 16  ? values.Pneu_6_rbQuesito_16 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 17  ? values.Pneu_6_rbQuesito_17 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 18  ? values.Pneu_6_rbQuesito_18 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 19  ? values.Pneu_6_rbQuesito_19 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 20  ? values.Pneu_6_rbQuesito_20 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 21  ? values.Pneu_6_rbQuesito_21 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 22  ? values.Pneu_6_rbQuesito_22 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 23  ? values.Pneu_6_rbQuesito_23 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 24  ? values.Pneu_6_rbQuesito_24 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 25  ? values.Pneu_6_rbQuesito_25 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 26  ? values.Pneu_6_rbQuesito_26 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 27  ? values.Pneu_6_rbQuesito_27 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 28  ? values.Pneu_6_rbQuesito_28 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 29  ? values.Pneu_6_rbQuesito_29 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 30  ? values.Pneu_6_rbQuesito_30 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 31  ? values.Pneu_6_rbQuesito_31 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 32  ? values.Pneu_6_rbQuesito_32 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 33  ? values.Pneu_6_rbQuesito_33 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 34  ? values.Pneu_6_rbQuesito_34 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 35  ? values.Pneu_6_rbQuesito_35 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 36  ? values.Pneu_6_rbQuesito_36 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 37  ? values.Pneu_6_rbQuesito_37 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 38  ? values.Pneu_6_rbQuesito_38 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 39  ? values.Pneu_6_rbQuesito_39 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 40  ? values.Pneu_6_rbQuesito_40 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 41  ? values.Pneu_6_rbQuesito_41 == radio.COD_OPCAO ? true : false :

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
																					//LIST BOX
																					quesito.IND_LISTA == true && quesito.IND_ATIVO == true &&
																					(
																						<Picker
																								selectedValue={
																									//PNEU 1
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 1 ? values.Pneu_1_lbQuesito_1 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 2 ? values.Pneu_1_lbQuesito_2 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 3 ? values.Pneu_1_lbQuesito_3 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 4 ? values.Pneu_1_lbQuesito_4 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 5 ? values.Pneu_1_lbQuesito_5 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 6 ? values.Pneu_1_lbQuesito_6 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 7 ? values.Pneu_1_lbQuesito_7 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 8 ? values.Pneu_1_lbQuesito_8 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 9 ? values.Pneu_1_lbQuesito_9 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 10  ? values.Pneu_1_lbQuesito_10 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 11  ? values.Pneu_1_lbQuesito_11 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 12  ? values.Pneu_1_lbQuesito_12 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 13  ? values.Pneu_1_lbQuesito_13 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 14  ? values.Pneu_1_lbQuesito_14 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 15  ? values.Pneu_1_lbQuesito_15 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 16  ? values.Pneu_1_lbQuesito_16 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 17  ? values.Pneu_1_lbQuesito_17 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 18  ? values.Pneu_1_lbQuesito_18 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 19  ? values.Pneu_1_lbQuesito_19 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 20  ? values.Pneu_1_lbQuesito_20 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 21  ? values.Pneu_1_lbQuesito_21 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 22  ? values.Pneu_1_lbQuesito_22 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 23  ? values.Pneu_1_lbQuesito_23 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 24  ? values.Pneu_1_lbQuesito_24 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 25  ? values.Pneu_1_lbQuesito_25 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 26  ? values.Pneu_1_lbQuesito_26 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 27  ? values.Pneu_1_lbQuesito_27 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 28  ? values.Pneu_1_lbQuesito_28 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 29  ? values.Pneu_1_lbQuesito_29 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 30  ? values.Pneu_1_lbQuesito_30 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 31  ? values.Pneu_1_lbQuesito_31 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 32  ? values.Pneu_1_lbQuesito_32 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 33  ? values.Pneu_1_lbQuesito_33 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 34  ? values.Pneu_1_lbQuesito_34 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 35  ? values.Pneu_1_lbQuesito_35 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 36  ? values.Pneu_1_lbQuesito_36 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 37  ? values.Pneu_1_lbQuesito_37 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 38  ? values.Pneu_1_lbQuesito_38 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 39  ? values.Pneu_1_lbQuesito_39 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 40  ? values.Pneu_1_lbQuesito_40 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 41  ? values.Pneu_1_lbQuesito_41 :

																									//PNEU 2
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 1 ? values.Pneu_2_lbQuesito_1 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 2 ? values.Pneu_2_lbQuesito_2 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 3 ? values.Pneu_2_lbQuesito_3 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 4 ? values.Pneu_2_lbQuesito_4 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 5 ? values.Pneu_2_lbQuesito_5 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 6 ? values.Pneu_2_lbQuesito_6 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 7 ? values.Pneu_2_lbQuesito_7 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 8 ? values.Pneu_2_lbQuesito_8 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 9 ? values.Pneu_2_lbQuesito_9 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 10  ? values.Pneu_2_lbQuesito_10 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 11  ? values.Pneu_2_lbQuesito_11 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 12  ? values.Pneu_2_lbQuesito_12 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 13  ? values.Pneu_2_lbQuesito_13 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 14  ? values.Pneu_2_lbQuesito_14 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 15  ? values.Pneu_2_lbQuesito_15 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 16  ? values.Pneu_2_lbQuesito_16 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 17  ? values.Pneu_2_lbQuesito_17 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 18  ? values.Pneu_2_lbQuesito_18 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 19  ? values.Pneu_2_lbQuesito_19 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 20  ? values.Pneu_2_lbQuesito_20 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 21  ? values.Pneu_2_lbQuesito_21 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 22  ? values.Pneu_2_lbQuesito_22 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 23  ? values.Pneu_2_lbQuesito_23 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 24  ? values.Pneu_2_lbQuesito_24 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 25  ? values.Pneu_2_lbQuesito_25 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 26  ? values.Pneu_2_lbQuesito_26 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 27  ? values.Pneu_2_lbQuesito_27 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 28  ? values.Pneu_2_lbQuesito_28 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 29  ? values.Pneu_2_lbQuesito_29 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 30  ? values.Pneu_2_lbQuesito_30 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 31  ? values.Pneu_2_lbQuesito_31 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 32  ? values.Pneu_2_lbQuesito_32 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 33  ? values.Pneu_2_lbQuesito_33 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 34  ? values.Pneu_2_lbQuesito_34 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 35  ? values.Pneu_2_lbQuesito_35 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 36  ? values.Pneu_2_lbQuesito_36 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 37  ? values.Pneu_2_lbQuesito_37 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 38  ? values.Pneu_2_lbQuesito_38 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 39  ? values.Pneu_2_lbQuesito_39 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 40  ? values.Pneu_2_lbQuesito_40 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 41  ? values.Pneu_2_lbQuesito_41 :

																									//PNEU 3
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 1 ? values.Pneu_3_lbQuesito_1 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 2 ? values.Pneu_3_lbQuesito_2 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 3 ? values.Pneu_3_lbQuesito_3 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 4 ? values.Pneu_3_lbQuesito_4 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 5 ? values.Pneu_3_lbQuesito_5 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 6 ? values.Pneu_3_lbQuesito_6 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 7 ? values.Pneu_3_lbQuesito_7 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 8 ? values.Pneu_3_lbQuesito_8 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 9 ? values.Pneu_3_lbQuesito_9 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 10  ? values.Pneu_3_lbQuesito_10 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 11  ? values.Pneu_3_lbQuesito_11 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 12  ? values.Pneu_3_lbQuesito_12 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 13  ? values.Pneu_3_lbQuesito_13 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 14  ? values.Pneu_3_lbQuesito_14 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 15  ? values.Pneu_3_lbQuesito_15 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 16  ? values.Pneu_3_lbQuesito_16 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 17  ? values.Pneu_3_lbQuesito_17 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 18  ? values.Pneu_3_lbQuesito_18 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 19  ? values.Pneu_3_lbQuesito_19 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 20  ? values.Pneu_3_lbQuesito_20 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 21  ? values.Pneu_3_lbQuesito_21 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 22  ? values.Pneu_3_lbQuesito_22 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 23  ? values.Pneu_3_lbQuesito_23 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 24  ? values.Pneu_3_lbQuesito_24 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 25  ? values.Pneu_3_lbQuesito_25 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 26  ? values.Pneu_3_lbQuesito_26 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 27  ? values.Pneu_3_lbQuesito_27 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 28  ? values.Pneu_3_lbQuesito_28 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 29  ? values.Pneu_3_lbQuesito_29 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 30  ? values.Pneu_3_lbQuesito_30 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 31  ? values.Pneu_3_lbQuesito_31 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 32  ? values.Pneu_3_lbQuesito_32 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 33  ? values.Pneu_3_lbQuesito_33 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 34  ? values.Pneu_3_lbQuesito_34 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 35  ? values.Pneu_3_lbQuesito_35 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 36  ? values.Pneu_3_lbQuesito_36 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 37  ? values.Pneu_3_lbQuesito_37 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 38  ? values.Pneu_3_lbQuesito_38 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 39  ? values.Pneu_3_lbQuesito_39 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 40  ? values.Pneu_3_lbQuesito_40 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 41  ? values.Pneu_3_lbQuesito_41 :

																									//PNEU 4
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 1 ? values.Pneu_4_lbQuesito_1 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 2 ? values.Pneu_4_lbQuesito_2 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 3 ? values.Pneu_4_lbQuesito_3 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 4 ? values.Pneu_4_lbQuesito_4 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 5 ? values.Pneu_4_lbQuesito_5 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 6 ? values.Pneu_4_lbQuesito_6 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 7 ? values.Pneu_4_lbQuesito_7 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 8 ? values.Pneu_4_lbQuesito_8 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 9 ? values.Pneu_4_lbQuesito_9 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 10  ? values.Pneu_4_lbQuesito_10 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 11  ? values.Pneu_4_lbQuesito_11 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 12  ? values.Pneu_4_lbQuesito_12 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 13  ? values.Pneu_4_lbQuesito_13 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 14  ? values.Pneu_4_lbQuesito_14 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 15  ? values.Pneu_4_lbQuesito_15 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 16  ? values.Pneu_4_lbQuesito_16 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 17  ? values.Pneu_4_lbQuesito_17 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 18  ? values.Pneu_4_lbQuesito_18 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 19  ? values.Pneu_4_lbQuesito_19 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 20  ? values.Pneu_4_lbQuesito_20 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 21  ? values.Pneu_4_lbQuesito_21 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 22  ? values.Pneu_4_lbQuesito_22 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 23  ? values.Pneu_4_lbQuesito_23 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 24  ? values.Pneu_4_lbQuesito_24 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 25  ? values.Pneu_4_lbQuesito_25 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 26  ? values.Pneu_4_lbQuesito_26 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 27  ? values.Pneu_4_lbQuesito_27 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 28  ? values.Pneu_4_lbQuesito_28 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 29  ? values.Pneu_4_lbQuesito_29 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 30  ? values.Pneu_4_lbQuesito_30 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 31  ? values.Pneu_4_lbQuesito_31 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 32  ? values.Pneu_4_lbQuesito_32 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 33  ? values.Pneu_4_lbQuesito_33 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 34  ? values.Pneu_4_lbQuesito_34 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 35  ? values.Pneu_4_lbQuesito_35 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 36  ? values.Pneu_4_lbQuesito_36 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 37  ? values.Pneu_4_lbQuesito_37 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 38  ? values.Pneu_4_lbQuesito_38 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 39  ? values.Pneu_4_lbQuesito_39 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 40  ? values.Pneu_4_lbQuesito_40 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 41  ? values.Pneu_4_lbQuesito_41 :

																									//PNEU 5
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 1 ? values.Pneu_5_lbQuesito_1 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 2 ? values.Pneu_5_lbQuesito_2 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 3 ? values.Pneu_5_lbQuesito_3 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 4 ? values.Pneu_5_lbQuesito_4 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 5 ? values.Pneu_5_lbQuesito_5 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 6 ? values.Pneu_5_lbQuesito_6 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 7 ? values.Pneu_5_lbQuesito_7 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 8 ? values.Pneu_5_lbQuesito_8 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 9 ? values.Pneu_5_lbQuesito_9 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 10  ? values.Pneu_5_lbQuesito_10 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 11  ? values.Pneu_5_lbQuesito_11 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 12  ? values.Pneu_5_lbQuesito_12 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 13  ? values.Pneu_5_lbQuesito_13 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 14  ? values.Pneu_5_lbQuesito_14 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 15  ? values.Pneu_5_lbQuesito_15 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 16  ? values.Pneu_5_lbQuesito_16 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 17  ? values.Pneu_5_lbQuesito_17 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 18  ? values.Pneu_5_lbQuesito_18 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 19  ? values.Pneu_5_lbQuesito_19 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 20  ? values.Pneu_5_lbQuesito_20 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 21  ? values.Pneu_5_lbQuesito_21 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 22  ? values.Pneu_5_lbQuesito_22 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 23  ? values.Pneu_5_lbQuesito_23 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 24  ? values.Pneu_5_lbQuesito_24 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 25  ? values.Pneu_5_lbQuesito_25 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 26  ? values.Pneu_5_lbQuesito_26 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 27  ? values.Pneu_5_lbQuesito_27 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 28  ? values.Pneu_5_lbQuesito_28 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 29  ? values.Pneu_5_lbQuesito_29 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 30  ? values.Pneu_5_lbQuesito_30 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 31  ? values.Pneu_5_lbQuesito_31 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 32  ? values.Pneu_5_lbQuesito_32 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 33  ? values.Pneu_5_lbQuesito_33 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 34  ? values.Pneu_5_lbQuesito_34 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 35  ? values.Pneu_5_lbQuesito_35 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 36  ? values.Pneu_5_lbQuesito_36 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 37  ? values.Pneu_5_lbQuesito_37 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 38  ? values.Pneu_5_lbQuesito_38 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 39  ? values.Pneu_5_lbQuesito_39 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 40  ? values.Pneu_5_lbQuesito_40 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 41  ? values.Pneu_5_lbQuesito_41 :

																									//PNEU 6
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 1 ? values.Pneu_6_lbQuesito_1 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 2 ? values.Pneu_6_lbQuesito_2 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 3 ? values.Pneu_6_lbQuesito_3 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 4 ? values.Pneu_6_lbQuesito_4 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 5 ? values.Pneu_6_lbQuesito_5 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 6 ? values.Pneu_6_lbQuesito_6 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 7 ? values.Pneu_6_lbQuesito_7 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 8 ? values.Pneu_6_lbQuesito_8 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 9 ? values.Pneu_6_lbQuesito_9 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 10  ? values.Pneu_6_lbQuesito_10 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 11  ? values.Pneu_6_lbQuesito_11 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 12  ? values.Pneu_6_lbQuesito_12 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 13  ? values.Pneu_6_lbQuesito_13 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 14  ? values.Pneu_6_lbQuesito_14 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 15  ? values.Pneu_6_lbQuesito_15 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 16  ? values.Pneu_6_lbQuesito_16 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 17  ? values.Pneu_6_lbQuesito_17 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 18  ? values.Pneu_6_lbQuesito_18 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 19  ? values.Pneu_6_lbQuesito_19 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 20  ? values.Pneu_6_lbQuesito_20 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 21  ? values.Pneu_6_lbQuesito_21 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 22  ? values.Pneu_6_lbQuesito_22 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 23  ? values.Pneu_6_lbQuesito_23 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 24  ? values.Pneu_6_lbQuesito_24 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 25  ? values.Pneu_6_lbQuesito_25 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 26  ? values.Pneu_6_lbQuesito_26 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 27  ? values.Pneu_6_lbQuesito_27 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 28  ? values.Pneu_6_lbQuesito_28 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 29  ? values.Pneu_6_lbQuesito_29 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 30  ? values.Pneu_6_lbQuesito_30 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 31  ? values.Pneu_6_lbQuesito_31 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 32  ? values.Pneu_6_lbQuesito_32 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 33  ? values.Pneu_6_lbQuesito_33 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 34  ? values.Pneu_6_lbQuesito_34 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 35  ? values.Pneu_6_lbQuesito_35 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 36  ? values.Pneu_6_lbQuesito_36 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 37  ? values.Pneu_6_lbQuesito_37 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 38  ? values.Pneu_6_lbQuesito_38 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 39  ? values.Pneu_6_lbQuesito_39 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 40  ? values.Pneu_6_lbQuesito_40 :
																									listbox.COD_OPCAO == 6 && quesito.COD_ITEM == 41  ? values.Pneu_6_lbQuesito_41 :

																									false
																								}
																								style={{ height: 50, margin:5, width: '100%'}}
																								onValueChange={(itemValue, itemIndex) => setFieldValue('Pneu_'+listbox.COD_OPCAO+'_lbQuesito_'+quesito.COD_ITEM, itemValue )}
																						>
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
																	<Separator style={{ backgroundColor: 'rgb(200, 251, 88)', height: 45, marginTop: 3, marginLeft: 20, marginRight: 20  }} bordered >
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
																					//CHECKBOX
																					quesito.IND_CHECKBOX == true && quesito.IND_ATIVO == true && 
																					(
																						<ListItem>
																							<Switch
																								trackColor={{ false: "red", true: "#C5DB5F" }}
																								thumbColor={ "#fff"}
																								ios_backgroundColor="#fff"
																								onValueChange={ (previousState) => setFieldValue('Lataria_'+listbox.COD_OPCAO+'_cbQuesito_'+quesito.COD_ITEM, previousState ) }
																								value={
																									//Lataria 1
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 1 ? values.Lataria_1_cbQuesito_1 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 2 ? values.Lataria_1_cbQuesito_2 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 3 ? values.Lataria_1_cbQuesito_3 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 4 ? values.Lataria_1_cbQuesito_4 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 5 ? values.Lataria_1_cbQuesito_5 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 6 ? values.Lataria_1_cbQuesito_6 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 7 ? values.Lataria_1_cbQuesito_7 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 8 ? values.Lataria_1_cbQuesito_8 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 9 ? values.Lataria_1_cbQuesito_9 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 10  ? values.Lataria_1_cbQuesito_10 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 11  ? values.Lataria_1_cbQuesito_11 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 12  ? values.Lataria_1_cbQuesito_12 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 13  ? values.Lataria_1_cbQuesito_13 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 14  ? values.Lataria_1_cbQuesito_14 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 15  ? values.Lataria_1_cbQuesito_15 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 16  ? values.Lataria_1_cbQuesito_16 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 17  ? values.Lataria_1_cbQuesito_17 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 18  ? values.Lataria_1_cbQuesito_18 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 19  ? values.Lataria_1_cbQuesito_19 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 20  ? values.Lataria_1_cbQuesito_20 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 21  ? values.Lataria_1_cbQuesito_21 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 22  ? values.Lataria_1_cbQuesito_22 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 23  ? values.Lataria_1_cbQuesito_23 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 24  ? values.Lataria_1_cbQuesito_24 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 25  ? values.Lataria_1_cbQuesito_25 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 26  ? values.Lataria_1_cbQuesito_26 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 27  ? values.Lataria_1_cbQuesito_27 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 28  ? values.Lataria_1_cbQuesito_28 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 29  ? values.Lataria_1_cbQuesito_29 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 30  ? values.Lataria_1_cbQuesito_30 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 31  ? values.Lataria_1_cbQuesito_31 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 32  ? values.Lataria_1_cbQuesito_32 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 33  ? values.Lataria_1_cbQuesito_33 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 34  ? values.Lataria_1_cbQuesito_34 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 35  ? values.Lataria_1_cbQuesito_35 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 36  ? values.Lataria_1_cbQuesito_36 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 37  ? values.Lataria_1_cbQuesito_37 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 38  ? values.Lataria_1_cbQuesito_38 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 39  ? values.Lataria_1_cbQuesito_39 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 40  ? values.Lataria_1_cbQuesito_40 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 41  ? values.Lataria_1_cbQuesito_41 :

																									//Lataria 2
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 1 ? values.Lataria_2_cbQuesito_1 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 2 ? values.Lataria_2_cbQuesito_2 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 3 ? values.Lataria_2_cbQuesito_3 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 4 ? values.Lataria_2_cbQuesito_4 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 5 ? values.Lataria_2_cbQuesito_5 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 6 ? values.Lataria_2_cbQuesito_6 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 7 ? values.Lataria_2_cbQuesito_7 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 8 ? values.Lataria_2_cbQuesito_8 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 9 ? values.Lataria_2_cbQuesito_9 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 10  ? values.Lataria_2_cbQuesito_10 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 11  ? values.Lataria_2_cbQuesito_11 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 12  ? values.Lataria_2_cbQuesito_12 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 13  ? values.Lataria_2_cbQuesito_13 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 14  ? values.Lataria_2_cbQuesito_14 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 15  ? values.Lataria_2_cbQuesito_15 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 16  ? values.Lataria_2_cbQuesito_16 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 17  ? values.Lataria_2_cbQuesito_17 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 18  ? values.Lataria_2_cbQuesito_18 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 19  ? values.Lataria_2_cbQuesito_19 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 20  ? values.Lataria_2_cbQuesito_20 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 21  ? values.Lataria_2_cbQuesito_21 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 22  ? values.Lataria_2_cbQuesito_22 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 23  ? values.Lataria_2_cbQuesito_23 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 24  ? values.Lataria_2_cbQuesito_24 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 25  ? values.Lataria_2_cbQuesito_25 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 26  ? values.Lataria_2_cbQuesito_26 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 27  ? values.Lataria_2_cbQuesito_27 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 28  ? values.Lataria_2_cbQuesito_28 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 29  ? values.Lataria_2_cbQuesito_29 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 30  ? values.Lataria_2_cbQuesito_30 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 31  ? values.Lataria_2_cbQuesito_31 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 32  ? values.Lataria_2_cbQuesito_32 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 33  ? values.Lataria_2_cbQuesito_33 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 34  ? values.Lataria_2_cbQuesito_34 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 35  ? values.Lataria_2_cbQuesito_35 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 36  ? values.Lataria_2_cbQuesito_36 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 37  ? values.Lataria_2_cbQuesito_37 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 38  ? values.Lataria_2_cbQuesito_38 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 39  ? values.Lataria_2_cbQuesito_39 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 40  ? values.Lataria_2_cbQuesito_40 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 41  ? values.Lataria_2_cbQuesito_41 :

																									//Lataria 3
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 1 ? values.Lataria_3_cbQuesito_1 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 2 ? values.Lataria_3_cbQuesito_2 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 3 ? values.Lataria_3_cbQuesito_3 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 4 ? values.Lataria_3_cbQuesito_4 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 5 ? values.Lataria_3_cbQuesito_5 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 6 ? values.Lataria_3_cbQuesito_6 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 7 ? values.Lataria_3_cbQuesito_7 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 8 ? values.Lataria_3_cbQuesito_8 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 9 ? values.Lataria_3_cbQuesito_9 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 10  ? values.Lataria_3_cbQuesito_10 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 11  ? values.Lataria_3_cbQuesito_11 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 12  ? values.Lataria_3_cbQuesito_12 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 13  ? values.Lataria_3_cbQuesito_13 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 14  ? values.Lataria_3_cbQuesito_14 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 15  ? values.Lataria_3_cbQuesito_15 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 16  ? values.Lataria_3_cbQuesito_16 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 17  ? values.Lataria_3_cbQuesito_17 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 18  ? values.Lataria_3_cbQuesito_18 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 19  ? values.Lataria_3_cbQuesito_19 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 20  ? values.Lataria_3_cbQuesito_20 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 21  ? values.Lataria_3_cbQuesito_21 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 22  ? values.Lataria_3_cbQuesito_22 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 23  ? values.Lataria_3_cbQuesito_23 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 24  ? values.Lataria_3_cbQuesito_24 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 25  ? values.Lataria_3_cbQuesito_25 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 26  ? values.Lataria_3_cbQuesito_26 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 27  ? values.Lataria_3_cbQuesito_27 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 28  ? values.Lataria_3_cbQuesito_28 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 29  ? values.Lataria_3_cbQuesito_29 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 30  ? values.Lataria_3_cbQuesito_30 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 31  ? values.Lataria_3_cbQuesito_31 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 32  ? values.Lataria_3_cbQuesito_32 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 33  ? values.Lataria_3_cbQuesito_33 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 34  ? values.Lataria_3_cbQuesito_34 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 35  ? values.Lataria_3_cbQuesito_35 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 36  ? values.Lataria_3_cbQuesito_36 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 37  ? values.Lataria_3_cbQuesito_37 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 38  ? values.Lataria_3_cbQuesito_38 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 39  ? values.Lataria_3_cbQuesito_39 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 40  ? values.Lataria_3_cbQuesito_40 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 41  ? values.Lataria_3_cbQuesito_41 :

																									//Lataria 4
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 1 ? values.Lataria_4_cbQuesito_1 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 2 ? values.Lataria_4_cbQuesito_2 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 3 ? values.Lataria_4_cbQuesito_3 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 4 ? values.Lataria_4_cbQuesito_4 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 5 ? values.Lataria_4_cbQuesito_5 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 6 ? values.Lataria_4_cbQuesito_6 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 7 ? values.Lataria_4_cbQuesito_7 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 8 ? values.Lataria_4_cbQuesito_8 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 9 ? values.Lataria_4_cbQuesito_9 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 10  ? values.Lataria_4_cbQuesito_10 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 11  ? values.Lataria_4_cbQuesito_11 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 12  ? values.Lataria_4_cbQuesito_12 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 13  ? values.Lataria_4_cbQuesito_13 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 14  ? values.Lataria_4_cbQuesito_14 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 15  ? values.Lataria_4_cbQuesito_15 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 16  ? values.Lataria_4_cbQuesito_16 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 17  ? values.Lataria_4_cbQuesito_17 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 18  ? values.Lataria_4_cbQuesito_18 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 19  ? values.Lataria_4_cbQuesito_19 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 20  ? values.Lataria_4_cbQuesito_20 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 21  ? values.Lataria_4_cbQuesito_21 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 22  ? values.Lataria_4_cbQuesito_22 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 23  ? values.Lataria_4_cbQuesito_23 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 24  ? values.Lataria_4_cbQuesito_24 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 25  ? values.Lataria_4_cbQuesito_25 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 26  ? values.Lataria_4_cbQuesito_26 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 27  ? values.Lataria_4_cbQuesito_27 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 28  ? values.Lataria_4_cbQuesito_28 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 29  ? values.Lataria_4_cbQuesito_29 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 30  ? values.Lataria_4_cbQuesito_30 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 31  ? values.Lataria_4_cbQuesito_31 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 32  ? values.Lataria_4_cbQuesito_32 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 33  ? values.Lataria_4_cbQuesito_33 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 34  ? values.Lataria_4_cbQuesito_34 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 35  ? values.Lataria_4_cbQuesito_35 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 36  ? values.Lataria_4_cbQuesito_36 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 37  ? values.Lataria_4_cbQuesito_37 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 38  ? values.Lataria_4_cbQuesito_38 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 39  ? values.Lataria_4_cbQuesito_39 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 40  ? values.Lataria_4_cbQuesito_40 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 41  ? values.Lataria_4_cbQuesito_41 :
																									
																									//Lataria 5
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 1 ? values.Lataria_5_cbQuesito_1 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 2 ? values.Lataria_5_cbQuesito_2 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 3 ? values.Lataria_5_cbQuesito_3 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 4 ? values.Lataria_5_cbQuesito_4 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 5 ? values.Lataria_5_cbQuesito_5 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 6 ? values.Lataria_5_cbQuesito_6 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 7 ? values.Lataria_5_cbQuesito_7 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 8 ? values.Lataria_5_cbQuesito_8 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 9 ? values.Lataria_5_cbQuesito_9 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 10  ? values.Lataria_5_cbQuesito_10 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 11  ? values.Lataria_5_cbQuesito_11 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 12  ? values.Lataria_5_cbQuesito_12 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 13  ? values.Lataria_5_cbQuesito_13 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 14  ? values.Lataria_5_cbQuesito_14 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 15  ? values.Lataria_5_cbQuesito_15 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 16  ? values.Lataria_5_cbQuesito_16 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 17  ? values.Lataria_5_cbQuesito_17 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 18  ? values.Lataria_5_cbQuesito_18 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 19  ? values.Lataria_5_cbQuesito_19 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 20  ? values.Lataria_5_cbQuesito_20 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 21  ? values.Lataria_5_cbQuesito_21 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 22  ? values.Lataria_5_cbQuesito_22 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 23  ? values.Lataria_5_cbQuesito_23 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 24  ? values.Lataria_5_cbQuesito_24 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 25  ? values.Lataria_5_cbQuesito_25 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 26  ? values.Lataria_5_cbQuesito_26 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 27  ? values.Lataria_5_cbQuesito_27 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 28  ? values.Lataria_5_cbQuesito_28 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 29  ? values.Lataria_5_cbQuesito_29 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 30  ? values.Lataria_5_cbQuesito_30 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 31  ? values.Lataria_5_cbQuesito_31 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 32  ? values.Lataria_5_cbQuesito_32 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 33  ? values.Lataria_5_cbQuesito_33 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 34  ? values.Lataria_5_cbQuesito_34 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 35  ? values.Lataria_5_cbQuesito_35 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 36  ? values.Lataria_5_cbQuesito_36 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 37  ? values.Lataria_5_cbQuesito_37 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 38  ? values.Lataria_5_cbQuesito_38 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 39  ? values.Lataria_5_cbQuesito_39 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 40  ? values.Lataria_5_cbQuesito_50 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 41  ? values.Lataria_5_cbQuesito_51 :

																									false
																								}
																							/>
																						</ListItem>	
																					)
																				}
																				{
																					//INPUT TEXTO Lataria
																					quesito.IND_TEXTO == true && quesito.IND_ATIVO == true && 
																					(	
																						<>
																						<Input 
																							onChangeText={handleChange('Lataria_'+listbox.COD_OPCAO+'_inputTextoQuesito_'+quesito.COD_ITEM)}
																							onBlur={handleBlur('Lataria_'+listbox.COD_OPCAO+'_inputTextoQuesito_'+quesito.COD_ITEM)}
																							placeholder='Observação'
																							value={
																								//Lataria 1
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 1 ? values.Lataria_1_inputTextoQuesito_1 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 2 ? values.Lataria_1_inputTextoQuesito_2 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 3 ? values.Lataria_1_inputTextoQuesito_3 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 4 ? values.Lataria_1_inputTextoQuesito_4 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 5 ? values.Lataria_1_inputTextoQuesito_5 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 6 ? values.Lataria_1_inputTextoQuesito_6 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 7 ? values.Lataria_1_inputTextoQuesito_7 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 8 ? values.Lataria_1_inputTextoQuesito_8 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 9 ? values.Lataria_1_inputTextoQuesito_9 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 10  ? values.Lataria_1_inputTextoQuesito_10 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 11  ? values.Lataria_1_inputTextoQuesito_11 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 12  ? values.Lataria_1_inputTextoQuesito_12 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 13  ? values.Lataria_1_inputTextoQuesito_13 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 14  ? values.Lataria_1_inputTextoQuesito_14 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 15  ? values.Lataria_1_inputTextoQuesito_15 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 16  ? values.Lataria_1_inputTextoQuesito_16 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 17  ? values.Lataria_1_inputTextoQuesito_17 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 18  ? values.Lataria_1_inputTextoQuesito_18 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 19  ? values.Lataria_1_inputTextoQuesito_19 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 20  ? values.Lataria_1_inputTextoQuesito_20 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 21  ? values.Lataria_1_inputTextoQuesito_21 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 22  ? values.Lataria_1_inputTextoQuesito_22 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 23  ? values.Lataria_1_inputTextoQuesito_23 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 24  ? values.Lataria_1_inputTextoQuesito_24 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 25  ? values.Lataria_1_inputTextoQuesito_25 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 26  ? values.Lataria_1_inputTextoQuesito_26 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 27  ? values.Lataria_1_inputTextoQuesito_27 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 28  ? values.Lataria_1_inputTextoQuesito_28 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 29  ? values.Lataria_1_inputTextoQuesito_29 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 30  ? values.Lataria_1_inputTextoQuesito_30 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 31  ? values.Lataria_1_inputTextoQuesito_31 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 32  ? values.Lataria_1_inputTextoQuesito_32 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 33  ? values.Lataria_1_inputTextoQuesito_33 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 34  ? values.Lataria_1_inputTextoQuesito_34 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 35  ? values.Lataria_1_inputTextoQuesito_35 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 36  ? values.Lataria_1_inputTextoQuesito_36 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 37  ? values.Lataria_1_inputTextoQuesito_37 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 38  ? values.Lataria_1_inputTextoQuesito_38 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 39  ? values.Lataria_1_inputTextoQuesito_39 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 40  ? values.Lataria_1_inputTextoQuesito_40 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 41  ? values.Lataria_1_inputTextoQuesito_41 :

																								//Lataria 2
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 1 ? values.Lataria_2_inputTextoQuesito_1 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 2 ? values.Lataria_2_inputTextoQuesito_2 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 3 ? values.Lataria_2_inputTextoQuesito_3 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 4 ? values.Lataria_2_inputTextoQuesito_4 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 5 ? values.Lataria_2_inputTextoQuesito_5 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 6 ? values.Lataria_2_inputTextoQuesito_6 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 7 ? values.Lataria_2_inputTextoQuesito_7 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 8 ? values.Lataria_2_inputTextoQuesito_8 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 9 ? values.Lataria_2_inputTextoQuesito_9 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 10  ? values.Lataria_2_inputTextoQuesito_10 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 11  ? values.Lataria_2_inputTextoQuesito_11 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 12  ? values.Lataria_2_inputTextoQuesito_12 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 13  ? values.Lataria_2_inputTextoQuesito_13 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 14  ? values.Lataria_2_inputTextoQuesito_14 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 15  ? values.Lataria_2_inputTextoQuesito_15 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 16  ? values.Lataria_2_inputTextoQuesito_16 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 17  ? values.Lataria_2_inputTextoQuesito_17 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 18  ? values.Lataria_2_inputTextoQuesito_18 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 19  ? values.Lataria_2_inputTextoQuesito_19 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 20  ? values.Lataria_2_inputTextoQuesito_20 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 21  ? values.Lataria_2_inputTextoQuesito_21 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 22  ? values.Lataria_2_inputTextoQuesito_22 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 23  ? values.Lataria_2_inputTextoQuesito_23 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 24  ? values.Lataria_2_inputTextoQuesito_24 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 25  ? values.Lataria_2_inputTextoQuesito_25 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 26  ? values.Lataria_2_inputTextoQuesito_26 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 27  ? values.Lataria_2_inputTextoQuesito_27 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 28  ? values.Lataria_2_inputTextoQuesito_28 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 29  ? values.Lataria_2_inputTextoQuesito_29 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 30  ? values.Lataria_2_inputTextoQuesito_30 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 31  ? values.Lataria_2_inputTextoQuesito_31 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 32  ? values.Lataria_2_inputTextoQuesito_32 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 33  ? values.Lataria_2_inputTextoQuesito_33 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 34  ? values.Lataria_2_inputTextoQuesito_34 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 35  ? values.Lataria_2_inputTextoQuesito_35 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 36  ? values.Lataria_2_inputTextoQuesito_36 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 37  ? values.Lataria_2_inputTextoQuesito_37 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 38  ? values.Lataria_2_inputTextoQuesito_38 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 39  ? values.Lataria_2_inputTextoQuesito_39 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 40  ? values.Lataria_2_inputTextoQuesito_40 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 41  ? values.Lataria_2_inputTextoQuesito_41 :

																								//Lataria 3
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 1 ? values.Lataria_3_inputTextoQuesito_1 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 2 ? values.Lataria_3_inputTextoQuesito_2 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 3 ? values.Lataria_3_inputTextoQuesito_3 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 4 ? values.Lataria_3_inputTextoQuesito_4 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 5 ? values.Lataria_3_inputTextoQuesito_5 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 6 ? values.Lataria_3_inputTextoQuesito_6 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 7 ? values.Lataria_3_inputTextoQuesito_7 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 8 ? values.Lataria_3_inputTextoQuesito_8 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 9 ? values.Lataria_3_inputTextoQuesito_9 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 10  ? values.Lataria_3_inputTextoQuesito_10 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 11  ? values.Lataria_3_inputTextoQuesito_11 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 12  ? values.Lataria_3_inputTextoQuesito_12 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 13  ? values.Lataria_3_inputTextoQuesito_13 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 14  ? values.Lataria_3_inputTextoQuesito_14 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 15  ? values.Lataria_3_inputTextoQuesito_15 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 16  ? values.Lataria_3_inputTextoQuesito_16 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 17  ? values.Lataria_3_inputTextoQuesito_17 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 18  ? values.Lataria_3_inputTextoQuesito_18 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 19  ? values.Lataria_3_inputTextoQuesito_19 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 20  ? values.Lataria_3_inputTextoQuesito_20 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 21  ? values.Lataria_3_inputTextoQuesito_21 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 22  ? values.Lataria_3_inputTextoQuesito_22 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 23  ? values.Lataria_3_inputTextoQuesito_23 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 24  ? values.Lataria_3_inputTextoQuesito_24 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 25  ? values.Lataria_3_inputTextoQuesito_25 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 26  ? values.Lataria_3_inputTextoQuesito_26 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 27  ? values.Lataria_3_inputTextoQuesito_27 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 28  ? values.Lataria_3_inputTextoQuesito_28 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 29  ? values.Lataria_3_inputTextoQuesito_29 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 30  ? values.Lataria_3_inputTextoQuesito_30 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 31  ? values.Lataria_3_inputTextoQuesito_31 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 32  ? values.Lataria_3_inputTextoQuesito_32 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 33  ? values.Lataria_3_inputTextoQuesito_33 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 34  ? values.Lataria_3_inputTextoQuesito_34 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 35  ? values.Lataria_3_inputTextoQuesito_35 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 36  ? values.Lataria_3_inputTextoQuesito_36 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 37  ? values.Lataria_3_inputTextoQuesito_37 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 38  ? values.Lataria_3_inputTextoQuesito_38 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 39  ? values.Lataria_3_inputTextoQuesito_39 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 40  ? values.Lataria_3_inputTextoQuesito_40 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 41  ? values.Lataria_3_inputTextoQuesito_41 :

																								//Lataria 4
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 1 ? values.Lataria_4_inputTextoQuesito_1 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 2 ? values.Lataria_4_inputTextoQuesito_2 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 3 ? values.Lataria_4_inputTextoQuesito_3 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 4 ? values.Lataria_4_inputTextoQuesito_4 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 5 ? values.Lataria_4_inputTextoQuesito_5 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 6 ? values.Lataria_4_inputTextoQuesito_6 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 7 ? values.Lataria_4_inputTextoQuesito_7 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 8 ? values.Lataria_4_inputTextoQuesito_8 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 9 ? values.Lataria_4_inputTextoQuesito_9 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 10  ? values.Lataria_4_inputTextoQuesito_10 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 11  ? values.Lataria_4_inputTextoQuesito_11 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 12  ? values.Lataria_4_inputTextoQuesito_12 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 13  ? values.Lataria_4_inputTextoQuesito_13 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 14  ? values.Lataria_4_inputTextoQuesito_14 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 15  ? values.Lataria_4_inputTextoQuesito_15 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 16  ? values.Lataria_4_inputTextoQuesito_16 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 17  ? values.Lataria_4_inputTextoQuesito_17 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 18  ? values.Lataria_4_inputTextoQuesito_18 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 19  ? values.Lataria_4_inputTextoQuesito_19 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 20  ? values.Lataria_4_inputTextoQuesito_20 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 21  ? values.Lataria_4_inputTextoQuesito_21 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 22  ? values.Lataria_4_inputTextoQuesito_22 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 23  ? values.Lataria_4_inputTextoQuesito_24 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 24  ? values.Lataria_4_inputTextoQuesito_24 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 25  ? values.Lataria_4_inputTextoQuesito_25 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 26  ? values.Lataria_4_inputTextoQuesito_26 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 27  ? values.Lataria_4_inputTextoQuesito_27 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 28  ? values.Lataria_4_inputTextoQuesito_28 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 29  ? values.Lataria_4_inputTextoQuesito_29 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 30  ? values.Lataria_4_inputTextoQuesito_30 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 31  ? values.Lataria_4_inputTextoQuesito_31 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 32  ? values.Lataria_4_inputTextoQuesito_32 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 33  ? values.Lataria_4_inputTextoQuesito_33 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 34  ? values.Lataria_4_inputTextoQuesito_34 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 35  ? values.Lataria_4_inputTextoQuesito_35 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 36  ? values.Lataria_4_inputTextoQuesito_36 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 37  ? values.Lataria_4_inputTextoQuesito_37 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 38  ? values.Lataria_4_inputTextoQuesito_38 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 39  ? values.Lataria_4_inputTextoQuesito_39 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 40  ? values.Lataria_4_inputTextoQuesito_40 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 41  ? values.Lataria_4_inputTextoQuesito_41 :

																								//Lataria 5
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 1 ? values.Lataria_5_inputTextoQuesito_1 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 2 ? values.Lataria_5_inputTextoQuesito_2 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 3 ? values.Lataria_5_inputTextoQuesito_3 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 4 ? values.Lataria_5_inputTextoQuesito_4 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 5 ? values.Lataria_5_inputTextoQuesito_5 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 6 ? values.Lataria_5_inputTextoQuesito_6 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 7 ? values.Lataria_5_inputTextoQuesito_7 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 8 ? values.Lataria_5_inputTextoQuesito_8 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 9 ? values.Lataria_5_inputTextoQuesito_9 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 10  ? values.Lataria_5_inputTextoQuesito_10 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 11  ? values.Lataria_5_inputTextoQuesito_11 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 12  ? values.Lataria_5_inputTextoQuesito_12 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 13  ? values.Lataria_5_inputTextoQuesito_13 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 14  ? values.Lataria_5_inputTextoQuesito_14 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 15  ? values.Lataria_5_inputTextoQuesito_15 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 16  ? values.Lataria_5_inputTextoQuesito_16 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 17  ? values.Lataria_5_inputTextoQuesito_17 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 18  ? values.Lataria_5_inputTextoQuesito_18 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 19  ? values.Lataria_5_inputTextoQuesito_19 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 20  ? values.Lataria_5_inputTextoQuesito_20 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 21  ? values.Lataria_5_inputTextoQuesito_21 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 22  ? values.Lataria_5_inputTextoQuesito_22 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 23  ? values.Lataria_5_inputTextoQuesito_23 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 24  ? values.Lataria_5_inputTextoQuesito_24 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 25  ? values.Lataria_5_inputTextoQuesito_25 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 26  ? values.Lataria_5_inputTextoQuesito_26 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 27  ? values.Lataria_5_inputTextoQuesito_27 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 28  ? values.Lataria_5_inputTextoQuesito_28 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 29  ? values.Lataria_5_inputTextoQuesito_29 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 30  ? values.Lataria_5_inputTextoQuesito_30 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 31  ? values.Lataria_5_inputTextoQuesito_31 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 32  ? values.Lataria_5_inputTextoQuesito_32 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 33  ? values.Lataria_5_inputTextoQuesito_33 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 34  ? values.Lataria_5_inputTextoQuesito_34 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 35  ? values.Lataria_5_inputTextoQuesito_35 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 36  ? values.Lataria_5_inputTextoQuesito_36 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 37  ? values.Lataria_5_inputTextoQuesito_37 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 38  ? values.Lataria_5_inputTextoQuesito_38 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 39  ? values.Lataria_5_inputTextoQuesito_39 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 40  ? values.Lataria_5_inputTextoQuesito_40 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 41  ? values.Lataria_5_inputTextoQuesito_41 :

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
																							onChangeText={handleChange('Lataria_'+listbox.COD_OPCAO+'_inputDecimalQuesito_'+quesito.COD_ITEM)}
																							onBlur={handleBlur('Lataria_'+listbox.COD_OPCAO+'_inputDecimalQuesito_'+quesito.COD_ITEM)}
																							placeholder='Decimal'
																							value={
																								//Lataria 1
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 1 ? values.Lataria_1_inputDecimalQuesito_1 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 2 ? values.Lataria_1_inputDecimalQuesito_2 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 3 ? values.Lataria_1_inputDecimalQuesito_3 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 4 ? values.Lataria_1_inputDecimalQuesito_4 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 5 ? values.Lataria_1_inputDecimalQuesito_5 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 6 ? values.Lataria_1_inputDecimalQuesito_6 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 7 ? values.Lataria_1_inputDecimalQuesito_7 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 8 ? values.Lataria_1_inputDecimalQuesito_8 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 9 ? values.Lataria_1_inputDecimalQuesito_9 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 10  ? values.Lataria_1_inputDecimalQuesito_10 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 11  ? values.Lataria_1_inputDecimalQuesito_11 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 12  ? values.Lataria_1_inputDecimalQuesito_12 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 13  ? values.Lataria_1_inputDecimalQuesito_13 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 14  ? values.Lataria_1_inputDecimalQuesito_14 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 15  ? values.Lataria_1_inputDecimalQuesito_15 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 16  ? values.Lataria_1_inputDecimalQuesito_16 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 17  ? values.Lataria_1_inputDecimalQuesito_17 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 18  ? values.Lataria_1_inputDecimalQuesito_18 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 19  ? values.Lataria_1_inputDecimalQuesito_19 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 20  ? values.Lataria_1_inputDecimalQuesito_20 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 21  ? values.Lataria_1_inputDecimalQuesito_21 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 22  ? values.Lataria_1_inputDecimalQuesito_22 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 23  ? values.Lataria_1_inputDecimalQuesito_23 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 24  ? values.Lataria_1_inputDecimalQuesito_24 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 25  ? values.Lataria_1_inputDecimalQuesito_25 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 26  ? values.Lataria_1_inputDecimalQuesito_26 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 27  ? values.Lataria_1_inputDecimalQuesito_27 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 28  ? values.Lataria_1_inputDecimalQuesito_28 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 29  ? values.Lataria_1_inputDecimalQuesito_29 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 30  ? values.Lataria_1_inputDecimalQuesito_30 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 31  ? values.Lataria_1_inputDecimalQuesito_31 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 32  ? values.Lataria_1_inputDecimalQuesito_32 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 33  ? values.Lataria_1_inputDecimalQuesito_33 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 34  ? values.Lataria_1_inputDecimalQuesito_34 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 35  ? values.Lataria_1_inputDecimalQuesito_35 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 36  ? values.Lataria_1_inputDecimalQuesito_36 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 37  ? values.Lataria_1_inputDecimalQuesito_37 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 38  ? values.Lataria_1_inputDecimalQuesito_38 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 39  ? values.Lataria_1_inputDecimalQuesito_39 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 40  ? values.Lataria_1_inputDecimalQuesito_40 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 41  ? values.Lataria_1_inputDecimalQuesito_41 :

																								//Lataria 2
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 1 ? values.Lataria_2_inputDecimalQuesito_1 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 2 ? values.Lataria_2_inputDecimalQuesito_2 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 3 ? values.Lataria_2_inputDecimalQuesito_3 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 4 ? values.Lataria_2_inputDecimalQuesito_4 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 5 ? values.Lataria_2_inputDecimalQuesito_5 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 6 ? values.Lataria_2_inputDecimalQuesito_6 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 7 ? values.Lataria_2_inputDecimalQuesito_7 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 8 ? values.Lataria_2_inputDecimalQuesito_8 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 9 ? values.Lataria_2_inputDecimalQuesito_9 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 10  ? values.Lataria_2_inputDecimalQuesito_10 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 11  ? values.Lataria_2_inputDecimalQuesito_11 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 12  ? values.Lataria_2_inputDecimalQuesito_12 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 13  ? values.Lataria_2_inputDecimalQuesito_13 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 14  ? values.Lataria_2_inputDecimalQuesito_14 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 15  ? values.Lataria_2_inputDecimalQuesito_15 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 16  ? values.Lataria_2_inputDecimalQuesito_16 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 17  ? values.Lataria_2_inputDecimalQuesito_17 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 18  ? values.Lataria_2_inputDecimalQuesito_18 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 19  ? values.Lataria_2_inputDecimalQuesito_19 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 20  ? values.Lataria_2_inputDecimalQuesito_20 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 21  ? values.Lataria_2_inputDecimalQuesito_21 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 22  ? values.Lataria_2_inputDecimalQuesito_22 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 23  ? values.Lataria_2_inputDecimalQuesito_23 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 24  ? values.Lataria_2_inputDecimalQuesito_24 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 25  ? values.Lataria_2_inputDecimalQuesito_25 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 26  ? values.Lataria_2_inputDecimalQuesito_26 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 27  ? values.Lataria_2_inputDecimalQuesito_27 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 28  ? values.Lataria_2_inputDecimalQuesito_28 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 29  ? values.Lataria_2_inputDecimalQuesito_29 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 30  ? values.Lataria_2_inputDecimalQuesito_30 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 31  ? values.Lataria_2_inputDecimalQuesito_31 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 32  ? values.Lataria_2_inputDecimalQuesito_32 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 33  ? values.Lataria_2_inputDecimalQuesito_33 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 34  ? values.Lataria_2_inputDecimalQuesito_34 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 35  ? values.Lataria_2_inputDecimalQuesito_35 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 36  ? values.Lataria_2_inputDecimalQuesito_36 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 37  ? values.Lataria_2_inputDecimalQuesito_37 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 38  ? values.Lataria_2_inputDecimalQuesito_38 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 39  ? values.Lataria_2_inputDecimalQuesito_39 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 40  ? values.Lataria_2_inputDecimalQuesito_40 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 41  ? values.Lataria_2_inputDecimalQuesito_41 :

																								//Lataria 3
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 1 ? values.Lataria_3_inputDecimalQuesito_1 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 2 ? values.Lataria_3_inputDecimalQuesito_2 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 3 ? values.Lataria_3_inputDecimalQuesito_3 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 4 ? values.Lataria_3_inputDecimalQuesito_4 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 5 ? values.Lataria_3_inputDecimalQuesito_5 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 6 ? values.Lataria_3_inputDecimalQuesito_6 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 7 ? values.Lataria_3_inputDecimalQuesito_7 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 8 ? values.Lataria_3_inputDecimalQuesito_8 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 9 ? values.Lataria_3_inputDecimalQuesito_9 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 10  ? values.Lataria_3_inputDecimalQuesito_10 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 11  ? values.Lataria_3_inputDecimalQuesito_11 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 12  ? values.Lataria_3_inputDecimalQuesito_12 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 13  ? values.Lataria_3_inputDecimalQuesito_13 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 14  ? values.Lataria_3_inputDecimalQuesito_14 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 15  ? values.Lataria_3_inputDecimalQuesito_15 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 16  ? values.Lataria_3_inputDecimalQuesito_16 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 17  ? values.Lataria_3_inputDecimalQuesito_17 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 18  ? values.Lataria_3_inputDecimalQuesito_18 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 19  ? values.Lataria_3_inputDecimalQuesito_19 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 20  ? values.Lataria_3_inputDecimalQuesito_20 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 21  ? values.Lataria_3_inputDecimalQuesito_21 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 22  ? values.Lataria_3_inputDecimalQuesito_22 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 23  ? values.Lataria_3_inputDecimalQuesito_23 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 24  ? values.Lataria_3_inputDecimalQuesito_24 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 25  ? values.Lataria_3_inputDecimalQuesito_25 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 26  ? values.Lataria_3_inputDecimalQuesito_26 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 27  ? values.Lataria_3_inputDecimalQuesito_27 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 28  ? values.Lataria_3_inputDecimalQuesito_28 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 29  ? values.Lataria_3_inputDecimalQuesito_29 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 30  ? values.Lataria_3_inputDecimalQuesito_30 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 31  ? values.Lataria_3_inputDecimalQuesito_31 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 32  ? values.Lataria_3_inputDecimalQuesito_32 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 33  ? values.Lataria_3_inputDecimalQuesito_33 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 34  ? values.Lataria_3_inputDecimalQuesito_34 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 35  ? values.Lataria_3_inputDecimalQuesito_35 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 36  ? values.Lataria_3_inputDecimalQuesito_36 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 37  ? values.Lataria_3_inputDecimalQuesito_37 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 38  ? values.Lataria_3_inputDecimalQuesito_38 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 39  ? values.Lataria_3_inputDecimalQuesito_39 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 40  ? values.Lataria_3_inputDecimalQuesito_40 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 41  ? values.Lataria_3_inputDecimalQuesito_41 :

																								//Lataria 4
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 1 ? values.Lataria_4_inputDecimalQuesito_1 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 2 ? values.Lataria_4_inputDecimalQuesito_2 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 3 ? values.Lataria_4_inputDecimalQuesito_3 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 4 ? values.Lataria_4_inputDecimalQuesito_4 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 5 ? values.Lataria_4_inputDecimalQuesito_5 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 6 ? values.Lataria_4_inputDecimalQuesito_6 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 7 ? values.Lataria_4_inputDecimalQuesito_7 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 8 ? values.Lataria_4_inputDecimalQuesito_8 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 9 ? values.Lataria_4_inputDecimalQuesito_9 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 10  ? values.Lataria_4_inputDecimalQuesito_10 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 11  ? values.Lataria_4_inputDecimalQuesito_11 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 12  ? values.Lataria_4_inputDecimalQuesito_12 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 14  ? values.Lataria_4_inputDecimalQuesito_14 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 14  ? values.Lataria_4_inputDecimalQuesito_14 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 15  ? values.Lataria_4_inputDecimalQuesito_15 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 16  ? values.Lataria_4_inputDecimalQuesito_16 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 17  ? values.Lataria_4_inputDecimalQuesito_17 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 18  ? values.Lataria_4_inputDecimalQuesito_18 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 19  ? values.Lataria_4_inputDecimalQuesito_19 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 20  ? values.Lataria_4_inputDecimalQuesito_20 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 21  ? values.Lataria_4_inputDecimalQuesito_21 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 22  ? values.Lataria_4_inputDecimalQuesito_22 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 23  ? values.Lataria_4_inputDecimalQuesito_24 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 24  ? values.Lataria_4_inputDecimalQuesito_24 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 25  ? values.Lataria_4_inputDecimalQuesito_25 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 26  ? values.Lataria_4_inputDecimalQuesito_26 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 27  ? values.Lataria_4_inputDecimalQuesito_27 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 28  ? values.Lataria_4_inputDecimalQuesito_28 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 29  ? values.Lataria_4_inputDecimalQuesito_29 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 30  ? values.Lataria_4_inputDecimalQuesito_30 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 31  ? values.Lataria_4_inputDecimalQuesito_31 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 32  ? values.Lataria_4_inputDecimalQuesito_32 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 33  ? values.Lataria_4_inputDecimalQuesito_33 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 34  ? values.Lataria_4_inputDecimalQuesito_34 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 35  ? values.Lataria_4_inputDecimalQuesito_35 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 36  ? values.Lataria_4_inputDecimalQuesito_36 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 37  ? values.Lataria_4_inputDecimalQuesito_37 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 38  ? values.Lataria_4_inputDecimalQuesito_38 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 39  ? values.Lataria_4_inputDecimalQuesito_39 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 40  ? values.Lataria_4_inputDecimalQuesito_40 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 41  ? values.Lataria_4_inputDecimalQuesito_41 :
																								
																								//Lataria 5
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 1 ? values.Lataria_5_inputDecimalQuesito_1 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 2 ? values.Lataria_5_inputDecimalQuesito_2 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 3 ? values.Lataria_5_inputDecimalQuesito_3 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 4 ? values.Lataria_5_inputDecimalQuesito_4 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 5 ? values.Lataria_5_inputDecimalQuesito_5 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 6 ? values.Lataria_5_inputDecimalQuesito_6 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 7 ? values.Lataria_5_inputDecimalQuesito_7 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 8 ? values.Lataria_5_inputDecimalQuesito_8 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 9 ? values.Lataria_5_inputDecimalQuesito_9 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 10  ? values.Lataria_5_inputDecimalQuesito_10 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 11  ? values.Lataria_5_inputDecimalQuesito_11 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 12  ? values.Lataria_5_inputDecimalQuesito_12 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 13  ? values.Lataria_5_inputDecimalQuesito_13 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 14  ? values.Lataria_5_inputDecimalQuesito_14 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 15  ? values.Lataria_5_inputDecimalQuesito_15 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 16  ? values.Lataria_5_inputDecimalQuesito_16 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 17  ? values.Lataria_5_inputDecimalQuesito_17 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 18  ? values.Lataria_5_inputDecimalQuesito_18 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 19  ? values.Lataria_5_inputDecimalQuesito_19 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 20  ? values.Lataria_5_inputDecimalQuesito_20 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 21  ? values.Lataria_5_inputDecimalQuesito_21 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 22  ? values.Lataria_5_inputDecimalQuesito_22 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 23  ? values.Lataria_5_inputDecimalQuesito_23 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 24  ? values.Lataria_5_inputDecimalQuesito_24 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 25  ? values.Lataria_5_inputDecimalQuesito_25 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 26  ? values.Lataria_5_inputDecimalQuesito_26 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 27  ? values.Lataria_5_inputDecimalQuesito_27 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 28  ? values.Lataria_5_inputDecimalQuesito_28 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 29  ? values.Lataria_5_inputDecimalQuesito_29 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 30  ? values.Lataria_5_inputDecimalQuesito_30 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 31  ? values.Lataria_5_inputDecimalQuesito_31 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 32  ? values.Lataria_5_inputDecimalQuesito_32 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 33  ? values.Lataria_5_inputDecimalQuesito_33 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 34  ? values.Lataria_5_inputDecimalQuesito_34 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 35  ? values.Lataria_5_inputDecimalQuesito_35 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 36  ? values.Lataria_5_inputDecimalQuesito_36 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 37  ? values.Lataria_5_inputDecimalQuesito_37 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 38  ? values.Lataria_5_inputDecimalQuesito_38 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 39  ? values.Lataria_5_inputDecimalQuesito_39 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 40  ? values.Lataria_5_inputDecimalQuesito_40 :
																								listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 41  ? values.Lataria_5_inputDecimalQuesito_41 :

																								false
																							}
																						/>
																						</>
																					)
																				}
																				{
																					//INPUT INTEIRO Lataria
																					quesito.IND_INTEIRO == true && quesito.IND_ATIVO == true && 
																					(	
																						<>
																						<Input 
																							onChangeText={handleChange('Lataria_'+listbox.COD_OPCAO+'_inputInteiroQuesito_'+quesito.COD_ITEM)}
																							onBlur={handleBlur('Lataria_'+listbox.COD_OPCAO+'_inputInteiroQuesito_'+quesito.COD_ITEM)}
																							placeholder='Inteiro'
																							value={
																								//Lataria 1
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 1 ? values.Lataria_1_inputInteiroQuesito_1 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 2 ? values.Lataria_1_inputInteiroQuesito_2 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 3 ? values.Lataria_1_inputInteiroQuesito_3 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 4 ? values.Lataria_1_inputInteiroQuesito_4 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 5 ? values.Lataria_1_inputInteiroQuesito_5 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 6 ? values.Lataria_1_inputInteiroQuesito_6 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 7 ? values.Lataria_1_inputInteiroQuesito_7 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 8 ? values.Lataria_1_inputInteiroQuesito_8 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 9 ? values.Lataria_1_inputInteiroQuesito_9 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 10  ? values.Lataria_1_inputInteiroQuesito_10 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 11  ? values.Lataria_1_inputInteiroQuesito_11 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 12  ? values.Lataria_1_inputInteiroQuesito_12 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 13  ? values.Lataria_1_inputInteiroQuesito_13 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 14  ? values.Lataria_1_inputInteiroQuesito_14 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 15  ? values.Lataria_1_inputInteiroQuesito_15 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 16  ? values.Lataria_1_inputInteiroQuesito_16 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 17  ? values.Lataria_1_inputInteiroQuesito_17 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 18  ? values.Lataria_1_inputInteiroQuesito_18 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 19  ? values.Lataria_1_inputInteiroQuesito_19 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 20  ? values.Lataria_1_inputInteiroQuesito_20 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 21  ? values.Lataria_1_inputInteiroQuesito_21 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 22  ? values.Lataria_1_inputInteiroQuesito_22 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 23  ? values.Lataria_1_inputInteiroQuesito_23 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 24  ? values.Lataria_1_inputInteiroQuesito_24 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 25  ? values.Lataria_1_inputInteiroQuesito_25 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 26  ? values.Lataria_1_inputInteiroQuesito_26 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 27  ? values.Lataria_1_inputInteiroQuesito_27 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 28  ? values.Lataria_1_inputInteiroQuesito_28 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 29  ? values.Lataria_1_inputInteiroQuesito_29 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 30  ? values.Lataria_1_inputInteiroQuesito_30 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 31  ? values.Lataria_1_inputInteiroQuesito_31 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 32  ? values.Lataria_1_inputInteiroQuesito_32 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 33  ? values.Lataria_1_inputInteiroQuesito_33 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 34  ? values.Lataria_1_inputInteiroQuesito_34 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 35  ? values.Lataria_1_inputInteiroQuesito_35 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 36  ? values.Lataria_1_inputInteiroQuesito_36 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 37  ? values.Lataria_1_inputInteiroQuesito_37 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 38  ? values.Lataria_1_inputInteiroQuesito_38 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 39  ? values.Lataria_1_inputInteiroQuesito_39 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 40  ? values.Lataria_1_inputInteiroQuesito_40 :
																								listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 41  ? values.Lataria_1_inputInteiroQuesito_41 :

																								//Lataria 2
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 1 ? values.Lataria_2_inputInteiroQuesito_1 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 2 ? values.Lataria_2_inputInteiroQuesito_2 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 3 ? values.Lataria_2_inputInteiroQuesito_3 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 4 ? values.Lataria_2_inputInteiroQuesito_4 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 5 ? values.Lataria_2_inputInteiroQuesito_5 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 6 ? values.Lataria_2_inputInteiroQuesito_6 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 7 ? values.Lataria_2_inputInteiroQuesito_7 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 8 ? values.Lataria_2_inputInteiroQuesito_8 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 9 ? values.Lataria_2_inputInteiroQuesito_9 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 10  ? values.Lataria_2_inputInteiroQuesito_10 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 11  ? values.Lataria_2_inputInteiroQuesito_11 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 12  ? values.Lataria_2_inputInteiroQuesito_12 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 13  ? values.Lataria_2_inputInteiroQuesito_13 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 14  ? values.Lataria_2_inputInteiroQuesito_14 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 15  ? values.Lataria_2_inputInteiroQuesito_15 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 16  ? values.Lataria_2_inputInteiroQuesito_16 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 17  ? values.Lataria_2_inputInteiroQuesito_17 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 18  ? values.Lataria_2_inputInteiroQuesito_18 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 19  ? values.Lataria_2_inputInteiroQuesito_19 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 20  ? values.Lataria_2_inputInteiroQuesito_20 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 21  ? values.Lataria_2_inputInteiroQuesito_21 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 22  ? values.Lataria_2_inputInteiroQuesito_22 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 23  ? values.Lataria_2_inputInteiroQuesito_23 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 24  ? values.Lataria_2_inputInteiroQuesito_24 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 25  ? values.Lataria_2_inputInteiroQuesito_25 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 26  ? values.Lataria_2_inputInteiroQuesito_26 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 27  ? values.Lataria_2_inputInteiroQuesito_27 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 28  ? values.Lataria_2_inputInteiroQuesito_28 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 29  ? values.Lataria_2_inputInteiroQuesito_29 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 30  ? values.Lataria_2_inputInteiroQuesito_30 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 31  ? values.Lataria_2_inputInteiroQuesito_31 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 32  ? values.Lataria_2_inputInteiroQuesito_32 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 33  ? values.Lataria_2_inputInteiroQuesito_33 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 34  ? values.Lataria_2_inputInteiroQuesito_34 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 35  ? values.Lataria_2_inputInteiroQuesito_35 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 36  ? values.Lataria_2_inputInteiroQuesito_36 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 37  ? values.Lataria_2_inputInteiroQuesito_37 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 38  ? values.Lataria_2_inputInteiroQuesito_38 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 39  ? values.Lataria_2_inputInteiroQuesito_39 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 40  ? values.Lataria_2_inputInteiroQuesito_40 :
																								listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 41  ? values.Lataria_2_inputInteiroQuesito_41 :

																								//Lataria 3
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 1 ? values.Lataria_3_inputInteiroQuesito_1 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 2 ? values.Lataria_3_inputInteiroQuesito_2 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 3 ? values.Lataria_3_inputInteiroQuesito_3 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 4 ? values.Lataria_3_inputInteiroQuesito_4 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 5 ? values.Lataria_3_inputInteiroQuesito_5 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 6 ? values.Lataria_3_inputInteiroQuesito_6 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 7 ? values.Lataria_3_inputInteiroQuesito_7 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 8 ? values.Lataria_3_inputInteiroQuesito_8 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 9 ? values.Lataria_3_inputInteiroQuesito_9 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 10  ? values.Lataria_3_inputInteiroQuesito_10 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 11  ? values.Lataria_3_inputInteiroQuesito_11 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 12  ? values.Lataria_3_inputInteiroQuesito_12 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 13  ? values.Lataria_3_inputInteiroQuesito_13 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 14  ? values.Lataria_3_inputInteiroQuesito_14 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 15  ? values.Lataria_3_inputInteiroQuesito_15 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 16  ? values.Lataria_3_inputInteiroQuesito_16 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 17  ? values.Lataria_3_inputInteiroQuesito_17 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 18  ? values.Lataria_3_inputInteiroQuesito_18 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 19  ? values.Lataria_3_inputInteiroQuesito_19 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 20  ? values.Lataria_3_inputInteiroQuesito_20 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 21  ? values.Lataria_3_inputInteiroQuesito_21 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 22  ? values.Lataria_3_inputInteiroQuesito_22 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 23  ? values.Lataria_3_inputInteiroQuesito_23 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 24  ? values.Lataria_3_inputInteiroQuesito_24 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 25  ? values.Lataria_3_inputInteiroQuesito_25 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 26  ? values.Lataria_3_inputInteiroQuesito_26 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 27  ? values.Lataria_3_inputInteiroQuesito_27 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 28  ? values.Lataria_3_inputInteiroQuesito_28 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 29  ? values.Lataria_3_inputInteiroQuesito_29 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 30  ? values.Lataria_3_inputInteiroQuesito_30 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 31  ? values.Lataria_3_inputInteiroQuesito_31 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 32  ? values.Lataria_3_inputInteiroQuesito_32 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 33  ? values.Lataria_3_inputInteiroQuesito_33 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 34  ? values.Lataria_3_inputInteiroQuesito_34 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 35  ? values.Lataria_3_inputInteiroQuesito_35 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 36  ? values.Lataria_3_inputInteiroQuesito_36 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 37  ? values.Lataria_3_inputInteiroQuesito_37 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 38  ? values.Lataria_3_inputInteiroQuesito_38 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 39  ? values.Lataria_3_inputInteiroQuesito_39 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 40  ? values.Lataria_3_inputInteiroQuesito_40 :
																								listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 41  ? values.Lataria_3_inputInteiroQuesito_41 :

																								//Lataria 4
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 1 ? values.Lataria_4_inputInteiroQuesito_1 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 2 ? values.Lataria_4_inputInteiroQuesito_2 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 3 ? values.Lataria_4_inputInteiroQuesito_3 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 4 ? values.Lataria_4_inputInteiroQuesito_4 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 5 ? values.Lataria_4_inputInteiroQuesito_5 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 6 ? values.Lataria_4_inputInteiroQuesito_6 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 7 ? values.Lataria_4_inputInteiroQuesito_7 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 8 ? values.Lataria_4_inputInteiroQuesito_8 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 9 ? values.Lataria_4_inputInteiroQuesito_9 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 10  ? values.Lataria_4_inputInteiroQuesito_10 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 11  ? values.Lataria_4_inputInteiroQuesito_11 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 12  ? values.Lataria_4_inputInteiroQuesito_12 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 14  ? values.Lataria_4_inputInteiroQuesito_14 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 14  ? values.Lataria_4_inputInteiroQuesito_14 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 15  ? values.Lataria_4_inputInteiroQuesito_15 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 16  ? values.Lataria_4_inputInteiroQuesito_16 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 17  ? values.Lataria_4_inputInteiroQuesito_17 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 18  ? values.Lataria_4_inputInteiroQuesito_18 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 19  ? values.Lataria_4_inputInteiroQuesito_19 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 20  ? values.Lataria_4_inputInteiroQuesito_20 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 21  ? values.Lataria_4_inputInteiroQuesito_21 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 22  ? values.Lataria_4_inputInteiroQuesito_22 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 23  ? values.Lataria_4_inputInteiroQuesito_24 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 24  ? values.Lataria_4_inputInteiroQuesito_24 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 25  ? values.Lataria_4_inputInteiroQuesito_25 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 26  ? values.Lataria_4_inputInteiroQuesito_26 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 27  ? values.Lataria_4_inputInteiroQuesito_27 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 28  ? values.Lataria_4_inputInteiroQuesito_28 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 29  ? values.Lataria_4_inputInteiroQuesito_29 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 30  ? values.Lataria_4_inputInteiroQuesito_30 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 31  ? values.Lataria_4_inputInteiroQuesito_31 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 32  ? values.Lataria_4_inputInteiroQuesito_32 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 33  ? values.Lataria_4_inputInteiroQuesito_33 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 34  ? values.Lataria_4_inputInteiroQuesito_34 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 35  ? values.Lataria_4_inputInteiroQuesito_35 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 36  ? values.Lataria_4_inputInteiroQuesito_36 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 37  ? values.Lataria_4_inputInteiroQuesito_37 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 38  ? values.Lataria_4_inputInteiroQuesito_38 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 39  ? values.Lataria_4_inputInteiroQuesito_39 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 40  ? values.Lataria_4_inputInteiroQuesito_40 :
																								listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 41  ? values.Lataria_4_inputInteiroQuesito_41 :

																								false
																							}
																						/>
																						</>
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
																									onPress={ () => setFieldValue('Lataria_'+listbox.COD_OPCAO+'_rbQuesito_'+quesito.COD_ITEM, radio.COD_OPCAO) }
																									>
																									<Radio
																										onPress={ () => setFieldValue('Lataria_'+listbox.COD_OPCAO+'_rbQuesito_'+quesito.COD_ITEM, radio.COD_OPCAO) }
																										color={"#f0ad4e"}
																										selectedColor={"#5cb85c"}
																										selected={ 
																											
																											//Lataria 1
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 1 ? values.Lataria_1_rbQuesito_1 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 2 ? values.Lataria_1_rbQuesito_2 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 3 ? values.Lataria_1_rbQuesito_3 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 4 ? values.Lataria_1_rbQuesito_4 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 5 ? values.Lataria_1_rbQuesito_5 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 6 ? values.Lataria_1_rbQuesito_6 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 7 ? values.Lataria_1_rbQuesito_7 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 8 ? values.Lataria_1_rbQuesito_8 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 9 ? values.Lataria_1_rbQuesito_9 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 10  ? values.Lataria_1_rbQuesito_10 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 11  ? values.Lataria_1_rbQuesito_11 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 12  ? values.Lataria_1_rbQuesito_12 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 13  ? values.Lataria_1_rbQuesito_13 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 14  ? values.Lataria_1_rbQuesito_14 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 15  ? values.Lataria_1_rbQuesito_15 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 16  ? values.Lataria_1_rbQuesito_16 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 17  ? values.Lataria_1_rbQuesito_17 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 18  ? values.Lataria_1_rbQuesito_18 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 19  ? values.Lataria_1_rbQuesito_19 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 20  ? values.Lataria_1_rbQuesito_20 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 21  ? values.Lataria_1_rbQuesito_21 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 22  ? values.Lataria_1_rbQuesito_22 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 23  ? values.Lataria_1_rbQuesito_23 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 24  ? values.Lataria_1_rbQuesito_24 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 25  ? values.Lataria_1_rbQuesito_25 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 26  ? values.Lataria_1_rbQuesito_26 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 27  ? values.Lataria_1_rbQuesito_27 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 28  ? values.Lataria_1_rbQuesito_28 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 29  ? values.Lataria_1_rbQuesito_29 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 30  ? values.Lataria_1_rbQuesito_30 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 31  ? values.Lataria_1_rbQuesito_31 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 32  ? values.Lataria_1_rbQuesito_32 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 33  ? values.Lataria_1_rbQuesito_33 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 34  ? values.Lataria_1_rbQuesito_34 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 35  ? values.Lataria_1_rbQuesito_35 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 36  ? values.Lataria_1_rbQuesito_36 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 37  ? values.Lataria_1_rbQuesito_37 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 38  ? values.Lataria_1_rbQuesito_38 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 39  ? values.Lataria_1_rbQuesito_39 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 40  ? values.Lataria_1_rbQuesito_40 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 41  ? values.Lataria_1_rbQuesito_41 == radio.COD_OPCAO ? true : false :
																											
																											//Lataria 2
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 1 ? values.Lataria_2_rbQuesito_1 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 2 ? values.Lataria_2_rbQuesito_2 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 3 ? values.Lataria_2_rbQuesito_3 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 4 ? values.Lataria_2_rbQuesito_4 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 5 ? values.Lataria_2_rbQuesito_5 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 6 ? values.Lataria_2_rbQuesito_6 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 7 ? values.Lataria_2_rbQuesito_7 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 8 ? values.Lataria_2_rbQuesito_8 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 9 ? values.Lataria_2_rbQuesito_9 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 10  ? values.Lataria_2_rbQuesito_10 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 11  ? values.Lataria_2_rbQuesito_11 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 12  ? values.Lataria_2_rbQuesito_12 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 13  ? values.Lataria_2_rbQuesito_13 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 14  ? values.Lataria_2_rbQuesito_14 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 15  ? values.Lataria_2_rbQuesito_15 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 16  ? values.Lataria_2_rbQuesito_16 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 17  ? values.Lataria_2_rbQuesito_17 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 18  ? values.Lataria_2_rbQuesito_18 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 19  ? values.Lataria_2_rbQuesito_19 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 20  ? values.Lataria_2_rbQuesito_20 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 21  ? values.Lataria_2_rbQuesito_21 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 22  ? values.Lataria_2_rbQuesito_22 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 23  ? values.Lataria_2_rbQuesito_23 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 24  ? values.Lataria_2_rbQuesito_24 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 25  ? values.Lataria_2_rbQuesito_25 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 26  ? values.Lataria_2_rbQuesito_26 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 27  ? values.Lataria_2_rbQuesito_27 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 28  ? values.Lataria_2_rbQuesito_28 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 29  ? values.Lataria_2_rbQuesito_29 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 30  ? values.Lataria_2_rbQuesito_30 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 31  ? values.Lataria_2_rbQuesito_31 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 32  ? values.Lataria_2_rbQuesito_32 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 33  ? values.Lataria_2_rbQuesito_33 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 34  ? values.Lataria_2_rbQuesito_34 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 35  ? values.Lataria_2_rbQuesito_35 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 36  ? values.Lataria_2_rbQuesito_36 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 37  ? values.Lataria_2_rbQuesito_37 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 38  ? values.Lataria_2_rbQuesito_38 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 39  ? values.Lataria_2_rbQuesito_39 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 40  ? values.Lataria_2_rbQuesito_40 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 41  ? values.Lataria_2_rbQuesito_41 == radio.COD_OPCAO ? true : false :
																											
																											//Lataria 3
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 1 ? values.Lataria_3_rbQuesito_1 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 2 ? values.Lataria_3_rbQuesito_2 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 3 ? values.Lataria_3_rbQuesito_3 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 4 ? values.Lataria_3_rbQuesito_4 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 5 ? values.Lataria_3_rbQuesito_5 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 6 ? values.Lataria_3_rbQuesito_6 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 7 ? values.Lataria_3_rbQuesito_7 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 8 ? values.Lataria_3_rbQuesito_8 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 9 ? values.Lataria_3_rbQuesito_9 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 10  ? values.Lataria_3_rbQuesito_10 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 11  ? values.Lataria_3_rbQuesito_11 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 12  ? values.Lataria_3_rbQuesito_12 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 13  ? values.Lataria_3_rbQuesito_13 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 14  ? values.Lataria_3_rbQuesito_14 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 15  ? values.Lataria_3_rbQuesito_15 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 16  ? values.Lataria_3_rbQuesito_16 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 17  ? values.Lataria_3_rbQuesito_17 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 18  ? values.Lataria_3_rbQuesito_18 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 19  ? values.Lataria_3_rbQuesito_19 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 20  ? values.Lataria_3_rbQuesito_20 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 21  ? values.Lataria_3_rbQuesito_21 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 22  ? values.Lataria_3_rbQuesito_22 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 23  ? values.Lataria_3_rbQuesito_23 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 24  ? values.Lataria_3_rbQuesito_24 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 25  ? values.Lataria_3_rbQuesito_25 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 26  ? values.Lataria_3_rbQuesito_26 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 27  ? values.Lataria_3_rbQuesito_27 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 28  ? values.Lataria_3_rbQuesito_28 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 29  ? values.Lataria_3_rbQuesito_29 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 30  ? values.Lataria_3_rbQuesito_30 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 31  ? values.Lataria_3_rbQuesito_31 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 32  ? values.Lataria_3_rbQuesito_32 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 33  ? values.Lataria_3_rbQuesito_33 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 34  ? values.Lataria_3_rbQuesito_34 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 35  ? values.Lataria_3_rbQuesito_35 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 36  ? values.Lataria_3_rbQuesito_36 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 37  ? values.Lataria_3_rbQuesito_37 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 38  ? values.Lataria_3_rbQuesito_38 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 39  ? values.Lataria_3_rbQuesito_39 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 40  ? values.Lataria_3_rbQuesito_40 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 41  ? values.Lataria_3_rbQuesito_41 == radio.COD_OPCAO ? true : false :

																											//Lataria 4
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 1 ? values.Lataria_4_rbQuesito_1 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 2 ? values.Lataria_4_rbQuesito_2 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 3 ? values.Lataria_4_rbQuesito_3 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 4 ? values.Lataria_4_rbQuesito_4 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 5 ? values.Lataria_4_rbQuesito_5 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 6 ? values.Lataria_4_rbQuesito_6 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 7 ? values.Lataria_4_rbQuesito_7 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 8 ? values.Lataria_4_rbQuesito_8 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 9 ? values.Lataria_4_rbQuesito_9 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 10  ? values.Lataria_4_rbQuesito_10 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 11  ? values.Lataria_4_rbQuesito_11 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 12  ? values.Lataria_4_rbQuesito_12 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 13  ? values.Lataria_4_rbQuesito_13 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 14  ? values.Lataria_4_rbQuesito_14 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 15  ? values.Lataria_4_rbQuesito_15 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 16  ? values.Lataria_4_rbQuesito_16 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 17  ? values.Lataria_4_rbQuesito_17 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 18  ? values.Lataria_4_rbQuesito_18 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 19  ? values.Lataria_4_rbQuesito_19 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 20  ? values.Lataria_4_rbQuesito_20 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 21  ? values.Lataria_4_rbQuesito_21 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 22  ? values.Lataria_4_rbQuesito_22 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 23  ? values.Lataria_4_rbQuesito_24 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 24  ? values.Lataria_4_rbQuesito_24 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 25  ? values.Lataria_4_rbQuesito_25 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 26  ? values.Lataria_4_rbQuesito_26 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 27  ? values.Lataria_4_rbQuesito_27 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 28  ? values.Lataria_4_rbQuesito_28 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 29  ? values.Lataria_4_rbQuesito_29 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 30  ? values.Lataria_4_rbQuesito_30 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 31  ? values.Lataria_4_rbQuesito_31 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 32  ? values.Lataria_4_rbQuesito_32 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 33  ? values.Lataria_4_rbQuesito_33 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 34  ? values.Lataria_4_rbQuesito_34 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 35  ? values.Lataria_4_rbQuesito_35 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 36  ? values.Lataria_4_rbQuesito_36 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 37  ? values.Lataria_4_rbQuesito_37 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 38  ? values.Lataria_4_rbQuesito_38 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 39  ? values.Lataria_4_rbQuesito_39 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 40  ? values.Lataria_4_rbQuesito_40 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 41  ? values.Lataria_4_rbQuesito_41 == radio.COD_OPCAO ? true : false :
																											
																											//Lataria 5
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 1 ? values.Lataria_5_rbQuesito_1 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 2 ? values.Lataria_5_rbQuesito_2 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 3 ? values.Lataria_5_rbQuesito_3 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 4 ? values.Lataria_5_rbQuesito_4 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 5 ? values.Lataria_5_rbQuesito_5 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 6 ? values.Lataria_5_rbQuesito_6 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 7 ? values.Lataria_5_rbQuesito_7 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 8 ? values.Lataria_5_rbQuesito_8 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 9 ? values.Lataria_5_rbQuesito_9 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 10  ? values.Lataria_5_rbQuesito_10 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 11  ? values.Lataria_5_rbQuesito_11 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 12  ? values.Lataria_5_rbQuesito_12 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 13  ? values.Lataria_5_rbQuesito_13 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 14  ? values.Lataria_5_rbQuesito_14 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 15  ? values.Lataria_5_rbQuesito_15 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 16  ? values.Lataria_5_rbQuesito_16 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 17  ? values.Lataria_5_rbQuesito_17 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 18  ? values.Lataria_5_rbQuesito_18 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 19  ? values.Lataria_5_rbQuesito_19 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 20  ? values.Lataria_5_rbQuesito_20 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 21  ? values.Lataria_5_rbQuesito_21 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 22  ? values.Lataria_5_rbQuesito_22 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 23  ? values.Lataria_5_rbQuesito_23 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 24  ? values.Lataria_5_rbQuesito_24 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 25  ? values.Lataria_5_rbQuesito_25 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 26  ? values.Lataria_5_rbQuesito_26 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 27  ? values.Lataria_5_rbQuesito_27 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 28  ? values.Lataria_5_rbQuesito_28 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 29  ? values.Lataria_5_rbQuesito_29 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 30  ? values.Lataria_5_rbQuesito_30 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 31  ? values.Lataria_5_rbQuesito_31 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 32  ? values.Lataria_5_rbQuesito_32 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 33  ? values.Lataria_5_rbQuesito_33 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 34  ? values.Lataria_5_rbQuesito_34 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 35  ? values.Lataria_5_rbQuesito_35 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 36  ? values.Lataria_5_rbQuesito_36 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 37  ? values.Lataria_5_rbQuesito_37 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 38  ? values.Lataria_5_rbQuesito_38 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 39  ? values.Lataria_5_rbQuesito_39 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 40  ? values.Lataria_5_rbQuesito_40 == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 41  ? values.Lataria_5_rbQuesito_41 == radio.COD_OPCAO ? true : false :

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
																					//LIST BOX
																					quesito.IND_LISTA == true && quesito.IND_ATIVO == true &&
																					(
																						<Picker
																								selectedValue={
																									//Lataria 1
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 1 ? values.Lataria_1_lbQuesito_1 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 2 ? values.Lataria_1_lbQuesito_2 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 3 ? values.Lataria_1_lbQuesito_3 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 4 ? values.Lataria_1_lbQuesito_4 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 5 ? values.Lataria_1_lbQuesito_5 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 6 ? values.Lataria_1_lbQuesito_6 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 7 ? values.Lataria_1_lbQuesito_7 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 8 ? values.Lataria_1_lbQuesito_8 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 9 ? values.Lataria_1_lbQuesito_9 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 10  ? values.Lataria_1_lbQuesito_10 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 11  ? values.Lataria_1_lbQuesito_11 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 12  ? values.Lataria_1_lbQuesito_12 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 13  ? values.Lataria_1_lbQuesito_13 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 14  ? values.Lataria_1_lbQuesito_14 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 15  ? values.Lataria_1_lbQuesito_15 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 16  ? values.Lataria_1_lbQuesito_16 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 17  ? values.Lataria_1_lbQuesito_17 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 18  ? values.Lataria_1_lbQuesito_18 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 19  ? values.Lataria_1_lbQuesito_19 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 20  ? values.Lataria_1_lbQuesito_20 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 21  ? values.Lataria_1_lbQuesito_21 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 22  ? values.Lataria_1_lbQuesito_22 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 23  ? values.Lataria_1_lbQuesito_23 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 24  ? values.Lataria_1_lbQuesito_24 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 25  ? values.Lataria_1_lbQuesito_25 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 26  ? values.Lataria_1_lbQuesito_26 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 27  ? values.Lataria_1_lbQuesito_27 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 28  ? values.Lataria_1_lbQuesito_28 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 29  ? values.Lataria_1_lbQuesito_29 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 30  ? values.Lataria_1_lbQuesito_30 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 31  ? values.Lataria_1_lbQuesito_31 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 32  ? values.Lataria_1_lbQuesito_32 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 33  ? values.Lataria_1_lbQuesito_33 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 34  ? values.Lataria_1_lbQuesito_34 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 35  ? values.Lataria_1_lbQuesito_35 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 36  ? values.Lataria_1_lbQuesito_36 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 37  ? values.Lataria_1_lbQuesito_37 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 38  ? values.Lataria_1_lbQuesito_38 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 39  ? values.Lataria_1_lbQuesito_39 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 40  ? values.Lataria_1_lbQuesito_40 :
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == 41  ? values.Lataria_1_lbQuesito_41 :

																									//Lataria 2
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 1 ? values.Lataria_2_lbQuesito_1 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 2 ? values.Lataria_2_lbQuesito_2 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 3 ? values.Lataria_2_lbQuesito_3 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 4 ? values.Lataria_2_lbQuesito_4 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 5 ? values.Lataria_2_lbQuesito_5 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 6 ? values.Lataria_2_lbQuesito_6 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 7 ? values.Lataria_2_lbQuesito_7 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 8 ? values.Lataria_2_lbQuesito_8 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 9 ? values.Lataria_2_lbQuesito_9 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 10  ? values.Lataria_2_lbQuesito_10 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 11  ? values.Lataria_2_lbQuesito_11 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 12  ? values.Lataria_2_lbQuesito_12 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 13  ? values.Lataria_2_lbQuesito_13 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 14  ? values.Lataria_2_lbQuesito_14 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 15  ? values.Lataria_2_lbQuesito_15 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 16  ? values.Lataria_2_lbQuesito_16 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 17  ? values.Lataria_2_lbQuesito_17 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 18  ? values.Lataria_2_lbQuesito_18 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 19  ? values.Lataria_2_lbQuesito_19 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 20  ? values.Lataria_2_lbQuesito_20 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 21  ? values.Lataria_2_lbQuesito_21 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 22  ? values.Lataria_2_lbQuesito_22 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 23  ? values.Lataria_2_lbQuesito_23 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 24  ? values.Lataria_2_lbQuesito_24 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 25  ? values.Lataria_2_lbQuesito_25 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 26  ? values.Lataria_2_lbQuesito_26 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 27  ? values.Lataria_2_lbQuesito_27 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 28  ? values.Lataria_2_lbQuesito_28 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 29  ? values.Lataria_2_lbQuesito_29 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 30  ? values.Lataria_2_lbQuesito_30 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 31  ? values.Lataria_2_lbQuesito_31 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 32  ? values.Lataria_2_lbQuesito_32 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 33  ? values.Lataria_2_lbQuesito_33 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 34  ? values.Lataria_2_lbQuesito_34 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 35  ? values.Lataria_2_lbQuesito_35 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 36  ? values.Lataria_2_lbQuesito_36 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 37  ? values.Lataria_2_lbQuesito_37 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 38  ? values.Lataria_2_lbQuesito_38 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 39  ? values.Lataria_2_lbQuesito_39 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 40  ? values.Lataria_2_lbQuesito_40 :
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == 41  ? values.Lataria_2_lbQuesito_41 :

																									//Lataria 3
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 1 ? values.Lataria_3_lbQuesito_1 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 2 ? values.Lataria_3_lbQuesito_2 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 3 ? values.Lataria_3_lbQuesito_3 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 4 ? values.Lataria_3_lbQuesito_4 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 5 ? values.Lataria_3_lbQuesito_5 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 6 ? values.Lataria_3_lbQuesito_6 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 7 ? values.Lataria_3_lbQuesito_7 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 8 ? values.Lataria_3_lbQuesito_8 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 9 ? values.Lataria_3_lbQuesito_9 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 10  ? values.Lataria_3_lbQuesito_10 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 11  ? values.Lataria_3_lbQuesito_11 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 12  ? values.Lataria_3_lbQuesito_12 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 13  ? values.Lataria_3_lbQuesito_13 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 14  ? values.Lataria_3_lbQuesito_14 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 15  ? values.Lataria_3_lbQuesito_15 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 16  ? values.Lataria_3_lbQuesito_16 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 17  ? values.Lataria_3_lbQuesito_17 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 18  ? values.Lataria_3_lbQuesito_18 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 19  ? values.Lataria_3_lbQuesito_19 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 20  ? values.Lataria_3_lbQuesito_20 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 21  ? values.Lataria_3_lbQuesito_21 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 22  ? values.Lataria_3_lbQuesito_22 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 23  ? values.Lataria_3_lbQuesito_23 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 24  ? values.Lataria_3_lbQuesito_24 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 25  ? values.Lataria_3_lbQuesito_25 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 26  ? values.Lataria_3_lbQuesito_26 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 27  ? values.Lataria_3_lbQuesito_27 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 28  ? values.Lataria_3_lbQuesito_28 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 29  ? values.Lataria_3_lbQuesito_29 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 30  ? values.Lataria_3_lbQuesito_30 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 31  ? values.Lataria_3_lbQuesito_31 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 32  ? values.Lataria_3_lbQuesito_32 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 33  ? values.Lataria_3_lbQuesito_33 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 34  ? values.Lataria_3_lbQuesito_34 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 35  ? values.Lataria_3_lbQuesito_35 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 36  ? values.Lataria_3_lbQuesito_36 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 37  ? values.Lataria_3_lbQuesito_37 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 38  ? values.Lataria_3_lbQuesito_38 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 39  ? values.Lataria_3_lbQuesito_39 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 40  ? values.Lataria_3_lbQuesito_40 :
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == 41  ? values.Lataria_3_lbQuesito_41 :

																									//Lataria 4
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 1 ? values.Lataria_4_lbQuesito_1 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 2 ? values.Lataria_4_lbQuesito_2 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 3 ? values.Lataria_4_lbQuesito_3 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 4 ? values.Lataria_4_lbQuesito_4 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 5 ? values.Lataria_4_lbQuesito_5 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 6 ? values.Lataria_4_lbQuesito_6 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 7 ? values.Lataria_4_lbQuesito_7 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 8 ? values.Lataria_4_lbQuesito_8 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 9 ? values.Lataria_4_lbQuesito_9 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 10  ? values.Lataria_4_lbQuesito_10 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 11  ? values.Lataria_4_lbQuesito_11 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 12  ? values.Lataria_4_lbQuesito_12 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 13  ? values.Lataria_4_lbQuesito_13 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 14  ? values.Lataria_4_lbQuesito_14 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 15  ? values.Lataria_4_lbQuesito_15 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 16  ? values.Lataria_4_lbQuesito_16 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 17  ? values.Lataria_4_lbQuesito_17 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 18  ? values.Lataria_4_lbQuesito_18 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 19  ? values.Lataria_4_lbQuesito_19 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 20  ? values.Lataria_4_lbQuesito_20 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 21  ? values.Lataria_4_lbQuesito_21 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 22  ? values.Lataria_4_lbQuesito_22 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 23  ? values.Lataria_4_lbQuesito_23 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 24  ? values.Lataria_4_lbQuesito_24 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 25  ? values.Lataria_4_lbQuesito_25 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 26  ? values.Lataria_4_lbQuesito_26 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 27  ? values.Lataria_4_lbQuesito_27 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 28  ? values.Lataria_4_lbQuesito_28 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 29  ? values.Lataria_4_lbQuesito_29 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 30  ? values.Lataria_4_lbQuesito_30 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 31  ? values.Lataria_4_lbQuesito_31 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 32  ? values.Lataria_4_lbQuesito_32 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 33  ? values.Lataria_4_lbQuesito_33 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 34  ? values.Lataria_4_lbQuesito_34 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 35  ? values.Lataria_4_lbQuesito_35 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 36  ? values.Lataria_4_lbQuesito_36 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 37  ? values.Lataria_4_lbQuesito_37 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 38  ? values.Lataria_4_lbQuesito_38 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 39  ? values.Lataria_4_lbQuesito_39 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 40  ? values.Lataria_4_lbQuesito_40 :
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 41  ? values.Lataria_4_lbQuesito_41 :

																									//Lataria 5
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 1 ? values.Lataria_5_lbQuesito_1 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 2 ? values.Lataria_5_lbQuesito_2 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 3 ? values.Lataria_5_lbQuesito_3 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 4 ? values.Lataria_5_lbQuesito_4 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 5 ? values.Lataria_5_lbQuesito_5 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 6 ? values.Lataria_5_lbQuesito_6 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 7 ? values.Lataria_5_lbQuesito_7 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 8 ? values.Lataria_5_lbQuesito_8 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 9 ? values.Lataria_5_lbQuesito_9 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 10  ? values.Lataria_5_lbQuesito_10 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 11  ? values.Lataria_5_lbQuesito_11 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 12  ? values.Lataria_5_lbQuesito_12 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 13  ? values.Lataria_5_lbQuesito_13 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 14  ? values.Lataria_5_lbQuesito_14 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 15  ? values.Lataria_5_lbQuesito_15 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 16  ? values.Lataria_5_lbQuesito_16 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 17  ? values.Lataria_5_lbQuesito_17 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 18  ? values.Lataria_5_lbQuesito_18 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 19  ? values.Lataria_5_lbQuesito_19 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 20  ? values.Lataria_5_lbQuesito_20 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 21  ? values.Lataria_5_lbQuesito_21 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 22  ? values.Lataria_5_lbQuesito_22 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 23  ? values.Lataria_5_lbQuesito_23 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 24  ? values.Lataria_5_lbQuesito_24 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 25  ? values.Lataria_5_lbQuesito_25 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 26  ? values.Lataria_5_lbQuesito_26 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 27  ? values.Lataria_5_lbQuesito_27 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 28  ? values.Lataria_5_lbQuesito_28 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 29  ? values.Lataria_5_lbQuesito_29 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 30  ? values.Lataria_5_lbQuesito_30 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 31  ? values.Lataria_5_lbQuesito_31 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 32  ? values.Lataria_5_lbQuesito_32 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 33  ? values.Lataria_5_lbQuesito_33 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 34  ? values.Lataria_5_lbQuesito_34 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 35  ? values.Lataria_5_lbQuesito_35 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 36  ? values.Lataria_5_lbQuesito_36 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 37  ? values.Lataria_5_lbQuesito_37 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 38  ? values.Lataria_5_lbQuesito_38 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 39  ? values.Lataria_5_lbQuesito_39 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 40  ? values.Lataria_5_lbQuesito_40 :
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == 41  ? values.Lataria_5_lbQuesito_41 :

																									false
																								}
																								style={{ height: 50, margin:5, width: '100%'}}
																								onValueChange={(itemValue, itemIndex) => setFieldValue('Lataria_'+listbox.COD_OPCAO+'_lbQuesito_'+quesito.COD_ITEM, itemValue )}
																						>
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
																	<Text style={{fontSize: 20, marginLeft: 10, marginTop: 10, fontWeight: 'bold' }}>{quesito.COD_ITEM+'. '+quesito.QUESITO}</Text>
																)
															}
															{ /* CHECKBOX */ }
															{
																quesito.IND_PNEU == false && quesito.IND_LATARIA == false && quesito.IND_CHECKBOX == true && quesito.IND_ATIVO == true && 
																(
																	<ListItem>
																		<Switch
																			trackColor={{ false: "red", true: "#C5DB5F" }}
																			thumbColor={ "#fff"}
																			ios_backgroundColor="#fff"
																			onValueChange={ (previousState) => setFieldValue('cbQuesito_'+quesito.COD_ITEM, previousState ) }
																			value={
																				quesito.COD_ITEM == 1 ? values.cbQuesito_1 
																				:
																				quesito.COD_ITEM == 2 ? values.cbQuesito_2 
																				:
																				quesito.COD_ITEM == 3 ? values.cbQuesito_3 
																				:
																				quesito.COD_ITEM == 4 ? values.cbQuesito_4 
																				:
																				quesito.COD_ITEM == 5 ? values.cbQuesito_5 
																				:
																				quesito.COD_ITEM == 6 ? values.cbQuesito_6 
																				:
																				quesito.COD_ITEM == 7 ? values.cbQuesito_7
																				:
																				quesito.COD_ITEM == 8 ? values.cbQuesito_8 
																				:
																				quesito.COD_ITEM == 9 ? values.cbQuesito_9 
																				:
																				quesito.COD_ITEM == 10 ? values.cbQuesito_10   
																				:
																				quesito.COD_ITEM == 11 ? values.cbQuesito_11
																				:
																				quesito.COD_ITEM == 12 ? values.cbQuesito_12 
																				:
																				quesito.COD_ITEM == 13 ? values.cbQuesito_13  
																				:
																				quesito.COD_ITEM == 14 ? values.cbQuesito_14 
																				:
																				quesito.COD_ITEM == 15 ? values.cbQuesito_15
																				:
																				quesito.COD_ITEM == 16 ? values.cbQuesito_16 
																				:
																				quesito.COD_ITEM == 17 ? values.cbQuesito_17 
																				:
																				quesito.COD_ITEM == 18 ? values.cbQuesito_18 
																				:
																				quesito.COD_ITEM == 19 ? values.cbQuesito_19 
																				:
																				quesito.COD_ITEM == 20 ? values.cbQuesito_20
																				:
																				quesito.COD_ITEM == 21 ? values.cbQuesito_21
																				:
																				quesito.COD_ITEM == 22 ? values.cbQuesito_22 
																				:
																				quesito.COD_ITEM == 23 ? values.cbQuesito_23
																				:
																				quesito.COD_ITEM == 24 ? values.cbQuesito_24 
																				:
																				quesito.COD_ITEM == 25 ? values.cbQuesito_25 
																				:
																				quesito.COD_ITEM == 26 ? values.cbQuesito_26 
																				:
																				quesito.COD_ITEM == 27 ? values.cbQuesito_27 
																				:
																				quesito.COD_ITEM == 28 ? values.cbQuesito_28 
																				:
																				quesito.COD_ITEM == 29 ? values.cbQuesito_29 
																				:
																				quesito.COD_ITEM == 30 ? values.cbQuesito_30 
																				:
																				quesito.COD_ITEM == 31 ? values.cbQuesito_31 
																				:
																				quesito.COD_ITEM == 32 ? values.cbQuesito_32 
																				:
																				quesito.COD_ITEM == 33 ? values.cbQuesito_33 
																				:
																				quesito.COD_ITEM == 34 ? values.cbQuesito_34 
																				:
																				quesito.COD_ITEM == 35 ? values.cbQuesito_35 
																				:
																				quesito.COD_ITEM == 36 ? values.cbQuesito_36 
																				:
																				quesito.COD_ITEM == 37 ? values.cbQuesito_37 
																				:
																				quesito.COD_ITEM == 38 ? values.cbQuesito_38
																				:
																				quesito.COD_ITEM == 39 ? values.cbQuesito_39
																				:
																				quesito.COD_ITEM == 40 ? values.cbQuesito_40 
																				:
																				quesito.COD_ITEM == 41 ? values.cbQuesito_41  
																				: 
																				false
																			}
																		/>
																	</ListItem>	
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
																			quesito.COD_ITEM == 1 ? values.inputTextoQuesito_1 
																			:
																			quesito.COD_ITEM == 2 ? values.inputTextoQuesito_2 
																			:
																			quesito.COD_ITEM == 3 ? values.inputTextoQuesito_3 
																			:
																			quesito.COD_ITEM == 4 ? values.inputTextoQuesito_4 
																			:
																			quesito.COD_ITEM == 5 ? values.inputTextoQuesito_5 
																			:
																			quesito.COD_ITEM == 6 ? values.inputTextoQuesito_6 
																			:
																			quesito.COD_ITEM == 7 ? values.inputTextoQuesito_7
																			:
																			quesito.COD_ITEM == 8 ? values.inputTextoQuesito_8 
																			:
																			quesito.COD_ITEM == 9 ? values.inputTextoQuesito_9 
																			:
																			quesito.COD_ITEM == 10 ? values.inputTextoQuesito_10   
																			:
																			quesito.COD_ITEM == 11 ? values.inputTextoQuesito_11
																			:
																			quesito.COD_ITEM == 12 ? values.inputTextoQuesito_12 
																			:
																			quesito.COD_ITEM == 13 ? values.inputTextoQuesito_13  
																			:
																			quesito.COD_ITEM == 14 ? values.inputTextoQuesito_14 
																			:
																			quesito.COD_ITEM == 15 ? values.inputTextoQuesito_15
																			:
																			quesito.COD_ITEM == 16 ? values.inputTextoQuesito_16 
																			:
																			quesito.COD_ITEM == 17 ? values.inputTextoQuesito_17 
																			:
																			quesito.COD_ITEM == 18 ? values.inputTextoQuesito_18 
																			:
																			quesito.COD_ITEM == 19 ? values.inputTextoQuesito_19 
																			:
																			quesito.COD_ITEM == 20 ? values.inputTextoQuesito_20
																			:
																			quesito.COD_ITEM == 21 ? values.inputTextoQuesito_21
																			:
																			quesito.COD_ITEM == 22 ? values.inputTextoQuesito_22 
																			:
																			quesito.COD_ITEM == 23 ? values.inputTextoQuesito_23
																			:
																			quesito.COD_ITEM == 24 ? values.inputTextoQuesito_24 
																			:
																			quesito.COD_ITEM == 25 ? values.inputTextoQuesito_25 
																			:
																			quesito.COD_ITEM == 26 ? values.inputTextoQuesito_26 
																			:
																			quesito.COD_ITEM == 27 ? values.inputTextoQuesito_27 
																			:
																			quesito.COD_ITEM == 28 ? values.inputTextoQuesito_28 
																			:
																			quesito.COD_ITEM == 29 ? values.inputTextoQuesito_29 
																			:
																			quesito.COD_ITEM == 30 ? values.inputTextoQuesito_30 
																			:
																			quesito.COD_ITEM == 31 ? values.inputTextoQuesito_31 
																			:
																			quesito.COD_ITEM == 32 ? values.inputTextoQuesito_32 
																			:
																			quesito.COD_ITEM == 33 ? values.inputTextoQuesito_33 
																			:
																			quesito.COD_ITEM == 34 ? values.inputTextoQuesito_34 
																			:
																			quesito.COD_ITEM == 35 ? values.inputTextoQuesito_35 
																			:
																			quesito.COD_ITEM == 36 ? values.inputTextoQuesito_36 
																			:
																			quesito.COD_ITEM == 37 ? values.inputTextoQuesito_37 
																			:
																			quesito.COD_ITEM == 38 ? values.inputTextoQuesito_38
																			:
																			quesito.COD_ITEM == 39 ? values.inputTextoQuesito_39
																			:
																			quesito.COD_ITEM == 40 ? values.inputTextoQuesito_40 
																			:
																			quesito.COD_ITEM == 41 ? values.inputTextoQuesito_41  
																			: 
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
																		placeholder='Decimal'
																		value={
																			quesito.COD_ITEM == 1 ? values.inputDecimalQuesito_1 
																			:
																			quesito.COD_ITEM == 2 ? values.inputDecimalQuesito_2 
																			:
																			quesito.COD_ITEM == 3 ? values.inputDecimalQuesito_3 
																			:
																			quesito.COD_ITEM == 4 ? values.inputDecimalQuesito_4 
																			:
																			quesito.COD_ITEM == 5 ? values.inputDecimalQuesito_5 
																			:
																			quesito.COD_ITEM == 6 ? values.inputDecimalQuesito_6 
																			:
																			quesito.COD_ITEM == 7 ? values.inputDecimalQuesito_7
																			:
																			quesito.COD_ITEM == 8 ? values.inputDecimalQuesito_8 
																			:
																			quesito.COD_ITEM == 9 ? values.inputDecimalQuesito_9 
																			:
																			quesito.COD_ITEM == 10 ? values.inputDecimalQuesito_10   
																			:
																			quesito.COD_ITEM == 11 ? values.inputDecimalQuesito_11
																			:
																			quesito.COD_ITEM == 12 ? values.inputDecimalQuesito_12 
																			:
																			quesito.COD_ITEM == 13 ? values.inputDecimalQuesito_13  
																			:
																			quesito.COD_ITEM == 14 ? values.inputDecimalQuesito_14 
																			:
																			quesito.COD_ITEM == 15 ? values.inputDecimalQuesito_15
																			:
																			quesito.COD_ITEM == 16 ? values.inputDecimalQuesito_16 
																			:
																			quesito.COD_ITEM == 17 ? values.inputDecimalQuesito_17 
																			:
																			quesito.COD_ITEM == 18 ? values.inputDecimalQuesito_18 
																			:
																			quesito.COD_ITEM == 19 ? values.inputDecimalQuesito_19 
																			:
																			quesito.COD_ITEM == 20 ? values.inputDecimalQuesito_20
																			:
																			quesito.COD_ITEM == 21 ? values.inputDecimalQuesito_21
																			:
																			quesito.COD_ITEM == 22 ? values.inputDecimalQuesito_22 
																			:
																			quesito.COD_ITEM == 23 ? values.inputDecimalQuesito_23
																			:
																			quesito.COD_ITEM == 24 ? values.inputDecimalQuesito_24 
																			:
																			quesito.COD_ITEM == 25 ? values.inputDecimalQuesito_25 
																			:
																			quesito.COD_ITEM == 26 ? values.inputDecimalQuesito_26 
																			:
																			quesito.COD_ITEM == 27 ? values.inputDecimalQuesito_27 
																			:
																			quesito.COD_ITEM == 28 ? values.inputDecimalQuesito_28 
																			:
																			quesito.COD_ITEM == 29 ? values.inputDecimalQuesito_29 
																			:
																			quesito.COD_ITEM == 30 ? values.inputDecimalQuesito_30 
																			:
																			quesito.COD_ITEM == 31 ? values.inputDecimalQuesito_31 
																			:
																			quesito.COD_ITEM == 32 ? values.inputDecimalQuesito_32 
																			:
																			quesito.COD_ITEM == 33 ? values.inputDecimalQuesito_33 
																			:
																			quesito.COD_ITEM == 34 ? values.inputDecimalQuesito_34 
																			:
																			quesito.COD_ITEM == 35 ? values.inputDecimalQuesito_35 
																			:
																			quesito.COD_ITEM == 36 ? values.inputDecimalQuesito_36 
																			:
																			quesito.COD_ITEM == 37 ? values.inputDecimalQuesito_37 
																			:
																			quesito.COD_ITEM == 38 ? values.inputDecimalQuesito_38
																			:
																			quesito.COD_ITEM == 39 ? values.inputDecimalQuesito_39
																			:
																			quesito.COD_ITEM == 40 ? values.inputDecimalQuesito_40 
																			:
																			quesito.COD_ITEM == 41 ? values.inputDecimalQuesito_41  
																			: 
																			false
																		}
																	/>
																)
															}
															{ 	
																//INPUT INTEIRO
																quesito.IND_PNEU == false && quesito.IND_LATARIA == false && quesito.IND_INTEIRO == true && quesito.IND_ATIVO == true && 
																(	
																	<Input 
																		onChangeText={handleChange('inputInteiroQuesito_'+quesito.COD_ITEM)}
																		onBlur={handleBlur('inputInteiroQuesito_'+quesito.COD_ITEM)}
																		placeholder='Inteiro'
																		value={
																			quesito.COD_ITEM == 1 ? values.inputInteiroQuesito_1 
																			:
																			quesito.COD_ITEM == 2 ? values.inputInteiroQuesito_2 
																			:
																			quesito.COD_ITEM == 3 ? values.inputInteiroQuesito_3 
																			:
																			quesito.COD_ITEM == 4 ? values.inputInteiroQuesito_4 
																			:
																			quesito.COD_ITEM == 5 ? values.inputInteiroQuesito_5 
																			:
																			quesito.COD_ITEM == 6 ? values.inputInteiroQuesito_6 
																			:
																			quesito.COD_ITEM == 7 ? values.inputInteiroQuesito_7
																			:
																			quesito.COD_ITEM == 8 ? values.inputInteiroQuesito_8 
																			:
																			quesito.COD_ITEM == 9 ? values.inputInteiroQuesito_9 
																			:
																			quesito.COD_ITEM == 10 ? values.inputInteiroQuesito_10   
																			:
																			quesito.COD_ITEM == 11 ? values.inputInteiroQuesito_11
																			:
																			quesito.COD_ITEM == 12 ? values.inputInteiroQuesito_12 
																			:
																			quesito.COD_ITEM == 13 ? values.inputInteiroQuesito_13  
																			:
																			quesito.COD_ITEM == 14 ? values.inputInteiroQuesito_14 
																			:
																			quesito.COD_ITEM == 15 ? values.inputInteiroQuesito_15
																			:
																			quesito.COD_ITEM == 16 ? values.inputInteiroQuesito_16 
																			:
																			quesito.COD_ITEM == 17 ? values.inputInteiroQuesito_17 
																			:
																			quesito.COD_ITEM == 18 ? values.inputInteiroQuesito_18 
																			:
																			quesito.COD_ITEM == 19 ? values.inputInteiroQuesito_19 
																			:
																			quesito.COD_ITEM == 20 ? values.inputInteiroQuesito_20
																			:
																			quesito.COD_ITEM == 21 ? values.inputInteiroQuesito_21
																			:
																			quesito.COD_ITEM == 22 ? values.inputInteiroQuesito_22 
																			:
																			quesito.COD_ITEM == 23 ? values.inputInteiroQuesito_23
																			:
																			quesito.COD_ITEM == 24 ? values.inputInteiroQuesito_24 
																			:
																			quesito.COD_ITEM == 25 ? values.inputInteiroQuesito_25 
																			:
																			quesito.COD_ITEM == 26 ? values.inputInteiroQuesito_26 
																			:
																			quesito.COD_ITEM == 27 ? values.inputInteiroQuesito_27 
																			:
																			quesito.COD_ITEM == 28 ? values.inputInteiroQuesito_28 
																			:
																			quesito.COD_ITEM == 29 ? values.inputInteiroQuesito_29 
																			:
																			quesito.COD_ITEM == 30 ? values.inputInteiroQuesito_30 
																			:
																			quesito.COD_ITEM == 31 ? values.inputInteiroQuesito_31 
																			:
																			quesito.COD_ITEM == 32 ? values.inputInteiroQuesito_32 
																			:
																			quesito.COD_ITEM == 33 ? values.inputInteiroQuesito_33 
																			:
																			quesito.COD_ITEM == 34 ? values.inputInteiroQuesito_34 
																			:
																			quesito.COD_ITEM == 35 ? values.inputInteiroQuesito_35 
																			:
																			quesito.COD_ITEM == 36 ? values.inputInteiroQuesito_36 
																			:
																			quesito.COD_ITEM == 37 ? values.inputInteiroQuesito_37 
																			:
																			quesito.COD_ITEM == 38 ? values.inputInteiroQuesito_38
																			:
																			quesito.COD_ITEM == 39 ? values.inputInteiroQuesito_39
																			:
																			quesito.COD_ITEM == 40 ? values.inputInteiroQuesito_40 
																			:
																			quesito.COD_ITEM == 41 ? values.inputInteiroQuesito_41  
																			: 
																			false
																		}
																	/>
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
																							quesito.COD_ITEM == 1 ? values.rbQuesito_1 == radio.COD_OPCAO ? true : false
																							:
																							quesito.COD_ITEM == 2 ? values.rbQuesito_2 == radio.COD_OPCAO ? true : false
																							:
																							quesito.COD_ITEM == 3 ? values.rbQuesito_3 == radio.COD_OPCAO ? true : false
																							:
																							quesito.COD_ITEM == 4 ? values.rbQuesito_4 == radio.COD_OPCAO ? true : false 
																							:
																							quesito.COD_ITEM == 5 ? values.rbQuesito_5 == radio.COD_OPCAO ? true : false
																							:
																							quesito.COD_ITEM == 6 ? values.rbQuesito_6 == radio.COD_OPCAO ? true : false 
																							:
																							quesito.COD_ITEM == 7 ? values.rbQuesito_7 == radio.COD_OPCAO ? true : false 
																							:
																							quesito.COD_ITEM == 8 ? values.rbQuesito_8 == radio.COD_OPCAO ? true : false 
																							:
																							quesito.COD_ITEM == 9 ? values.rbQuesito_9 == radio.COD_OPCAO ? true : false
																							:
																							quesito.COD_ITEM == 10 ? values.rbQuesito_10 == radio.COD_OPCAO ? true : false  
																							:
																							quesito.COD_ITEM == 11 ? values.rbQuesito_11 == radio.COD_OPCAO ? true : false 
																							:
																							quesito.COD_ITEM == 12 ? values.rbQuesito_12 == radio.COD_OPCAO ? true : false 
																							:
																							quesito.COD_ITEM == 13 ? values.rbQuesito_13 == radio.COD_OPCAO ? true : false 
																							:
																							quesito.COD_ITEM == 14 ? values.rbQuesito_14 == radio.COD_OPCAO ? true : false 
																							:
																							quesito.COD_ITEM == 15 ? values.rbQuesito_15 == radio.COD_OPCAO ? true : false
																							:
																							quesito.COD_ITEM == 16 ? values.rbQuesito_16 == radio.COD_OPCAO ? true : false
																							:
																							quesito.COD_ITEM == 17 ? values.rbQuesito_17 == radio.COD_OPCAO ? true : false
																							:
																							quesito.COD_ITEM == 18 ? values.rbQuesito_18 == radio.COD_OPCAO ? true : false
																							:
																							quesito.COD_ITEM == 19 ? values.rbQuesito_19 == radio.COD_OPCAO ? true : false
																							:
																							quesito.COD_ITEM == 20 ? values.rbQuesito_20 == radio.COD_OPCAO ? true : false
																							:
																							quesito.COD_ITEM == 21 ? values.rbQuesito_21 == radio.COD_OPCAO ? true : false
																							:
																							quesito.COD_ITEM == 22 ? values.rbQuesito_22 == radio.COD_OPCAO ? true : false
																							:
																							quesito.COD_ITEM == 23 ? values.rbQuesito_23 == radio.COD_OPCAO ? true : false
																							:
																							quesito.COD_ITEM == 24 ? values.rbQuesito_24 == radio.COD_OPCAO ? true : false
																							:
																							quesito.COD_ITEM == 25 ? values.rbQuesito_25 == radio.COD_OPCAO ? true : false
																							:
																							quesito.COD_ITEM == 26 ? values.rbQuesito_26 == radio.COD_OPCAO ? true : false
																							:
																							quesito.COD_ITEM == 27 ? values.rbQuesito_27 == radio.COD_OPCAO ? true : false
																							:
																							quesito.COD_ITEM == 28 ? values.rbQuesito_28 == radio.COD_OPCAO ? true : false
																							:
																							quesito.COD_ITEM == 29 ? values.rbQuesito_29 == radio.COD_OPCAO ? true : false
																							:
																							quesito.COD_ITEM == 30 ? values.rbQuesito_30 == radio.COD_OPCAO ? true : false
																							:
																							quesito.COD_ITEM == 31 ? values.rbQuesito_31 == radio.COD_OPCAO ? true : false
																							:
																							quesito.COD_ITEM == 32 ? values.rbQuesito_32 == radio.COD_OPCAO ? true : false
																							:
																							quesito.COD_ITEM == 33 ? values.rbQuesito_33 == radio.COD_OPCAO ? true : false
																							:
																							quesito.COD_ITEM == 34 ? values.rbQuesito_34 == radio.COD_OPCAO ? true : false
																							:
																							quesito.COD_ITEM == 35 ? values.rbQuesito_35 == radio.COD_OPCAO ? true : false
																							:
																							quesito.COD_ITEM == 36 ? values.rbQuesito_36 == radio.COD_OPCAO ? true : false
																							:
																							quesito.COD_ITEM == 37 ? values.rbQuesito_37 == radio.COD_OPCAO ? true : false
																							:
																							quesito.COD_ITEM == 38 ? values.rbQuesito_38 == radio.COD_OPCAO ? true : false
																							:
																							quesito.COD_ITEM == 39 ? values.rbQuesito_39 == radio.COD_OPCAO ? true : false
																							:
																							quesito.COD_ITEM == 40 ? values.rbQuesito_40 == radio.COD_OPCAO ? true : false
																							:
																							quesito.COD_ITEM == 41 ? values.rbQuesito_41 == radio.COD_OPCAO ? true : false
																							: 
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
																//LIST BOX
																quesito.IND_PNEU == false && quesito.IND_LATARIA == false && quesito.IND_LISTA == true && quesito.IND_ATIVO == true &&
																(
																	
																		<Picker
																			selectedValue={
																				quesito.COD_ITEM == 1 ? values.lbQuesito_1 
																				:
																				quesito.COD_ITEM == 2 ? values.lbQuesito_2 
																				:
																				quesito.COD_ITEM == 3 ? values.lbQuesito_3 
																				:
																				quesito.COD_ITEM == 4 ? values.lbQuesito_4 
																				:
																				quesito.COD_ITEM == 5 ? values.lbQuesito_5 
																				:
																				quesito.COD_ITEM == 6 ? values.lbQuesito_6 
																				:
																				quesito.COD_ITEM == 7 ? values.lbQuesito_7
																				:
																				quesito.COD_ITEM == 8 ? values.lbQuesito_8 
																				:
																				quesito.COD_ITEM == 9 ? values.lbQuesito_9 
																				:
																				quesito.COD_ITEM == 10 ? values.lbQuesito_10   
																				:
																				quesito.COD_ITEM == 11 ? values.lbQuesito_11
																				:
																				quesito.COD_ITEM == 12 ? values.lbQuesito_12 
																				:
																				quesito.COD_ITEM == 13 ? values.lbQuesito_13  
																				:
																				quesito.COD_ITEM == 14 ? values.lbQuesito_14 
																				:
																				quesito.COD_ITEM == 15 ? values.lbQuesito_15
																				:
																				quesito.COD_ITEM == 16 ? values.lbQuesito_16 
																				:
																				quesito.COD_ITEM == 17 ? values.lbQuesito_17 
																				:
																				quesito.COD_ITEM == 18 ? values.lbQuesito_18 
																				:
																				quesito.COD_ITEM == 19 ? values.lbQuesito_19 
																				:
																				quesito.COD_ITEM == 20 ? values.lbQuesito_20
																				:
																				quesito.COD_ITEM == 21 ? values.lbQuesito_21
																				:
																				quesito.COD_ITEM == 22 ? values.lbQuesito_22 
																				:
																				quesito.COD_ITEM == 23 ? values.lbQuesito_23
																				:
																				quesito.COD_ITEM == 24 ? values.lbQuesito_24 
																				:
																				quesito.COD_ITEM == 25 ? values.lbQuesito_25 
																				:
																				quesito.COD_ITEM == 26 ? values.lbQuesito_26 
																				:
																				quesito.COD_ITEM == 27 ? values.lbQuesito_27 
																				:
																				quesito.COD_ITEM == 28 ? values.lbQuesito_28 
																				:
																				quesito.COD_ITEM == 29 ? values.lbQuesito_29 
																				:
																				quesito.COD_ITEM == 30 ? values.lbQuesito_30 
																				:
																				quesito.COD_ITEM == 31 ? values.lbQuesito_31 
																				:
																				quesito.COD_ITEM == 32 ? values.lbQuesito_32 
																				:
																				quesito.COD_ITEM == 33 ? values.lbQuesito_33 
																				:
																				quesito.COD_ITEM == 34 ? values.lbQuesito_34 
																				:
																				quesito.COD_ITEM == 35 ? values.lbQuesito_35 
																				:
																				quesito.COD_ITEM == 36 ? values.lbQuesito_36 
																				:
																				quesito.COD_ITEM == 37 ? values.lbQuesito_37 
																				:
																				quesito.COD_ITEM == 38 ? values.lbQuesito_38
																				:
																				quesito.COD_ITEM == 39 ? values.lbQuesito_39
																				:
																				quesito.COD_ITEM == 40 ? values.lbQuesito_40 
																				:
																				quesito.COD_ITEM == 41 ? values.lbQuesito_41  
																				: 
																				false

																			}
																			style={{ height: 50, margin:5, width: '100%'}}
																			onValueChange={(itemValue, itemIndex) => setFieldValue('lbQuesito_'+quesito.COD_ITEM, itemValue )}
																		>
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
					onPress={handleSubmit}
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
		marginBottom: 10,
		fontSize: 18,
		paddingLeft:5
	},
	containerImg: {
		marginTop: 20,
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: 10,
	},
	botao: {
		marginTop: 20,
		marginBottom:30,
		backgroundColor: 'rgb(0,86,112)',
	},
});
