import { StatusBar } from 'expo-status-bar';
import React, {Component, useEffect, useState} from 'react';
import { StyleSheet, View, ScrollView, Image, Alert } from 'react-native';
import {buscarQuesitos} from '../services/api';
import { Separator, Radio, Right, Left, Center, ListItem } from 'native-base';
import {Collapse,CollapseHeader, CollapseBody, AccordionList} from 'accordion-collapse-react-native';

import axios from 'axios';

import { RadioButton } from 'react-native-paper';
import { Button, Text } from 'react-native-elements';

export default class Teste extends Component {

	constructor(props) {
        super(props);
        this.state = {
			quesitos: {},
			checked_1: false,
			checked_2: false
		}

		this.setRb = this.setRb.bind(this);

	}

	componentDidMount() {
		
		axios.get('https://web.gruposol.com.br/ws/abastecimento/api/getQuesitos', {
			params: {
				QrCode: 2000
			}
		  })
		.then(response => {
			this.setState({quesitos: response.data.draw });
		})
		.catch(function (error) {
			console.log(error);
		});

	}

	setRb(quesito, opcao){
		console.log(quesito);
		console.log(opcao);
	}
	
	render() {
        return (
			<ScrollView style={styles.container}>
				{
			this.state.quesitos.GRUPO != undefined ?	
				this.state.quesitos.GRUPO.map((grupo, g) => {
					return (
						<View key={grupo.COD_GRUPO}>
						<Collapse>
							<CollapseHeader>
								<Separator style={{ backgroundColor: 'rgb(250,184,29)', height: 45, marginTop: 3 }} bordered >
								<Text>
									
								&nbsp;&nbsp;{grupo.DES_GRUPO}
								</Text>
								</Separator>
							</CollapseHeader>
							<CollapseBody>
								{
									grupo.QUESITOS != undefined ?	
										grupo.QUESITOS.map((quesito, q) => {
											return(
												<View key={quesito.QUESITO}>
													<Text style={{fontSize: 20, marginLeft: 10, marginTop: 10, fontWeight: 'bold' }}>{quesito.COD_ITEM+'. '+quesito.QUESITO}</Text>
													
													{ /* RADIO BUTTON ITEM 1 */ }
													{
														quesito.IND_RADIO == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 1 &&
														(
															quesito.componentes.radio.OPCOES.map((radio, i) => {
																return (
																	<ListItem 
																		key={radio.DES_OPCAO}
																		//onPress={}
																		//selected={ rb[quesito.COD_ITEM] == radio.COD_OPCAO ? true : false } 
																		>
																		<Left>
																		<Text>{radio.DES_OPCAO}</Text>
																		</Left>
																		<Right>
																		<Radio
																			onPress={() => { this.setState({ checked_1: quesito.COD_ITEM+radio.COD_OPCAO }); }}
																			color={"#f0ad4e"}
																			selectedColor={"#5cb85c"}
																			selected={ this.state.checked_1 == quesito.COD_ITEM+radio.COD_OPCAO ? true : false }
																		/>
																		</Right>
																	</ListItem>
																);
															})
														)
													}

													{ /* RADIO BUTTON ITEM 4 */ }
													{
														quesito.IND_RADIO == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 4 &&
														(
															quesito.componentes.radio.OPCOES.map((radio, i) => {
																return (
																	<ListItem 
																		key={radio.DES_OPCAO}
																		//onPress={}
																		//selected={ rb[quesito.COD_ITEM] == radio.COD_OPCAO ? true : false } 
																		>
																		<Left>
																		<Text>{radio.DES_OPCAO}</Text>
																		</Left>
																		<Right>
																		<Radio
																			onPress={() => { this.setState({ checked_4: quesito.COD_ITEM+radio.COD_OPCAO }); }}
																			color={"#f0ad4e"}
																			selectedColor={"#5cb85c"}
																			selected={ this.state.checked_4 == quesito.COD_ITEM+radio.COD_OPCAO ? true : false }
																		/>
																		</Right>
																	</ListItem>
																);
															})
														)
													}
													
													{ /* LISTBOX PNEU ITEM 19 */ }
													{
														quesito.IND_PNEU == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 19 && 
														(
															this.state.quesitos.LISTA_PNEUS.map((listbox, i) => {
																return (
																	<Collapse 
																		key={listbox.DES_OPCAO}
																		isExpanded={false}
																		>
																		<CollapseHeader>
																			<Separator style={{ backgroundColor: 'rgb(200, 251, 88)', height: 45, marginTop: 3, marginLeft: 10  }} bordered >
																			<Text > 
																			&nbsp;&nbsp;{listbox.DES_OPCAO}
																			</Text>
																			</Separator>
																		</CollapseHeader>
																		<CollapseBody style={{ marginLeft: 20  }} >
																		
																		{
																			// RADIO BUTTON ITEM 19
																			quesito.IND_RADIO == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 19  &&
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

																		</CollapseBody>
																	</Collapse>
																);
															})
														)
													}

												
												</View>
											)
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
			</ScrollView>
			);
		}
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
