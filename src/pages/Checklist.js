import React, {useEffect, useState, useContext} from 'react';
import { StyleSheet, View, ScrollView, Switch, Alert, Image, Picker } from 'react-native';
import {buscarQuesitos} from '../services/api';
import { Separator, Radio, ListItem, Item } from 'native-base';
import {Collapse,CollapseHeader, CollapseBody} from 'accordion-collapse-react-native';
import LoadingItem from '../components/LoadingItem';
import { Button, Text, Input } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import NetInfo from "@react-native-community/netinfo";
import { Formik } from 'formik';
import {registrarChecklist} from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationEvents  } from 'react-navigation';
import Agenda from '../components/Agenda';
import { Context } from '../context/Index';

export default function Checklist(props) {

	const {obj, setObj} = useContext(Context);
	const [nomeEquipamento, setNomeEquipamento] = useState('');
	const [qrCodeEquipamento, setQrCodeEquipamento] = useState('');
	const [loading, setloading] = useState(false);
	const [ultimoCheckup, setUltimoCheckup] = useState('');
	const [ultimoHorimetro, setUltimoHorimetro] = useState('');
	const [tipoEquipamento, setTipoEquipamento] = useState('');
	const [cliente, setCliente] = useState('');
	const [codEmitente, setCodEmitente] = useState('');
	const [codOperador, setCodOperador] = useState('');
	const [quesitos, setQuesitos] = useState([]);
	const [imgEquipamento, setImgEquipamento] = useState(false);
	const [contadorQuesito, setContadorQuesito] = useState([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50]);

	// INSERIR AGENDA CONTEXT API
	
	//OPERADOR
	const getOperador = async () => {
		try {
			const value = await AsyncStorage.getItem('codOperador')
			if(value !== null) {
				setCodOperador(value);
			}else{
				setCodOperador(9999);
			}
		} catch(e) {
			Alert.alert('Aviso', 'Não foi possível recuperar o operador.');
		}
	}

	//EQUIPAMENTO
	useEffect(() => {
		getOperador();
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

				//VERIFICA AUTENTICAÇÃO
				if(respostaQuesitos.resultado == "Chave invalida."){
					setloading(false);
					Alert.alert('Aviso', 'Chave de autenticação inválida.');
				}
				
				setloading(false);
				setQuesitos(respostaQuesitos.resultado.data.draw);
				setObj({agenda: respostaQuesitos.resultado.data.draw.AGENDA})
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
				if( respostaQuesitos.resultado.data.draw.IMAGEM != null ){
					setImgEquipamento(respostaQuesitos.resultado.data.draw.IMAGEM);
				}
			}else{
				setloading(false);
				//VERIFICA SE A INPEÇÃO FOI REALIZADA NO DIA INSPECT_ALREADY_DONE_TODAY 
				if(respostaQuesitos.statusCode == 409){
					Alert.alert('Aviso', 'Inspeção já realizada para este equipamento hoje.', [ { text: "OK", onPress: () => props.navigation.navigate('Equipamento') } ]);
				}else{
					Alert.alert('Aviso', respostaQuesitos.mensagem);
				}
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
		var quesitosJson = [];
		var indice = 0;
		Object.keys(values).forEach(function(item){
			if( item.indexOf("icon") == -1 ){

				let respostaQuesito = values[item];
				let quesitoObrigatorio = true;
				let quesitoIgual = false;

				//PNEU TRUE
				if(  item.indexOf("Pneu") != -1 ){
					let pneu = item.substring(5,6);
					let quesitoPneu = item.substring(item.indexOf("Q") + 1);
					let respostaPneu = values[item];

					//VERIFICA QUESITO OBRIGATORIO (DESABILITADO)
					quesitos.GRUPO.forEach(function(grupos, g){
						grupos.QUESITOS.forEach(function(quesitos, q){
							if( (quesitoPneu == quesitos.COD_ITEM) && (quesitos.IND_OBRIGATORIO == false) ){
								quesitoObrigatorio = false;
							}
						});
					});

					//LIST BOX
					if(item.indexOf("lb") != -1){
						if( quesitoObrigatorio == true ){
							quesitosJson.forEach(function(item, i){
								if( (item.COD_ITEM == quesitoPneu) && (item.COD_LADO == pneu) ){
									quesitoIgual = true;
									quesitosJson[i] = ({ "COD_LADO": pneu, "COD_ITEM": quesitoPneu, "NUM_RESPOSTA": respostaPneu, "NUM_ALTERNATIVO": item.NUM_ALTERNATIVO, "DES_RESPOSTA": item.DES_RESPOSTA, "DES_FOTO": item.DES_FOTO });
								}
							});
							if(quesitoIgual == false){
								quesitosJson[indice] = ({ "COD_LADO": pneu, "COD_ITEM": quesitoPneu, "NUM_RESPOSTA": respostaPneu, "NUM_ALTERNATIVO":"", "DES_RESPOSTA": "", "DES_FOTO": "" });
							}
						}
					}

					//RADIO BUTTON
					if(item.indexOf("rb") != -1){
						if( quesitoObrigatorio == true ){
							quesitosJson.forEach(function(item, i){
								if( (item.COD_ITEM == quesitoPneu) && (item.COD_LADO == pneu) ){
									quesitoIgual = true;
									quesitosJson[i] = ({ "COD_LADO": pneu, "COD_ITEM": quesitoPneu, "NUM_RESPOSTA": respostaPneu, "NUM_ALTERNATIVO": item.NUM_ALTERNATIVO, "DES_RESPOSTA": item.DES_RESPOSTA, "DES_FOTO": item.DES_FOTO });
								}
							});
							if(quesitoIgual == false){
								quesitosJson[indice] = ({ "COD_LADO": pneu, "COD_ITEM": quesitoPneu, "NUM_RESPOSTA": respostaPneu, "NUM_ALTERNATIVO":"", "DES_RESPOSTA": "", "DES_FOTO": "" });
							}
						}
					}

					//CHECKBOX
					if(item.indexOf("cb") != -1){
						if( quesitoObrigatorio == true ){
							quesitosJson.forEach(function(item, i){
								if( (item.COD_ITEM == quesitoPneu) && (item.COD_LADO == pneu) ){
									quesitoIgual = true;
									quesitosJson[i] = ({ "COD_LADO": pneu, "COD_ITEM": quesitoPneu, "NUM_RESPOSTA": respostaPneu, "NUM_ALTERNATIVO": item.NUM_ALTERNATIVO, "DES_RESPOSTA": item.DES_RESPOSTA, "DES_FOTO": item.DES_FOTO });
								}
							});
							if(quesitoIgual == false){
								quesitosJson[indice] = ({ "COD_LADO": pneu, "COD_ITEM": quesitoPneu, "NUM_RESPOSTA": respostaPneu, "NUM_ALTERNATIVO":"", "DES_RESPOSTA": "", "DES_FOTO": "" });
							}
						}
					}

					//TEXTO
					if(item.indexOf("Texto") != -1){
						if( quesitoObrigatorio == true ){
							quesitosJson.forEach(function(item, i){
								if( (item.COD_ITEM == quesitoPneu) && (item.COD_LADO == pneu) ){
									quesitoIgual = true;
									quesitosJson[i] = ({ "COD_LADO": pneu, "COD_ITEM": quesitoPneu, "NUM_RESPOSTA": item.NUM_RESPOSTA, "NUM_ALTERNATIVO": item.NUM_ALTERNATIVO, "DES_RESPOSTA": respostaPneu, "DES_FOTO": item.DES_FOTO });
								}
							});
							if(quesitoIgual == false){
								quesitosJson[indice] = ({ "COD_LADO": pneu, "COD_ITEM": quesitoPneu, "NUM_RESPOSTA": "", "NUM_ALTERNATIVO":"", "DES_RESPOSTA": respostaPneu, "DES_FOTO": "" });
							}
						}
					}

					//DECIMAL
					if(item.indexOf("Decimal") != -1){
						if( quesitoObrigatorio == true ){
							quesitosJson.forEach(function(item, i){
								if( (item.COD_ITEM == quesitoPneu) && (item.COD_LADO == pneu) ){
									quesitoIgual = true;
									quesitosJson[i] = ({ "COD_LADO": pneu, "COD_ITEM": quesitoPneu, "NUM_RESPOSTA": item.NUM_RESPOSTA, "NUM_ALTERNATIVO": respostaPneu, "DES_RESPOSTA": item.DES_RESPOSTA, "DES_FOTO": item.DES_FOTO });
								}
							});
							if(quesitoIgual == false){
								quesitosJson[indice] = ({ "COD_LADO": pneu, "COD_ITEM": quesitoPneu, "NUM_RESPOSTA": "", "NUM_ALTERNATIVO": respostaPneu, "DES_RESPOSTA": "", "DES_FOTO": "" });
							}
						}
					}

					//INTEIRO
					if(item.indexOf("Inteiro") != -1){
						if( quesitoObrigatorio == true ){
							quesitosJson.forEach(function(item, i){
								if( (item.COD_ITEM == quesitoPneu) && (item.COD_LADO == pneu) ){
									quesitoIgual = true;
									quesitosJson[i] = ({ "COD_LADO": pneu, "COD_ITEM": quesitoPneu, "NUM_RESPOSTA": item.NUM_RESPOSTA, "NUM_ALTERNATIVO": respostaPneu, "DES_RESPOSTA": item.DES_RESPOSTA, "DES_FOTO": item.DES_FOTO });
								}
							});
							if(quesitoIgual == false){
								quesitosJson[indice] = ({ "COD_LADO": pneu, "COD_ITEM": quesitoPneu, "NUM_RESPOSTA": "", "NUM_ALTERNATIVO": respostaPneu, "DES_RESPOSTA": "", "DES_FOTO": "" });
							}
						}
					}

					//FOTO
					if(item.indexOf("ft") != -1){
						if( quesitoObrigatorio == true && respostaPneu != null ){
							quesitosJson.forEach(function(item, i){
								if( (item.COD_ITEM == quesitoPneu) && (item.COD_LADO == pneu) ){
									quesitoIgual = true;
									quesitosJson[i] = ({ "COD_LADO": pneu, "COD_ITEM": quesitoPneu, "NUM_RESPOSTA": item.NUM_RESPOSTA, "NUM_ALTERNATIVO": item.NUM_ALTERNATIVO, "DES_RESPOSTA": item.DES_RESPOSTA, "DES_FOTO": respostaPneu });
								}
							});
							if(quesitoIgual == false){
								quesitosJson[indice] = ({ "COD_LADO": pneu, "COD_ITEM": quesitoPneu, "NUM_RESPOSTA": "", "NUM_ALTERNATIVO": "", "DES_RESPOSTA": "", "DES_FOTO": respostaPneu });
							}
						}
					}
				}

				//LATARIA TRUE
				if(  item.indexOf("Lataria") != -1 ){
					let lataria = item.substring(8,9);
					let quesitoLataria = item.substring(item.indexOf("Q") + 1);
					let respostaLataria = values[item];

					//VERIFICA QUESITO OBRIGATORIO
					quesitos.GRUPO.forEach(function(grupos, g){
						grupos.QUESITOS.forEach(function(quesitos, q){
							if( (quesitoLataria == quesitos.COD_ITEM) && (quesitos.IND_OBRIGATORIO == false) ){
								quesitoObrigatorio = false;
							}
						});
					});

					//LIST BOX
					if(item.indexOf("lb") != -1){
						if( quesitoObrigatorio == true ){
							quesitosJson.forEach(function(item, i){
								if( (item.COD_ITEM == quesitoLataria) && (item.COD_LADO == lataria) ){
									quesitoIgual = true;
									quesitosJson[i] = ({ "COD_LADO": lataria, "COD_ITEM": quesitoLataria, "NUM_RESPOSTA": respostaLataria, "NUM_ALTERNATIVO": item.NUM_ALTERNATIVO, "DES_RESPOSTA": item.DES_RESPOSTA, "DES_FOTO": item.DES_FOTO });
								}
							});
							if(quesitoIgual == false){
								quesitosJson[indice] = ({ "COD_LADO": lataria, "COD_ITEM": quesitoLataria, "NUM_RESPOSTA": respostaLataria, "NUM_ALTERNATIVO":"", "DES_RESPOSTA": "", "DES_FOTO": "" });
							}
						}
					}

					//RADIO BUTTON
					if(item.indexOf("rb") != -1){
						if( quesitoObrigatorio == true ){
							quesitosJson.forEach(function(item, i){
								if( (item.COD_ITEM == quesitoLataria) && (item.COD_LADO == lataria) ){
									quesitoIgual = true;
									quesitosJson[i] = ({ "COD_LADO": lataria, "COD_ITEM": quesitoLataria, "NUM_RESPOSTA": respostaLataria, "NUM_ALTERNATIVO": item.NUM_ALTERNATIVO, "DES_RESPOSTA": item.DES_RESPOSTA, "DES_FOTO": item.DES_FOTO });
								}
							});
							if(quesitoIgual == false){
								quesitosJson[indice] = ({ "COD_LADO": lataria, "COD_ITEM": quesitoLataria, "NUM_RESPOSTA": respostaLataria, "NUM_ALTERNATIVO":"", "DES_RESPOSTA": "", "DES_FOTO": "" });
							}
						}
					}

					//CHECKBOX
					if(item.indexOf("cb") != -1){
						if( quesitoObrigatorio == true ){
							quesitosJson.forEach(function(item, i){
								if( (item.COD_ITEM == quesitoLataria) && (item.COD_LADO == lataria) ){
									quesitoIgual = true;
									quesitosJson[i] = ({ "COD_LADO": lataria, "COD_ITEM": quesitoLataria, "NUM_RESPOSTA": respostaLataria, "NUM_ALTERNATIVO": item.NUM_ALTERNATIVO, "DES_RESPOSTA": item.DES_RESPOSTA, "DES_FOTO": item.DES_FOTO });
								}
							});
							if(quesitoIgual == false){
								quesitosJson[indice] = ({ "COD_LADO": lataria, "COD_ITEM": quesitoLataria, "NUM_RESPOSTA": respostaLataria, "NUM_ALTERNATIVO":"", "DES_RESPOSTA": "", "DES_FOTO": "" });
							}
						}
					}

					//TEXTO
					if(item.indexOf("Texto") != -1){
						if( quesitoObrigatorio == true ){
							quesitosJson.forEach(function(item, i){
								if( (item.COD_ITEM == quesitoLataria) && (item.COD_LADO == lataria) ){
									quesitoIgual = true;
									quesitosJson[i] = ({ "COD_LADO": lataria, "COD_ITEM": quesitoLataria, "NUM_RESPOSTA": item.NUM_RESPOSTA, "NUM_ALTERNATIVO": item.NUM_ALTERNATIVO, "DES_RESPOSTA": respostaLataria, "DES_FOTO": item.DES_FOTO });
								}
							});
							if(quesitoIgual == false){
								quesitosJson[indice] = ({ "COD_LADO": lataria, "COD_ITEM": quesitoLataria, "NUM_RESPOSTA": "", "NUM_ALTERNATIVO":"", "DES_RESPOSTA": respostaLataria, "DES_FOTO": "" });
							}
						}
					}

					//DECIMAL
					if(item.indexOf("Decimal") != -1){
						if( quesitoObrigatorio == true ){
							quesitosJson.forEach(function(item, i){
								if( (item.COD_ITEM == quesitoLataria) && (item.COD_LADO == lataria) ){
									quesitoIgual = true;
									quesitosJson[i] = ({ "COD_LADO": lataria, "COD_ITEM": quesitoLataria, "NUM_RESPOSTA": item.NUM_RESPOSTA, "NUM_ALTERNATIVO": respostaLataria, "DES_RESPOSTA": item.DES_RESPOSTA, "DES_FOTO": item.DES_FOTO });
								}
							});
							if(quesitoIgual == false){
								quesitosJson[indice] = ({ "COD_LADO": lataria, "COD_ITEM": quesitoLataria, "NUM_RESPOSTA": "", "NUM_ALTERNATIVO": respostaLataria, "DES_RESPOSTA": "", "DES_FOTO": "" });
							}
						}
					}

					//INTEIRO
					if(item.indexOf("Inteiro") != -1){
						if( quesitoObrigatorio == true ){
							quesitosJson.forEach(function(item, i){
								if( (item.COD_ITEM == quesitoLataria) && (item.COD_LADO == lataria) ){
									quesitoIgual = true;
									quesitosJson[i] = ({ "COD_LADO": lataria, "COD_ITEM": quesitoLataria, "NUM_RESPOSTA": item.NUM_RESPOSTA, "NUM_ALTERNATIVO": respostaLataria, "DES_RESPOSTA": item.DES_RESPOSTA, "DES_FOTO": item.DES_FOTO });
								}
							});
							if(quesitoIgual == false){
								quesitosJson[indice] = ({ "COD_LADO": lataria, "COD_ITEM": quesitoLataria, "NUM_RESPOSTA": "", "NUM_ALTERNATIVO": respostaLataria, "DES_RESPOSTA": "", "DES_FOTO": "" });
							}
						}
					}

					//FOTO
					if(item.indexOf("ft") != -1){
						if( quesitoObrigatorio == true && respostaLataria != null){
							quesitosJson.forEach(function(item, i){
								if( (item.COD_ITEM == quesitoLataria) && (item.COD_LADO == lataria) ){
									quesitoIgual = true;
									quesitosJson[i] = ({ "COD_LADO": lataria, "COD_ITEM": quesitoLataria, "NUM_RESPOSTA": item.NUM_RESPOSTA, "NUM_ALTERNATIVO": item.NUM_ALTERNATIVO, "DES_RESPOSTA": item.DES_RESPOSTA, "DES_FOTO": respostaLataria });
								}
							});
							if(quesitoIgual == false){
								quesitosJson[indice] = ({ "COD_LADO": lataria, "COD_ITEM": quesitoLataria, "NUM_RESPOSTA": "", "NUM_ALTERNATIVO": "", "DES_RESPOSTA": "", "DES_FOTO": respostaLataria });
							}
						}
					}

				}

				//PNEU FALSE - LATARIA FALSE
				if( (item.indexOf("Pneu") == -1) && (item.indexOf("Lataria") == -1) ){
					
					let quesito = item.substring(item.indexOf("_") + 1);
					let resposta = values[item];
					
					//VERIFICA QUESITO OBRIGATORIO
					quesitos.GRUPO.forEach(function(grupos, g){
						grupos.QUESITOS.forEach(function(quesitos, q){
							if( (quesito == quesitos.COD_ITEM) && (quesitos.IND_OBRIGATORIO == false) ){
								quesitoObrigatorio = false;
							}
						});
					});

					//LIST BOX
					if(item.indexOf("lb") != -1){
						if( quesitoObrigatorio == true ){
							quesitosJson.forEach(function(item, i){
								if(item.COD_ITEM == quesito){
									quesitoIgual = true;
									quesitosJson[i] = ({ "COD_LADO":"", "COD_ITEM": quesito, "NUM_RESPOSTA": resposta, "NUM_ALTERNATIVO": item.NUM_ALTERNATIVO, "DES_RESPOSTA": item.DES_RESPOSTA, "DES_FOTO": item.DES_FOTO });
								}
							});
							
							if(quesitoIgual == false){
								quesitosJson[indice] = ({ "COD_LADO":"", "COD_ITEM": quesito, "NUM_RESPOSTA": resposta, "NUM_ALTERNATIVO":"", "DES_RESPOSTA": "", "DES_FOTO": "" });
							}
						}
					}

					//RADIO BUTTON
					if(item.indexOf("rb") != -1){
						if( quesitoObrigatorio == true ){
							
							if( quesitoObrigatorio == true && resposta != null){
								quesitosJson.forEach(function(item, i){
									if(item.COD_ITEM == quesito){
										quesitoIgual = true;
										quesitosJson[i] = ({ "COD_LADO":"", "COD_ITEM": quesito, "NUM_RESPOSTA": resposta, "NUM_ALTERNATIVO": item.NUM_ALTERNATIVO, "DES_RESPOSTA": item.DES_RESPOSTA, "DES_FOTO": item.DES_FOTO });
									}
								});

								if(quesitoIgual == false){
									quesitosJson[indice] = ({ "COD_LADO":"", "COD_ITEM": quesito, "NUM_RESPOSTA": resposta, "NUM_ALTERNATIVO":"", "DES_RESPOSTA": "", "DES_FOTO": "" });
								}
							}
						}
					}

					//CHECKBOX
					if(item.indexOf("cb") != -1){
						if( quesitoObrigatorio == true ){
							quesitosJson.forEach(function(item, i){
								if(item.COD_ITEM == quesito){
									quesitoIgual = true;
									quesitosJson[i] = ({ "COD_LADO":"", "COD_ITEM": quesito, "NUM_RESPOSTA": resposta, "NUM_ALTERNATIVO": item.NUM_ALTERNATIVO, "DES_RESPOSTA": item.DES_RESPOSTA, "DES_FOTO": item.DES_FOTO });
								}
							});

							if(quesitoIgual == false){
								quesitosJson[indice] = ({ "COD_LADO":"", "COD_ITEM": quesito, "NUM_RESPOSTA": resposta, "NUM_ALTERNATIVO":"", "DES_RESPOSTA": "", "DES_FOTO": "" });
							}
						}
					}

					//TEXTO
					if(item.indexOf("Texto") != -1){
						if( quesitoObrigatorio == true ){
							
							if( quesitoObrigatorio == true ){
								quesitosJson.forEach(function(item, i){
									if(item.COD_ITEM == quesito){
										quesitoIgual = true;
										quesitosJson[i] = ({ "COD_LADO":"", "COD_ITEM": quesito, "NUM_RESPOSTA": item.NUM_RESPOSTA, "NUM_ALTERNATIVO": item.NUM_ALTERNATIVO, "DES_RESPOSTA": resposta, "DES_FOTO": item.DES_FOTO });
									}
								});

								if(quesitoIgual == false){
									quesitosJson[indice] = ({ "COD_LADO":"", "COD_ITEM": quesito, "NUM_RESPOSTA": "", "NUM_ALTERNATIVO":"", "DES_RESPOSTA": resposta, "DES_FOTO": "" });
								}
							}
						}
					}

					//DECIMAL
					if(item.indexOf("Decimal") != -1){
						if( quesitoObrigatorio == true ){
							quesitosJson.forEach(function(item, i){
								if(item.COD_ITEM == quesito){
									quesitoIgual = true;
									quesitosJson[i] = ({ "COD_LADO":"", "COD_ITEM": quesito, "NUM_RESPOSTA": item.NUM_RESPOSTA, "NUM_ALTERNATIVO": resposta, "DES_RESPOSTA": item.DES_RESPOSTA, "DES_FOTO": item.DES_FOTO });
								}
							});

							if(quesitoIgual == false){
								quesitosJson[indice] = ({ "COD_LADO":"", "COD_ITEM": quesito, "NUM_RESPOSTA": "", "NUM_ALTERNATIVO": resposta, "DES_RESPOSTA": "", "DES_FOTO": "" });
							}
						}
					}

					//INTEIRO
					if(item.indexOf("Inteiro") != -1){
						if( quesitoObrigatorio == true ){
							quesitosJson.forEach(function(item, i){
								if(item.COD_ITEM == quesito){
									quesitoIgual = true;
									quesitosJson[i] = ({ "COD_LADO":"", "COD_ITEM": quesito, "NUM_RESPOSTA": item.NUM_RESPOSTA, "NUM_ALTERNATIVO": resposta, "DES_RESPOSTA": item.DES_RESPOSTA, "DES_FOTO": item.DES_FOTO });
								}
							});

							if(quesitoIgual == false){
								quesitosJson[indice] = ({ "COD_LADO":"", "COD_ITEM": quesito, "NUM_RESPOSTA": "", "NUM_ALTERNATIVO": resposta, "DES_RESPOSTA": "", "DES_FOTO": "" });
							}
						}
					}

					//FOTO
					if(item.indexOf("ft") != -1){
						
						if( quesitoObrigatorio == true && resposta != null){
							quesitosJson.forEach(function(item, i){
								if(item.COD_ITEM == quesito){
									quesitoIgual = true;
									quesitosJson[i] = ({ "COD_LADO":"", "COD_ITEM": quesito, "NUM_RESPOSTA": item.NUM_RESPOSTA, "NUM_ALTERNATIVO": item.NUM_ALTERNATIVO, "DES_RESPOSTA": item.DES_RESPOSTA, "DES_FOTO": resposta });
								}
							});
							if(quesitoIgual == false){
								quesitosJson[indice] = ({ "COD_LADO":"", "COD_ITEM": quesito, "NUM_RESPOSTA": "", "NUM_ALTERNATIVO": "", "DES_RESPOSTA": "", "DES_FOTO": resposta });
							}
						}
					}
				}

				if( quesitoObrigatorio == true && respostaQuesito != null && quesitoIgual == false){
					indice++;
				}
			}
		});
		
		// VERIFICA SE OS QUESITOS OBRIGATORIOS FORAM PREENCHIDOS
		let quesitosObrigatoriosNaoPreenchidos = [];
		quesitos.GRUPO.forEach(function(grupos, g){
			grupos.QUESITOS.forEach(function(quesito, q){
				if(quesito.IND_OBRIGATORIO == true){
					if(quesito.IND_CHECKBOX == true){
						let resposta = quesitosJson.find( quesitoJson => quesitoJson.COD_ITEM == quesito.COD_ITEM );
						if( resposta == undefined ){
							quesitosObrigatoriosNaoPreenchidos.push(quesito.COD_ITEM);
						}
					}
					if(quesito.IND_DECIMAL == true){
						let resposta = quesitosJson.find( quesitoJson => quesitoJson.COD_ITEM == quesito.COD_ITEM );
						if( resposta == undefined ){
							quesitosObrigatoriosNaoPreenchidos.push(quesito.COD_ITEM);
						}else{
							if(resposta.NUM_ALTERNATIVO == '' || resposta.NUM_ALTERNATIVO == null ){
								quesitosObrigatoriosNaoPreenchidos.push(quesito.COD_ITEM);
							}
						}
					}
					if(quesito.IND_FOTO == true){
						let resposta = quesitosJson.find( quesitoJson => quesitoJson.COD_ITEM == quesito.COD_ITEM );
						if( resposta == undefined ){
							quesitosObrigatoriosNaoPreenchidos.push(quesito.COD_ITEM);
						}else{
							if(resposta.DES_FOTO == '' || resposta.DES_FOTO == null ){
								quesitosObrigatoriosNaoPreenchidos.push(quesito.COD_ITEM);
							}
						}
					}
					if(quesito.IND_INTEIRO == true){
						let resposta = quesitosJson.find( quesitoJson => quesitoJson.COD_ITEM == quesito.COD_ITEM );
						if( resposta == undefined ){
							quesitosObrigatoriosNaoPreenchidos.push(quesito.COD_ITEM);
						}else{
							if(resposta.NUM_ALTERNATIVO == '' || resposta.NUM_ALTERNATIVO == null ){
								quesitosObrigatoriosNaoPreenchidos.push(quesito.COD_ITEM);
							}
						}
					}
					if(quesito.IND_LISTA == true){
						let resposta = quesitosJson.find( quesitoJson => quesitoJson.COD_ITEM == quesito.COD_ITEM );
						if( resposta == undefined ){
							quesitosObrigatoriosNaoPreenchidos.push(quesito.COD_ITEM);
						}else{
							if(resposta.NUM_RESPOSTA == '' || resposta.NUM_ALTERNATIVO == null ){
								quesitosObrigatoriosNaoPreenchidos.push(quesito.COD_ITEM);
							}
						}
					}
					if(quesito.IND_RADIO == true){
						let resposta = quesitosJson.find( quesitoJson => quesitoJson.COD_ITEM == quesito.COD_ITEM );
						if( resposta == undefined ){
							quesitosObrigatoriosNaoPreenchidos.push(quesito.COD_ITEM);
						}else{
							if(resposta.NUM_RESPOSTA == '' || resposta.NUM_ALTERNATIVO == null ){
								quesitosObrigatoriosNaoPreenchidos.push(quesito.COD_ITEM);
							}
						}
					}
					if(quesito.IND_TEXTO == true){
						let resposta = quesitosJson.find( quesitoJson => quesitoJson.COD_ITEM == quesito.COD_ITEM );
						if( resposta == undefined ){
							quesitosObrigatoriosNaoPreenchidos.push(quesito.COD_ITEM);
						}else{
							if(resposta.DES_RESPOSTA == '' || resposta.DES_RESPOSTA == null ){
								quesitosObrigatoriosNaoPreenchidos.push(quesito.COD_ITEM);
							}
						}
					}
				}
			});
		});

		//SE HOUVEREM QUESITOS NAO PREENCHIDOS, EXIBE MENSAGEM
		if(quesitosObrigatoriosNaoPreenchidos.length > 0 ){
			var quesitosNaoPreenchidos = quesitosObrigatoriosNaoPreenchidos.map(function(quesito, i) {
				return ' '+quesito;
			});

			Alert.alert('Aviso', 'Os quesitos '+quesitosNaoPreenchidos+', não foram preenchidos e são obrigatórios para a data de hoje.'); return;
		}
		
		async function registrar(dominio, quesitosJson, codEmitente, nomeEquipamento, codOperador){
			if(quesitosJson.length == 0 ){
				Alert.alert('Aviso', 'Favor preencher o checklist.'); return;
			}
			setloading(true);
			//REGISTRA CHECKLIST
			let respostaChecklist = await registrarChecklist(dominio, quesitosJson, codEmitente, nomeEquipamento, codOperador);
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
				registrar(dominio, quesitosJson, codEmitente, nomeEquipamento, codOperador);
			}else{
			  Alert.alert('Aviso', 'Dispositivo sem conexão com a internet.');
			}
		});
	}

	function abreFechaMenu(){
		console.log('abreFechaMenu');
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
					{ 
					imgEquipamento 
					? <Image style={styles.img} source={{uri: imgEquipamento}}  />
					: <Image style={styles.img} source={require('../assets/foto.png')}  />
					}
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
									<Collapse 
										isExpanded={ false }
										onToggle={ (isExpanded) => setFieldValue('icon_'+grupo.COD_GRUPO, isExpanded ) } 
										>
										<CollapseHeader>
											<Separator style={{ backgroundColor: '#fdb700', height: 45, marginTop: 3 }} bordered >
											<Text style={{ fontWeight: 'bold', fontSize: 16, color: '#000000' }}>
											<Icon
												name={ values['icon_'+grupo.COD_GRUPO] == true ? 'angle-up' : 'angle-down' }
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
																				{ quesito.IND_OBRIGATORIO == false && (<Text style={{ marginLeft: 10, marginTop: 10, fontWeight: 'bold', color: '#1A237C' }}>Não programado para hoje</Text>) }
																				{
																					//LIST BOX
																					quesito.IND_LISTA == true && quesito.IND_ATIVO == true &&
																					(
																						<Picker
																								enabled={quesito.IND_OBRIGATORIO}
																								selectedValue={
																									listbox.COD_OPCAO == 1 ? values['Pneu_1_lbQ'+quesito.COD_ITEM] : 
																									listbox.COD_OPCAO == 2 ? values['Pneu_2_lbQ'+quesito.COD_ITEM] : 
																									listbox.COD_OPCAO == 3 ? values['Pneu_3_lbQ'+quesito.COD_ITEM] : 
																									listbox.COD_OPCAO == 4 ? values['Pneu_4_lbQ'+quesito.COD_ITEM] : 
																									listbox.COD_OPCAO == 5 ? values['Pneu_5_lbQ'+quesito.COD_ITEM] : 
																									listbox.COD_OPCAO == 6 ? values['Pneu_6_lbQ'+quesito.COD_ITEM] : 
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
																									disabled={!quesito.IND_OBRIGATORIO}
																									key={radio.DES_OPCAO}
																									onPress={ () => setFieldValue('Pneu_'+listbox.COD_OPCAO+'_rbQ'+quesito.COD_ITEM, radio.COD_OPCAO) }
																									>
																									<Radio
																										disabled={!quesito.IND_OBRIGATORIO}
																										onPress={ () => setFieldValue('Pneu_'+listbox.COD_OPCAO+'_rbQ'+quesito.COD_ITEM, radio.COD_OPCAO) }
																										color={"#f0ad4e"}
																										selectedColor={"#5cb85c"}
																										selected={
																											listbox.COD_OPCAO == 1 ? values['Pneu_1_rbQ'+quesito.COD_ITEM] == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 ? values['Pneu_2_rbQ'+quesito.COD_ITEM] == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 ? values['Pneu_3_rbQ'+quesito.COD_ITEM] == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 ? values['Pneu_4_rbQ'+quesito.COD_ITEM] == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 ? values['Pneu_5_rbQ'+quesito.COD_ITEM] == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 6 ? values['Pneu_6_rbQ'+quesito.COD_ITEM] == radio.COD_OPCAO ? true : false :
																											false
																										}
																									/>
																									{ quesito.IND_OBRIGATORIO == true ? <Text style={{color: '#000000'}}>{'  '+radio.DES_OPCAO}</Text> : <Text style={{color: '#7d7d7d'}}>{'  '+radio.DES_OPCAO}</Text> }
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
																								disabled={!quesito.IND_OBRIGATORIO}
																								trackColor={{ false: "#C4C4C4", true: "#C5DB5F" }}
																								thumbColor={ "#fff"}
																								ios_backgroundColor="#fff"
																								onValueChange={ (previousState) => setFieldValue('Pneu_'+listbox.COD_OPCAO+'_cbQ'+quesito.COD_ITEM, previousState ) }
																								value={
																									listbox.COD_OPCAO == 1 ? values['Pneu_1_cbQ'+quesito.COD_ITEM] : 
																									listbox.COD_OPCAO == 2 ? values['Pneu_2_cbQ'+quesito.COD_ITEM] : 
																									listbox.COD_OPCAO == 3 ? values['Pneu_3_cbQ'+quesito.COD_ITEM] : 
																									listbox.COD_OPCAO == 4 ? values['Pneu_4_cbQ'+quesito.COD_ITEM] : 
																									listbox.COD_OPCAO == 5 ? values['Pneu_5_cbQ'+quesito.COD_ITEM] : 
																									listbox.COD_OPCAO == 6 ? values['Pneu_6_cbQ'+quesito.COD_ITEM] : 
																									false
																								}
																							/>
																							<Text style={{fontWeight: 'bold'}}>
																							{
																								listbox.COD_OPCAO == 1 ? values['Pneu_1_cbQ'+quesito.COD_ITEM]  == true ? 'Sim' : 'Não' : 
																								listbox.COD_OPCAO == 2 ? values['Pneu_2_cbQ'+quesito.COD_ITEM]  == true ? 'Sim' : 'Não' : 
																								listbox.COD_OPCAO == 3 ? values['Pneu_3_cbQ'+quesito.COD_ITEM]  == true ? 'Sim' : 'Não' : 
																								listbox.COD_OPCAO == 4 ? values['Pneu_4_cbQ'+quesito.COD_ITEM]  == true ? 'Sim' : 'Não' : 
																								listbox.COD_OPCAO == 5 ? values['Pneu_5_cbQ'+quesito.COD_ITEM]  == true ? 'Sim' : 'Não' : 
																								listbox.COD_OPCAO == 6 ? values['Pneu_6_cbQ'+quesito.COD_ITEM]  == true ? 'Sim' : 'Não' : 
																								false
																							}
																							</Text>
																						</ListItem>	
																					)
																				}
																				{
																					//INPUT INTEIRO PNEU
																					quesito.IND_INTEIRO == true && quesito.IND_ATIVO == true && 
																					(	
																						<>
																						<Input 
																							editable={quesito.IND_OBRIGATORIO}
																							onChangeText={handleChange('Pneu_'+listbox.COD_OPCAO+'_inputInteiroQ'+quesito.COD_ITEM)}
																							onBlur={handleBlur('Pneu_'+listbox.COD_OPCAO+'_inputInteiroQ'+quesito.COD_ITEM)}
																							placeholder='Valor inteiro'
																							keyboardType='number-pad'
																							value={
																								listbox.COD_OPCAO == 1 ? values['Pneu_1_inputInteiroQ'+quesito.COD_ITEM] : 
																								listbox.COD_OPCAO == 2 ? values['Pneu_2_inputInteiroQ'+quesito.COD_ITEM] : 
																								listbox.COD_OPCAO == 3 ? values['Pneu_3_inputInteiroQ'+quesito.COD_ITEM] : 
																								listbox.COD_OPCAO == 4 ? values['Pneu_4_inputInteiroQ'+quesito.COD_ITEM] : 
																								listbox.COD_OPCAO == 5 ? values['Pneu_5_inputInteiroQ'+quesito.COD_ITEM] : 
																								listbox.COD_OPCAO == 6 ? values['Pneu_6_inputInteiroQ'+quesito.COD_ITEM] : 
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
																							editable={quesito.IND_OBRIGATORIO}
																							onChangeText={handleChange('Pneu_'+listbox.COD_OPCAO+'_inputDecimalQ'+quesito.COD_ITEM)}
																							onBlur={handleBlur('Pneu_'+listbox.COD_OPCAO+'_inputDecimalQ'+quesito.COD_ITEM)}
																							placeholder='Valor decimal'
																							value={
																								listbox.COD_OPCAO == 1 ? values['Pneu_1_inputDecimalQ'+quesito.COD_ITEM] : 
																								listbox.COD_OPCAO == 2 ? values['Pneu_2_inputDecimalQ'+quesito.COD_ITEM] : 
																								listbox.COD_OPCAO == 3 ? values['Pneu_3_inputDecimalQ'+quesito.COD_ITEM] : 
																								listbox.COD_OPCAO == 4 ? values['Pneu_4_inputDecimalQ'+quesito.COD_ITEM] : 
																								listbox.COD_OPCAO == 5 ? values['Pneu_5_inputDecimalQ'+quesito.COD_ITEM] : 
																								listbox.COD_OPCAO == 6 ? values['Pneu_6_inputDecimalQ'+quesito.COD_ITEM] : 
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
																							editable={quesito.IND_OBRIGATORIO}
																							onChangeText={handleChange('Pneu_'+listbox.COD_OPCAO+'_inputTextoQ'+quesito.COD_ITEM)}
																							onBlur={handleBlur('Pneu_'+listbox.COD_OPCAO+'_inputTextoQ'+quesito.COD_ITEM)}
																							placeholder='Observação'
																							value={
																								listbox.COD_OPCAO == 1 ? values['Pneu_1_inputTextoQ'+quesito.COD_ITEM] : 
																								listbox.COD_OPCAO == 2 ? values['Pneu_2_inputTextoQ'+quesito.COD_ITEM] : 
																								listbox.COD_OPCAO == 3 ? values['Pneu_3_inputTextoQ'+quesito.COD_ITEM] : 
																								listbox.COD_OPCAO == 4 ? values['Pneu_4_inputTextoQ'+quesito.COD_ITEM] : 
																								listbox.COD_OPCAO == 5 ? values['Pneu_5_inputTextoQ'+quesito.COD_ITEM] : 
																								listbox.COD_OPCAO == 6 ? values['Pneu_6_inputTextoQ'+quesito.COD_ITEM] : 
																								false
																							}
																						/>
																						</>
																					)
																				}
																				<NavigationEvents 
																					onDidFocus={payload => 
																						{
																							payload.state.params != undefined && payload.state.params.tipo == 'pneu' &&
																							 (
																								listbox.COD_OPCAO == 1 && payload.state.params.numero == 1 ?
																								setFieldValue('Pneu_1_ftQ'+payload.state.params.quesito, payload.state.params.fotoBase64 )
																								: 
																								listbox.COD_OPCAO == 2 && payload.state.params.numero == 2 ?
																								setFieldValue('Pneu_2_ftQ'+payload.state.params.quesito, payload.state.params.fotoBase64 )
																								:
																								listbox.COD_OPCAO == 3 && payload.state.params.numero == 3 ?
																								setFieldValue('Pneu_3_ftQ'+payload.state.params.quesito, payload.state.params.fotoBase64 )
																								:
																								listbox.COD_OPCAO == 4 && payload.state.params.numero == 4 ?
																								setFieldValue('Pneu_4_ftQ'+payload.state.params.quesito, payload.state.params.fotoBase64 )
																								:
																								listbox.COD_OPCAO == 5 && payload.state.params.numero == 5 ?
																								setFieldValue('Pneu_5_ftQ'+payload.state.params.quesito, payload.state.params.fotoBase64 )
																								:
																								listbox.COD_OPCAO == 6 && payload.state.params.numero == 6 ?
																								setFieldValue('Pneu_6_ftQ'+payload.state.params.quesito, payload.state.params.fotoBase64 )
																								:
																								''
																							)
																						}
																					}
																				/>
																				{
																					//FOTO
																					quesito.IND_FOTO == true && quesito.IND_ATIVO == true && 
																					(	
																						<>
																						{
																							values['Pneu_'+listbox.COD_OPCAO+'_ftQ'+quesito.COD_ITEM] == undefined &&(
																								<Button disabled={!quesito.IND_OBRIGATORIO} buttonStyle={styles.botaoFoto} title="Capturar Foto" onPress={ () => props.navigation.navigate('Camera', { rota: 'Checklist', quesito: quesito.COD_ITEM, tipo: 'pneu', numero: listbox.COD_OPCAO }) } />
																							)
																						}
																						
																						<View style={styles.containerImgQuesito}>
																							{	
																								//PNEU 1
																								contadorQuesito.map((contador, i) => {
																									return(
																										listbox.COD_OPCAO == 1 && quesito.COD_ITEM == contador && values['Pneu_1_ftQ'+quesito.COD_ITEM] != undefined && (
																											<View key={i}>
																												<Image style={styles.imgQuesito} source={{uri: values['Pneu_1_ftQ'+quesito.COD_ITEM] }} />
																												<Button disabled={!quesito.IND_OBRIGATORIO} buttonStyle={styles.botaoExcluirFoto} title="Excluir Foto" onPress={ () => setFieldValue('Pneu_1_ftQ'+quesito.COD_ITEM, null ) } />
																											</View>
																										)
																									)
																								})
																							}
																							{	
																								//PNEU 2
																								contadorQuesito.map((contador, i) => {
																									return(
																										listbox.COD_OPCAO == 2 && quesito.COD_ITEM == contador && values['Pneu_2_ftQ'+quesito.COD_ITEM] != undefined && (
																											<View key={i}>
																												<Image style={styles.imgQuesito} source={{uri: values['Pneu_2_ftQ'+quesito.COD_ITEM] }} />
																												<Button disabled={!quesito.IND_OBRIGATORIO} buttonStyle={styles.botaoExcluirFoto} title="Excluir Foto" onPress={ () => setFieldValue('Pneu_2_ftQ'+quesito.COD_ITEM, null ) } />
																											</View>
																										)
																									)
																								})
																							}
																							{	
																								//PNEU 3
																								contadorQuesito.map((contador, i) => {
																									return(
																										listbox.COD_OPCAO == 3 && quesito.COD_ITEM == contador && values['Pneu_3_ftQ'+quesito.COD_ITEM] != undefined && (
																											<View key={i}>
																												<Image style={styles.imgQuesito} source={{uri: values['Pneu_3_ftQ'+quesito.COD_ITEM] }} />
																												<Button disabled={!quesito.IND_OBRIGATORIO} buttonStyle={styles.botaoExcluirFoto} title="Excluir Foto" onPress={ () => setFieldValue('Pneu_3_ftQ'+quesito.COD_ITEM, null ) } />
																											</View>
																										)
																									)
																								})
																							}
																							{	
																								//PNEU 4
																								contadorQuesito.map((contador, i) => {
																									return(
																										listbox.COD_OPCAO == 4 && quesito.COD_ITEM == contador && values['Pneu_4_ftQ'+quesito.COD_ITEM] != undefined && (
																											<View key={i}>
																												<Image style={styles.imgQuesito} source={{uri: values['Pneu_4_ftQ'+quesito.COD_ITEM] }} />
																												<Button disabled={!quesito.IND_OBRIGATORIO} buttonStyle={styles.botaoExcluirFoto} title="Excluir Foto" onPress={ () => setFieldValue('Pneu_4_ftQ'+quesito.COD_ITEM, null ) } />
																											</View>
																										)
																									)
																								})
																							}
																							{	
																								//PNEU 5
																								contadorQuesito.map((contador, i) => {
																									return(
																										listbox.COD_OPCAO == 5 && quesito.COD_ITEM == contador && values['Pneu_5_ftQ'+quesito.COD_ITEM] != undefined && (
																											<View key={i}>
																												<Image style={styles.imgQuesito} source={{uri: values['Pneu_5_ftQ'+quesito.COD_ITEM] }} />
																												<Button disabled={!quesito.IND_OBRIGATORIO} buttonStyle={styles.botaoExcluirFoto} title="Excluir Foto" onPress={ () => setFieldValue('Pneu_5_ftQ'+quesito.COD_ITEM, null ) } />
																											</View>
																										)
																									)
																								})
																							}
																							{	
																								//PNEU 6
																								contadorQuesito.map((contador, i) => {
																									return(
																										listbox.COD_OPCAO == 6 && quesito.COD_ITEM == contador && values['Pneu_6_ftQ'+quesito.COD_ITEM] != undefined && (
																											<View key={i}>
																												<Image style={styles.imgQuesito} source={{uri: values['Pneu_6_ftQ'+quesito.COD_ITEM] }} />
																												<Button disabled={!quesito.IND_OBRIGATORIO} buttonStyle={styles.botaoExcluirFoto} title="Excluir Foto" onPress={ () => setFieldValue('Pneu_6_ftQ'+quesito.COD_ITEM, null ) } />
																											</View>
																										)
																									)
																								})
																							}
																						</View>
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
																				{ quesito.IND_OBRIGATORIO == false && (<Text style={{ marginLeft: 10, marginTop: 10, fontWeight: 'bold', color: '#1A237C' }}>Não programado para hoje</Text>) }
																				{
																					//LIST BOX
																					quesito.IND_LISTA == true && quesito.IND_ATIVO == true &&
																					(
																						<Picker
																								enabled={quesito.IND_OBRIGATORIO}
																								selectedValue={
																									listbox.COD_OPCAO == 1 ? values['Lataria_1_lbQ'+quesito.COD_ITEM] : 
																									listbox.COD_OPCAO == 2 ? values['Lataria_2_lbQ'+quesito.COD_ITEM] : 
																									listbox.COD_OPCAO == 3 ? values['Lataria_3_lbQ'+quesito.COD_ITEM] : 
																									listbox.COD_OPCAO == 4 ? values['Lataria_4_lbQ'+quesito.COD_ITEM] : 
																									listbox.COD_OPCAO == 5 ? values['Lataria_5_lbQ'+quesito.COD_ITEM] : 
																									listbox.COD_OPCAO == 6 ? values['Lataria_6_lbQ'+quesito.COD_ITEM] : 
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
																									disabled={!quesito.IND_OBRIGATORIO}
																									key={radio.DES_OPCAO}
																									onPress={ () => setFieldValue('Lataria_'+listbox.COD_OPCAO+'_rbQ'+quesito.COD_ITEM, radio.COD_OPCAO) }
																									>
																									<Radio
																										disabled={!quesito.IND_OBRIGATORIO}
																										onPress={ () => setFieldValue('Lataria_'+listbox.COD_OPCAO+'_rbQ'+quesito.COD_ITEM, radio.COD_OPCAO) }
																										color={"#f0ad4e"}
																										selectedColor={"#5cb85c"}
																										selected={ 
																											listbox.COD_OPCAO == 1 ? values['Lataria_1_rbQ'+quesito.COD_ITEM] == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 2 ? values['Lataria_2_rbQ'+quesito.COD_ITEM] == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 3 ? values['Lataria_3_rbQ'+quesito.COD_ITEM] == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 4 ? values['Lataria_4_rbQ'+quesito.COD_ITEM] == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 5 ? values['Lataria_5_rbQ'+quesito.COD_ITEM] == radio.COD_OPCAO ? true : false :
																											listbox.COD_OPCAO == 6 ? values['Lataria_6_rbQ'+quesito.COD_ITEM] == radio.COD_OPCAO ? true : false :
																											false
																										}
																									/>
																									{ quesito.IND_OBRIGATORIO == true ? <Text style={{color: '#000000'}}>{'  '+radio.DES_OPCAO}</Text> : <Text style={{color: '#7d7d7d'}}>{'  '+radio.DES_OPCAO}</Text> }
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
																								disabled={!quesito.IND_OBRIGATORIO}
																								trackColor={{ false: "#C4C4C4", true: "#C5DB5F" }}
																								thumbColor={ "#fff"}
																								ios_backgroundColor="#fff"
																								onValueChange={ (previousState) => setFieldValue('Lataria_'+listbox.COD_OPCAO+'_cbQ'+quesito.COD_ITEM, previousState ) }
																								value={
																									listbox.COD_OPCAO == 1 ? values['Lataria_1_cbQ'+quesito.COD_ITEM] : 
																									listbox.COD_OPCAO == 2 ? values['Lataria_2_cbQ'+quesito.COD_ITEM] : 
																									listbox.COD_OPCAO == 3 ? values['Lataria_3_cbQ'+quesito.COD_ITEM] : 
																									listbox.COD_OPCAO == 4 ? values['Lataria_4_cbQ'+quesito.COD_ITEM] : 
																									listbox.COD_OPCAO == 5 ? values['Lataria_5_cbQ'+quesito.COD_ITEM] :
																									listbox.COD_OPCAO == 6 ? values['Lataria_6_cbQ'+quesito.COD_ITEM] :
																									false
																								}
																							/>
																							<Text style={{fontWeight: 'bold'}}>
																							{
																								listbox.COD_OPCAO == 1 ? values['Lataria_1_cbQ'+quesito.COD_ITEM]  == true ? 'Sim' : 'Não' : 
																								listbox.COD_OPCAO == 2 ? values['Lataria_2_cbQ'+quesito.COD_ITEM]  == true ? 'Sim' : 'Não' : 
																								listbox.COD_OPCAO == 3 ? values['Lataria_3_cbQ'+quesito.COD_ITEM]  == true ? 'Sim' : 'Não' : 
																								listbox.COD_OPCAO == 4 ? values['Lataria_4_cbQ'+quesito.COD_ITEM]  == true ? 'Sim' : 'Não' : 
																								listbox.COD_OPCAO == 5 ? values['Lataria_5_cbQ'+quesito.COD_ITEM]  == true ? 'Sim' : 'Não' : 
																								false
																							}
																							</Text>
																						</ListItem>	
																					)
																				}
																				{
																					//INPUT INTEIRO Lataria
																					quesito.IND_INTEIRO == true && quesito.IND_ATIVO == true && 
																					(	
																						<>
																						<Input 
																							editable={quesito.IND_OBRIGATORIO}
																							onChangeText={handleChange('Lataria_'+listbox.COD_OPCAO+'_inputInteiroQ'+quesito.COD_ITEM)}
																							onBlur={handleBlur('Lataria_'+listbox.COD_OPCAO+'_inputInteiroQ'+quesito.COD_ITEM)}
																							placeholder='Valor'
																							value={
																								listbox.COD_OPCAO == 1 ? values['Lataria_1_inputInteiroQ'+quesito.COD_ITEM] : 
																								listbox.COD_OPCAO == 2 ? values['Lataria_2_inputInteiroQ'+quesito.COD_ITEM] : 
																								listbox.COD_OPCAO == 3 ? values['Lataria_3_inputInteiroQ'+quesito.COD_ITEM] : 
																								listbox.COD_OPCAO == 4 ? values['Lataria_4_inputInteiroQ'+quesito.COD_ITEM] : 
																								listbox.COD_OPCAO == 5 ? values['Lataria_5_inputInteiroQ'+quesito.COD_ITEM] : 
																								listbox.COD_OPCAO == 6 ? values['Lataria_6_inputInteiroQ'+quesito.COD_ITEM] : 
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
																							editable={quesito.IND_OBRIGATORIO}
																							onChangeText={handleChange('Lataria_'+listbox.COD_OPCAO+'_inputDecimalQ'+quesito.COD_ITEM)}
																							onBlur={handleBlur('Lataria_'+listbox.COD_OPCAO+'_inputDecimalQ'+quesito.COD_ITEM)}
																							placeholder='Valor'
																							value={
																								listbox.COD_OPCAO == 1 ? values['Lataria_1_inputDecimalQ'+quesito.COD_ITEM] : 
																								listbox.COD_OPCAO == 2 ? values['Lataria_2_inputDecimalQ'+quesito.COD_ITEM] : 
																								listbox.COD_OPCAO == 3 ? values['Lataria_3_inputDecimalQ'+quesito.COD_ITEM] : 
																								listbox.COD_OPCAO == 4 ? values['Lataria_4_inputDecimalQ'+quesito.COD_ITEM] : 
																								listbox.COD_OPCAO == 5 ? values['Lataria_5_inputDecimalQ'+quesito.COD_ITEM] : 
																								listbox.COD_OPCAO == 6 ? values['Lataria_6_inputDecimalQ'+quesito.COD_ITEM] : 
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
																							editable={quesito.IND_OBRIGATORIO}
																							onChangeText={handleChange('Lataria_'+listbox.COD_OPCAO+'_inputTextoQ'+quesito.COD_ITEM)}
																							onBlur={handleBlur('Lataria_'+listbox.COD_OPCAO+'_inputTextoQ'+quesito.COD_ITEM)}
																							placeholder='Observação'
																							value={
																								listbox.COD_OPCAO == 1 ? values['Lataria_1_inputTextoQ'+quesito.COD_ITEM] : 
																								listbox.COD_OPCAO == 2 ? values['Lataria_2_inputTextoQ'+quesito.COD_ITEM] : 
																								listbox.COD_OPCAO == 3 ? values['Lataria_3_inputTextoQ'+quesito.COD_ITEM] : 
																								listbox.COD_OPCAO == 4 ? values['Lataria_4_inputTextoQ'+quesito.COD_ITEM] : 
																								listbox.COD_OPCAO == 5 ? values['Lataria_5_inputTextoQ'+quesito.COD_ITEM] : 
																								listbox.COD_OPCAO == 6 ? values['Lataria_6_inputTextoQ'+quesito.COD_ITEM] : 
																								false
																							}
																						/>
																						</>
																					)
																				}
																				<NavigationEvents 
																					onDidFocus={payload => 
																						{
																							payload.state.params != undefined && payload.state.params.tipo == 'lataria'
																							&& (
																								listbox.COD_OPCAO == 1 && payload.state.params.numero == 1 ?
																								setFieldValue('Lataria_1_ftQ'+payload.state.params.quesito, payload.state.params.fotoBase64 )
																								: 
																								listbox.COD_OPCAO == 2 && payload.state.params.numero == 2 ?
																								setFieldValue('Lataria_2_ftQ'+payload.state.params.quesito, payload.state.params.fotoBase64 )
																								:
																								listbox.COD_OPCAO == 3 && payload.state.params.numero == 3 ?
																								setFieldValue('Lataria_3_ftQ'+payload.state.params.quesito, payload.state.params.fotoBase64 )
																								:
																								listbox.COD_OPCAO == 4 && payload.state.params.numero == 4 ?
																								setFieldValue('Lataria_4_ftQ'+payload.state.params.quesito, payload.state.params.fotoBase64 )
																								:
																								listbox.COD_OPCAO == 5 && payload.state.params.numero == 5 ?
																								setFieldValue('Lataria_5_ftQ'+payload.state.params.quesito, payload.state.params.fotoBase64 )
																								:
																								''
																							)
																						}
																					}
																				/>
																				{
																				//FOTO
																				quesito.IND_FOTO == true && quesito.IND_ATIVO == true && 
																				(	
																					<>
																					{
																						values['Lataria_'+listbox.COD_OPCAO+'_ftQ'+quesito.COD_ITEM] == undefined &&(
																							<Button disabled={!quesito.IND_OBRIGATORIO} buttonStyle={styles.botaoFoto} title="Capturar Foto" onPress={ () => props.navigation.navigate('Camera', { rota: 'Checklist', quesito: quesito.COD_ITEM, tipo: 'lataria', numero: listbox.COD_OPCAO }) } />
																						)
																					}
																					<View style={styles.containerImgQuesito}>
																						{	
																							//LATARIA 1
																							contadorQuesito.map((contador, i) => {
																								return(
																									listbox.COD_OPCAO == 1 && quesito.COD_ITEM == contador && values['Lataria_1_ftQ'+quesito.COD_ITEM] != undefined && (
																										<View key={i}>
																											<Image style={styles.imgQuesito} source={{uri: values['Lataria_1_ftQ'+quesito.COD_ITEM] }} />
																											<Button disabled={!quesito.IND_OBRIGATORIO} buttonStyle={styles.botaoExcluirFoto} title="Excluir Foto" onPress={ () => setFieldValue('Lataria_1_ftQ'+quesito.COD_ITEM, null ) } />
																										</View>
																									)
																								)
																							})
																						}
																						{	
																							//Lataria 2
																							contadorQuesito.map((contador, i) => {
																								return(
																									listbox.COD_OPCAO == 2 && quesito.COD_ITEM == contador && values['Lataria_2_ftQ'+quesito.COD_ITEM] != undefined && (
																										<View key={i}>
																											<Image style={styles.imgQuesito} source={{uri: values['Lataria_2_ftQ'+quesito.COD_ITEM] }} />
																											<Button disabled={!quesito.IND_OBRIGATORIO} buttonStyle={styles.botaoExcluirFoto} title="Excluir Foto" onPress={ () => setFieldValue('Lataria_2_ftQ'+quesito.COD_ITEM, null ) } />
																										</View>
																									)
																								)
																							})
																						}
																						{	
																							//Lataria 3
																							contadorQuesito.map((contador, i) => {
																								return(
																									listbox.COD_OPCAO == 3 && quesito.COD_ITEM == contador && values['Lataria_3_ftQ'+quesito.COD_ITEM] != undefined && (
																										<View key={i}>
																											<Image style={styles.imgQuesito} source={{uri: values['Lataria_3_ftQ'+quesito.COD_ITEM] }} />
																											<Button disabled={!quesito.IND_OBRIGATORIO} buttonStyle={styles.botaoExcluirFoto} title="Excluir Foto" onPress={ () => setFieldValue('Lataria_3_ftQ'+quesito.COD_ITEM, null ) } />
																										</View>
																									)
																								)
																							})
																						}
																						{	
																							//Lataria 4
																							contadorQuesito.map((contador, i) => {
																								return(
																									listbox.COD_OPCAO == 4 && quesito.COD_ITEM == contador && values['Lataria_4_ftQ'+quesito.COD_ITEM] != undefined && (
																										<View key={i}>
																											<Image style={styles.imgQuesito} source={{uri: values['Lataria_4_ftQ'+quesito.COD_ITEM] }} />
																											<Button disabled={!quesito.IND_OBRIGATORIO} buttonStyle={styles.botaoExcluirFoto} title="Excluir Foto" onPress={ () => setFieldValue('Lataria_4_ftQ'+quesito.COD_ITEM, null ) } />
																										</View>
																									)
																								)
																							})
																						}
																						{	
																							//Lataria 5
																							contadorQuesito.map((contador, i) => {
																								return(
																									listbox.COD_OPCAO == 5 && quesito.COD_ITEM == contador && values['Lataria_5_ftQ'+quesito.COD_ITEM] != undefined && (
																										<View key={i}>
																											<Image style={styles.imgQuesito} source={{uri: values['Lataria_5_ftQ'+quesito.COD_ITEM] }} />
																											<Button disabled={!quesito.IND_OBRIGATORIO} buttonStyle={styles.botaoExcluirFoto} title="Excluir Foto" onPress={ () => setFieldValue('Lataria_5_ftQ'+quesito.COD_ITEM, null ) } />
																										</View>
																									)
																								)
																							})
																						}
																					</View>
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
																	<>
																	{
																		quesito.IND_OBRIGATORIO == true ?
																		<Text style={{fontSize: 20, marginLeft: 10, marginTop: 10, fontWeight: 'bold', color: '#000000' }}>{quesito.COD_ITEM+'. '+quesito.QUESITO}</Text>
																		:
																		<> 
																		<Text style={{fontSize: 20, marginLeft: 10, marginTop: 10, fontWeight: 'bold', color: '#7d7d7d' }}>{quesito.COD_ITEM+'. '+quesito.QUESITO}</Text>
																		<Text style={{ marginLeft: 10, marginTop: 10, fontWeight: 'bold', color: '#7d7d7d' }}>Não programado para hoje</Text>
																		</>
																	}
																	</>
																)
															}
															{
																//LIST BOX
																quesito.IND_PNEU == false && quesito.IND_LATARIA == false && quesito.IND_LISTA == true && quesito.IND_ATIVO == true &&
																(
																		<Picker
																			enabled={quesito.IND_OBRIGATORIO}
																			selectedValue={
																				values['lbQuesito_'+quesito.COD_ITEM]
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
																				disabled={!quesito.IND_OBRIGATORIO}
																				key={radio.DES_OPCAO}
																				onPress={ () => setFieldValue('rbQuesito_'+quesito.COD_ITEM, radio.COD_OPCAO ) }
																				>
																					<Radio
																						disabled={!quesito.IND_OBRIGATORIO}
																						onPress={ () => setFieldValue('rbQuesito_'+quesito.COD_ITEM, radio.COD_OPCAO ) }
																						color={"#f0ad4e"}
																						selectedColor={"#5cb85c"}
																						selected={
																							values['rbQuesito_'+quesito.COD_ITEM] == radio.COD_OPCAO ? true : false
																						}
																					/>
																					{ quesito.IND_OBRIGATORIO == true ? <Text style={{color: '#000000'}}>{'  '+radio.DES_OPCAO}</Text> : <Text style={{color: '#7d7d7d'}}>{'  '+radio.DES_OPCAO}</Text> }
																				
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
																			disabled={!quesito.IND_OBRIGATORIO}
																			trackColor={{ false: "#C4C4C4", true: "#C5DB5F" }}
																			thumbColor={ "#fff"}
																			ios_backgroundColor="#fff"
																			onValueChange={ (previousState) => setFieldValue('cbQuesito_'+quesito.COD_ITEM, previousState ) }
																			value={
																				values['cbQuesito_'+quesito.COD_ITEM]
																			}
																		/>
																		<Text style={{fontWeight: 'bold'}}>
																		{
																			values['cbQuesito_'+quesito.COD_ITEM]  == true ? 'Sim' : 'Não' 
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
																		editable={quesito.IND_OBRIGATORIO}
																		onChangeText={handleChange('inputInteiroQuesito_'+quesito.COD_ITEM)}
																		onBlur={handleBlur('inputInteiroQuesito_'+quesito.COD_ITEM)}
																		placeholder='Valor'
																		value={
																			values['inputInteiroQuesito_'+quesito.COD_ITEM]
																		}
																	/>
																)
															}
															{ 	
																//INPUT DECIMAL
																quesito.IND_PNEU == false && quesito.IND_LATARIA == false && quesito.IND_DECIMAL == true && quesito.IND_ATIVO == true && 
																(	
																	<Input 
																		editable={quesito.IND_OBRIGATORIO}
																		onChangeText={handleChange('inputDecimalQuesito_'+quesito.COD_ITEM)}
																		onBlur={handleBlur('inputDecimalQuesito_'+quesito.COD_ITEM)}
																		placeholder='Valor'
																		value={
																			values['inputDecimalQuesito_'+quesito.COD_ITEM]
																		}
																	/>
																)
															}
															{ 	
																//INPUT TEXTO
																quesito.IND_PNEU == false && quesito.IND_LATARIA == false && quesito.IND_TEXTO == true && quesito.IND_ATIVO == true && 
																(	
																	<Input 
																		editable={quesito.IND_OBRIGATORIO}
																		onChangeText={handleChange('inputTextoQuesito_'+quesito.COD_ITEM)}
																		onBlur={handleBlur('inputTextoQuesito_'+quesito.COD_ITEM)}
																		placeholder='Observação'
																		value={
																			values['inputTextoQuesito_'+quesito.COD_ITEM]
																		}
																	/>
																)
															}
															{ 	
																//FOTO
																quesito.IND_PNEU == false && quesito.IND_LATARIA == false && quesito.IND_FOTO == true && quesito.IND_ATIVO == true && 
																(	
																	<>
																		<NavigationEvents 
																			onDidFocus={payload => 
																				{
																					payload.state.params != undefined 
																					&& (
																						setFieldValue('ftQuesito_'+payload.state.params.quesito, payload.state.params.fotoBase64 )
																					)
																				}
																			}
																		/>
																		{
																			values['ftQuesito_'+quesito.COD_ITEM] == undefined &&(
																				<Button disabled={!quesito.IND_OBRIGATORIO} buttonStyle={styles.botaoFoto} title="Capturar Foto" onPress={ () => props.navigation.navigate('Camera', { rota: 'Checklist', quesito: quesito.COD_ITEM}) } />
																			)
																		}
																		
																		<View style={styles.containerImgQuesito}>
																			{	
																				contadorQuesito.map((contador, i) => {
																					return (
																						quesito.COD_ITEM == i && values['ftQuesito_'+i] != undefined &&
																						(
																							<View key={i}>
																								<Image style={styles.imgQuesito} source={{uri: values['ftQuesito_'+i] }} />
																								<Button disabled={!quesito.IND_OBRIGATORIO} buttonStyle={styles.botaoExcluirFoto} title="Excluir Foto" onPress={ () => setFieldValue('ftQuesito_'+quesito.COD_ITEM, null ) } />
																							</View>
																						)
																					)
																				})
																			}
																		</View>
																	</>
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
	title: 'Checklist',
	/*headerRight: () => (
		<Agenda />
	)*/
}

const array = [1,2,3];


function teste(props) {
	return alert('teste')
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
	containerImgQuesito: {
		justifyContent: 'center',
		alignItems: 'center',
	},
	img: {
		height: 100,
		width: 100,
		resizeMode: 'stretch',
	},
	imgQuesito: {
		marginTop:10,
		height: 180,
		width: 150,
		resizeMode: 'stretch',
	},
	botao: {
		marginTop: 20,
		marginBottom:30,
		backgroundColor: 'rgb(0,86,112)',
	},
	botaoFoto: {
		margin: 10
	},
	botaoExcluirFoto: {
		marginTop: 10,
		backgroundColor: 'red'
	},
});
