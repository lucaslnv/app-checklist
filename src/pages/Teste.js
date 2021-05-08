import { StatusBar } from 'expo-status-bar';
import React, {useEffect, useState} from 'react';
import { StyleSheet, View, ScrollView, Switch, Alert, TextInput } from 'react-native';
import {buscarQuesitos} from '../services/api';
import { Separator, Radio, Right, Left, Center, ListItem } from 'native-base';
import {Collapse,CollapseHeader, CollapseBody, AccordionList} from 'accordion-collapse-react-native';

import { RadioButton } from 'react-native-paper';
import { Button, Text, Input } from 'react-native-elements';

import { Formik } from 'formik';

export function Rb(props) {

	const [rb, setRb] = useState({});

	const [status, setStatus] = useState(false);

	function clicouRb(){

		var rbNovo = '{"'+props.quesito+'" : '+props.opcao+', "opcao": '+props.opcao+'}';
		rbNovo = JSON.parse(rbNovo);

		//var rb = { quesito: props.quesito, opcao: props.opcao};
		setRb(rbNovo);
		
		console.log(rb);
		
	}
	
	return(
		<>
			<Text>{props.nome}</Text>
			<RadioButton
				status={ props.quesito == props.opcao ? 'checked' : 'unchecked' }
				onPress = { ()=> clicouRb() }
			/>
		</>
	)

}

export default function Teste(props) {

	const [motoristas, setMotoristas] = useState([]);
	const [quesitos, setQuesitos] = useState([]);
	const [loading, setloading] = useState(false);

	const [checked, setChecked] = React.useState('first');

	//const [selected, setSelected] = useState(false);

	const [rbItem_1, setRbItem_1] = useState(false);
	const [rbItem_4, setRbItem_4] = useState(false);

	const [rbQuesito_1, setRbQuesito_1] = useState(false);
	const [rbQuesito_4, setRbQuesito_4] = useState(false);
	
	//CARREGAR MOTORISTAS
	useEffect(() => { 
		var dominio = 'web';
    	async function carregarQuesitos(){
			
			//BUSCA QUESITOS
			//let respostaQuesitos = await buscarQuesitos(dominio, props.navigation.getParam('qrCodeEquipamento'));
			let respostaQuesitos = await buscarQuesitos(dominio, 2000);
			
			if(respostaQuesitos.status){
				if(respostaQuesitos.resultado == "Chave invalida."){
					setloading(false);
					Alert.alert('Aviso', 'Chave de autenticaÃ§Ã£o invÃ¡lida.');
				}
				setQuesitos(respostaQuesitos.resultado.data.draw);
				setloading(false);
			}else{
				setloading(false);
				Alert.alert('Aviso', respostaQuesitos.mensagem);
			}
		}

		carregarQuesitos();
	}, []);
	
	
  return (
    	<ScrollView style={styles.container}>
		
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
											<Text>&nbsp;&nbsp;{grupo.DES_GRUPO}
											</Text>
											</Separator>
										</CollapseHeader>
										<CollapseBody>
										{
											//PNEUS TRUE
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
																					//INPUT TEXTO PNEU
																					 quesito.IND_TEXTO == true && quesito.IND_ATIVO == true && 
																					(	
																						<>
																						<TextInput 
																							onChangeText={handleChange('Pneu_'+listbox.COD_OPCAO+'_inputTextoQuesito_'+quesito.COD_ITEM)}
																							onBlur={handleBlur('Pneu_'+listbox.COD_OPCAO+'_inputTextoQuesito_'+quesito.COD_ITEM)}
																							placeholder='Observação'
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
																									<Left>
																									<Text>{radio.DES_OPCAO}</Text>
																									</Left>
																									<Right>
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
																											listbox.COD_OPCAO == 4 && quesito.COD_ITEM == 14  ? values.Pneu_4_rbQuesito_14 == radio.COD_OPCAO ? true : false :
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
																											
																											false
																										}
																									/>
																									
																									</Right>
																								</ListItem>
																							);
																						})
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
											//PNEUS FALSE - LATARIA FALSE - VIDRO FALSE
											grupo.QUESITOS != undefined &&(
												grupo.QUESITOS.map((quesito, q) => {
													return(
														<View key={quesito.QUESITO}>
														{	
															//NOME QUESITO
															quesito.IND_PNEU == false && (
																<Text style={{fontSize: 20, marginLeft: 10, marginTop: 10, fontWeight: 'bold' }}>{quesito.COD_ITEM+'. '+quesito.QUESITO}</Text>
															)
														}
														{ /* CHECKBOX */ }
														{
															quesito.IND_PNEU == false && quesito.IND_CHECKBOX == true && quesito.IND_ATIVO == true && 
															(
																<ListItem>
																	<Switch
																		trackColor={{ false: "red", true: "#C5DB5F" }}
																		thumbColor={values.cbQuesito_ ? "#fff" : "#fff"}
																		ios_backgroundColor="#fff"
																		onValueChange={ () => setFieldValue('cbQuesito_'+quesito.COD_ITEM, !values.cbQuesito_2 ) }
																		value={values.cbQuesito_2}
																	/>
																</ListItem>	
															)
														}

														{ 	
															//INPUT TEXTO
															quesito.IND_PNEU == false && quesito.IND_TEXTO == true && quesito.IND_ATIVO == true && 
															(	
																<Input 
																	onChangeText={handleChange('_inputTextoQuesito_'+quesito.COD_ITEM)}
																	onBlur={handleBlur('_inputTextoQuesito_'+quesito.COD_ITEM)}
																	placeholder='Observação'
																	value={ values._inputTextoQuesito_31 }
																/>
															)
														}
														{ 	
															//INPUT DECIMAL
															quesito.IND_PNEU == false && quesito.IND_DECIMAL == true && quesito.IND_ATIVO == true && 
															(	
																<Input 
																	onChangeText={handleChange('_inputDecimalQuesito_'+quesito.COD_ITEM)}
																	onBlur={handleBlur('_inputDecimalQuesito_'+quesito.COD_ITEM)}
																	placeholder='Decimal'
																/>
															)
														}
														{ 	
															//INPUT INTEIRO
															quesito.IND_PNEU == false && quesito.IND_INTEIRO == true && quesito.IND_ATIVO == true && 
															(	
																<Input 
																	onChangeText={handleChange('_inputInteiroQuesito_'+quesito.COD_ITEM)}
																	onBlur={handleBlur('_inputInteiroQuesito_'+quesito.COD_ITEM)}
																	placeholder='Inteiro'
																/>
															)
														}
														
														{
															//RADIO BUTTON 
															quesito.IND_PNEU == false && quesito.IND_RADIO == true && quesito.IND_ATIVO == true &&
															(
																quesito.componentes.radio.OPCOES.map((radio, i) => {
																	return (
																		<ListItem 
																			key={radio.DES_OPCAO}
																			onPress={ () => setFieldValue('rbQuesito_'+quesito.COD_ITEM, radio.COD_OPCAO ) }
																			>
																			<Left>
																				<Text>{radio.DES_OPCAO}</Text>
																			</Left>
																			<Right>
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
																			</Right>
																		</ListItem>
																	);
																})
															)
														}
														</View>
													)
													
												})
											)
										}
										</CollapseBody>
									</Collapse>
								</View>
								);
							})
					)
				}
				<Text></Text>
				<Button onPress={handleSubmit} title="Submit" />
				<Text></Text>
				<Text></Text>
			</View>
			)}
		</Formik>
				
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
