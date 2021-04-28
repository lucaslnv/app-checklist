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

	/* ITEM 1 */

	//CHECKBOX ITEM 1
	const [cbItem1, setCbItem1] = useState(false);
	const toggleSwitchItem1 = () => setCbItem1(previousState => !previousState);

	//RADIO BUTTON ITEM 1
	const [rbItem1, setRbItem1] = useState(false);

	//LIST BOX ITEM 1
	const [lbItem1, setLbItem1] = useState(false);

	//INPUT INTEIRO ITEM 1
	const [inputInteiroItem1, setInputInteiroItem1] = useState('');

	//INPUT TEXTO ITEM 1
	const [inputTextoItem1, setinputTextoItem1] = useState('');

	//INPUT DECIMAL ITEM 1
	const [inputDecimalItem1, setInputDecimalItem1] = useState('');

	/* ITEM 2 */

	//CHECKBOX ITEM 2
	const [cbItem2, setCbItem2] = useState(false);
	const toggleSwitchItem2 = () => setCbItem2(previousState => !previousState);

	//RADIO BUTTON ITEM 2
	const [rbItem2, setRbItem2] = useState(false);

	//INPUT INTEIRO ITEM 2
	const [inputInteiroItem2, setInputInteiroItem2] = useState('');

	//INPUT TEXTO ITEM 2
	const [inputTextoItem2, setinputTextoItem2] = useState('');

	//INPUT DECIMAL ITEM 2
	const [inputDecimalItem2, setInputDecimalItem2] = useState('');

	/* ITEM 3 */

	//CHECKBOX ITEM 3
	const [cbItem3, setCbItem3] = useState(false);
	const toggleSwitchItem3 = () => setCbItem3(previousState => !previousState);

	//RADIO BUTTON ITEM 3
	const [rbItem3, setRbItem3] = useState(false);

	//LIST BOX ITEM 3
	const [lbItem3, setLbItem3] = useState(false);

	//INPUT INTEIRO ITEM 3
	const [inputInteiroItem3, setInputInteiroItem3] = useState('');

	//INPUT TEXTO ITEM 3
	const [inputTextoItem3, setinputTextoItem3] = useState('');

	//INPUT DECIMAL ITEM 3
	const [inputDecimalItem3, setInputDecimalItem3] = useState('');

	/* ITEM 4 */

	//CHECKBOX ITEM 4
	const [cbItem4, setCbItem4] = useState(false);
	const toggleSwitchItem4 = () => setCbItem4(previousState => !previousState);

	//RADIO BUTTON ITEM 4
	const [rbItem4, setRbItem4] = useState(false);

	//LIST BOX ITEM 4
	const [lbItem4, setLbItem4] = useState(false);

	//INPUT INTEIRO ITEM 4
	const [inputInteiroItem4, setInputInteiroItem4] = useState('');

	//INPUT TEXTO ITEM 4
	const [inputTextoItem4, setinputTextoItem4] = useState('');

	//INPUT DECIMAL ITEM 4
	const [inputDecimalItem4, setInputDecimalItem4] = useState('');

	/* ITEM 5 */

	//CHECKBOX ITEM 5
	const [cbItem5, setCbItem5] = useState(false);
	const toggleSwitchItem5 = () => setCbItem5(previousState => !previousState);

	//RADIO BUTTON ITEM 5
	const [rbItem5, setRbItem5] = useState(false);
	
	//LIST BOX ITEM 5
	const [lbItem5, setLbItem5] = useState(false);

	//INPUT INTEIRO ITEM 5
	const [inputInteiroItem5, setInputInteiroItem5] = useState('');
	
	//INPUT TEXTO ITEM 5
	const [inputTextoItem5, setinputTextoItem5] = useState('');

	//INPUT DECIMAL ITEM 5
	const [inputDecimalItem5, setInputDecimalItem5] = useState('');

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
			  Alert.alert('Aviso', 'Dispositivo sem conexão com a internet.');
			}
		});
		
		
	}, []);

	const [icon, setIcon] = useState([]);
	function changeIcon (key, isExpanded){
		setIcon([key, isExpanded]);
		console.log(icon)
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
					return (
						<View key={grupo.COD_GRUPO}>
						<Collapse onToggle={ (isExpanded) => changeIcon(grupo.COD_GRUPO, isExpanded) } >
							<CollapseHeader  >
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

							{ /* QUESITOS */ }
							{
								grupo.QUESITOS != undefined ?	
									grupo.QUESITOS.map((quesito, q) => {
										return (
											<View key={quesito.QUESITO}>

											{ /* DESCRICAO QUESITO */ }
											<Text style={{fontSize: 20, marginLeft: 10, marginTop: 10, fontWeight: 'bold' }}>{quesito.COD_ITEM+'. '+quesito.QUESITO}</Text>
											
											{ 
												/* ITEM 1 */
											}

											{ /* CHECKBOX ITEM 1 */ }
											{
												quesito.IND_CHECKBOX == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 1 && 
												(
													<ListItem >
														<Switch
															trackColor={{ false: "red", true: "#C5DB5F" }}
															thumbColor={cbItem1 ? "#fff" : "#fff"}
															ios_backgroundColor="#fff"
															onValueChange={toggleSwitchItem2}
															value={cbItem1}
														/>
													</ListItem>	
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

											{ /* LIST BOX ITEM 1 */ }
											{
												quesito.IND_LISTA == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 1  &&
												(
													
														<Picker
															selectedValue={lbItem1}
															style={{ height: 50, margin:5, width: '100%'}}
															onValueChange={(itemValue, itemIndex) => setLbItem1(itemValue)}
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

											{ /* INPUT INTEIRO ITEM 1 */ }
											{
												quesito.IND_INTEIRO == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 1 && 
												(
													<Input 
														value={inputInteiroItem1}
														onChangeText={value => setInputInteiroItem1(value)}
														placeholder='Inteiro'
													/>
												)
											}

											{ /* INPUT TEXTO ITEM 1 */ }
											{
												quesito.IND_TEXTO == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 1 && 
												(
													<Input 
														value={inputTextoItem1}
														onChangeText={value => setInputTextoItem1(value)}
														placeholder='Observação'
													/>
												)
											}

											{/* INPUT TEXTO ITEM 1 */ }
											{
												quesito.IND_TEXTO == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 1 && 
												(
													<Input 
														value={inputDecimalItem1}
														onChangeText={value => setInputDecimalItem1(value)}
														placeholder='Decimal'
													/>
												)
											}

											{ 
												/* ITEM 2 */
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

											{ /* LIST BOX ITEM 2 */ }
											{
												quesito.IND_LISTA == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 2  &&
												(
													
														<Picker
															selectedValue={lbItem1}
															style={{ height: 50, margin:5, width: '100%'}}
															onValueChange={(itemValue, itemIndex) => setLbItem2(itemValue)}
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

											{ /* INPUT INTEIRO ITEM 2 */ }
											{
												quesito.IND_INTEIRO == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 2 && 
												(
													<Input 
														value={inputInteiroItem2}
														onChangeText={value => setInputInteiroItem2(value)}
														placeholder='Inteiro'
													/>
												)
											}

											{ /* INPUT TEXTO ITEM 2 */ }
											{
												quesito.IND_TEXTO == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 2 && 
												(
													<Input 
														value={inputTextoItem2}
														onChangeText={value => setInputTextoItem2(value)}
														placeholder='Observação'
													/>
												)
											}

											{/* INPUT TEXTO ITEM 2 */ }
											{
												quesito.IND_TEXTO == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 2 && 
												(
													<Input 
														value={inputDecimalItem2}
														onChangeText={value => setInputDecimalItem2(value)}
														placeholder='Decimal'
													/>
												)
											}

											{ 
												/* ITEM 3 */
											}

											{ /* CHECKBOX ITEM 3 */ }
											{
												quesito.IND_CHECKBOX == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 3 && 
												(
													<ListItem >
														<Switch
															trackColor={{ false: "red", true: "#C5DB5F" }}
															thumbColor={cbItem3 ? "#fff" : "#fff"}
															ios_backgroundColor="#fff"
															onValueChange={toggleSwitchItem3}
															value={cbItem3}
														/>
													</ListItem>	
												)
											}

											{ /* RADIO BUTTON ITEM 3 */ }
											{
												quesito.IND_RADIO == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 3  &&
												(
													quesito.componentes.radio.OPCOES.map((radio, i) => {
														return (
															<ListItem 
																key={radio.DES_OPCAO}
																onPress={() => setRbItem3(radio.COD_OPCAO)}
																selected={ rbItem3 == radio.COD_OPCAO ? true : false } >
																<Left>
																<Text>{radio.DES_OPCAO}</Text>
																</Left>
																<Right>
																<Radio
																	onPress={() => setRbItem3(radio.COD_OPCAO)}
																	color={"#f0ad4e"}
																	selectedColor={"#5cb85c"}
																	selected={ rbItem3 == radio.COD_OPCAO ? true : false }
																/>
																</Right>
															</ListItem>
														);
													})
												)
											}

											{ /* LIST BOX ITEM 3 */ }
											{
												quesito.IND_LISTA == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 3 &&
												(
													
														<Picker
															selectedValue={lbItem3}
															style={{ height: 50, margin:5, width: '100%'}}
															onValueChange={(itemValue, itemIndex) => setLbItem3(itemValue)}
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

											{ /* INPUT INTEIRO ITEM 3 */ }
											{
												quesito.IND_INTEIRO == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 3 && 
												(
													<Input 
														value={inputInteiroItem3}
														onChangeText={value => setInputInteiroItem3(value)}
														placeholder='Inteiro'
													/>
												)
											}

											{ /* INPUT TEXTO ITEM 3 */ }
											{
												quesito.IND_TEXTO == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 3 && 
												(
													<Input 
														value={inputTextoItem3}
														onChangeText={value => setInputTextoItem3(value)}
														placeholder='Observação'
													/>
												)
											}

											{/* INPUT TEXTO ITEM 3 */ }
											{
												quesito.IND_TEXTO == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 3 && 
												(
													<Input 
														value={inputDecimalItem3}
														onChangeText={value => setInputDecimalItem3(value)}
														placeholder='Decimal'
													/>
												)
											}

											{ 
												/* ITEM 4 */
											}

											{ /* CHECKBOX ITEM 4 */ }
											{
												quesito.IND_CHECKBOX == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 4 && 
												(
													<ListItem >
														<Switch
															trackColor={{ false: "red", true: "#C5DB5F" }}
															thumbColor={cbItem3 ? "#fff" : "#fff"}
															ios_backgroundColor="#fff"
															onValueChange={toggleSwitchItem4}
															value={cbItem4}
														/>
													</ListItem>	
												)
											}

											{ /* RADIO BUTTON ITEM 4 */ }
											{
												quesito.IND_RADIO == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 4  &&
												(
													quesito.componentes.radio.OPCOES.map((radio, i) => {
														return (
															<ListItem 
																key={radio.DES_OPCAO}
																onPress={() => setRbItem4(radio.COD_OPCAO)}
																selected={ rbItem4 == radio.COD_OPCAO ? true : false } >
																<Left>
																<Text>{radio.DES_OPCAO}</Text>
																</Left>
																<Right>
																<Radio
																	onPress={() => setRbItem4(radio.COD_OPCAO)}
																	color={"#f0ad4e"}
																	selectedColor={"#5cb85c"}
																	selected={ rbItem4 == radio.COD_OPCAO ? true : false }
																/>
																</Right>
															</ListItem>
														);
													})
												)
											}

											{ /* LIST BOX ITEM 4 */ }
											{
												quesito.IND_LISTA == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 4 &&
												(
													
														<Picker
															selectedValue={lbItem3}
															style={{ height: 50, margin:5, width: '100%'}}
															onValueChange={(itemValue, itemIndex) => setLbItem4(itemValue)}
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

											{ /* INPUT INTEIRO ITEM 4 */ }
											{
												quesito.IND_INTEIRO == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 4 && 
												(
													<Input 
														value={inputInteiroItem4}
														onChangeText={value => setInputInteiroItem4(value)}
														placeholder='Inteiro'
													/>
												)
											}

											{ /* INPUT TEXTO ITEM 4 */ }
											{
												quesito.IND_TEXTO == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 4 && 
												(
													<Input 
														value={inputTextoItem4}
														onChangeText={value => setInputTextoItem3(value)}
														placeholder='Observação'
													/>
												)
											}

											{/* INPUT TEXTO ITEM 4 */ }
											{
												quesito.IND_TEXTO == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 4 && 
												(
													<Input 
														value={inputDecimalItem4}
														onChangeText={value => setInputDecimalItem4(value)}
														placeholder='Decimal'
													/>
												)
											}

											{ 
												/* ITEM 5 */
											}

											{ /* CHECKBOX ITEM 5 */ }
											{
												quesito.IND_CHECKBOX == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 5 && 
												(
													<ListItem >
														<Switch
															trackColor={{ false: "red", true: "#C5DB5F" }}
															thumbColor={cbItem3 ? "#fff" : "#fff"}
															ios_backgroundColor="#fff"
															onValueChange={toggleSwitchItem5}
															value={cbItem5}
														/>
													</ListItem>	
												)
											}

											{ /* RADIO BUTTON ITEM 5 */ }
											{
												quesito.IND_RADIO == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 5  &&
												(
													quesito.componentes.radio.OPCOES.map((radio, i) => {
														return (
															<ListItem 
																key={radio.DES_OPCAO}
																onPress={() => setRbItem5(radio.COD_OPCAO)}
																selected={ rbItem5 == radio.COD_OPCAO ? true : false } >
																<Left>
																<Text>{radio.DES_OPCAO}</Text>
																</Left>
																<Right>
																<Radio
																	onPress={() => setRbItem5(radio.COD_OPCAO)}
																	color={"#f0ad5e"}
																	selectedColor={"#5cb85c"}
																	selected={ rbItem5 == radio.COD_OPCAO ? true : false }
																/>
																</Right>
															</ListItem>
														);
													})
												)
											}

											{ /* LIST BOX ITEM 5 */ }
											{
												quesito.IND_LISTA == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 5 &&
												(
													
														<Picker
															selectedValue={lbItem3}
															style={{ height: 50, margin:5, width: '100%'}}
															onValueChange={(itemValue, itemIndex) => setLbItem5(itemValue)}
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

											{ /* INPUT INTEIRO ITEM 5 */ }
											{
												quesito.IND_INTEIRO == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 5 && 
												(
													<Input 
														value={inputInteiroItem5}
														onChangeText={value => setInputInteiroItem5(value)}
														placeholder='Inteiro'
													/>
												)
											}

											{ /* INPUT TEXTO ITEM 5 */ }
											{
												quesito.IND_TEXTO == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 5 && 
												(
													<Input 
														value={inputTextoItem5}
														onChangeText={value => setInputTextoItem3(value)}
														placeholder='Observação'
													/>
												)
											}

											{/* INPUT TEXTO ITEM 5 */ }
											{
												quesito.IND_TEXTO == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 5 && 
												(
													<Input 
														value={inputDecimalItem5}
														onChangeText={value => setInputDecimalItem5(value)}
														placeholder='Decimal'
													/>
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