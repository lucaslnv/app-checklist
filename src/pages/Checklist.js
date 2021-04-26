import React, {useEffect, useState} from 'react';
import { StyleSheet, View, ScrollView, Switch, Picker, Alert } from 'react-native';
import { Text, Button, Input, CheckBox } from 'react-native-elements';
import { Separator, Radio, Right, Left, Center, ListItem } from 'native-base';
import LoadingItem from '../components/LoadingItem';
import {Collapse,CollapseHeader, CollapseBody, AccordionList} from 'accordion-collapse-react-native';
import {buscarQuesitos} from '../services/api';
import NetInfo from "@react-native-community/netinfo";

import Icon from 'react-native-vector-icons/FontAwesome';

export default function Checklist(props) {

	const [nomeEquipamento, setNomeEquipamento] = useState('');
	const [qrCodeEquipamento, setQrCodeEquipamento] = useState('');
	const [loading, setloading] = useState(false);
	const [ultimoCheckup, setUltimoCheckup] = useState('');
	const [ultimoHorimetro, setUltimoHorimetro] = useState('');
	const [quesitos, setQuesitos] = useState([]);

	//KEY
	//const [key, setKey] = useState(1);
	var key = 1;
	function setKey(value){
		key = key + 1;		
	}

	var key2 = 1;
	function setKey2(value){
		key2 = key2 + 1;		
	}

	//CHECKBOX ITEM 1
	const [cbItem1, setCbItem1] = useState(false);
	const toggleSwitchItem1 = () => setCbItem1(previousState => !previousState);

	//RADIO BUTTON ITEM 1
	const [rbItem1, setRbItem1] = useState(false);

	//CHECKBOX ITEM 2
	const [cbItem2, setCbItem2] = useState(false);
	const toggleSwitchItem2 = () => setCbItem2(previousState => !previousState);
	
	//RADIO BUTTON ITEM 2
	const [rbItem2, setRbItem2] = useState(false);

	//LIST BOX ITEM 8
	const [lbItem8, setLbItem8] = useState(false);

	//INPUT INTEIRO ITEM 20
	const [inputInteiroItem20, setInputInteiroItem20] = useState('');

	//INPUT TEXTO ITEM 20
	const [inputTextoItem20, setInputTextoItem20] = useState('');

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
			console.log(respostaQuesitos);
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
			  Alert.alert('Aviso', 'Dispositivo sem conexão com a internet.');
			}
		});
		
		
	}, []);

	function changeIcon (key, isExpanded){
		console.log( key );
		console.log( isExpanded );
		setIsExpanded(isExpanded);
		setKey(key);
	}

	return (
		<ScrollView style={styles.container}>

			<Text style={styles.textoEquipamento}>{'QR Code: '+qrCodeEquipamento }</Text>
			<Text style={styles.textoEquipamento}>{'Equipamento: '+nomeEquipamento}</Text>
			<Text style={{ padding: 5}}>{'Último checkup: '+ultimoCheckup}</Text>
			<Text style={{ padding: 5}}>{'Último horímetro: '+ultimoHorimetro}</Text>
			
			{ /* GRUPOS */ }
			{
			quesitos.GRUPO != undefined ?	
				quesitos.GRUPO.map((grupo, g) => {
					setKey(1);
					//console.log(key);
					return (
						<View key={grupo.COD_GRUPO}>
						<Collapse >
							<CollapseHeader>
								<Separator style={{ backgroundColor: 'rgb(250,184,29)', height: 45, marginTop: 3 }} bordered >
								<Text>
								<Icon
									name="plus"
									size={15}
									color="black"
								/>
								&nbsp;&nbsp;{grupo.DES_GRUPO}
								</Text>
								</Separator>
							</CollapseHeader>
							<CollapseBody>

							{ /* QUESITOS */ }
							{
								grupo.QUESITOS != undefined ?	
									grupo.QUESITOS.map((quesito, q) => {
										setKey2(1);
										return (
											<View key={quesito.QUESITO}>
											{ /* DESCRICAO QUESITO */ }
											<Text style={{fontSize: 20, marginLeft: 10, marginTop: 10, fontWeight: 'bold' }}>{quesito.COD_ITEM+'. '+quesito.QUESITO}</Text>
											
											{ /* CHECKBOX ITEM 1 */ }
											{
												quesito.IND_CHECKBOX == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 1 && 
												(
													quesito.componentes.checkbox.map((checkbox, c) => {
														return (
															<Switch
																key={checkbox.COD_ACAO} 
																trackColor={{ false: "red", true: "#C5DB5F" }}
																thumbColor={isEnabled4 ? "#fff" : "#fff"}
																ios_backgroundColor="#fff"
																onValueChange={toggleSwitchItem1}
																value={cbItem1}
															/>
														);
													})
												)
											}

											{ /* RADIO BUTTON ITEM 1 */ }
											{
												quesito.IND_RADIO == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 1  &&
												(
													quesito.componentes.radio.OPCOES.map((radio, i) => {
														return (
															<ListItem 
																key={radio.DES_OPCAO}
																onPress={() => setRbItem1(radio.COD_OPCAO)}
																selected={ rbItem1 == radio.COD_OPCAO ? true : false } >
																<Left>
																<Text>{radio.DES_OPCAO}</Text>
																</Left>
																<Right>
																<Radio
																	onPress={() => setRbItem1(radio.COD_OPCAO)}
																	color={"#f0ad4e"}
																	selectedColor={"#5cb85c"}
																	selected={ rbItem1 == radio.COD_OPCAO ? true : false }
																/>
																</Right>
															</ListItem>
														);
													})
												)
											}

											{ /* LIST BOX ITEM 8 */ }
											{
												quesito.IND_LISTA == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 8  &&
												(
													
														<Picker
															selectedValue={lbItem8}
															style={{ height: 50, margin:5, width: '100%'}}
															onValueChange={(itemValue, itemIndex) => setLbItem8(itemValue)}
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

											{ /* INPUT INTEIRO ITEM 20 */ }
											{
												quesito.IND_INTEIRO == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 20 && 
												(
													<Input 
														value={inputInteiroItem20}
														onChangeText={value => setInputInteiroItem20(value)}
														placeholder='Inteiro'
													/>
												)
											}

											{ /* INPUT TEXTO ITEM 20 */ }
											{
												quesito.IND_TEXTO == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 20 && 
												(
													<Input 
														value={inputTextoItem20}
														onChangeText={value => setInputtEXTOItem20(value)}
														placeholder='Texto'
													/>
												)
											}

											{ /* CHECKBOX ITEM 2 */ }
											{
												quesito.IND_CHECKBOX == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 2 && 
												(
													<ListItem >
														<Switch
															trackColor={{ false: "red", true: "#C5DB5F" }}
															thumbColor={cbItem2 ? "#fff" : "#fff"}
															ios_backgroundColor="#fff"
															onValueChange={toggleSwitchItem2}
															value={cbItem2}
														/>
													</ListItem>	
												)
											}

											{ /* RADIO BUTTON ITEM 2 */ }
											{
												quesito.IND_RADIO == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 2  &&
												(
													quesito.componentes.radio.OPCOES.map((radio, i) => {
														return (
															<ListItem 
																key={radio.DES_OPCAO}
																onPress={() => setRbItem2(radio.COD_OPCAO)}
																selected={ rbItem2 == radio.COD_OPCAO ? true : false } >
																<Left>
																<Text>{radio.DES_OPCAO}</Text>
																</Left>
																<Right>
																<Radio
																	onPress={() => setRbItem2(radio.COD_OPCAO)}
																	color={"#f0ad4e"}
																	selectedColor={"#5cb85c"}
																	selected={ rbItem2 == radio.COD_OPCAO ? true : false }
																/>
																</Right>
															</ListItem>
														);
													})
												)
											}
											</View>
										);
									})
								: <Text>{'QUESITOS NÃO ENCONTRADOS.'}</Text>
							}
							</CollapseBody>
						</Collapse>
						</View>
					);
				})
				: <Text>{'GRUPOS NÃO ENCONTRADOS.'}</Text>
			}
			
			
			<Button
				buttonStyle={styles.botao}
				title="REGISTRAR"
				onPress={ ()=> Alert.alert('Aviso', 'Operação realizada com sucesso.') }
			/>
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