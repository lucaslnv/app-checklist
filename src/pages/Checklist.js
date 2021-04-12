import React, {useEffect, useState} from 'react';
import { StyleSheet, View, ScrollView, Switch, Picker } from 'react-native';
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

	//RADIO BUTTON
	const [rbComDefeito, setRbComDefeito] = useState(false);
	const [rbSemDefeito, setRbSemDefeito] = useState(false);
	const [rbNaoSabe, setRbNaoSabe] = useState(false);
	const [rbPossivelAvaria, setRbPossivelAvaria] = useState(false);

	//SWITCH
	const [isEnabled, setIsEnabled] = useState(false);
  	const toggleSwitch = () => setIsEnabled(previousState => !previousState);

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
			{ id: 4, title: "Elétrica", content: "Lorem ipsum dolor sit amet" },
			{ id: 5, title: "Vidros/Espelhos", content: "Lorem ipsum dolor sit amet" },
			{ id: 6, title: "Pneus", content: "Lorem ipsum dolor sit amet" },
			{ id: 7, title: "Lataria", content: "Lorem ipsum dolor sit amet" },
			{ id: 8, title: "Fluídos", content: "Lorem ipsum dolor sit amet" },
			{ id: 9, title: "Freios", content: "Lorem ipsum dolor sit amet" },
			{ id: 10, title: "Segurança", content: "Lorem ipsum dolor sit amet" },
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

			<Text style={styles.textoEquipamento}>{qrCodeEquipamento + ' - '+nomeEquipamento}</Text>

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
								placeholder=''
							/>
							<Text style={{fontSize: 18, marginLeft: 10}}>2. Horímetro atual</Text>
							<Input
								placeholder=''
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
								onPress={() => setRbComDefeito(!rbComDefeito)}
								selected={rbComDefeito} >
								<Left>
								<Text>Com defeito</Text>
								</Left>
								<Right>
								<Radio
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
								<Text>Sem defeito</Text>
								</Left>
								<Right>
								<Radio
									color={"#f0ad4e"}
									selectedColor={"#5cb85c"}
									selected={rbSemDefeito}
								/>
								</Right>
							</ListItem>
							<ListItem 
								onPress={() => setRbNaoSabe(!rbNaoSabe)}
								selected={rbNaoSabe} >
								<Left>
								<Text>Não sabe</Text>
								</Left>
								<Right>
								<Radio
									color={"#f0ad4e"}
									selectedColor={"#5cb85c"}
									selected={rbNaoSabe}
								/>
								</Right>
							</ListItem>
							<ListItem 
								onPress={() => setRbPossivelAvaria(!rbPossivelAvaria)}
								selected={rbPossivelAvaria} >
								<Left>
								<Text>Possível avaria</Text>
								</Left>
								<Right>
								<Radio
									color={"#f0ad4e"}
									selectedColor={"#5cb85c"}
									selected={rbPossivelAvaria}
								/>
								</Right>
							</ListItem>
							<Text style={{fontSize: 20, marginTop: 10, marginLeft: 10, marginBottom: 10, fontWeight: 'bold' }}>Combustível</Text>
							<Text style={{fontSize: 18, marginLeft: 10}}>4. Ponteiro no último abasecimento </Text>
							<ListItem 
								onPress={() => setRbComDefeito(!rbComDefeito)}
								selected={rbComDefeito} >
								<Left>
								<Text>4/4</Text>
								</Left>
								<Right>
								<Radio
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
								<Text>3/4</Text>
								</Left>
								<Right>
								<Radio
									color={"#f0ad4e"}
									selectedColor={"#5cb85c"}
									selected={rbSemDefeito}
								/>
								</Right>
							</ListItem>
							<ListItem 
								onPress={() => setRbNaoSabe(!rbNaoSabe)}
								selected={rbNaoSabe} >
								<Left>
								<Text>1/2</Text>
								</Left>
								<Right>
								<Radio
									color={"#f0ad4e"}
									selectedColor={"#5cb85c"}
									selected={rbNaoSabe}
								/>
								</Right>
							</ListItem>
							<ListItem 
								onPress={() => setRbPossivelAvaria(!rbPossivelAvaria)}
								selected={rbPossivelAvaria} >
								<Left>
								<Text>{'< 1/2'}</Text>
								</Left>
								<Right>
								<Radio
									onPress={ () => console.log('aaa') }
									color={"#f0ad4e"}
									selectedColor={"#5cb85c"}
									selected={rbPossivelAvaria}
								/>
								</Right>
							</ListItem>
							<Text style={{fontSize: 18, marginTop:10, marginLeft: 10}}>5. Ponteiro se alterou </Text>
							<ListItem >
							<Switch
								trackColor={{ false: "#767577", true: "#81b0ff" }}
								thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
								ios_backgroundColor="#3e3e3e"
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
								onPress={() => setRbComDefeito(!rbComDefeito)}
								selected={rbComDefeito} >
								<Left>
								<Text>Com Com tranca</Text>
								</Left>
								<Right>
								<Radio
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
								<Text>Sem tranca</Text>
								</Left>
								<Right>
								<Radio
									color={"#f0ad4e"}
									selectedColor={"#5cb85c"}
									selected={rbSemDefeito}
								/>
								</Right>
							</ListItem>
							<ListItem 
								onPress={() => setRbNaoSabe(!rbNaoSabe)}
								selected={rbNaoSabe} >
								<Left>
								<Text>Ausente</Text>
								</Left>
								<Right>
								<Radio
									color={"#f0ad4e"}
									selectedColor={"#5cb85c"}
									selected={rbNaoSabe}
								/>
								</Right>
							</ListItem>
							<Text style={{fontSize: 18,  marginTop:10,marginLeft: 10}}>7. Boia do tanque </Text>
							<ListItem 
								onPress={() => setRbComDefeito(!rbComDefeito)}
								selected={rbComDefeito} >
								<Left>
								<Text>Normal</Text>
								</Left>
								<Right>
								<Radio
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
									color={"#f0ad4e"}
									selectedColor={"#5cb85c"}
									selected={rbSemDefeito}
								/>
								</Right>
							</ListItem>
							<Text style={{fontSize: 20, marginTop:10, marginLeft: 10, marginBottom: 10, fontWeight: 'bold' }}>Partida</Text>
							<Text style={{fontSize: 18, marginLeft: 10}}>8. Teste de ignição </Text>
							<ListItem 
								onPress={() => setRbComDefeito(!rbComDefeito)}
								selected={rbComDefeito} >
								<Left>
								<Text>Rápido</Text>
								</Left>
								<Right>
								<Radio
									color={"#f0ad4e"}
									selectedColor={"#5cb85c"}
									selected={rbComDefeito}
								/>
								</Right>
							</ListItem>
							<ListItem 
								onPress={() => setRbComDefeito(!rbComDefeito)}
								selected={rbComDefeito} >
								<Left>
								<Text>Lento</Text>
								</Left>
								<Right>
								<Radio
									color={"#f0ad4e"}
									selectedColor={"#5cb85c"}
									selected={rbComDefeito}
								/>
								</Right>
							</ListItem>
							<ListItem 
								onPress={() => setRbComDefeito(!rbComDefeito)}
								selected={rbComDefeito} >
								<Left>
								<Text>Muito lento</Text>
								</Left>
								<Right>
								<Radio
									color={"#f0ad4e"}
									selectedColor={"#5cb85c"}
									selected={rbComDefeito}
								/>
								</Right>
							</ListItem>
							<ListItem 
								onPress={() => setRbComDefeito(!rbComDefeito)}
								selected={rbComDefeito} >
								<Left>
								<Text>Não liga</Text>
								</Left>
								<Right>
								<Radio
									color={"#f0ad4e"}
									selectedColor={"#5cb85c"}
									selected={rbComDefeito}
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
								onPress={() => setRbSemDefeito(!rbSemDefeito)}
								selected={rbSemDefeito} >
								<Left>
								<Text>Carregando</Text>
								</Left>
								<Right>
								<Radio
									color={"#f0ad4e"}
									selectedColor={"#5cb85c"}
									selected={rbSemDefeito}
								/>
								</Right>
							</ListItem>
							<ListItem 
								onPress={() => setRbNaoSabe(!rbNaoSabe)}
								selected={rbNaoSabe} >
								<Left>
								<Text>Não carrega</Text>
								</Left>
								<Right>
								<Radio
									color={"#f0ad4e"}
									selectedColor={"#5cb85c"}
									selected={rbNaoSabe}
								/>
								</Right>
							</ListItem>
							<Text style={{fontSize: 20, marginTop:10, marginLeft: 10, marginBottom: 10, fontWeight: 'bold' }}>Segurança</Text>
							<Text style={{fontSize: 18, marginLeft: 10}}>11. Iluminação e alerta de atenção </Text>
							<ListItem 
								onPress={() => setRbComDefeito(!rbComDefeito)}
								selected={rbComDefeito} >
								<Left>
								<Text>Normal</Text>
								</Left>
								<Right>
								<Radio
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
								<Text>Não acende</Text>
								</Left>
								<Right>
								<Radio
									color={"#f0ad4e"}
									selectedColor={"#5cb85c"}
									selected={rbSemDefeito}
								/>
								</Right>
							</ListItem>
							<ListItem 
								onPress={() => setRbSemDefeito(!rbSemDefeito)}
								selected={rbSemDefeito} >
								<Left>
								<Text>Baixo</Text>
								</Left>
								<Right>
								<Radio
									color={"#f0ad4e"}
									selectedColor={"#5cb85c"}
									selected={rbSemDefeito}
								/>
								</Right>
							</ListItem>
							<Text style={{fontSize: 18, marginTop:10, marginLeft: 10}}>13. Buzina e sinalizador </Text>
							<ListItem 
								onPress={() => setRbComDefeito(!rbComDefeito)}
								selected={rbComDefeito} >
								<Left>
								<Text>Normal</Text>
								</Left>
								<Right>
								<Radio
									color={"#f0ad4e"}
									selectedColor={"#5cb85c"}
									selected={rbComDefeito}
								/>
								</Right>
							</ListItem>
							<ListItem 
								onPress={() => setRbComDefeito(!rbComDefeito)}
								selected={rbComDefeito} >
								<Left>
								<Text>Ausente</Text>
								</Left>
								<Right>
								<Radio
									color={"#f0ad4e"}
									selectedColor={"#5cb85c"}
									selected={rbComDefeito}
								/>
								</Right>
							</ListItem>
							<ListItem 
								onPress={() => setRbComDefeito(!rbComDefeito)}
								selected={rbComDefeito} >
								<Left>
								<Text>Com defeito</Text>
								</Left>
								<Right>
								<Radio
									color={"#f0ad4e"}
									selectedColor={"#5cb85c"}
									selected={rbComDefeito}
								/>
								</Right>
							</ListItem>
							<Text style={{fontSize: 18, marginTop:10, marginLeft: 10}}>14. Correia do alternador e motor </Text>
							<ListItem 
								onPress={() => setRbComDefeito(!rbComDefeito)}
								selected={rbComDefeito} >
								<Left>
								<Text>Bom estado</Text>
								</Left>
								<Right>
								<Radio
									color={"#f0ad4e"}
									selectedColor={"#5cb85c"}
									selected={rbComDefeito}
								/>
								</Right>
							</ListItem>
							<ListItem 
								onPress={() => setRbComDefeito(!rbComDefeito)}
								selected={rbComDefeito} >
								<Left>
								<Text>Trocar</Text>
								</Left>
								<Right>
								<Radio
									color={"#f0ad4e"}
									selectedColor={"#5cb85c"}
									selected={rbComDefeito}
								/>
								</Right>
							</ListItem>
							<ListItem 
								onPress={() => setRbComDefeito(!rbComDefeito)}
								selected={rbComDefeito} >
								<Left>
								<Text>Crítico</Text>
								</Left>
								<Right>
								<Radio
									color={"#f0ad4e"}
									selectedColor={"#5cb85c"}
									selected={rbComDefeito}
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
								onPress={() => setRbComDefeito(!rbComDefeito)}
								selected={rbComDefeito} >
								<Left>
								<Text>Normal</Text>
								</Left>
								<Right>
								<Radio
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
								<Text>Quebrado</Text>
								</Left>
								<Right>
								<Radio
									color={"#f0ad4e"}
									selectedColor={"#5cb85c"}
									selected={rbSemDefeito}
								/>
								</Right>
							</ListItem>
							<ListItem 
								onPress={() => setRbNaoSabe(!rbNaoSabe)}
								selected={rbNaoSabe} >
								<Left>
								<Text>Ausente</Text>
								</Left>
								<Right>
								<Radio
									color={"#f0ad4e"}
									selectedColor={"#5cb85c"}
									selected={rbNaoSabe}
								/>
								</Right>
							</ListItem>
							<Text style={{fontSize: 18, marginTop:10, marginLeft: 10}}>18. Retrovisor direito </Text>
							<ListItem 
								onPress={() => setRbComDefeito(!rbComDefeito)}
								selected={rbComDefeito} >
								<Left>
								<Text>Normal</Text>
								</Left>
								<Right>
								<Radio
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
								<Text>Quebrado</Text>
								</Left>
								<Right>
								<Radio
									color={"#f0ad4e"}
									selectedColor={"#5cb85c"}
									selected={rbSemDefeito}
								/>
								</Right>
							</ListItem>
							<ListItem 
								onPress={() => setRbSemDefeito(!rbSemDefeito)}
								selected={rbSemDefeito} >
								<Left>
								<Text>Ausente</Text>
								</Left>
								<Right>
								<Radio
									color={"#f0ad4e"}
									selectedColor={"#5cb85c"}
									selected={rbSemDefeito}
								/>
								</Right>
							</ListItem>
							<Text style={{fontSize: 18, marginTop:10, marginLeft: 10}}>19. Retrovisor interno </Text>
							<ListItem 
								onPress={() => setRbComDefeito(!rbComDefeito)}
								selected={rbComDefeito} >
								<Left>
								<Text>Normal</Text>
								</Left>
								<Right>
								<Radio
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
								<Text>Quebrado</Text>
								</Left>
								<Right>
								<Radio
									color={"#f0ad4e"}
									selectedColor={"#5cb85c"}
									selected={rbSemDefeito}
								/>
								</Right>
							</ListItem>
							<ListItem 
								onPress={() => setRbSemDefeito(!rbSemDefeito)}
								selected={rbSemDefeito} >
								<Left>
								<Text>Ausente</Text>
								</Left>
								<Right>
								<Radio
									color={"#f0ad4e"}
									selectedColor={"#5cb85c"}
									selected={rbSemDefeito}
								/>
								</Right>
							</ListItem>
							<Text style={{fontSize: 18, marginLeft: 10}}>20. Para-brisa </Text>
							<ListItem 
								onPress={() => setRbComDefeito(!rbComDefeito)}
								selected={rbComDefeito} >
								<Left>
								<Text>Normal</Text>
								</Left>
								<Right>
								<Radio
									color={"#f0ad4e"}
									selectedColor={"#5cb85c"}
									selected={rbComDefeito}
								/>
								</Right>
							</ListItem>
							<ListItem 
								onPress={() => setRbComDefeito(!rbComDefeito)}
								selected={rbComDefeito} >
								<Left>
								<Text>Riscado</Text>
								</Left>
								<Right>
								<Radio
									color={"#f0ad4e"}
									selectedColor={"#5cb85c"}
									selected={rbComDefeito}
								/>
								</Right>
							</ListItem>
							<ListItem 
								onPress={() => setRbComDefeito(!rbComDefeito)}
								selected={rbComDefeito} >
								<Left>
								<Text>Trincado</Text>
								</Left>
								<Right>
								<Radio
									color={"#f0ad4e"}
									selectedColor={"#5cb85c"}
									selected={rbComDefeito}
								/>
								</Right>
							</ListItem>
							<ListItem 
								onPress={() => setRbComDefeito(!rbComDefeito)}
								selected={rbComDefeito} >
								<Left>
								<Text>Ausente</Text>
								</Left>
								<Right>
								<Radio
									color={"#f0ad4e"}
									selectedColor={"#5cb85c"}
									selected={rbComDefeito}
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
								onPress={() => setRbComDefeito(!rbComDefeito)}
								selected={rbComDefeito} >
								<Left>
								<Text>Esquerdo</Text>
								</Left>
								<Right>
								<Radio
									color={"#f0ad4e"}
									selectedColor={"#5cb85c"}
									selected={rbComDefeito}
								/>
								</Right>
							</ListItem>
							<ListItem 
								onPress={() => setRbComDefeito(!rbComDefeito)}
								selected={rbComDefeito} >
								<Left>
								<Text>Direito</Text>
								</Left>
								<Right>
								<Radio
									color={"#f0ad4e"}
									selectedColor={"#5cb85c"}
									selected={rbComDefeito}
								/>
								</Right>
							</ListItem>
							<Text style={{fontSize: 18, marginTop:10, marginLeft: 10}}>21. Pneu calibrado corretamente </Text>
							<ListItem >
							<Switch
								trackColor={{ false: "#767577", true: "#81b0ff" }}
								thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
								ios_backgroundColor="#3e3e3e"
								onValueChange={toggleSwitch}
								value={isEnabled}
							/>
							</ListItem>
							<Text style={{fontSize: 18, marginLeft: 10}}>22. Profundidade do sulco (mm)</Text>
							<Input 
								placeholder=''
							/>
							<Text style={{fontSize: 18, marginTop:-5, marginLeft: 10}}>23. Pneu com bolha </Text>
							<ListItem >
							<Switch
								trackColor={{ false: "#767577", true: "#81b0ff" }}
								thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
								ios_backgroundColor="#3e3e3e"
								onValueChange={toggleSwitch}
								value={isEnabled}
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
								onPress={() => setRbComDefeito(!rbComDefeito)}
								selected={rbComDefeito} >
								<Left>
								<Text>Bom estado</Text>
								</Left>
								<Right>
								<Radio
									color={"#f0ad4e"}
									selectedColor={"#5cb85c"}
									selected={rbComDefeito}
								/>
								</Right>
							</ListItem>
							<ListItem 
								onPress={() => setRbComDefeito(!rbComDefeito)}
								selected={rbComDefeito} >
								<Left>
								<Text>Trocar</Text>
								</Left>
								<Right>
								<Radio
									color={"#f0ad4e"}
									selectedColor={"#5cb85c"}
									selected={rbComDefeito}
								/>
								</Right>
							</ListItem>
							<ListItem 
								onPress={() => setRbComDefeito(!rbComDefeito)}
								selected={rbComDefeito} >
								<Left>
								<Text>Crítico</Text>
								</Left>
								<Right>
								<Radio
									color={"#f0ad4e"}
									selectedColor={"#5cb85c"}
									selected={rbComDefeito}
								/>
								</Right>
							</ListItem>
						</View>
					</CollapseBody>
				</Collapse>
			</View>
			<Button
				buttonStyle={styles.botao}
				title="REGISTRAR"
				onPress={ ()=> props.navigation.navigate('Camera', { rota: 'Equipamento', operacao: 'equipamento'}) }
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
		textAlign: "center",
		marginBottom: 10,
		fontSize: 18
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