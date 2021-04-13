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
	const [list, setList] = useState([]);
	const [icon, setIcon] = useState("arrow-right");
	const [index, setIndex] = useState('');
	const [isExpanded, setIsExpanded] = useState(false);
	const [key, setKey] = useState('');
	const [quesitos, setQuesitos] = useState([]);

	//RADIO BUTTON 3
	const [rbComDefeito, setRbComDefeito] = useState(false);
	const [rbSemDefeito, setRbSemDefeito] = useState(true);
	const [rbNaoSabe, setRbNaoSabe] = useState(false);
	const [rbPossivelAvaria, setRbPossivelAvaria] = useState(false);

	//RADIO BUTTON 4
	const [rb44, setRb44] = useState(true);
	const [rb34, setRb34] = useState(false);
	const [rb12, setRb12] = useState(false);
	const [rb122, setRb122] = useState(false);

	//RADIO BUTTON 6
	const [rbComTranca6, setRbComTranca6] = useState(true);
	const [rbSemTranca6, setRbSemTranca6] = useState(false);
	const [rbAusente6, setRbAusente6] = useState(false);

	//RADIO BUTTON 7
	const [rbNormal7, setRbNormal7] = useState(true);
	const [rbComDefeito7, setRbComDefeito7] = useState(false);

	//RADIO BUTTON 8
	const [rbRapido8, setRbRapido8] = useState(true);
	const [rbLento8, setRbLento8] = useState(false);
	const [rbMuitoLento8, setRbMuitoLento8] = useState(false);
	const [rbNaoLiga8, setRbNaoLiga8] = useState(false);

	//RADIO BUTTON 10
	const [rbCarregando10, setRbCarregando10] = useState(true);
	const [rbnaoCarregando10, setRbnaoCarregando10] = useState(false);

	//RADIO BUTTON 11
	const [rbNormal11, setRbNormal11] = useState(true);
	const [rbnaoAcende11, setRbnaoAcende11] = useState(false);
	const [rbBaixo11, setRbBaixo11] = useState(false);

	//RADIO BUTTON 13
	const [rbNormal13, setRbNormal13] = useState(true);
	const [rbAusente13, setRbAusente13] = useState(false);
	const [rbComDefeito13, setRbComDefeito13] = useState(false);

	//RADIO BUTTON 14
	const [rbBomEstado14, setRbBomEstado14] = useState(true);
	const [rbTrocar14, setRbTrocar14] = useState(false);
	const [rbCritico14, setRbCritico14] = useState(false);

	//RADIO BUTTON 17
	const [rbNormal17, setRbNormal17] = useState(true);
	const [rbQuebrado17, setRbQuebrado17] = useState(false);
	const [rbAusente17, setRbAusente17] = useState(false);

	//RADIO BUTTON 18
	const [rbNormal18, setRbNormal18] = useState(true);
	const [rbQuebrado18, setRbQuebrado18] = useState(false);
	const [rbAusente18, setRbAusente18] = useState(false);

	//RADIO BUTTON 19
	const [rbNormal19, setRbNormal19] = useState(true);
	const [rbQuebrado19, setRbQuebrado19] = useState(false);
	const [rbAusente19, setRbAusente19] = useState(false);

	//RADIO BUTTON 20
	const [rbNormal20, setRbNormal20] = useState(true);
	const [rbRiscado20, setRbRiscado20] = useState(false);
	const [rbQuebrado20, setRbQuebrado20] = useState(false);
	const [rbAusente20, setRbAusente20] = useState(false);

	//RADIO BUTTON 25
	const [rbBomEstado25, setRbBomEstado25] = useState(true);
	const [rbTrocar25, setRbTrocar25] = useState(false);
	const [rbCritico25, setRbCritico25] = useState(false);

	//RADIO BUTTON 36
	const [rbBomEstado36, setRbBomEstado36] = useState(true);
	const [rbTrocar36, setRbTrocar36] = useState(false);
	const [rbCritico36, setRbCritico36] = useState(false);

	//RADIO BUTTON 37
	const [rbBomEstado37, setRbBomEstado37] = useState(true);
	const [rbTrocar37, setRbTrocar37] = useState(false);
	const [rbCritico37, setRbCritico37] = useState(false);

	//RADIO BUTTON 40
	const [rbNormal40, setRbNormal40] = useState(true);
	const [rbComDefeito40, setRbComDefeito40] = useState(false);

	//SWITCH
	const [isEnabled, setIsEnabled] = useState(false);
	const toggleSwitch = () => setIsEnabled(previousState => !previousState);
	const [isEnabled1, setIsEnabled1] = useState(false);
	const toggleSwitch1 = () => setIsEnabled1(previousState => !previousState);
	const [isEnabled2, setIsEnabled2] = useState(false);
	const toggleSwitch2 = () => setIsEnabled2(previousState => !previousState);
	const [isEnabled3, setIsEnabled3] = useState(false);
	const toggleSwitch3 = () => setIsEnabled3(previousState => !previousState);
	const [isEnabled4, setIsEnabled4] = useState(false);
	const toggleSwitch4 = () => setIsEnabled4(previousState => !previousState);

	//SELECT
	const [selectedValue, setSelectedValue] = useState("Selecione um item");

	//EQUIPAMENTO
	useEffect(() => { 
		//setQrCodeEquipamento('2432');
		setQrCodeEquipamento(props.navigation.getParam('qrCodeEquipamento'));
		setNomeEquipamento(props.navigation.getParam('nomeEquipamento'));
		setList([
			{ id: 1, title: "Geral", content: "Lorem ipsum dolor sit amet" },
			{ id: 2, title: "Mostradores", content: "Lorem ipsum dolor sit amet" },
			{ id: 3, title: "Motor", content: "Lorem ipsum dolor sit amet" },
			]
	  );
	}, []);

	//CARREGAR QUESITOS
	useEffect(() => { 

		async function carregarQuesitos(){
			setloading(true);
			//BUSCA EQUIPAMENTOS
			let respostaQuesitos = await buscarQuesitos();
			console.log(respostaQuesitos.resultado);
			if(respostaQuesitos.status){
				if(respostaQuesitos.resultado == "Chave invalida."){
					setloading(false);
					Alert.alert('Aviso', 'Chave de autenticação inválida.');
				}
				setloading(false);
				setQuesitos(respostaQuesitos.resultado);
			}else{
				setloading(false);
				Alert.alert('Aviso', respostaQuesitos.mensagem);
			}
		}

		//VERIFICA CONEXAO COM A INTERNET
		NetInfo.fetch().then(state => {
			if(state.isConnected){
				//carregarQuesitos();
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

			<Text style={styles.textoEquipamento}>{qrCodeEquipamento }</Text>
			<Text style={styles.textoEquipamento}>{'Equipamento: '+nomeEquipamento}</Text>
			<Text style={{ padding: 5}}>{'Último checkup: 14/04/2021 - 23:11:58'}</Text>
			<Text style={{ padding: 5}}>{'Último horímetro: 31445.2'}</Text>
			
			<View>
				<Collapse 
					isExpanded={false}
					>
					<CollapseHeader>
						<Separator style={{ backgroundColor: 'rgb(250,184,29)', height: 45, marginTop: 3 }} bordered >
						<Text > 
						<Icon
							name="plus"
							size={15}
							color="black"
						/>
						&nbsp;&nbsp;{'GERAL'}
						</Text>
						</Separator>
					</CollapseHeader>
					<CollapseBody>
						<View style={{ marginTop: 15 }}>
						<Text style={{fontSize: 18, marginLeft: 10}}>1. Horímetro anterior</Text>
							<Input 
								placeholder='0.0'
							/>
							<Text style={{fontSize: 18, marginLeft: 10}}>2. Horímetro atual</Text>
							<Input
								placeholder='0.0'
							/>
						</View>
					</CollapseBody>
				</Collapse>
				<Collapse 
					isExpanded={false}
					>
					<CollapseHeader>
						<Separator style={{ backgroundColor: 'rgb(250,184,29)', height: 45, marginTop: 3 }} bordered >
						<Text > 
						<Icon
							name="plus"
							size={15}
							color="black"
						/>
						&nbsp;&nbsp;{'MOSTRADORES'}
						</Text>
						</Separator>
					</CollapseHeader>
					<CollapseBody>
						<View style={{ marginTop: 15 }}>
							<Text style={{fontSize: 20, marginLeft: 10, marginBottom: 10, fontWeight: 'bold' }}>Horímetro</Text>
							<Text style={{fontSize: 18, marginLeft: 10}}>3. Estado do horímetro </Text>
							<ListItem 
								onPress={ () => { setRbComDefeito(true); setRbSemDefeito(false); setRbNaoSabe(false); setRbPossivelAvaria(false); } }
								selected={rbComDefeito} >
								<Left>
								<Text>Com defeito</Text>
								</Left>
								<Right>
								<Radio
									onPress={ () => { setRbComDefeito(true); setRbSemDefeito(false); setRbNaoSabe(false); setRbPossivelAvaria(false); } }
									color={"#f0ad4e"}
									selectedColor={"#5cb85c"}
									selected={rbComDefeito}
								/>
								</Right>
							</ListItem>
							<ListItem 
								onPress={ () => { setRbComDefeito(false); setRbSemDefeito(true); setRbNaoSabe(false); setRbPossivelAvaria(false); } }
								selected={rbSemDefeito} >
								<Left>
								<Text>Sem defeito</Text>
								</Left>
								<Right>
								<Radio
									onPress={ () => { setRbComDefeito(false); setRbSemDefeito(true); setRbNaoSabe(false); setRbPossivelAvaria(false); } }
									color={"#f0ad4e"}
									selectedColor={"#5cb85c"}
									selected={rbSemDefeito}
								/>
								</Right>
							</ListItem>
							<ListItem 
								onPress={ () => { setRbComDefeito(false); setRbSemDefeito(false); setRbNaoSabe(true); setRbPossivelAvaria(false); } }
								selected={rbNaoSabe} >
								<Left>
								<Text>Não sabe</Text>
								</Left>
								<Right>
								<Radio
									onPress={ () => { setRbComDefeito(false); setRbSemDefeito(false); setRbNaoSabe(true); setRbPossivelAvaria(false); } }
									color={"#f0ad4e"}
									selectedColor={"#5cb85c"}
									selected={rbNaoSabe}
								/>
								</Right>
							</ListItem>
							<ListItem 
								onPress={ () => { setRbComDefeito(false); setRbSemDefeito(false); setRbNaoSabe(false); setRbPossivelAvaria(true); } }
								selected={rbPossivelAvaria} >
								<Left>
								<Text>Possível avaria</Text>
								</Left>
								<Right>
								<Radio
									onPress={ () => { setRbComDefeito(false); setRbSemDefeito(false); setRbNaoSabe(false); setRbPossivelAvaria(true); } }
									color={"#f0ad4e"}
									selectedColor={"#5cb85c"}
									selected={rbPossivelAvaria}
								/>
								</Right>
							</ListItem>
							<Text style={{fontSize: 20, marginTop: 10, marginLeft: 10, marginBottom: 10, fontWeight: 'bold' }}>Combustível</Text>
							<Text style={{fontSize: 18, marginLeft: 10}}>4. Ponteiro no último abasecimento </Text>
							<ListItem 
								onPress={ () => { setRb44(true); setRb34(false); setRb12(false); setRb122(false); } }
								selected={rb44} >
								<Left>
								<Text>4/4</Text>
								</Left>
								<Right>
								<Radio
									onPress={ () => { setRb44(true); setRb34(false); setRb12(false); setRb122(false); } }
									color={"#f0ad4e"}
									selectedColor={"#5cb85c"}
									selected={rb44}
								/>
								</Right>
							</ListItem>
							<ListItem 
								onPress={ () => { setRb44(false); setRb34(true); setRb12(false); setRb122(false); } }
								selected={rb34} >
								<Left>
								<Text>3/4</Text>
								</Left>
								<Right>
								<Radio
									onPress={ () => { setRb44(false); setRb34(true); setRb12(false); setRb122(false); } }
									color={"#f0ad4e"}
									selectedColor={"#5cb85c"}
									selected={rb34}
								/>
								</Right>
							</ListItem>
							<ListItem 
								onPress={ () => { setRb44(false); setRb34(false); setRb12(true); setRb122(false); } }
								selected={rb12} >
								<Left>
								<Text>1/2</Text>
								</Left>
								<Right>
								<Radio
									onPress={ () => { setRb44(false); setRb34(false); setRb12(true); setRb122(false); } }
									color={"#f0ad4e"}
									selectedColor={"#5cb85c"}
									selected={rb12}
								/>
								</Right>
							</ListItem>
							<ListItem 
								onPress={ () => { setRb44(false); setRb34(false); setRb12(false); setRb122(true); } }
								selected={rb122} >
								<Left>
								<Text>{'< 1/2'}</Text>
								</Left>
								<Right>
								<Radio
									onPress={ () => { setRb44(false); setRb34(false); setRb12(false); setRb122(true); } }
									onPress={ () => console.log('aaa') }
									color={"#f0ad4e"}
									selectedColor={"#5cb85c"}
									selected={rb122}
								/>
								</Right>
							</ListItem>
							<Text style={{fontSize: 18, marginTop:10, marginLeft: 10}}>5. Ponteiro se alterou </Text>
							<ListItem >
							<Switch
								trackColor={{ false: "red", true: "#C5DB5F" }}
								thumbColor={isEnabled ? "#fff" : "#fff"}
								ios_backgroundColor="#fff"
								onValueChange={toggleSwitch}
								value={isEnabled}
							/>
							</ListItem>
						</View>
					</CollapseBody>
				</Collapse>
				<Collapse 
					isExpanded={false}
					>
					<CollapseHeader>
						<Separator style={{ backgroundColor: 'rgb(250,184,29)', height: 45, marginTop: 3 }} bordered >
						<Text > 
						<Icon
							name="plus"
							size={15}
							color="black"
						/>
						&nbsp;&nbsp;{'MOTOR'}
						</Text>
						</Separator>
					</CollapseHeader>
					<CollapseBody>
						<View style={{ marginTop: 15 }}>
							<Text style={{fontSize: 20, marginLeft: 10, marginBottom: 10, fontWeight: 'bold' }}>Tanque</Text>
							<Text style={{fontSize: 18, marginLeft: 10}}>6. Tampa de combustível </Text>
							<ListItem 
								onPress={ () => { setRbComTranca6(true); setRbSemTranca6(false); setRbAusente6(false); } }
								selected={rbComTranca6} >
								<Left>
								<Text>Com tranca</Text>
								</Left>
								<Right>
								<Radio
									onPress={ () => { setRbComTranca6(true); setRbSemTranca6(false); setRbAusente6(false); } }
									color={"#f0ad4e"}
									selectedColor={"#5cb85c"}
									selected={rbComTranca6}
								/>
								</Right>
							</ListItem>
							<ListItem 
								onPress={ () => { setRbComTranca6(false); setRbSemTranca6(true); setRbAusente6(false); } }
								selected={rbSemTranca6} >
								<Left>
								<Text>Sem tranca</Text>
								</Left>
								<Right>
								<Radio
									onPress={ () => { setRbComTranca6(false); setRbSemTranca6(true); setRbAusente6(false); } }
									color={"#f0ad4e"}
									selectedColor={"#5cb85c"}
									selected={rbSemTranca6}
								/>
								</Right>
							</ListItem>
							<ListItem 
								onPress={ () => { setRbComTranca6(false); setRbSemTranca6(false); setRbAusente6(true); } }
								selected={rbAusente6} >
								<Left>
								<Text>Ausente</Text>
								</Left>
								<Right>
								<Radio
									onPress={ () => { setRbComTranca6(false); setRbSemTranca6(false); setRbAusente6(true); } }
									color={"#f0ad4e"}
									selectedColor={"#5cb85c"}
									selected={rbAusente6}
								/>
								</Right>
							</ListItem>
							<Text style={{fontSize: 18,  marginTop:10,marginLeft: 10}}>7. Boia do tanque </Text>
							<ListItem 
								onPress={ () => { setRbNormal7(true); setRbComDefeito7(false); } }
								selected={rbNormal7} >
								<Left>
								<Text>Normal</Text>
								</Left>
								<Right>
								<Radio
									onPress={ () => { setRbNormal7(true); setRbComDefeito7(false); } }
									color={"#f0ad4e"}
									selectedColor={"#5cb85c"}
									selected={rbNormal7}
								/>
								</Right>
							</ListItem>
							<ListItem 
								onPress={ () => { setRbNormal7(false); setRbComDefeito7(true); } }
								selected={rbComDefeito7} >
								<Left>
								<Text>Com defeito</Text>
								</Left>
								<Right>
								<Radio
									onPress={ () => { setRbNormal7(false); setRbComDefeito7(true); } }
									color={"#f0ad4e"}
									selectedColor={"#5cb85c"}
									selected={rbComDefeito7}
								/>
								</Right>
							</ListItem>
							<Text style={{fontSize: 20, marginTop:10, marginLeft: 10, marginBottom: 10, fontWeight: 'bold' }}>Partida</Text>
							<Text style={{fontSize: 18, marginLeft: 10}}>8. Teste de ignição </Text>
							<ListItem 
								onPress={ () => { setRbRapido8(true); setRbLento8(false); setRbMuitoLento8(false); setRbNaoLiga8(false); } }
								selected={rbRapido8} >
								<Left>
								<Text>Rápido</Text>
								</Left>
								<Right>
								<Radio
									onPress={ () => { setRbRapido8(true); setRbLento8(false); setRbMuitoLento8(false); setRbNaoLiga8(false); } }
									color={"#f0ad4e"}
									selectedColor={"#5cb85c"}
									selected={rbRapido8}
								/>
								</Right>
							</ListItem>
							<ListItem 
								onPress={ () => { setRbRapido8(false); setRbLento8(true); setRbMuitoLento8(false); setRbNaoLiga8(false); } }
								selected={rbLento8} >
								<Left>
								<Text>Lento</Text>
								</Left>
								<Right>
								<Radio
									onPress={ () => { setRbRapido8(false); setRbLento8(true); setRbMuitoLento8(false); setRbNaoLiga8(false); } }
									color={"#f0ad4e"}
									selectedColor={"#5cb85c"}
									selected={rbLento8}
								/>
								</Right>
							</ListItem>
							<ListItem 
								onPress={ () => { setRbRapido8(false); setRbLento8(false); setRbMuitoLento8(true); setRbNaoLiga8(false); } }
								selected={rbMuitoLento8} >
								<Left>
								<Text>Muito lento</Text>
								</Left>
								<Right>
								<Radio
									onPress={ () => { setRbRapido8(false); setRbLento8(false); setRbMuitoLento8(true); setRbNaoLiga8(false); } }
									color={"#f0ad4e"}
									selectedColor={"#5cb85c"}
									selected={rbMuitoLento8}
								/>
								</Right>
							</ListItem>
							<ListItem 
								onPress={ () => { setRbRapido8(false); setRbLento8(false); setRbMuitoLento8(false); setRbNaoLiga8(true); } }
								selected={rbNaoLiga8} >
								<Left>
								<Text>Não liga</Text>
								</Left>
								<Right>
								<Radio
									onPress={ () => { setRbRapido8(false); setRbLento8(false); setRbMuitoLento8(false); setRbNaoLiga8(true); } }
									color={"#f0ad4e"}
									selectedColor={"#5cb85c"}
									selected={rbNaoLiga8}
								/>
								</Right>
							</ListItem>
						</View>
					</CollapseBody>
				</Collapse>
				<Collapse 
					isExpanded={false}
					>
					<CollapseHeader>
						<Separator style={{ backgroundColor: 'rgb(250,184,29)', height: 45, marginTop: 3 }} bordered >
						<Text > 
						<Icon
							name="plus"
							size={15}
							color="black"
						/>
						&nbsp;&nbsp;{'ELÉTRICA'}
						</Text>
						</Separator>
					</CollapseHeader>
					<CollapseBody>
						<View style={{ marginTop: 15 }}>
							<Text style={{fontSize: 20, marginLeft: 10, marginBottom: 10, fontWeight: 'bold' }}>Partida</Text>
							<Text style={{fontSize: 18, marginLeft: 10}}>9. Carga da bateria </Text>
							<Picker
								selectedValue={selectedValue}
								style={{ height: 50, width: '100%'}}
								onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
							>
								<Picker.Item label="> 90 %" value="1" />
								<Picker.Item label="> 70 %" value="2" />
								<Picker.Item label="> 50 %" value="3" />
								<Picker.Item label="> 30 %" value="4" />
							</Picker>
							<Text style={{fontSize: 18, marginLeft: 10}}>10. Alternador </Text>
							<ListItem 
								onPress={ () => { setRbCarregando10(true); setRbnaoCarregando10(false); } }
								selected={rbCarregando10} >
								<Left>
								<Text>Carregando</Text>
								</Left>
								<Right>
								<Radio
									onPress={ () => { setRbCarregando10(true); setRbnaoCarregando10(false); } }
									color={"#f0ad4e"}
									selectedColor={"#5cb85c"}
									selected={rbCarregando10}
								/>
								</Right>
							</ListItem>
							<ListItem 
								onPress={ () => { setRbCarregando10(false); setRbnaoCarregando10(true); } } 
								selected={rbnaoCarregando10} >
								<Left>
								<Text>Não carrega</Text>
								</Left>
								<Right>
								<Radio
									onPress={ () => { setRbCarregando10(false); setRbnaoCarregando10(true); } } 
									color={"#f0ad4e"}
									selectedColor={"#5cb85c"}
									selected={rbnaoCarregando10}
								/>
								</Right>
							</ListItem>
							<Text style={{fontSize: 20, marginTop:10, marginLeft: 10, marginBottom: 10, fontWeight: 'bold' }}>Segurança</Text>
							<Text style={{fontSize: 18, marginLeft: 10}}>11. Iluminação e alerta de atenção </Text>
							<ListItem 
								onPress={() =>{ setRbNormal11(true); setRbnaoAcende11(false); setRbBaixo11(false); } }
								selected={rbNormal11} >
								<Left>
								<Text>Normal</Text>
								</Left>
								<Right>
								<Radio
									onPress={() =>{ setRbNormal11(true); setRbnaoAcende11(false); setRbBaixo11(false); } }
									color={"#f0ad4e"}
									selectedColor={"#5cb85c"}
									selected={rbNormal11}
								/>
								</Right>
							</ListItem>
							<ListItem 
								onPress={() =>{ setRbNormal11(false); setRbnaoAcende11(true); setRbBaixo11(false); } }
								selected={rbnaoAcende11} >
								<Left>
								<Text>Não acende</Text>
								</Left>
								<Right>
								<Radio
									onPress={() =>{ setRbNormal11(false); setRbnaoAcende11(true); setRbBaixo11(false); } }
									color={"#f0ad4e"}
									selectedColor={"#5cb85c"}
									selected={rbnaoAcende11}
								/>
								</Right>
							</ListItem>
							<ListItem 
								onPress={() =>{ setRbNormal11(false); setRbnaoAcende11(false); setRbBaixo11(true); } }
								selected={rbBaixo11} >
								<Left>
								<Text>Baixo</Text>
								</Left>
								<Right>
								<Radio
									onPress={() =>{ setRbNormal11(false); setRbnaoAcende11(false); setRbBaixo11(true); } }
									color={"#f0ad4e"}
									selectedColor={"#5cb85c"}
									selected={rbBaixo11}
								/>
								</Right>
							</ListItem>
							<Text style={{fontSize: 18, marginTop:10, marginLeft: 10}}>13. Buzina e sinalizador </Text>
							<ListItem 
								onPress={ () => { setRbNormal13(true); setRbAusente13(false); setRbComDefeito13(false);  } }
								selected={rbNormal13} >
								<Left>
								<Text>Normal</Text>
								</Left>
								<Right>
								<Radio
									onPress={ () => { setRbNormal13(true); setRbAusente13(false); setRbComDefeito13(false);  } }
									color={"#f0ad4e"}
									selectedColor={"#5cb85c"}
									selected={rbNormal13}
								/>
								</Right>
							</ListItem>
							<ListItem 
								onPress={ () => { setRbNormal13(false); setRbAusente13(true); setRbComDefeito13(false);  } }
								selected={rbAusente13} >
								<Left>
								<Text>Ausente</Text>
								</Left>
								<Right>
								<Radio
									onPress={ () => { setRbNormal13(false); setRbAusente13(true); setRbComDefeito13(false);  } }
									color={"#f0ad4e"}
									selectedColor={"#5cb85c"}
									selected={rbAusente13}
								/>
								</Right>
							</ListItem>
							<ListItem 
								onPress={ () => { setRbNormal13(false); setRbAusente13(false); setRbComDefeito13(true);  } }
								selected={rbComDefeito13} >
								<Left>
								<Text>Com defeito</Text>
								</Left>
								<Right>
								<Radio
									onPress={ () => { setRbNormal13(false); setRbAusente13(false); setRbComDefeito13(true);  } }
									color={"#f0ad4e"}
									selectedColor={"#5cb85c"}
									selected={rbComDefeito13}
								/>
								</Right>
							</ListItem>
							<Text style={{fontSize: 18, marginTop:10, marginLeft: 10}}>14. Correia do alternador e motor </Text>
							<ListItem 
								onPress={ () => { setRbBomEstado14(true); setRbTrocar14(false); setRbCritico14(false); } }
								selected={rbBomEstado14} >
								<Left>
								<Text>Bom estado</Text>
								</Left>
								<Right>
								<Radio
									onPress={ () => { setRbBomEstado14(true); setRbTrocar14(false); setRbCritico14(false); } }
									color={"#f0ad4e"}
									selectedColor={"#5cb85c"}
									selected={rbBomEstado14}
								/>
								</Right>
							</ListItem>
							<ListItem 
								onPress={ () => { setRbBomEstado14(false); setRbTrocar14(true); setRbCritico14(false); } }
								selected={rbTrocar14} >
								<Left>
								<Text>Trocar</Text>
								</Left>
								<Right>
								<Radio
									onPress={ () => { setRbBomEstado14(false); setRbTrocar14(true); setRbCritico14(false); } }
									color={"#f0ad4e"}
									selectedColor={"#5cb85c"}
									selected={rbTrocar14}
								/>
								</Right>
							</ListItem>
							<ListItem 
								onPress={ () => { setRbBomEstado14(false); setRbTrocar14(false); setRbCritico14(true); } }
								selected={rbCritico14} >
								<Left>
								<Text>Crítico</Text>
								</Left>
								<Right>
								<Radio
									onPress={ () => { setRbBomEstado14(false); setRbTrocar14(false); setRbCritico14(true); } }
									color={"#f0ad4e"}
									selectedColor={"#5cb85c"}
									selected={rbCritico14}
								/>
								</Right>
							</ListItem>
						</View>
					</CollapseBody>
				</Collapse>
				<Collapse 
					isExpanded={false}
					>
					<CollapseHeader>
						<Separator style={{ backgroundColor: 'rgb(250,184,29)', height: 45, marginTop: 3 }} bordered >
						<Text > 
						<Icon
							name="plus"
							size={15}
							color="black"
						/>
						&nbsp;&nbsp;{'VIDROS / ESPELHOS'}
						</Text>
						</Separator>
					</CollapseHeader>
					<CollapseBody>
						<View style={{ marginTop: 15 }}>
							<Text style={{fontSize: 20, marginLeft: 10, marginBottom: 10, fontWeight: 'bold' }}>Outros</Text>
							<Text style={{fontSize: 18, marginLeft: 10}}>17. Retrovisor esquerdo </Text>
							<ListItem 
								onPress={ () => { setRbNormal17(true); setRbQuebrado17(false); setRbAusente17(false); } }
								selected={rbNormal17} >
								<Left>
								<Text>Normal</Text>
								</Left>
								<Right>
								<Radio
									onPress={ () => { setRbNormal17(true); setRbQuebrado17(false); setRbAusente17(false); } }
									color={"#f0ad4e"}
									selectedColor={"#5cb85c"}
									selected={rbNormal17}
								/>
								</Right>
							</ListItem>
							<ListItem 
								onPress={ () => { setRbNormal17(false); setRbQuebrado17(true); setRbAusente17(false); } }
								selected={rbQuebrado17} >
								<Left>
								<Text>Quebrado</Text>
								</Left>
								<Right>
								<Radio
									onPress={ () => { setRbNormal17(false); setRbQuebrado17(true); setRbAusente17(false); } }
									color={"#f0ad4e"}
									selectedColor={"#5cb85c"}
									selected={rbQuebrado17}
								/>
								</Right>
							</ListItem>
							<ListItem 
								onPress={ () => { setRbNormal17(false); setRbQuebrado17(false); setRbAusente17(true); } }
								selected={rbAusente17} >
								<Left>
								<Text>Ausente</Text>
								</Left>
								<Right>
								<Radio
									onPress={ () => { setRbNormal17(false); setRbQuebrado17(false); setRbAusente17(true); } }
									color={"#f0ad4e"}
									selectedColor={"#5cb85c"}
									selected={rbAusente17}
								/>
								</Right>
							</ListItem>
							<Text style={{fontSize: 18, marginTop:10, marginLeft: 10}}>18. Retrovisor direito </Text>
							<ListItem 
								onPress={ () => { setRbNormal18(true); setRbQuebrado18(false); setRbAusente18(false); } }
								selected={rbNormal18} >
								<Left>
								<Text>Normal</Text>
								</Left>
								<Right>
								<Radio
									onPress={ () => { setRbNormal18(true); setRbQuebrado18(false); setRbAusente18(false); } }
									color={"#f0ad4e"}
									selectedColor={"#5cb85c"}
									selected={rbNormal18}
								/>
								</Right>
							</ListItem>
							<ListItem 
								onPress={ () => { setRbNormal18(false); setRbQuebrado18(true); setRbAusente18(false); } }
								selected={rbQuebrado18} >
								<Left>
								<Text>Quebrado</Text>
								</Left>
								<Right>
								<Radio
									onPress={ () => { setRbNormal18(false); setRbQuebrado18(true); setRbAusente18(false); } }
									color={"#f0ad4e"}
									selectedColor={"#5cb85c"}
									selected={rbQuebrado18}
								/>
								</Right>
							</ListItem>
							<ListItem 
								onPress={ () => { setRbNormal18(false); setRbQuebrado18(false); setRbAusente18(true); } }
								selected={rbAusente18} >
								<Left>
								<Text>Ausente</Text>
								</Left>
								<Right>
								<Radio
									onPress={ () => { setRbNormal18(false); setRbQuebrado18(false); setRbAusente18(true); } }
									color={"#f0ad4e"}
									selectedColor={"#5cb85c"}
									selected={rbAusente18}
								/>
								</Right>
							</ListItem>
							<Text style={{fontSize: 18, marginTop:10, marginLeft: 10}}>19. Retrovisor interno </Text>
							<ListItem 
								onPress={ () => { setRbNormal19(true); setRbQuebrado19(false); setRbAusente19(false); } }
								selected={rbNormal19} >
								<Left>
								<Text>Normal</Text>
								</Left>
								<Right>
								<Radio
									onPress={ () => { setRbNormal19(true); setRbQuebrado19(false); setRbAusente19(false); } }
									color={"#f0ad4e"}
									selectedColor={"#5cb85c"}
									selected={rbNormal19}
								/>
								</Right>
							</ListItem>
							<ListItem 
								onPress={ () => { setRbNormal19(false); setRbQuebrado19(true); setRbAusente19(false); } }
								selected={rbQuebrado19} >
								<Left>
								<Text>Quebrado</Text>
								</Left>
								<Right>
								<Radio
									onPress={ () => { setRbNormal19(false); setRbQuebrado19(true); setRbAusente19(false); } }
									color={"#f0ad4e"}
									selectedColor={"#5cb85c"}
									selected={rbQuebrado19}
								/>
								</Right>
							</ListItem>
							<ListItem 
								onPress={ () => { setRbNormal19(false); setRbQuebrado19(false); setRbAusente19(true); } }
								selected={rbAusente19} >
								<Left>
								<Text>Ausente</Text>
								</Left>
								<Right>
								<Radio
									onPress={ () => { setRbNormal19(false); setRbQuebrado19(false); setRbAusente19(true); } }
									color={"#f0ad4e"}
									selectedColor={"#5cb85c"}
									selected={rbAusente19}
								/>
								</Right>
							</ListItem>
							<Text style={{fontSize: 18, marginTop: 10, marginLeft: 10}}>20. Para-brisa </Text>
							<ListItem 
								onPress={ () => { setRbNormal20(true); setRbRiscado20(false); setRbQuebrado20(false); setRbAusente20(false); } }
								selected={rbNormal20} >
								<Left>
								<Text>Normal</Text>
								</Left>
								<Right>
								<Radio
									onPress={ () => { setRbNormal20(true); setRbRiscado20(false); setRbQuebrado20(false); setRbAusente20(false); } }
									color={"#f0ad4e"}
									selectedColor={"#5cb85c"}
									selected={rbNormal20}
								/>
								</Right>
							</ListItem>
							<ListItem 
								onPress={ () => { setRbNormal20(false); setRbRiscado20(true); setRbQuebrado20(false); setRbAusente20(false); } }
								selected={rbRiscado20} >
								<Left>
								<Text>Riscado</Text>
								</Left>
								<Right>
								<Radio
									onPress={ () => { setRbNormal20(false); setRbRiscado20(true); setRbQuebrado20(false); setRbAusente20(false); } }
									color={"#f0ad4e"}
									selectedColor={"#5cb85c"}
									selected={rbRiscado20}
								/>
								</Right>
							</ListItem>
							<ListItem 
								onPress={ () => { setRbNormal20(false); setRbRiscado20(false); setRbQuebrado20(true); setRbAusente20(false); } }
								selected={rbQuebrado20} >
								<Left>
								<Text>Trincado</Text>
								</Left>
								<Right>
								<Radio
									onPress={ () => { setRbNormal20(false); setRbRiscado20(false); setRbQuebrado20(true); setRbAusente20(false); } }
									color={"#f0ad4e"}
									selectedColor={"#5cb85c"}
									selected={rbQuebrado20}
								/>
								</Right>
							</ListItem>
							<ListItem 
								onPress={ () => { setRbNormal20(false); setRbRiscado20(false); setRbQuebrado20(false); setRbAusente20(true); } }
								selected={rbAusente20} >
								<Left>
								<Text>Ausente</Text>
								</Left>
								<Right>
								<Radio
									onPress={ () => { setRbNormal20(false); setRbRiscado20(false); setRbQuebrado20(false); setRbAusente20(true); } }
									color={"#f0ad4e"}
									selectedColor={"#5cb85c"}
									selected={rbAusente20}
								/>
								</Right>
							</ListItem>
						</View>
					</CollapseBody>
				</Collapse>
				<Collapse 
					isExpanded={false}
					>
					<CollapseHeader>
						<Separator style={{ backgroundColor: 'rgb(250,184,29)', height: 45, marginTop: 3 }} bordered >
						<Text > 
						<Icon
							name="plus"
							size={15}
							color="black"
						/>
						&nbsp;&nbsp;{'PNEUS'}
						</Text>
						</Separator>
					</CollapseHeader>
					<CollapseBody>
						<View style={{ marginTop: 15 }}>
						<Picker
							selectedValue={selectedValue}
							style={{ height: 50, width: '100%'}}
							onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
						>
							<Picker.Item label="Dianteiro" value="1" />
							<Picker.Item label="Traseiro" value="2" />
						</Picker>
						<ListItem 
								onPress={ () => { setRbCarregando10(true); setRbnaoCarregando10(false); } }
								selected={rbCarregando10} >
								<Left>
								<Text>Esquerdo</Text>
								</Left>
								<Right>
								<Radio
									onPress={ () => { setRbCarregando10(true); setRbnaoCarregando10(false); } }
									color={"#f0ad4e"}
									selectedColor={"#5cb85c"}
									selected={rbCarregando10}
								/>
								</Right>
							</ListItem>
							<ListItem 
								onPress={ () => { setRbCarregando10(false); setRbnaoCarregando10(true); } }
								selected={rbnaoCarregando10} >
								<Left>
								<Text>Direito</Text>
								</Left>
								<Right>
								<Radio
									onPress={ () => { setRbCarregando10(false); setRbnaoCarregando10(true); } }
									color={"#f0ad4e"}
									selectedColor={"#5cb85c"}
									selected={rbnaoCarregando10}
								/>
								</Right>
							</ListItem>
							<Text style={{fontSize: 18, marginTop:10, marginLeft: 10}}>21. Pneu calibrado corretamente </Text>
							<ListItem >
							<Switch
								trackColor={{ false: "red", true: "#C5DB5F" }}
								thumbColor={isEnabled1 ? "#fff" : "#fff"}
								ios_backgroundColor="#fff"
								onValueChange={toggleSwitch1}
								value={isEnabled1}
							/>
							</ListItem>
							<Text style={{fontSize: 18, marginLeft: 10}}>22. Profundidade do sulco (mm)</Text>
							<Input 
								placeholder=''
							/>
							<Text style={{fontSize: 18, marginTop:-5, marginLeft: 10}}>23. Pneu com bolha </Text>
							<ListItem >
							<Switch
								trackColor={{ false: "red", true: "#C5DB5F" }}
								thumbColor={isEnabled2 ? "#fff" : "#fff"}
								ios_backgroundColor="#fff"
								onValueChange={toggleSwitch2}
								value={isEnabled2}
							/>
							</ListItem>
							<Text style={{fontSize: 18, marginTop:-5, marginLeft: 10}}>24. Desgaste irregular da banda </Text>
							<ListItem >
							<Switch
								trackColor={{ false: "red", true: "#C5DB5F" }}
								thumbColor={isEnabled ? "#fff" : "#fff"}
								ios_backgroundColor="#fff"
								onValueChange={toggleSwitch}
								value={isEnabled}
							/>
							</ListItem>
							<Text style={{fontSize: 20, marginTop: 10, marginLeft: 10, marginBottom: 10, fontWeight: 'bold' }}>Segurança</Text>
							<Text style={{fontSize: 18, marginLeft: 10}}>25. Desgaste - avaliação geral </Text>
							<ListItem 
								onPress={() => { setRbBomEstado25(true); setRbTrocar25(false); setRbCritico25(false); } }
								selected={rbBomEstado25} >
								<Left>
								<Text>Bom estado</Text>
								</Left>
								<Right>
								<Radio
									onPress={() => { setRbBomEstado25(true); setRbTrocar25(false); setRbCritico25(false); } }
									color={"#f0ad4e"}
									selectedColor={"#5cb85c"}
									selected={rbBomEstado25}
								/>
								</Right>
							</ListItem>
							<ListItem 
								onPress={() => { setRbBomEstado25(false); setRbTrocar25(true); setRbCritico25(false); } }
								selected={rbTrocar25} >
								<Left>
								<Text>Trocar</Text>
								</Left>
								<Right>
								<Radio
									onPress={() => { setRbBomEstado25(false); setRbTrocar25(true); setRbCritico25(false); } }
									color={"#f0ad4e"}
									selectedColor={"#5cb85c"}
									selected={rbTrocar25}
								/>
								</Right>
							</ListItem>
							<ListItem 
								onPress={() => { setRbBomEstado25(false); setRbTrocar25(false); setRbCritico25(true); } }
								selected={rbCritico25} >
								<Left>
								<Text>Crítico</Text>
								</Left>
								<Right>
								<Radio
									onPress={() => { setRbBomEstado25(false); setRbTrocar25(false); setRbCritico25(true); } }
									color={"#f0ad4e"}
									selectedColor={"#5cb85c"}
									selected={rbCritico25}
								/>
								</Right>
							</ListItem>
						</View>
					</CollapseBody>
				</Collapse>
				<Collapse 
					isExpanded={false}
					>
					<CollapseHeader>
						<Separator style={{ backgroundColor: 'rgb(250,184,29)', height: 45, marginTop: 3 }} bordered >
						<Text > 
						<Icon
							name="plus"
							size={15}
							color="black"
						/>
						&nbsp;&nbsp;{'LATARIA'}
						</Text>
						</Separator>
					</CollapseHeader>
					<CollapseBody>
						<View style={{ marginTop: 15 }}>
						<Text style={{fontSize: 20, marginLeft: 10, marginBottom: 10, fontWeight: 'bold' }}>Outros</Text>
						<Text style={{fontSize: 18, marginLeft: 10}}>26. Amassados e riscos severos </Text>
						<Picker
							selectedValue={selectedValue}
							style={{ height: 50, width: '100%'}}
							onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
						>
							<Picker.Item label="Parachoque dianteiro" value="1" />
							<Picker.Item label="Parachoque traseiro" value="2" />
						</Picker>
						<Text style={{fontSize: 18, marginLeft: 10}}>27. Ferrugem / Bolhas / Queimado de sol </Text>
						<Picker
							selectedValue={selectedValue}
							style={{ height: 50, width: '100%'}}
							onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
						>
							<Picker.Item label="Parachoque dianteiro" value="1" />
							<Picker.Item label="Parachoque traseiro" value="2" />
						</Picker>
						<Text style={{fontSize: 18, marginTop:-5, marginLeft: 10}}>28. Número equipamento visível </Text>
						<ListItem >
						<Switch
							trackColor={{ false: "red", true: "#C5DB5F" }}
							thumbColor={isEnabled3 ? "#fff" : "#fff"}
							ios_backgroundColor="#fff"
							onValueChange={toggleSwitch3}
							value={isEnabled3}
						/>
						</ListItem>
						<Text style={{fontSize: 18, marginTop:-5, marginLeft: 10}}>29. Veículo sujo </Text>
						<ListItem >
						<Switch
							trackColor={{ false: "red", true: "#C5DB5F" }}
							thumbColor={isEnabled4 ? "#fff" : "#fff"}
							ios_backgroundColor="#fff"
							onValueChange={toggleSwitch4}
							value={isEnabled4}
						/>
						</ListItem>
						</View>
					</CollapseBody>
				</Collapse>
				<Collapse 
					isExpanded={false}
					>
					<CollapseHeader>
						<Separator style={{ backgroundColor: 'rgb(250,184,29)', height: 45, marginTop: 3 }} bordered >
						<Text > 
						<Icon
							name="plus"
							size={15}
							color="black"
						/>
						&nbsp;&nbsp;{'FLUÍDOS'}
						</Text>
						</Separator>
					</CollapseHeader>
					<CollapseBody>
						<View style={{ marginTop: 15 }}>
						<Text style={{fontSize: 20, marginLeft: 10, marginBottom: 10, fontWeight: 'bold' }}>Preventivo</Text>
						<Text style={{fontSize: 18, marginLeft: 10}}>30. Óleo do motor </Text>
						<Picker
							selectedValue={selectedValue}
							style={{ height: 50, width: '100%'}}
							onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
						>
							<Picker.Item label="4/4" value="1" />
							<Picker.Item label="3/4" value="2" />
							<Picker.Item label="2/4" value="3" />
						</Picker>
						<Text style={{fontSize: 18, marginLeft: 10}}>31. Fluído de freio </Text>
						<Picker
							selectedValue={selectedValue}
							style={{ height: 50, width: '100%'}}
							onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
						>
							<Picker.Item label="4/4" value="1" />
							<Picker.Item label="3/4" value="2" />
							<Picker.Item label="2/4" value="3" />
						</Picker>
						<Text style={{fontSize: 18, marginLeft: 10}}>32. Fluído de transmissão </Text>
						<Picker
							selectedValue={selectedValue}
							style={{ height: 50, width: '100%'}}
							onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
						>
							<Picker.Item label="4/4" value="1" />
							<Picker.Item label="3/4" value="2" />
							<Picker.Item label="2/4" value="3" />
						</Picker>
						<Text style={{fontSize: 18, marginLeft: 10}}>33. Fluído de hidráulico </Text>
						<Picker
							selectedValue={selectedValue}
							style={{ height: 50, width: '100%'}}
							onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
						>
							<Picker.Item label="4/4" value="1" />
							<Picker.Item label="3/4" value="2" />
							<Picker.Item label="2/4" value="3" />
						</Picker>
						<Text style={{fontSize: 18, marginLeft: 10}}>34. Fluído de arrefecimento </Text>
						<Picker
							selectedValue={selectedValue}
							style={{ height: 50, width: '100%'}}
							onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
						>
							<Picker.Item label="4/4" value="1" />
							<Picker.Item label="3/4" value="2" />
							<Picker.Item label="2/4" value="3" />
						</Picker>
						<Text style={{fontSize: 20, marginLeft: 10, marginBottom: 10, fontWeight: 'bold' }}>Segurança</Text>
						<Text style={{fontSize: 18, marginLeft: 10}}>35. Vazamentos </Text>
						<Picker
							selectedValue={selectedValue}
							style={{ height: 50, width: '100%'}}
							onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
						>
							<Picker.Item label="Óleo do motor" value="1" />
							<Picker.Item label="Água" value="2" />
						</Picker>
						</View>
					</CollapseBody>
				</Collapse>
				<Collapse 
					isExpanded={false}
					>
					<CollapseHeader>
						<Separator style={{ backgroundColor: 'rgb(250,184,29)', height: 45, marginTop: 3 }} bordered >
						<Text > 
						<Icon
							name="plus"
							size={15}
							color="black"
						/>
						&nbsp;&nbsp;{'FREIOS'}
						</Text>
						</Separator>
					</CollapseHeader>
					<CollapseBody>
						<View style={{ marginTop: 15 }}>
							<Text style={{fontSize: 20, marginLeft: 10, marginBottom: 10, fontWeight: 'bold' }}>Segurança</Text>
							<Text style={{fontSize: 18, marginLeft: 10}}>36. Freio de pé </Text>
							<ListItem 
								onPress={() => { setRbBomEstado36(true); setRbTrocar36(false); setRbCritico36(false) } }
								selected={rbBomEstado36} >
								<Left>
								<Text>Normal</Text>
								</Left>
								<Right>
								<Radio
									onPress={() => { setRbBomEstado36(true); setRbTrocar36(false); setRbCritico36(false) } }
									color={"#f0ad4e"}
									selectedColor={"#5cb85c"}
									selected={rbBomEstado36}
								/>
								</Right>
							</ListItem>
							<ListItem 
								onPress={() => { setRbBomEstado36(false); setRbTrocar36(true); setRbCritico36(false) } }
								selected={rbTrocar36} >
								<Left>
								<Text>Baixa frenagem</Text>
								</Left>
								<Right>
								<Radio
									onPress={() => { setRbBomEstado36(false); setRbTrocar36(true); setRbCritico36(false) } }
									color={"#f0ad4e"}
									selectedColor={"#5cb85c"}
									selected={rbTrocar36}
								/>
								</Right>
							</ListItem>
							<ListItem 
								onPress={() => { setRbBomEstado36(false); setRbTrocar36(false); setRbCritico36(true) } }
								selected={rbCritico36} >
								<Left>
								<Text>Crítico</Text>
								</Left>
								<Right>
								<Radio
									onPress={() => { setRbBomEstado36(false); setRbTrocar36(false); setRbCritico36(true) } }
									color={"#f0ad4e"}
									selectedColor={"#5cb85c"}
									selected={rbCritico36}
								/>
								</Right>
							</ListItem>
							<Text style={{fontSize: 18,  marginTop:10,marginLeft: 10}}>37. Freio de mão </Text>
							<ListItem 
								onPress={() => { setRbBomEstado37(true); setRbTrocar37(false); setRbCritico37(false) } }
								selected={rbBomEstado37} >
								<Left>
								<Text>Normal</Text>
								</Left>
								<Right>
								<Radio
									onPress={() => { setRbBomEstado37(true); setRbTrocar37(false); setRbCritico37(false) } }
									color={"#f0ad4e"}
									selectedColor={"#5cb85c"}
									selected={rbBomEstado37}
								/>
								</Right>
							</ListItem>
							<ListItem 
								onPress={() => { setRbBomEstado37(false); setRbTrocar37(true); setRbCritico37(false) } }
								selected={rbTrocar37} >
								<Left>
								<Text>Baixa frenagem</Text>
								</Left>
								<Right>
								<Radio
									onPress={() => { setRbBomEstado37(false); setRbTrocar37(true); setRbCritico37(false) } }
									color={"#f0ad4e"}
									selectedColor={"#5cb85c"}
									selected={rbTrocar37}
								/>
								</Right>
							</ListItem>
							<ListItem 
								onPress={() => { setRbBomEstado37(false); setRbTrocar37(false); setRbCritico37(true) } }
								selected={rbCritico37} >
								<Left>
								<Text>Crítico</Text>
								</Left>
								<Right>
								<Radio
									onPress={() => { setRbBomEstado37(false); setRbTrocar37(false); setRbCritico37(true) } }
									color={"#f0ad4e"}
									selectedColor={"#5cb85c"}
									selected={rbCritico37}
								/>
								</Right>
							</ListItem>
						</View>
					</CollapseBody>
				</Collapse>
				<Collapse 
					isExpanded={false}
					>
					<CollapseHeader>
						<Separator style={{ backgroundColor: 'rgb(250,184,29)', height: 45, marginTop: 3 }} bordered >
						<Text > 
						<Icon
							name="plus"
							size={15}
							color="black"
						/>
						&nbsp;&nbsp;{'SEGURANÇA'}
						</Text>
						</Separator>
					</CollapseHeader>
					<CollapseBody>
						<View style={{ marginTop: 15 }}>
							<Text style={{fontSize: 20, marginLeft: 10, marginBottom: 10, fontWeight: 'bold' }}>Segurança</Text>
							<Text style={{fontSize: 18, marginTop:-5, marginLeft: 10}}>38. Sensores de segurança e anti-colisão </Text>
							<ListItem >
							<Switch
								trackColor={{ false: "red", true: "#C5DB5F" }}
								thumbColor={isEnabled ? "#fff" : "#fff"}
								ios_backgroundColor="#fff"
								onValueChange={toggleSwitch}
								value={isEnabled}
							/>
							</ListItem>
							<Text style={{fontSize: 18, marginTop:-5, marginLeft: 10}}>39. Travas, régua e pino de segurança </Text>
							<ListItem >
							<Switch
								trackColor={{ false: "red", true: "#C5DB5F" }}
								thumbColor={isEnabled1 ? "#fff" : "#fff"}
								ios_backgroundColor="#fff"
								onValueChange={toggleSwitch1}
								value={isEnabled1}
							/>
							</ListItem>
							<Text style={{fontSize: 18, marginTop:10, marginLeft: 10}}>40. Borrachões, corrimões e degraus </Text>
							<ListItem 
								onPress={() => { setRbNormal40(true); setRbComDefeito40(false)} }
								selected={rbNormal40} >
								<Left>
								<Text>Normal</Text>
								</Left>
								<Right>
								<Radio
									onPress={() => { setRbNormal40(true); setRbComDefeito40(false)} }
									color={"#f0ad4e"}
									selectedColor={"#5cb85c"}
									selected={rbNormal40}
								/>
								</Right>
							</ListItem>
							<ListItem 
								onPress={() => { setRbNormal40(false); setRbComDefeito40(true)} }
								selected={rbComDefeito40} >
								<Left>
								<Text>Com defeito</Text>
								</Left>
								<Right>
								<Radio
									onPress={() => { setRbNormal40(false); setRbComDefeito40(true)} }
									color={"#f0ad4e"}
									selectedColor={"#5cb85c"}
									selected={rbComDefeito40}
								/>
								</Right>
							</ListItem>
							<Text style={{fontSize: 18,  marginTop:10,marginLeft: 10}}>41. Corremtes, cabos e roletes </Text>
							<ListItem 
								onPress={() => setRbComDefeito(!rbComDefeito)}
								selected={rbComDefeito} >
								<Left>
								<Text>Normal</Text>
								</Left>
								<Right>
								<Radio
									onPress={() => setRbComDefeito(!rbComDefeito)}
									color={"#f0ad4e"}
									selectedColor={"#5cb85c"}
									selected={rbComDefeito}
								/>
								</Right>
							</ListItem>
							<ListItem 
								onPress={() => setRbSemDefeito(!rbSemDefeito)}
								selected={rbSemDefeito} >
								<Left>
								<Text>Com defeito</Text>
								</Left>
								<Right>
								<Radio
									onPress={() => setRbSemDefeito(!rbSemDefeito)}
									color={"#f0ad4e"}
									selectedColor={"#5cb85c"}
									selected={rbSemDefeito}
								/>
								</Right>
							</ListItem>
							<Text style={{fontSize: 18, marginTop: 10, marginLeft: 10}}>42. Atividade aeroportuária </Text>
							<ListItem >
							<Switch
								trackColor={{ false: "red", true: "#C5DB5F" }}
								thumbColor={isEnabled3 ? "#fff" : "#fff"}
								ios_backgroundColor="#fff"
								onValueChange={toggleSwitch3}
								value={isEnabled3}
							/>
							</ListItem>
							<Text style={{fontSize: 18, marginTop: 10, marginLeft: 10}}>43. Cinto de segurança </Text>
							<ListItem 
								selected={true} >
								<Left>
								<Text>Normal</Text>
								</Left>
								<Right>
								<Radio
									color={"#f0ad4e"}
									selectedColor={"#5cb85c"}
									selected={true}
								/>
								</Right>
							</ListItem>
							<ListItem 
								selected={false} >
								<Left>
								<Text>Com defeito</Text>
								</Left>
								<Right>
								<Radio
									color={"#f0ad4e"}
									selectedColor={"#5cb85c"}
									selected={false}
								/>
								</Right>
							</ListItem>
							<Text style={{fontSize: 18, marginTop: 10, marginLeft: 10}}>44. Ausência de extintor </Text>
							<ListItem >
							<Switch
								trackColor={{ false: "red", true: "#C5DB5F" }}
								thumbColor={isEnabled4 ? "#fff" : "#fff"}
								ios_backgroundColor="#fff"
								onValueChange={toggleSwitch4}
								value={isEnabled4}
							/>
							</ListItem>
							
						</View>
					</CollapseBody>
				</Collapse>
			</View>
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