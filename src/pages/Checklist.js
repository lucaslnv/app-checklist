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
	const [inputTextoItem1, setInputTextoItem1] = useState('');

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
	const [inputTextoItem2, setInputTextoItem2] = useState('');

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
	const [inputTextoItem3, setInputTextoItem3] = useState('');

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
	const [inputTextoItem4, setInputTextoItem4] = useState('');

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
	const [inputTextoItem5, setInputTextoItem5] = useState('');

	//INPUT DECIMAL ITEM 5
	const [inputDecimalItem5, setInputDecimalItem5] = useState('');

	/* ITEM 6 */

	//CHECKBOX ITEM 6
	const [cbItem6, setCbItem6] = useState(false);
	const toggleSwitchItem6 = () => setCbItem6(previousState => !previousState);

	//RADIO BUTTON ITEM 6
	const [rbItem6, setRbItem6] = useState(false);

	//LIST BOX ITEM 6
	const [lbItem6, setLbItem6] = useState(false);

	//INPUT INTEIRO ITEM 6
	const [inputInteiroItem6, setInputInteiroItem6] = useState('');

	//INPUT TEXTO ITEM 6
	const [inputTextoItem6, setInputTextoItem6] = useState('');

	//INPUT DECIMAL ITEM 6
	const [inputDecimalItem6, setInputDecimalItem6] = useState('');

	/* ITEM 7 */

	//CHECKBOX ITEM 7
	const [cbItem7, setCbItem7] = useState(false);
	const toggleSwitchItem7 = () => setCbItem7(previousState => !previousState);

	//RADIO BUTTON ITEM 7
	const [rbItem7, setRbItem7] = useState(false);

	//LIST BOX ITEM 7
	const [lbItem7, setLbItem7] = useState(false);

	//INPUT INTEIRO ITEM 7
	const [inputInteiroItem7, setInputInteiroItem7] = useState('');

	//INPUT TEXTO ITEM 7
	const [inputTextoItem7, setInputTextoItem7] = useState('');

	//INPUT DECIMAL ITEM 7
	const [inputDecimalItem7, setInputDecimalItem7] = useState('');

	/* ITEM 8 */

	//CHECKBOX ITEM 8
	const [cbItem8, setCbItem8] = useState(false);
	const toggleSwitchItem8 = () => setCbItem8(previousState => !previousState);

	//RADIO BUTTON ITEM 8
	const [rbItem8, setRbItem8] = useState(false);

	//LIST BOX ITEM 8
	const [lbItem8, setLbItem8] = useState(false);

	//INPUT INTEIRO ITEM 8
	const [inputInteiroItem8, setInputInteiroItem8] = useState('');

	//INPUT TEXTO ITEM 8
	const [inputTextoItem8, setInputTextoItem8] = useState('');

	//INPUT DECIMAL ITEM 8
	const [inputDecimalItem8, setInputDecimalItem8] = useState('');

	/* ITEM 9 */

	//CHECKBOX ITEM 9
	const [cbItem9, setCbItem9] = useState(false);
	const toggleSwitchItem9 = () => setCbItem9(previousState => !previousState);

	//RADIO BUTTON ITEM 9
	const [rbItem9, setRbItem9] = useState(false);

	//LIST BOX ITEM 9
	const [lbItem9, setLbItem9] = useState(false);

	//INPUT INTEIRO ITEM 9
	const [inputInteiroItem9, setInputInteiroItem9] = useState('');

	//INPUT TEXTO ITEM 9
	const [inputTextoItem9, setInputTextoItem9] = useState('');

	//INPUT DECIMAL ITEM 9
	const [inputDecimalItem9, setInputDecimalItem9] = useState('');

	/* ITEM 10 */

	//CHECKBOX ITEM 10
	const [cbItem10, setCbItem10] = useState(false);
	const toggleSwitchItem10 = () => setCbItem10(previousState => !previousState);

	//RADIO BUTTON ITEM 10
	const [rbItem10, setRbItem10] = useState(false);

	//LIST BOX ITEM 10
	const [lbItem10, setLbItem10] = useState(false);

	//INPUT INTEIRO ITEM 10
	const [inputInteiroItem10, setInputInteiroItem10] = useState('');

	//INPUT TEXTO ITEM 10
	const [inputTextoItem10, setInputTextoItem10] = useState('');

	//INPUT DECIMAL ITEM 10
	const [inputDecimalItem10, setInputDecimalItem10] = useState('');

	/* ITEM 11 */

	//CHECKBOX ITEM 11
	const [cbItem11, setCbItem11] = useState(false);
	const toggleSwitchItem11 = () => setCbItem11(previousState => !previousState);

	//RADIO BUTTON ITEM 11
	const [rbItem11, setRbItem11] = useState(false);

	//LIST BOX ITEM 11
	const [lbItem11, setLbItem11] = useState(false);

	//INPUT INTEIRO ITEM 11
	const [inputInteiroItem11, setInputInteiroItem11] = useState('');

	//INPUT TEXTO ITEM 11
	const [inputTextoItem11, setInputTextoItem11] = useState('');

	//INPUT DECIMAL ITEM 11
	const [inputDecimalItem11, setInputDecimalItem11] = useState('');

	/* ITEM 12 */

	//CHECKBOX ITEM 12
	const [cbItem12, setCbItem12] = useState(false);
	const toggleSwitchItem12 = () => setCbItem12(previousState => !previousState);

	//RADIO BUTTON ITEM 12
	const [rbItem12, setRbItem12] = useState(false);

	//LIST BOX ITEM 12
	const [lbItem12, setLbItem12] = useState(false);

	//INPUT INTEIRO ITEM 12
	const [inputInteiroItem12, setInputInteiroItem12] = useState('');

	//INPUT TEXTO ITEM 12
	const [inputTextoItem12, setInputTextoItem12] = useState('');

	//INPUT DECIMAL ITEM 12
	const [inputDecimalItem12, setInputDecimalItem12] = useState('');

	/* ITEM 13 */

	//CHECKBOX ITEM 13
	const [cbItem13, setCbItem13] = useState(false);
	const toggleSwitchItem13 = () => setCbItem13(previousState => !previousState);

	//RADIO BUTTON ITEM 13
	const [rbItem13, setRbItem13] = useState(false);

	//LIST BOX ITEM 13
	const [lbItem13, setLbItem13] = useState(false);

	//INPUT INTEIRO ITEM 13
	const [inputInteiroItem13, setInputInteiroItem13] = useState('');

	//INPUT TEXTO ITEM 13
	const [inputTextoItem13, setInputTextoItem13] = useState('');

	//INPUT DECIMAL ITEM 13
	const [inputDecimalItem13, setInputDecimalItem13] = useState('');

	/* ITEM 14 */

	//CHECKBOX ITEM 14
	const [cbItem14, setCbItem14] = useState(false);
	const toggleSwitchItem14 = () => setCbItem14(previousState => !previousState);

	//RADIO BUTTON ITEM 14
	const [rbItem14, setRbItem14] = useState(false);

	//LIST BOX ITEM 14
	const [lbItem14, setLbItem14] = useState(false);

	//INPUT INTEIRO ITEM 14
	const [inputInteiroItem14, setInputInteiroItem14] = useState('');

	//INPUT TEXTO ITEM 14
	const [inputTextoItem14, setInputTextoItem14] = useState('');

	//INPUT DECIMAL ITEM 14
	const [inputDecimalItem14, setInputDecimalItem14] = useState('');

	/* ITEM 15 */

	//CHECKBOX ITEM 15
	const [cbItem15, setCbItem15] = useState(false);
	const toggleSwitchItem15 = () => setCbItem15(previousState => !previousState);

	//RADIO BUTTON ITEM 15
	const [rbItem15, setRbItem15] = useState(false);

	//LIST BOX ITEM 15
	const [lbItem15, setLbItem15] = useState(false);

	//INPUT INTEIRO ITEM 15
	const [inputInteiroItem15, setInputInteiroItem15] = useState('');

	//INPUT TEXTO ITEM 15
	const [inputTextoItem15, setInputTextoItem15] = useState('');

	//INPUT DECIMAL ITEM 15
	const [inputDecimalItem15, setInputDecimalItem15] = useState('');

	/* ITEM 16 */

	//CHECKBOX ITEM 16
	const [cbItem16, setCbItem16] = useState(false);
	const toggleSwitchItem16 = () => setCbItem16(previousState => !previousState);

	//RADIO BUTTON ITEM 16
	const [rbItem16, setRbItem16] = useState(false);

	//LIST BOX ITEM 16
	const [lbItem16, setLbItem16] = useState(false);

	//INPUT INTEIRO ITEM 16
	const [inputInteiroItem16, setInputInteiroItem16] = useState('');

	//INPUT TEXTO ITEM 16
	const [inputTextoItem16, setInputTextoItem16] = useState('');

	//INPUT DECIMAL ITEM 16
	const [inputDecimalItem16, setInputDecimalItem16] = useState('');

	/* ITEM 17 */

	//CHECKBOX ITEM 17
	const [cbItem17, setCbItem17] = useState(false);
	const toggleSwitchItem17 = () => setCbItem17(previousState => !previousState);

	//RADIO BUTTON ITEM 17
	const [rbItem17, setRbItem17] = useState(false);

	//LIST BOX ITEM 17
	const [lbItem17, setLbItem17] = useState(false);

	//INPUT INTEIRO ITEM 17
	const [inputInteiroItem17, setInputInteiroItem17] = useState('');

	//INPUT TEXTO ITEM 17
	const [inputTextoItem17, setInputTextoItem17] = useState('');

	//INPUT DECIMAL ITEM 17
	const [inputDecimalItem17, setInputDecimalItem17] = useState('');

	/* ITEM 18 */

	//CHECKBOX ITEM 18
	const [cbItem18, setCbItem18] = useState(false);
	const toggleSwitchItem18 = () => setCbItem18(previousState => !previousState);

	//RADIO BUTTON ITEM 18
	const [rbItem18, setRbItem18] = useState(false);

	//LIST BOX ITEM 18
	const [lbItem18, setLbItem18] = useState(false);

	//INPUT INTEIRO ITEM 18
	const [inputInteiroItem18, setInputInteiroItem18] = useState('');

	//INPUT TEXTO ITEM 18
	const [inputTextoItem18, setInputTextoItem18] = useState('');

	//INPUT DECIMAL ITEM 18
	const [inputDecimalItem18, setInputDecimalItem18] = useState('');

	/* ITEM 19 */

	//CHECKBOX ITEM 19
	const [cbItem19, setCbItem19] = useState(false);
	const toggleSwitchItem19 = () => setCbItem19(previousState => !previousState);

	//RADIO BUTTON ITEM 19
	const [rbItem19, setRbItem19] = useState(false);

	//LIST BOX ITEM 19
	const [lbItem19, setLbItem19] = useState(false);

	//INPUT INTEIRO ITEM 19
	const [inputInteiroItem19, setInputInteiroItem19] = useState('');

	//INPUT TEXTO ITEM 19
	const [inputTextoItem19, setInputTextoItem19] = useState('');

	//INPUT DECIMAL ITEM 19
	const [inputDecimalItem19, setInputDecimalItem19] = useState('');

	/* ITEM 20 */

	//CHECKBOX ITEM 20
	const [cbItem20, setCbItem20] = useState(false);
	const toggleSwitchItem20 = () => setCbItem20(previousState => !previousState);

	//RADIO BUTTON ITEM 20
	const [rbItem20, setRbItem20] = useState(false);

	//LIST BOX ITEM 20
	const [lbItem20, setLbItem20] = useState(false);

	//INPUT INTEIRO ITEM 20
	const [inputInteiroItem20, setInputInteiroItem20] = useState('');

	//INPUT TEXTO ITEM 20
	const [inputTextoItem20, setInputTextoItem20] = useState('');

	//INPUT DECIMAL ITEM 20
	const [inputDecimalItem20, setInputDecimalItem20] = useState('');

	/* ITEM 21 */

	//CHECKBOX ITEM 21
	const [cbItem21, setCbItem21] = useState(false);
	const toggleSwitchItem21 = () => setCbItem21(previousState => !previousState);

	//RADIO BUTTON ITEM 21
	const [rbItem21, setRbItem21] = useState(false);

	//LIST BOX ITEM 21
	const [lbItem21, setLbItem21] = useState(false);

	//INPUT INTEIRO ITEM 21
	const [inputInteiroItem21, setInputInteiroItem21] = useState('');

	//INPUT TEXTO ITEM 21
	const [inputTextoItem21, setInputTextoItem21] = useState('');

	//INPUT DECIMAL ITEM 21
	const [inputDecimalItem21, setInputDecimalItem21] = useState('');

	/* ITEM 22 */

	//CHECKBOX ITEM 22
	const [cbItem22, setCbItem22] = useState(false);
	const toggleSwitchItem22 = () => setCbItem22(previousState => !previousState);

	//RADIO BUTTON ITEM 22
	const [rbItem22, setRbItem22] = useState(false);

	//LIST BOX ITEM 22
	const [lbItem22, setLbItem22] = useState(false);

	//INPUT INTEIRO ITEM 22
	const [inputInteiroItem22, setInputInteiroItem22] = useState('');

	//INPUT TEXTO ITEM 22
	const [inputTextoItem22, setInputTextoItem22] = useState('');

	//INPUT DECIMAL ITEM 22
	const [inputDecimalItem22, setInputDecimalItem22] = useState('');

	/* ITEM 23 */

	//CHECKBOX ITEM 23
	const [cbItem23, setCbItem23] = useState(false);
	const toggleSwitchItem23 = () => setCbItem23(previousState => !previousState);

	//RADIO BUTTON ITEM 23
	const [rbItem23, setRbItem23] = useState(false);

	//LIST BOX ITEM 23
	const [lbItem23, setLbItem23] = useState(false);

	//INPUT INTEIRO ITEM 23
	const [inputInteiroItem23, setInputInteiroItem23] = useState('');

	//INPUT TEXTO ITEM 23
	const [inputTextoItem23, setInputTextoItem23] = useState('');

	//INPUT DECIMAL ITEM 23
	const [inputDecimalItem23, setInputDecimalItem23] = useState('');

	/* ITEM 24 */

	//CHECKBOX ITEM 24
	const [cbItem24, setCbItem24] = useState(false);
	const toggleSwitchItem24 = () => setCbItem24(previousState => !previousState);

	//RADIO BUTTON ITEM 24
	const [rbItem24, setRbItem24] = useState(false);

	//LIST BOX ITEM 24
	const [lbItem24, setLbItem24] = useState(false);

	//INPUT INTEIRO ITEM 24
	const [inputInteiroItem24, setInputInteiroItem24] = useState('');

	//INPUT TEXTO ITEM 24
	const [inputTextoItem24, setInputTextoItem24] = useState('');

	//INPUT DECIMAL ITEM 24
	const [inputDecimalItem24, setInputDecimalItem24] = useState('');

	/* ITEM 25 */

	//CHECKBOX ITEM 25
	const [cbItem25, setCbItem25] = useState(false);
	const toggleSwitchItem25 = () => setCbItem25(previousState => !previousState);

	//RADIO BUTTON ITEM 25
	const [rbItem25, setRbItem25] = useState(false);

	//LIST BOX ITEM 25
	const [lbItem25, setLbItem25] = useState(false);

	//INPUT INTEIRO ITEM 25
	const [inputInteiroItem25, setInputInteiroItem25] = useState('');

	//INPUT TEXTO ITEM 25
	const [inputTextoItem25, setInputTextoItem25] = useState('');

	//INPUT DECIMAL ITEM 25
	const [inputDecimalItem25, setInputDecimalItem25] = useState('');

	/* ITEM 26 */

	//CHECKBOX ITEM 26
	const [cbItem26, setCbItem26] = useState(false);
	const toggleSwitchItem26 = () => setCbItem26(previousState => !previousState);

	//RADIO BUTTON ITEM 26
	const [rbItem26, setRbItem26] = useState(false);

	//LIST BOX ITEM 26
	const [lbItem26, setLbItem26] = useState(false);

	//INPUT INTEIRO ITEM 26
	const [inputInteiroItem26, setInputInteiroItem26] = useState('');

	//INPUT TEXTO ITEM 26
	const [inputTextoItem26, setInputTextoItem26] = useState('');

	//INPUT DECIMAL ITEM 26
	const [inputDecimalItem26, setInputDecimalItem26] = useState('');

	/* ITEM 27 */

	//CHECKBOX ITEM 27
	const [cbItem27, setCbItem27] = useState(false);
	const toggleSwitchItem27 = () => setCbItem27(previousState => !previousState);

	//RADIO BUTTON ITEM 27
	const [rbItem27, setRbItem27] = useState(false);

	//LIST BOX ITEM 27
	const [lbItem27, setLbItem27] = useState(false);

	//INPUT INTEIRO ITEM 27
	const [inputInteiroItem27, setInputInteiroItem27] = useState('');

	//INPUT TEXTO ITEM 27
	const [inputTextoItem27, setInputTextoItem27] = useState('');

	//INPUT DECIMAL ITEM 27
	const [inputDecimalItem27, setInputDecimalItem27] = useState('');

	/* ITEM 28 */

	//CHECKBOX ITEM 28
	const [cbItem28, setCbItem28] = useState(false);
	const toggleSwitchItem28 = () => setCbItem28(previousState => !previousState);

	//RADIO BUTTON ITEM 28
	const [rbItem28, setRbItem28] = useState(false);

	//LIST BOX ITEM 28
	const [lbItem28, setLbItem28] = useState(false);

	//INPUT INTEIRO ITEM 28
	const [inputInteiroItem28, setInputInteiroItem28] = useState('');

	//INPUT TEXTO ITEM 28
	const [inputTextoItem28, setInputTextoItem28] = useState('');

	//INPUT DECIMAL ITEM 28
	const [inputDecimalItem28, setInputDecimalItem28] = useState('');

	/* ITEM 29 */

	//CHECKBOX ITEM 29
	const [cbItem29, setCbItem29] = useState(false);
	const toggleSwitchItem29 = () => setCbItem29(previousState => !previousState);

	//RADIO BUTTON ITEM 29
	const [rbItem29, setRbItem29] = useState(false);

	//LIST BOX ITEM 29
	const [lbItem29, setLbItem29] = useState(false);

	//INPUT INTEIRO ITEM 29
	const [inputInteiroItem29, setInputInteiroItem29] = useState('');

	//INPUT TEXTO ITEM 29
	const [inputTextoItem29, setInputTextoItem29] = useState('');

	//INPUT DECIMAL ITEM 29
	const [inputDecimalItem29, setInputDecimalItem29] = useState('');

	/* ITEM 30 */

	//CHECKBOX ITEM 30
	const [cbItem30, setCbItem30] = useState(false);
	const toggleSwitchItem30 = () => setCbItem30(previousState => !previousState);

	//RADIO BUTTON ITEM 30
	const [rbItem30, setRbItem30] = useState(false);

	//LIST BOX ITEM 30
	const [lbItem30, setLbItem30] = useState(false);

	//INPUT INTEIRO ITEM 30
	const [inputInteiroItem30, setInputInteiroItem30] = useState('');

	//INPUT TEXTO ITEM 30
	const [inputTextoItem30, setInputTextoItem30] = useState('');

	//INPUT DECIMAL ITEM 30
	const [inputDecimalItem30, setInputDecimalItem30] = useState('');

	/* ITEM 31 */

	//CHECKBOX ITEM 31
	const [cbItem31, setCbItem31] = useState(false);
	const toggleSwitchItem31 = () => setCbItem31(previousState => !previousState);

	//RADIO BUTTON ITEM 31
	const [rbItem31, setRbItem31] = useState(false);

	//LIST BOX ITEM 31
	const [lbItem31, setLbItem31] = useState(false);

	//INPUT INTEIRO ITEM 31
	const [inputInteiroItem31, setInputInteiroItem31] = useState('');

	//INPUT TEXTO ITEM 31
	const [inputTextoItem31, setInputTextoItem31] = useState('');

	//INPUT DECIMAL ITEM 31
	const [inputDecimalItem31, setInputDecimalItem31] = useState('');

	/* ITEM 32 */

	//CHECKBOX ITEM 32
	const [cbItem32, setCbItem32] = useState(false);
	const toggleSwitchItem32 = () => setCbItem32(previousState => !previousState);

	//RADIO BUTTON ITEM 32
	const [rbItem32, setRbItem32] = useState(false);

	//LIST BOX ITEM 32
	const [lbItem32, setLbItem32] = useState(false);

	//INPUT INTEIRO ITEM 32
	const [inputInteiroItem32, setInputInteiroItem32] = useState('');

	//INPUT TEXTO ITEM 32
	const [inputTextoItem32, setInputTextoItem32] = useState('');

	//INPUT DECIMAL ITEM 32
	const [inputDecimalItem32, setInputDecimalItem32] = useState('');

	/* ITEM 33 */

	//CHECKBOX ITEM 33
	const [cbItem33, setCbItem33] = useState(false);
	const toggleSwitchItem33 = () => setCbItem33(previousState => !previousState);

	//RADIO BUTTON ITEM 33
	const [rbItem33, setRbItem33] = useState(false);

	//LIST BOX ITEM 33
	const [lbItem33, setLbItem33] = useState(false);

	//INPUT INTEIRO ITEM 33
	const [inputInteiroItem33, setInputInteiroItem33] = useState('');

	//INPUT TEXTO ITEM 33
	const [inputTextoItem33, setInputTextoItem33] = useState('');

	//INPUT DECIMAL ITEM 33
	const [inputDecimalItem33, setInputDecimalItem33] = useState('');

	/* ITEM 34 */

	//CHECKBOX ITEM 34
	const [cbItem34, setCbItem34] = useState(false);
	const toggleSwitchItem34 = () => setCbItem34(previousState => !previousState);

	//RADIO BUTTON ITEM 34
	const [rbItem34, setRbItem34] = useState(false);

	//LIST BOX ITEM 34
	const [lbItem34, setLbItem34] = useState(false);

	//INPUT INTEIRO ITEM 34
	const [inputInteiroItem34, setInputInteiroItem34] = useState('');

	//INPUT TEXTO ITEM 34
	const [inputTextoItem34, setInputTextoItem34] = useState('');

	//INPUT DECIMAL ITEM 34
	const [inputDecimalItem34, setInputDecimalItem34] = useState('');

	/* ITEM 35 */

	//CHECKBOX ITEM 35
	const [cbItem35, setCbItem35] = useState(false);
	const toggleSwitchItem35 = () => setCbItem35(previousState => !previousState);

	//RADIO BUTTON ITEM 35
	const [rbItem35, setRbItem35] = useState(false);

	//LIST BOX ITEM 35
	const [lbItem35, setLbItem35] = useState(false);

	//INPUT INTEIRO ITEM 35
	const [inputInteiroItem35, setInputInteiroItem35] = useState('');

	//INPUT TEXTO ITEM 35
	const [inputTextoItem35, setInputTextoItem35] = useState('');

	//INPUT DECIMAL ITEM 35
	const [inputDecimalItem35, setInputDecimalItem35] = useState('');

	/* ITEM 36 */

	//CHECKBOX ITEM 36
	const [cbItem36, setCbItem36] = useState(false);
	const toggleSwitchItem36 = () => setCbItem36(previousState => !previousState);

	//RADIO BUTTON ITEM 36
	const [rbItem36, setRbItem36] = useState(false);

	//LIST BOX ITEM 36
	const [lbItem36, setLbItem36] = useState(false);

	//INPUT INTEIRO ITEM 36
	const [inputInteiroItem36, setInputInteiroItem36] = useState('');

	//INPUT TEXTO ITEM 36
	const [inputTextoItem36, setInputTextoItem36] = useState('');

	//INPUT DECIMAL ITEM 36
	const [inputDecimalItem36, setInputDecimalItem36] = useState('');

	/* ITEM 37 */

	//CHECKBOX ITEM 37
	const [cbItem37, setCbItem37] = useState(false);
	const toggleSwitchItem37 = () => setCbItem37(previousState => !previousState);

	//RADIO BUTTON ITEM 37
	const [rbItem37, setRbItem37] = useState(false);

	//LIST BOX ITEM 37
	const [lbItem37, setLbItem37] = useState(false);

	//INPUT INTEIRO ITEM 37
	const [inputInteiroItem37, setInputInteiroItem37] = useState('');

	//INPUT TEXTO ITEM 37
	const [inputTextoItem37, setInputTextoItem37] = useState('');

	//INPUT DECIMAL ITEM 37
	const [inputDecimalItem37, setInputDecimalItem37] = useState('');

	/* ITEM 38 */

	//CHECKBOX ITEM 38
	const [cbItem38, setCbItem38] = useState(false);
	const toggleSwitchItem38 = () => setCbItem38(previousState => !previousState);

	//RADIO BUTTON ITEM 38
	const [rbItem38, setRbItem38] = useState(false);

	//LIST BOX ITEM 38
	const [lbItem38, setLbItem38] = useState(false);

	//INPUT INTEIRO ITEM 38
	const [inputInteiroItem38, setInputInteiroItem38] = useState('');

	//INPUT TEXTO ITEM 38
	const [inputTextoItem38, setInputTextoItem38] = useState('');

	//INPUT DECIMAL ITEM 38
	const [inputDecimalItem38, setInputDecimalItem38] = useState('');

	/* ITEM 39 */

	//CHECKBOX ITEM 39
	const [cbItem39, setCbItem39] = useState(false);
	const toggleSwitchItem39 = () => setCbItem39(previousState => !previousState);

	//RADIO BUTTON ITEM 39
	const [rbItem39, setRbItem39] = useState(false);

	//LIST BOX ITEM 39
	const [lbItem39, setLbItem39] = useState(false);

	//INPUT INTEIRO ITEM 39
	const [inputInteiroItem39, setInputInteiroItem39] = useState('');

	//INPUT TEXTO ITEM 39
	const [inputTextoItem39, setInputTextoItem39] = useState('');

	//INPUT DECIMAL ITEM 39
	const [inputDecimalItem39, setInputDecimalItem39] = useState('');

	/* ITEM 40 */

	//CHECKBOX ITEM 40
	const [cbItem40, setCbItem40] = useState(false);
	const toggleSwitchItem40 = () => setCbItem40(previousState => !previousState);

	//RADIO BUTTON ITEM 40
	const [rbItem40, setRbItem40] = useState(false);

	//LIST BOX ITEM 40
	const [lbItem40, setLbItem40] = useState(false);

	//INPUT INTEIRO ITEM 40
	const [inputInteiroItem40, setInputInteiroItem40] = useState('');

	//INPUT TEXTO ITEM 40
	const [inputTextoItem40, setInputTextoItem40] = useState('');

	//INPUT DECIMAL ITEM 40
	const [inputDecimalItem40, setInputDecimalItem40] = useState('');

	/* ITEM 41 */

	//CHECKBOX ITEM 41
	const [cbItem41, setCbItem41] = useState(false);
	const toggleSwitchItem41 = () => setCbItem41(previousState => !previousState);

	//RADIO BUTTON ITEM 41
	const [rbItem41, setRbItem41] = useState(false);

	//LIST BOX ITEM 41
	const [lbItem41, setLbItem41] = useState(false);

	//INPUT INTEIRO ITEM 41
	const [inputInteiroItem41, setInputInteiroItem41] = useState('');

	//INPUT TEXTO ITEM 41
	const [inputTextoItem41, setInputTextoItem41] = useState('');

	//INPUT DECIMAL ITEM 41
	const [inputDecimalItem41, setInputDecimalItem41] = useState('');

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
															onValueChange={toggleSwitchItem1}
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
																	color={"#f0ad4e"}
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

											{ 
												/* ITEM 6 */
											}
											{ /* CHECKBOX ITEM 6 */ }
											{
												quesito.IND_CHECKBOX == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 6 && 
												(
													<ListItem >
														<Switch
															trackColor={{ false: "red", true: "#C5DB5F" }}
															thumbColor={cbItem6 ? "#fff" : "#fff"}
															ios_backgroundColor="#fff"
															onValueChange={toggleSwitchItem6}
															value={cbItem6}
														/>
													</ListItem>	
												)
											}
											{ /* RADIO BUTTON ITEM 6 */ }
											{
												quesito.IND_RADIO == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 6  &&
												(
													quesito.componentes.radio.OPCOES.map((radio, i) => {
														return (
															<ListItem 
																key={radio.DES_OPCAO}
																onPress={() => setRbItem6(radio.COD_OPCAO)}
																selected={ rbItem6 == radio.COD_OPCAO ? true : false } >
																<Left>
																<Text>{radio.DES_OPCAO}</Text>
																</Left>
																<Right>
																<Radio
																	onPress={() => setRbItem6(radio.COD_OPCAO)}
																	color={"#f0ad4e"}
																	selectedColor={"#5cb85c"}
																	selected={ rbItem6 == radio.COD_OPCAO ? true : false }
																/>
																</Right>
															</ListItem>
														);
													})
												)
											}
											{ /* LIST BOX ITEM 6 */ }
											{
												quesito.IND_LISTA == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 6  &&
												(
													
														<Picker
															selectedValue={lbItem6}
															style={{ height: 50, margin:5, width: '100%'}}
															onValueChange={(itemValue, itemIndex) => setLbItem6(itemValue)}
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
											{ /* INPUT INTEIRO ITEM 6 */ }
											{
												quesito.IND_INTEIRO == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 6 && 
												(
													<Input 
														value={inputInteiroItem6}
														onChangeText={value => setInputInteiroItem6(value)}
														placeholder='Inteiro'
													/>
												)
											}
											{ /* INPUT TEXTO ITEM 6 */ }
											{
												quesito.IND_TEXTO == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 6 && 
												(
													<Input 
														value={inputTextoItem6}
														onChangeText={value => setInputTextoItem6(value)}
														placeholder='Observação'
													/>
												)
											}
											{/* INPUT TEXTO ITEM 6 */ }
											{
												quesito.IND_TEXTO == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 6 && 
												(
													<Input 
														value={inputDecimalItem6}
														onChangeText={value => setInputDecimalItem6(value)}
														placeholder='Decimal'
													/>
												)
											}

											{ 
												/* ITEM 7 */
											}
											{ /* CHECKBOX ITEM 7 */ }
											{
												quesito.IND_CHECKBOX == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 7 && 
												(
													<ListItem >
														<Switch
															trackColor={{ false: "red", true: "#C5DB5F" }}
															thumbColor={cbItem7 ? "#fff" : "#fff"}
															ios_backgroundColor="#fff"
															onValueChange={toggleSwitchItem7}
															value={cbItem7}
														/>
													</ListItem>	
												)
											}
											{ /* RADIO BUTTON ITEM 7 */ }
											{
												quesito.IND_RADIO == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 7  &&
												(
													quesito.componentes.radio.OPCOES.map((radio, i) => {
														return (
															<ListItem 
																key={radio.DES_OPCAO}
																onPress={() => setRbItem7(radio.COD_OPCAO)}
																selected={ rbItem7 == radio.COD_OPCAO ? true : false } >
																<Left>
																<Text>{radio.DES_OPCAO}</Text>
																</Left>
																<Right>
																<Radio
																	onPress={() => setRbItem7(radio.COD_OPCAO)}
																	color={"#f0ad4e"}
																	selectedColor={"#5cb85c"}
																	selected={ rbItem7 == radio.COD_OPCAO ? true : false }
																/>
																</Right>
															</ListItem>
														);
													})
												)
											}
											{ /* LIST BOX ITEM 7 */ }
											{
												quesito.IND_LISTA == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 7  &&
												(
													
														<Picker
															selectedValue={lbItem7}
															style={{ height: 50, margin:5, width: '100%'}}
															onValueChange={(itemValue, itemIndex) => setLbItem7(itemValue)}
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
											{ /* INPUT INTEIRO ITEM 7 */ }
											{
												quesito.IND_INTEIRO == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 7 && 
												(
													<Input 
														value={inputInteiroItem7}
														onChangeText={value => setInputInteiroItem7(value)}
														placeholder='Inteiro'
													/>
												)
											}
											{ /* INPUT TEXTO ITEM 7 */ }
											{
												quesito.IND_TEXTO == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 7 && 
												(
													<Input 
														value={inputTextoItem7}
														onChangeText={value => setInputTextoItem7(value)}
														placeholder='Observação'
													/>
												)
											}
											{/* INPUT TEXTO ITEM 7 */ }
											{
												quesito.IND_TEXTO == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 7 && 
												(
													<Input 
														value={inputDecimalItem7}
														onChangeText={value => setInputDecimalItem7(value)}
														placeholder='Decimal'
													/>
												)
											}

											{ 
												/* ITEM 8 */
											}
											{ /* CHECKBOX ITEM 8 */ }
											{
												quesito.IND_CHECKBOX == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 8 && 
												(
													<ListItem >
														<Switch
															trackColor={{ false: "red", true: "#C5DB5F" }}
															thumbColor={cbItem8 ? "#fff" : "#fff"}
															ios_backgroundColor="#fff"
															onValueChange={toggleSwitchItem8}
															value={cbItem8}
														/>
													</ListItem>	
												)
											}
											{ /* RADIO BUTTON ITEM 8 */ }
											{
												quesito.IND_RADIO == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 8  &&
												(
													quesito.componentes.radio.OPCOES.map((radio, i) => {
														return (
															<ListItem 
																key={radio.DES_OPCAO}
																onPress={() => setRbItem8(radio.COD_OPCAO)}
																selected={ rbItem8 == radio.COD_OPCAO ? true : false } >
																<Left>
																<Text>{radio.DES_OPCAO}</Text>
																</Left>
																<Right>
																<Radio
																	onPress={() => setRbItem8(radio.COD_OPCAO)}
																	color={"#f0ad4e"}
																	selectedColor={"#5cb85c"}
																	selected={ rbItem8 == radio.COD_OPCAO ? true : false }
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
											{ /* INPUT INTEIRO ITEM 8 */ }
											{
												quesito.IND_INTEIRO == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 8 && 
												(
													<Input 
														value={inputInteiroItem8}
														onChangeText={value => setInputInteiroItem8(value)}
														placeholder='Inteiro'
													/>
												)
											}
											{ /* INPUT TEXTO ITEM 8 */ }
											{
												quesito.IND_TEXTO == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 8 && 
												(
													<Input 
														value={inputTextoItem8}
														onChangeText={value => setInputTextoItem8(value)}
														placeholder='Observação'
													/>
												)
											}
											{/* INPUT TEXTO ITEM 8 */ }
											{
												quesito.IND_TEXTO == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 8 && 
												(
													<Input 
														value={inputDecimalItem8}
														onChangeText={value => setInputDecimalItem8(value)}
														placeholder='Decimal'
													/>
												)
											}

											{ 
												/* ITEM 9 */
											}
											{ /* CHECKBOX ITEM 9 */ }
											{
												quesito.IND_CHECKBOX == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 9 && 
												(
													<ListItem >
														<Switch
															trackColor={{ false: "red", true: "#C5DB5F" }}
															thumbColor={cbItem9 ? "#fff" : "#fff"}
															ios_backgroundColor="#fff"
															onValueChange={toggleSwitchItem9}
															value={cbItem9}
														/>
													</ListItem>	
												)
											}
											{ /* RADIO BUTTON ITEM 9 */ }
											{
												quesito.IND_RADIO == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 9  &&
												(
													quesito.componentes.radio.OPCOES.map((radio, i) => {
														return (
															<ListItem 
																key={radio.DES_OPCAO}
																onPress={() => setRbItem9(radio.COD_OPCAO)}
																selected={ rbItem9 == radio.COD_OPCAO ? true : false } >
																<Left>
																<Text>{radio.DES_OPCAO}</Text>
																</Left>
																<Right>
																<Radio
																	onPress={() => setRbItem9(radio.COD_OPCAO)}
																	color={"#f0ad4e"}
																	selectedColor={"#5cb85c"}
																	selected={ rbItem9 == radio.COD_OPCAO ? true : false }
																/>
																</Right>
															</ListItem>
														);
													})
												)
											}
											{ /* LIST BOX ITEM 9 */ }
											{
												quesito.IND_LISTA == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 9  &&
												(
													
														<Picker
															selectedValue={lbItem9}
															style={{ height: 50, margin:5, width: '100%'}}
															onValueChange={(itemValue, itemIndex) => setLbItem9(itemValue)}
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
											{ /* INPUT INTEIRO ITEM 9 */ }
											{
												quesito.IND_INTEIRO == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 9 && 
												(
													<Input 
														value={inputInteiroItem9}
														onChangeText={value => setInputInteiroItem9(value)}
														placeholder='Inteiro'
													/>
												)
											}
											{ /* INPUT TEXTO ITEM 9 */ }
											{
												quesito.IND_TEXTO == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 9 && 
												(
													<Input 
														value={inputTextoItem9}
														onChangeText={value => setInputTextoItem9(value)}
														placeholder='Observação'
													/>
												)
											}
											{/* INPUT TEXTO ITEM 9 */ }
											{
												quesito.IND_TEXTO == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 9 && 
												(
													<Input 
														value={inputDecimalItem9}
														onChangeText={value => setInputDecimalItem9(value)}
														placeholder='Decimal'
													/>
												)
											}

											{ 
												/* ITEM 10 */
											}
											{ /* CHECKBOX ITEM 10 */ }
											{
												quesito.IND_CHECKBOX == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 10 && 
												(
													<ListItem >
														<Switch
															trackColor={{ false: "red", true: "#C5DB5F" }}
															thumbColor={cbItem10 ? "#fff" : "#fff"}
															ios_backgroundColor="#fff"
															onValueChange={toggleSwitchItem10}
															value={cbItem10}
														/>
													</ListItem>	
												)
											}
											{ /* RADIO BUTTON ITEM 10 */ }
											{
												quesito.IND_RADIO == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 10  &&
												(
													quesito.componentes.radio.OPCOES.map((radio, i) => {
														return (
															<ListItem 
																key={radio.DES_OPCAO}
																onPress={() => setRbItem10(radio.COD_OPCAO)}
																selected={ rbItem10 == radio.COD_OPCAO ? true : false } >
																<Left>
																<Text>{radio.DES_OPCAO}</Text>
																</Left>
																<Right>
																<Radio
																	onPress={() => setRbItem10(radio.COD_OPCAO)}
																	color={"#f0ad4e"}
																	selectedColor={"#5cb85c"}
																	selected={ rbItem10 == radio.COD_OPCAO ? true : false }
																/>
																</Right>
															</ListItem>
														);
													})
												)
											}
											{ /* LIST BOX ITEM 10 */ }
											{
												quesito.IND_LISTA == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 10  &&
												(
													
														<Picker
															selectedValue={lbItem10}
															style={{ height: 50, margin:5, width: '100%'}}
															onValueChange={(itemValue, itemIndex) => setLbItem10(itemValue)}
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
											{ /* INPUT INTEIRO ITEM 10 */ }
											{
												quesito.IND_INTEIRO == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 10 && 
												(
													<Input 
														value={inputInteiroItem10}
														onChangeText={value => setInputInteiroItem10(value)}
														placeholder='Inteiro'
													/>
												)
											}
											{ /* INPUT TEXTO ITEM 10 */ }
											{
												quesito.IND_TEXTO == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 10 && 
												(
													<Input 
														value={inputTextoItem10}
														onChangeText={value => setInputTextoItem10(value)}
														placeholder='Observação'
													/>
												)
											}
											{/* INPUT TEXTO ITEM 10 */ }
											{
												quesito.IND_TEXTO == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 10 && 
												(
													<Input 
														value={inputDecimalItem10}
														onChangeText={value => setInputDecimalItem10(value)}
														placeholder='Decimal'
													/>
												)
											}

											{ 
												/* ITEM 11 */
											}
											{ /* CHECKBOX ITEM 11 */ }
											{
												quesito.IND_CHECKBOX == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 11 && 
												(
													<ListItem >
														<Switch
															trackColor={{ false: "red", true: "#C5DB5F" }}
															thumbColor={cbItem11 ? "#fff" : "#fff"}
															ios_backgroundColor="#fff"
															onValueChange={toggleSwitchItem11}
															value={cbItem11}
														/>
													</ListItem>	
												)
											}
											{ /* RADIO BUTTON ITEM 11 */ }
											{
												quesito.IND_RADIO == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 11  &&
												(
													quesito.componentes.radio.OPCOES.map((radio, i) => {
														return (
															<ListItem 
																key={radio.DES_OPCAO}
																onPress={() => setRbItem11(radio.COD_OPCAO)}
																selected={ rbItem11 == radio.COD_OPCAO ? true : false } >
																<Left>
																<Text>{radio.DES_OPCAO}</Text>
																</Left>
																<Right>
																<Radio
																	onPress={() => setRbItem11(radio.COD_OPCAO)}
																	color={"#f0ad4e"}
																	selectedColor={"#5cb85c"}
																	selected={ rbItem11 == radio.COD_OPCAO ? true : false }
																/>
																</Right>
															</ListItem>
														);
													})
												)
											}
											{ /* LIST BOX ITEM 11 */ }
											{
												quesito.IND_LISTA == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 11  &&
												(
													
														<Picker
															selectedValue={lbItem11}
															style={{ height: 50, margin:5, width: '100%'}}
															onValueChange={(itemValue, itemIndex) => setLbItem11(itemValue)}
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
											{ /* INPUT INTEIRO ITEM 11 */ }
											{
												quesito.IND_INTEIRO == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 11 && 
												(
													<Input 
														value={inputInteiroItem11}
														onChangeText={value => setInputInteiroItem11(value)}
														placeholder='Inteiro'
													/>
												)
											}
											{ /* INPUT TEXTO ITEM 11 */ }
											{
												quesito.IND_TEXTO == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 11 && 
												(
													<Input 
														value={inputTextoItem11}
														onChangeText={value => setInputTextoItem11(value)}
														placeholder='Observação'
													/>
												)
											}
											{/* INPUT TEXTO ITEM 11 */ }
											{
												quesito.IND_TEXTO == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 11 && 
												(
													<Input 
														value={inputDecimalItem11}
														onChangeText={value => setInputDecimalItem11(value)}
														placeholder='Decimal'
													/>
												)
											}

											{ 
												/* ITEM 12 */
											}
											{ /* CHECKBOX ITEM 12 */ }
											{
												quesito.IND_CHECKBOX == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 12 && 
												(
													<ListItem >
														<Switch
															trackColor={{ false: "red", true: "#C5DB5F" }}
															thumbColor={cbItem12 ? "#fff" : "#fff"}
															ios_backgroundColor="#fff"
															onValueChange={toggleSwitchItem12}
															value={cbItem12}
														/>
													</ListItem>	
												)
											}
											{ /* RADIO BUTTON ITEM 12 */ }
											{
												quesito.IND_RADIO == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 12  &&
												(
													quesito.componentes.radio.OPCOES.map((radio, i) => {
														return (
															<ListItem 
																key={radio.DES_OPCAO}
																onPress={() => setRbItem12(radio.COD_OPCAO)}
																selected={ rbItem12 == radio.COD_OPCAO ? true : false } >
																<Left>
																<Text>{radio.DES_OPCAO}</Text>
																</Left>
																<Right>
																<Radio
																	onPress={() => setRbItem12(radio.COD_OPCAO)}
																	color={"#f0ad4e"}
																	selectedColor={"#5cb85c"}
																	selected={ rbItem12 == radio.COD_OPCAO ? true : false }
																/>
																</Right>
															</ListItem>
														);
													})
												)
											}
											{ /* LIST BOX ITEM 12 */ }
											{
												quesito.IND_LISTA == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 12  &&
												(
													
														<Picker
															selectedValue={lbItem12}
															style={{ height: 50, margin:5, width: '100%'}}
															onValueChange={(itemValue, itemIndex) => setLbItem12(itemValue)}
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
											{ /* INPUT INTEIRO ITEM 12 */ }
											{
												quesito.IND_INTEIRO == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 12 && 
												(
													<Input 
														value={inputInteiroItem12}
														onChangeText={value => setInputInteiroItem12(value)}
														placeholder='Inteiro'
													/>
												)
											}
											{ /* INPUT TEXTO ITEM 12 */ }
											{
												quesito.IND_TEXTO == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 12 && 
												(
													<Input 
														value={inputTextoItem12}
														onChangeText={value => setInputTextoItem12(value)}
														placeholder='Observação'
													/>
												)
											}
											{/* INPUT TEXTO ITEM 12 */ }
											{
												quesito.IND_TEXTO == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 12 && 
												(
													<Input 
														value={inputDecimalItem12}
														onChangeText={value => setInputDecimalItem12(value)}
														placeholder='Decimal'
													/>
												)
											}

											{ 
												/* ITEM 13 */
											}
											{ /* CHECKBOX ITEM 13 */ }
											{
												quesito.IND_CHECKBOX == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 13 && 
												(
													<ListItem >
														<Switch
															trackColor={{ false: "red", true: "#C5DB5F" }}
															thumbColor={cbItem13 ? "#fff" : "#fff"}
															ios_backgroundColor="#fff"
															onValueChange={toggleSwitchItem13}
															value={cbItem13}
														/>
													</ListItem>	
												)
											}
											{ /* RADIO BUTTON ITEM 13 */ }
											{
												quesito.IND_RADIO == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 13  &&
												(
													quesito.componentes.radio.OPCOES.map((radio, i) => {
														return (
															<ListItem 
																key={radio.DES_OPCAO}
																onPress={() => setRbItem13(radio.COD_OPCAO)}
																selected={ rbItem13 == radio.COD_OPCAO ? true : false } >
																<Left>
																<Text>{radio.DES_OPCAO}</Text>
																</Left>
																<Right>
																<Radio
																	onPress={() => setRbItem13(radio.COD_OPCAO)}
																	color={"#f0ad4e"}
																	selectedColor={"#5cb85c"}
																	selected={ rbItem13 == radio.COD_OPCAO ? true : false }
																/>
																</Right>
															</ListItem>
														);
													})
												)
											}
											{ /* LIST BOX ITEM 13 */ }
											{
												quesito.IND_LISTA == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 13  &&
												(
													
														<Picker
															selectedValue={lbItem13}
															style={{ height: 50, margin:5, width: '100%'}}
															onValueChange={(itemValue, itemIndex) => setLbItem13(itemValue)}
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
											{ /* INPUT INTEIRO ITEM 13 */ }
											{
												quesito.IND_INTEIRO == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 13 && 
												(
													<Input 
														value={inputInteiroItem13}
														onChangeText={value => setInputInteiroItem13(value)}
														placeholder='Inteiro'
													/>
												)
											}
											{ /* INPUT TEXTO ITEM 13 */ }
											{
												quesito.IND_TEXTO == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 13 && 
												(
													<Input 
														value={inputTextoItem13}
														onChangeText={value => setInputTextoItem13(value)}
														placeholder='Observação'
													/>
												)
											}
											{/* INPUT TEXTO ITEM 13 */ }
											{
												quesito.IND_TEXTO == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 13 && 
												(
													<Input 
														value={inputDecimalItem13}
														onChangeText={value => setInputDecimalItem13(value)}
														placeholder='Decimal'
													/>
												)
											}

											{ 
												/* ITEM 14 */
											}
											{ /* CHECKBOX ITEM 14 */ }
											{
												quesito.IND_CHECKBOX == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 14 && 
												(
													<ListItem >
														<Switch
															trackColor={{ false: "red", true: "#C5DB5F" }}
															thumbColor={cbItem14 ? "#fff" : "#fff"}
															ios_backgroundColor="#fff"
															onValueChange={toggleSwitchItem14}
															value={cbItem14}
														/>
													</ListItem>	
												)
											}
											{ /* RADIO BUTTON ITEM 14 */ }
											{
												quesito.IND_RADIO == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 14  &&
												(
													quesito.componentes.radio.OPCOES.map((radio, i) => {
														return (
															<ListItem 
																key={radio.DES_OPCAO}
																onPress={() => setRbItem14(radio.COD_OPCAO)}
																selected={ rbItem14 == radio.COD_OPCAO ? true : false } >
																<Left>
																<Text>{radio.DES_OPCAO}</Text>
																</Left>
																<Right>
																<Radio
																	onPress={() => setRbItem14(radio.COD_OPCAO)}
																	color={"#f0ad4e"}
																	selectedColor={"#5cb85c"}
																	selected={ rbItem14 == radio.COD_OPCAO ? true : false }
																/>
																</Right>
															</ListItem>
														);
													})
												)
											}
											{ /* LIST BOX ITEM 14 */ }
											{
												quesito.IND_LISTA == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 14  &&
												(
													
														<Picker
															selectedValue={lbItem14}
															style={{ height: 50, margin:5, width: '100%'}}
															onValueChange={(itemValue, itemIndex) => setLbItem14(itemValue)}
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
											{ /* INPUT INTEIRO ITEM 14 */ }
											{
												quesito.IND_INTEIRO == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 14 && 
												(
													<Input 
														value={inputInteiroItem14}
														onChangeText={value => setInputInteiroItem14(value)}
														placeholder='Inteiro'
													/>
												)
											}
											{ /* INPUT TEXTO ITEM 14 */ }
											{
												quesito.IND_TEXTO == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 14 && 
												(
													<Input 
														value={inputTextoItem14}
														onChangeText={value => setInputTextoItem14(value)}
														placeholder='Observação'
													/>
												)
											}
											{/* INPUT TEXTO ITEM 14 */ }
											{
												quesito.IND_TEXTO == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 14 && 
												(
													<Input 
														value={inputDecimalItem14}
														onChangeText={value => setInputDecimalItem14(value)}
														placeholder='Decimal'
													/>
												)
											}

											{ 
												/* ITEM 15 */
											}
											{ /* CHECKBOX ITEM 15 */ }
											{
												quesito.IND_CHECKBOX == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 15 && 
												(
													<ListItem >
														<Switch
															trackColor={{ false: "red", true: "#C5DB5F" }}
															thumbColor={cbItem15 ? "#fff" : "#fff"}
															ios_backgroundColor="#fff"
															onValueChange={toggleSwitchItem15}
															value={cbItem15}
														/>
													</ListItem>	
												)
											}
											{ /* RADIO BUTTON ITEM 15 */ }
											{
												quesito.IND_RADIO == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 15  &&
												(
													quesito.componentes.radio.OPCOES.map((radio, i) => {
														return (
															<ListItem 
																key={radio.DES_OPCAO}
																onPress={() => setRbItem15(radio.COD_OPCAO)}
																selected={ rbItem15 == radio.COD_OPCAO ? true : false } >
																<Left>
																<Text>{radio.DES_OPCAO}</Text>
																</Left>
																<Right>
																<Radio
																	onPress={() => setRbItem15(radio.COD_OPCAO)}
																	color={"#f0ad4e"}
																	selectedColor={"#5cb85c"}
																	selected={ rbItem15 == radio.COD_OPCAO ? true : false }
																/>
																</Right>
															</ListItem>
														);
													})
												)
											}
											{ /* LIST BOX ITEM 15 */ }
											{
												quesito.IND_LISTA == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 15  &&
												(
													
														<Picker
															selectedValue={lbItem15}
															style={{ height: 50, margin:5, width: '100%'}}
															onValueChange={(itemValue, itemIndex) => setLbItem15(itemValue)}
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
											{ /* INPUT INTEIRO ITEM 15 */ }
											{
												quesito.IND_INTEIRO == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 15 && 
												(
													<Input 
														value={inputInteiroItem15}
														onChangeText={value => setInputInteiroItem15(value)}
														placeholder='Inteiro'
													/>
												)
											}
											{ /* INPUT TEXTO ITEM 15 */ }
											{
												quesito.IND_TEXTO == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 15 && 
												(
													<Input 
														value={inputTextoItem15}
														onChangeText={value => setInputTextoItem15(value)}
														placeholder='Observação'
													/>
												)
											}
											{/* INPUT TEXTO ITEM 15 */ }
											{
												quesito.IND_TEXTO == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 15 && 
												(
													<Input 
														value={inputDecimalItem15}
														onChangeText={value => setInputDecimalItem15(value)}
														placeholder='Decimal'
													/>
												)
											}

											{ 
												/* ITEM 16 */
											}
											{ /* CHECKBOX ITEM 16 */ }
											{
												quesito.IND_CHECKBOX == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 16 && 
												(
													<ListItem >
														<Switch
															trackColor={{ false: "red", true: "#C5DB5F" }}
															thumbColor={cbItem16 ? "#fff" : "#fff"}
															ios_backgroundColor="#fff"
															onValueChange={toggleSwitchItem16}
															value={cbItem16}
														/>
													</ListItem>	
												)
											}
											{ /* RADIO BUTTON ITEM 16 */ }
											{
												quesito.IND_RADIO == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 16  &&
												(
													quesito.componentes.radio.OPCOES.map((radio, i) => {
														return (
															<ListItem 
																key={radio.DES_OPCAO}
																onPress={() => setRbItem16(radio.COD_OPCAO)}
																selected={ rbItem16 == radio.COD_OPCAO ? true : false } >
																<Left>
																<Text>{radio.DES_OPCAO}</Text>
																</Left>
																<Right>
																<Radio
																	onPress={() => setRbItem16(radio.COD_OPCAO)}
																	color={"#f0ad4e"}
																	selectedColor={"#5cb85c"}
																	selected={ rbItem16 == radio.COD_OPCAO ? true : false }
																/>
																</Right>
															</ListItem>
														);
													})
												)
											}
											{ /* LIST BOX ITEM 16 */ }
											{
												quesito.IND_LISTA == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 16  &&
												(
													
														<Picker
															selectedValue={lbItem16}
															style={{ height: 50, margin:5, width: '100%'}}
															onValueChange={(itemValue, itemIndex) => setLbItem16(itemValue)}
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
											{ /* INPUT INTEIRO ITEM 16 */ }
											{
												quesito.IND_INTEIRO == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 16 && 
												(
													<Input 
														value={inputInteiroItem16}
														onChangeText={value => setInputInteiroItem16(value)}
														placeholder='Inteiro'
													/>
												)
											}
											{ /* INPUT TEXTO ITEM 16 */ }
											{
												quesito.IND_TEXTO == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 16 && 
												(
													<Input 
														value={inputTextoItem16}
														onChangeText={value => setInputTextoItem16(value)}
														placeholder='Observação'
													/>
												)
											}
											{/* INPUT TEXTO ITEM 16 */ }
											{
												quesito.IND_TEXTO == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 16 && 
												(
													<Input 
														value={inputDecimalItem16}
														onChangeText={value => setInputDecimalItem16(value)}
														placeholder='Decimal'
													/>
												)
											}

											{ 
												/* ITEM 17 */
											}
											{ /* CHECKBOX ITEM 17 */ }
											{
												quesito.IND_CHECKBOX == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 17 && 
												(
													<ListItem >
														<Switch
															trackColor={{ false: "red", true: "#C5DB5F" }}
															thumbColor={cbItem17 ? "#fff" : "#fff"}
															ios_backgroundColor="#fff"
															onValueChange={toggleSwitchItem17}
															value={cbItem17}
														/>
													</ListItem>	
												)
											}
											{ /* RADIO BUTTON ITEM 17 */ }
											{
												quesito.IND_RADIO == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 17  &&
												(
													quesito.componentes.radio.OPCOES.map((radio, i) => {
														return (
															<ListItem 
																key={radio.DES_OPCAO}
																onPress={() => setRbItem17(radio.COD_OPCAO)}
																selected={ rbItem17 == radio.COD_OPCAO ? true : false } >
																<Left>
																<Text>{radio.DES_OPCAO}</Text>
																</Left>
																<Right>
																<Radio
																	onPress={() => setRbItem17(radio.COD_OPCAO)}
																	color={"#f0ad4e"}
																	selectedColor={"#5cb85c"}
																	selected={ rbItem17 == radio.COD_OPCAO ? true : false }
																/>
																</Right>
															</ListItem>
														);
													})
												)
											}
											{ /* LIST BOX ITEM 17 */ }
											{
												quesito.IND_LISTA == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 17  &&
												(
													
														<Picker
															selectedValue={lbItem17}
															style={{ height: 50, margin:5, width: '100%'}}
															onValueChange={(itemValue, itemIndex) => setLbItem17(itemValue)}
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
											{ /* INPUT INTEIRO ITEM 17 */ }
											{
												quesito.IND_INTEIRO == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 17 && 
												(
													<Input 
														value={inputInteiroItem17}
														onChangeText={value => setInputInteiroItem17(value)}
														placeholder='Inteiro'
													/>
												)
											}
											{ /* INPUT TEXTO ITEM 17 */ }
											{
												quesito.IND_TEXTO == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 17 && 
												(
													<Input 
														value={inputTextoItem17}
														onChangeText={value => setInputTextoItem17(value)}
														placeholder='Observação'
													/>
												)
											}
											{/* INPUT TEXTO ITEM 17 */ }
											{
												quesito.IND_TEXTO == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 17 && 
												(
													<Input 
														value={inputDecimalItem17}
														onChangeText={value => setInputDecimalItem17(value)}
														placeholder='Decimal'
													/>
												)
											}

											{ 
												/* ITEM 18 */
											}
											{ /* CHECKBOX ITEM 18 */ }
											{
												quesito.IND_CHECKBOX == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 18 && 
												(
													<ListItem >
														<Switch
															trackColor={{ false: "red", true: "#C5DB5F" }}
															thumbColor={cbItem18 ? "#fff" : "#fff"}
															ios_backgroundColor="#fff"
															onValueChange={toggleSwitchItem18}
															value={cbItem18}
														/>
													</ListItem>	
												)
											}
											{ /* RADIO BUTTON ITEM 18 */ }
											{
												quesito.IND_RADIO == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 18  &&
												(
													quesito.componentes.radio.OPCOES.map((radio, i) => {
														return (
															<ListItem 
																key={radio.DES_OPCAO}
																onPress={() => setRbItem18(radio.COD_OPCAO)}
																selected={ rbItem18 == radio.COD_OPCAO ? true : false } >
																<Left>
																<Text>{radio.DES_OPCAO}</Text>
																</Left>
																<Right>
																<Radio
																	onPress={() => setRbItem18(radio.COD_OPCAO)}
																	color={"#f0ad4e"}
																	selectedColor={"#5cb85c"}
																	selected={ rbItem18 == radio.COD_OPCAO ? true : false }
																/>
																</Right>
															</ListItem>
														);
													})
												)
											}
											{ /* LIST BOX ITEM 18 */ }
											{
												quesito.IND_LISTA == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 18  &&
												(
													
														<Picker
															selectedValue={lbItem18}
															style={{ height: 50, margin:5, width: '100%'}}
															onValueChange={(itemValue, itemIndex) => setLbItem18(itemValue)}
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
											{ /* INPUT INTEIRO ITEM 18 */ }
											{
												quesito.IND_INTEIRO == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 18 && 
												(
													<Input 
														value={inputInteiroItem18}
														onChangeText={value => setInputInteiroItem18(value)}
														placeholder='Inteiro'
													/>
												)
											}
											{ /* INPUT TEXTO ITEM 18 */ }
											{
												quesito.IND_TEXTO == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 18 && 
												(
													<Input 
														value={inputTextoItem18}
														onChangeText={value => setInputTextoItem18(value)}
														placeholder='Observação'
													/>
												)
											}
											{/* INPUT TEXTO ITEM 18 */ }
											{
												quesito.IND_TEXTO == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 18 && 
												(
													<Input 
														value={inputDecimalItem18}
														onChangeText={value => setInputDecimalItem18(value)}
														placeholder='Decimal'
													/>
												)
											}

											{ 
												/* ITEM 19 */
											}
											{ /* CHECKBOX ITEM 19 */ }
											{
												quesito.IND_CHECKBOX == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 19 && 
												(
													<ListItem >
														<Switch
															trackColor={{ false: "red", true: "#C5DB5F" }}
															thumbColor={cbItem19 ? "#fff" : "#fff"}
															ios_backgroundColor="#fff"
															onValueChange={toggleSwitchItem19}
															value={cbItem19}
														/>
													</ListItem>	
												)
											}
											{ /* RADIO BUTTON ITEM 19 */ }
											{
												quesito.IND_RADIO == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 19  &&
												(
													quesito.componentes.radio.OPCOES.map((radio, i) => {
														return (
															<ListItem 
																key={radio.DES_OPCAO}
																onPress={() => setRbItem19(radio.COD_OPCAO)}
																selected={ rbItem19 == radio.COD_OPCAO ? true : false } >
																<Left>
																<Text>{radio.DES_OPCAO}</Text>
																</Left>
																<Right>
																<Radio
																	onPress={() => setRbItem19(radio.COD_OPCAO)}
																	color={"#f0ad4e"}
																	selectedColor={"#5cb85c"}
																	selected={ rbItem19 == radio.COD_OPCAO ? true : false }
																/>
																</Right>
															</ListItem>
														);
													})
												)
											}
											{ /* LIST BOX ITEM 19 */ }
											{
												quesito.IND_LISTA == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 19  &&
												(
													
														<Picker
															selectedValue={lbItem19}
															style={{ height: 50, margin:5, width: '100%'}}
															onValueChange={(itemValue, itemIndex) => setLbItem19(itemValue)}
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
											{ /* INPUT INTEIRO ITEM 19 */ }
											{
												quesito.IND_INTEIRO == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 19 && 
												(
													<Input 
														value={inputInteiroItem19}
														onChangeText={value => setInputInteiroItem19(value)}
														placeholder='Inteiro'
													/>
												)
											}
											{ /* INPUT TEXTO ITEM 19 */ }
											{
												quesito.IND_TEXTO == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 19 && 
												(
													<Input 
														value={inputTextoItem19}
														onChangeText={value => setInputTextoItem19(value)}
														placeholder='Observação'
													/>
												)
											}
											{/* INPUT DECIMAL ITEM 19 */ }
											{
												quesito.IND_TEXTO == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 19 && 
												(
													<Input 
														value={inputDecimalItem19}
														onChangeText={value => setInputDecimalItem19(value)}
														placeholder='Decimal'
													/>
												)
											}

											{ 
												/* ITEM 20 */
											}
											{ /* CHECKBOX ITEM 20 */ }
											{
												quesito.IND_CHECKBOX == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 20 && 
												(
													<ListItem >
														<Switch
															trackColor={{ false: "red", true: "#C5DB5F" }}
															thumbColor={cbItem20 ? "#fff" : "#fff"}
															ios_backgroundColor="#fff"
															onValueChange={toggleSwitchItem20}
															value={cbItem20}
														/>
													</ListItem>	
												)
											}
											{ /* RADIO BUTTON ITEM 20 */ }
											{
												quesito.IND_RADIO == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 20  &&
												(
													quesito.componentes.radio.OPCOES.map((radio, i) => {
														return (
															<ListItem 
																key={radio.DES_OPCAO}
																onPress={() => setRbItem20(radio.COD_OPCAO)}
																selected={ rbItem20 == radio.COD_OPCAO ? true : false } >
																<Left>
																<Text>{radio.DES_OPCAO}</Text>
																</Left>
																<Right>
																<Radio
																	onPress={() => setRbItem20(radio.COD_OPCAO)}
																	color={"#f0ad4e"}
																	selectedColor={"#5cb85c"}
																	selected={ rbItem20 == radio.COD_OPCAO ? true : false }
																/>
																</Right>
															</ListItem>
														);
													})
												)
											}
											{ /* LIST BOX ITEM 20 */ }
											{
												quesito.IND_LISTA == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 20  &&
												(
													
														<Picker
															selectedValue={lbItem20}
															style={{ height: 50, margin:5, width: '100%'}}
															onValueChange={(itemValue, itemIndex) => setLbItem20(itemValue)}
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
														onChangeText={value => setInputTextoItem20(value)}
														placeholder='Observação'
													/>
												)
											}
											{/* INPUT TEXTO ITEM 20 */ }
											{
												quesito.IND_TEXTO == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 20 && 
												(
													<Input 
														value={inputDecimalItem20}
														onChangeText={value => setInputDecimalItem20(value)}
														placeholder='Decimal'
													/>
												)
											}

											{ 
												/* ITEM 21 */
											}
											{ /* CHECKBOX ITEM 21 */ }
											{
												quesito.IND_CHECKBOX == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 21 && 
												(
													<ListItem >
														<Switch
															trackColor={{ false: "red", true: "#C5DB5F" }}
															thumbColor={cbItem21 ? "#fff" : "#fff"}
															ios_backgroundColor="#fff"
															onValueChange={toggleSwitchItem21}
															value={cbItem21}
														/>
													</ListItem>	
												)
											}
											{ /* RADIO BUTTON ITEM 21 */ }
											{
												quesito.IND_RADIO == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 21  &&
												(
													quesito.componentes.radio.OPCOES.map((radio, i) => {
														return (
															<ListItem 
																key={radio.DES_OPCAO}
																onPress={() => setRbItem21(radio.COD_OPCAO)}
																selected={ rbItem21 == radio.COD_OPCAO ? true : false } >
																<Left>
																<Text>{radio.DES_OPCAO}</Text>
																</Left>
																<Right>
																<Radio
																	onPress={() => setRbItem21(radio.COD_OPCAO)}
																	color={"#f0ad4e"}
																	selectedColor={"#5cb85c"}
																	selected={ rbItem21 == radio.COD_OPCAO ? true : false }
																/>
																</Right>
															</ListItem>
														);
													})
												)
											}
											{ /* LIST BOX ITEM 21 */ }
											{
												quesito.IND_LISTA == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 21  &&
												(
													
														<Picker
															selectedValue={lbItem21}
															style={{ height: 50, margin:5, width: '100%'}}
															onValueChange={(itemValue, itemIndex) => setLbItem21(itemValue)}
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
											{ /* INPUT INTEIRO ITEM 21 */ }
											{
												quesito.IND_INTEIRO == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 21 && 
												(
													<Input 
														value={inputInteiroItem21}
														onChangeText={value => setInputInteiroItem21(value)}
														placeholder='Inteiro'
													/>
												)
											}
											{ /* INPUT TEXTO ITEM 21 */ }
											{
												quesito.IND_TEXTO == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 21 && 
												(
													<Input 
														value={inputTextoItem21}
														onChangeText={value => setInputTextoItem21(value)}
														placeholder='Observação'
													/>
												)
											}
											{/* INPUT TEXTO ITEM 21 */ }
											{
												quesito.IND_TEXTO == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 21 && 
												(
													<Input 
														value={inputDecimalItem21}
														onChangeText={value => setInputDecimalItem21(value)}
														placeholder='Decimal'
													/>
												)
											}

											{ 
												/* ITEM 22 */
											}
											{ /* CHECKBOX ITEM 22 */ }
											{
												quesito.IND_CHECKBOX == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 22 && 
												(
													<ListItem >
														<Switch
															trackColor={{ false: "red", true: "#C5DB5F" }}
															thumbColor={cbItem22 ? "#fff" : "#fff"}
															ios_backgroundColor="#fff"
															onValueChange={toggleSwitchItem22}
															value={cbItem22}
														/>
													</ListItem>	
												)
											}
											{ /* RADIO BUTTON ITEM 22 */ }
											{
												quesito.IND_RADIO == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 22  &&
												(
													quesito.componentes.radio.OPCOES.map((radio, i) => {
														return (
															<ListItem 
																key={radio.DES_OPCAO}
																onPress={() => setRbItem22(radio.COD_OPCAO)}
																selected={ rbItem22 == radio.COD_OPCAO ? true : false } >
																<Left>
																<Text>{radio.DES_OPCAO}</Text>
																</Left>
																<Right>
																<Radio
																	onPress={() => setRbItem22(radio.COD_OPCAO)}
																	color={"#f0ad4e"}
																	selectedColor={"#5cb85c"}
																	selected={ rbItem22 == radio.COD_OPCAO ? true : false }
																/>
																</Right>
															</ListItem>
														);
													})
												)
											}
											{ /* LIST BOX ITEM 22 */ }
											{
												quesito.IND_LISTA == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 22  &&
												(
													
														<Picker
															selectedValue={lbItem22}
															style={{ height: 50, margin:5, width: '100%'}}
															onValueChange={(itemValue, itemIndex) => setLbItem22(itemValue)}
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
											{ /* INPUT INTEIRO ITEM 22 */ }
											{
												quesito.IND_INTEIRO == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 22 && 
												(
													<Input 
														value={inputInteiroItem22}
														onChangeText={value => setInputInteiroItem22(value)}
														placeholder='Inteiro'
													/>
												)
											}
											{ /* INPUT TEXTO ITEM 22 */ }
											{
												quesito.IND_TEXTO == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 22 && 
												(
													<Input 
														value={inputTextoItem22}
														onChangeText={value => setInputTextoItem22(value)}
														placeholder='Observação'
													/>
												)
											}
											{/* INPUT TEXTO ITEM 22 */ }
											{
												quesito.IND_TEXTO == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 22 && 
												(
													<Input 
														value={inputDecimalItem22}
														onChangeText={value => setInputDecimalItem22(value)}
														placeholder='Decimal'
													/>
												)
											}

											{ 
												/* ITEM 23 */
											}
											{ /* CHECKBOX ITEM 23 */ }
											{
												quesito.IND_CHECKBOX == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 23 && 
												(
													<ListItem >
														<Switch
															trackColor={{ false: "red", true: "#C5DB5F" }}
															thumbColor={cbItem23 ? "#fff" : "#fff"}
															ios_backgroundColor="#fff"
															onValueChange={toggleSwitchItem23}
															value={cbItem23}
														/>
													</ListItem>	
												)
											}
											{ /* RADIO BUTTON ITEM 23 */ }
											{
												quesito.IND_RADIO == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 23  &&
												(
													quesito.componentes.radio.OPCOES.map((radio, i) => {
														return (
															<ListItem 
																key={radio.DES_OPCAO}
																onPress={() => setRbItem23(radio.COD_OPCAO)}
																selected={ rbItem23 == radio.COD_OPCAO ? true : false } >
																<Left>
																<Text>{radio.DES_OPCAO}</Text>
																</Left>
																<Right>
																<Radio
																	onPress={() => setRbItem23(radio.COD_OPCAO)}
																	color={"#f0ad4e"}
																	selectedColor={"#5cb85c"}
																	selected={ rbItem23 == radio.COD_OPCAO ? true : false }
																/>
																</Right>
															</ListItem>
														);
													})
												)
											}
											{ /* LIST BOX ITEM 23 */ }
											{
												quesito.IND_LISTA == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 23  &&
												(
													
														<Picker
															selectedValue={lbItem23}
															style={{ height: 50, margin:5, width: '100%'}}
															onValueChange={(itemValue, itemIndex) => setLbItem23(itemValue)}
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
											{ /* INPUT INTEIRO ITEM 23 */ }
											{
												quesito.IND_INTEIRO == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 23 && 
												(
													<Input 
														value={inputInteiroItem23}
														onChangeText={value => setInputInteiroItem23(value)}
														placeholder='Inteiro'
													/>
												)
											}
											{ /* INPUT TEXTO ITEM 23 */ }
											{
												quesito.IND_TEXTO == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 23 && 
												(
													<Input 
														value={inputTextoItem23}
														onChangeText={value => setInputTextoItem23(value)}
														placeholder='Observação'
													/>
												)
											}
											{/* INPUT TEXTO ITEM 23 */ }
											{
												quesito.IND_TEXTO == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 23 && 
												(
													<Input 
														value={inputDecimalItem23}
														onChangeText={value => setInputDecimalItem23(value)}
														placeholder='Decimal'
													/>
												)
											}

											{ 
												/* ITEM 24 */
											}
											{ /* CHECKBOX ITEM 24 */ }
											{
												quesito.IND_CHECKBOX == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 24 && 
												(
													<ListItem >
														<Switch
															trackColor={{ false: "red", true: "#C5DB5F" }}
															thumbColor={cbItem24 ? "#fff" : "#fff"}
															ios_backgroundColor="#fff"
															onValueChange={toggleSwitchItem24}
															value={cbItem24}
														/>
													</ListItem>	
												)
											}
											{ /* RADIO BUTTON ITEM 24 */ }
											{
												quesito.IND_RADIO == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 24  &&
												(
													quesito.componentes.radio.OPCOES.map((radio, i) => {
														return (
															<ListItem 
																key={radio.DES_OPCAO}
																onPress={() => setRbItem24(radio.COD_OPCAO)}
																selected={ rbItem24 == radio.COD_OPCAO ? true : false } >
																<Left>
																<Text>{radio.DES_OPCAO}</Text>
																</Left>
																<Right>
																<Radio
																	onPress={() => setRbItem24(radio.COD_OPCAO)}
																	color={"#f0ad4e"}
																	selectedColor={"#5cb85c"}
																	selected={ rbItem24 == radio.COD_OPCAO ? true : false }
																/>
																</Right>
															</ListItem>
														);
													})
												)
											}
											{ /* LIST BOX ITEM 24 */ }
											{
												quesito.IND_LISTA == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 24  &&
												(
													
														<Picker
															selectedValue={lbItem24}
															style={{ height: 50, margin:5, width: '100%'}}
															onValueChange={(itemValue, itemIndex) => setLbItem24(itemValue)}
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
											{ /* INPUT INTEIRO ITEM 24 */ }
											{
												quesito.IND_INTEIRO == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 24 && 
												(
													<Input 
														value={inputInteiroItem24}
														onChangeText={value => setInputInteiroItem24(value)}
														placeholder='Inteiro'
													/>
												)
											}
											{ /* INPUT TEXTO ITEM 24 */ }
											{
												quesito.IND_TEXTO == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 24 && 
												(
													<Input 
														value={inputTextoItem24}
														onChangeText={value => setInputTextoItem24(value)}
														placeholder='Observação'
													/>
												)
											}
											{/* INPUT TEXTO ITEM 24 */ }
											{
												quesito.IND_TEXTO == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 24 && 
												(
													<Input 
														value={inputDecimalItem24}
														onChangeText={value => setInputDecimalItem24(value)}
														placeholder='Decimal'
													/>
												)
											}

											{ 
												/* ITEM 25 */
											}
											{ /* CHECKBOX ITEM 25 */ }
											{
												quesito.IND_CHECKBOX == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 25 && 
												(
													<ListItem >
														<Switch
															trackColor={{ false: "red", true: "#C5DB5F" }}
															thumbColor={cbItem25 ? "#fff" : "#fff"}
															ios_backgroundColor="#fff"
															onValueChange={toggleSwitchItem25}
															value={cbItem25}
														/>
													</ListItem>	
												)
											}
											{ /* RADIO BUTTON ITEM 25 */ }
											{
												quesito.IND_RADIO == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 25  &&
												(
													quesito.componentes.radio.OPCOES.map((radio, i) => {
														return (
															<ListItem 
																key={radio.DES_OPCAO}
																onPress={() => setRbItem25(radio.COD_OPCAO)}
																selected={ rbItem25 == radio.COD_OPCAO ? true : false } >
																<Left>
																<Text>{radio.DES_OPCAO}</Text>
																</Left>
																<Right>
																<Radio
																	onPress={() => setRbItem25(radio.COD_OPCAO)}
																	color={"#f0ad4e"}
																	selectedColor={"#5cb85c"}
																	selected={ rbItem25 == radio.COD_OPCAO ? true : false }
																/>
																</Right>
															</ListItem>
														);
													})
												)
											}
											{ /* LIST BOX ITEM 25 */ }
											{
												quesito.IND_LISTA == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 25  &&
												(
													
														<Picker
															selectedValue={lbItem25}
															style={{ height: 50, margin:5, width: '100%'}}
															onValueChange={(itemValue, itemIndex) => setLbItem25(itemValue)}
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
											{ /* INPUT INTEIRO ITEM 25 */ }
											{
												quesito.IND_INTEIRO == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 25 && 
												(
													<Input 
														value={inputInteiroItem25}
														onChangeText={value => setInputInteiroItem25(value)}
														placeholder='Inteiro'
													/>
												)
											}
											{ /* INPUT TEXTO ITEM 25 */ }
											{
												quesito.IND_TEXTO == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 25 && 
												(
													<Input 
														value={inputTextoItem25}
														onChangeText={value => setInputTextoItem25(value)}
														placeholder='Observação'
													/>
												)
											}
											{/* INPUT TEXTO ITEM 25 */ }
											{
												quesito.IND_TEXTO == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 25 && 
												(
													<Input 
														value={inputDecimalItem25}
														onChangeText={value => setInputDecimalItem25(value)}
														placeholder='Decimal'
													/>
												)
											}

											{ 
												/* ITEM 26 */
											}
											{ /* CHECKBOX ITEM 26 */ }
											{
												quesito.IND_CHECKBOX == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 26 && 
												(
													<ListItem >
														<Switch
															trackColor={{ false: "red", true: "#C5DB5F" }}
															thumbColor={cbItem26 ? "#fff" : "#fff"}
															ios_backgroundColor="#fff"
															onValueChange={toggleSwitchItem26}
															value={cbItem26}
														/>
													</ListItem>	
												)
											}
											{ /* RADIO BUTTON ITEM 26 */ }
											{
												quesito.IND_RADIO == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 26  &&
												(
													quesito.componentes.radio.OPCOES.map((radio, i) => {
														return (
															<ListItem 
																key={radio.DES_OPCAO}
																onPress={() => setRbItem26(radio.COD_OPCAO)}
																selected={ rbItem26 == radio.COD_OPCAO ? true : false } >
																<Left>
																<Text>{radio.DES_OPCAO}</Text>
																</Left>
																<Right>
																<Radio
																	onPress={() => setRbItem26(radio.COD_OPCAO)}
																	color={"#f0ad4e"}
																	selectedColor={"#5cb85c"}
																	selected={ rbItem26 == radio.COD_OPCAO ? true : false }
																/>
																</Right>
															</ListItem>
														);
													})
												)
											}
											{ /* LIST BOX ITEM 26 */ }
											{
												quesito.IND_LISTA == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 26  &&
												(
													
														<Picker
															selectedValue={lbItem26}
															style={{ height: 50, margin:5, width: '100%'}}
															onValueChange={(itemValue, itemIndex) => setLbItem26(itemValue)}
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
											{ /* INPUT INTEIRO ITEM 26 */ }
											{
												quesito.IND_INTEIRO == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 26 && 
												(
													<Input 
														value={inputInteiroItem26}
														onChangeText={value => setInputInteiroItem26(value)}
														placeholder='Inteiro'
													/>
												)
											}
											{ /* INPUT TEXTO ITEM 26 */ }
											{
												quesito.IND_TEXTO == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 26 && 
												(
													<Input 
														value={inputTextoItem26}
														onChangeText={value => setInputTextoItem26(value)}
														placeholder='Observação'
													/>
												)
											}
											{/* INPUT TEXTO ITEM 26 */ }
											{
												quesito.IND_TEXTO == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 26 && 
												(
													<Input 
														value={inputDecimalItem26}
														onChangeText={value => setInputDecimalItem26(value)}
														placeholder='Decimal'
													/>
												)
											}

											{ 
												/* ITEM 27 */
											}
											{ /* CHECKBOX ITEM 27 */ }
											{
												quesito.IND_CHECKBOX == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 27 && 
												(
													<ListItem >
														<Switch
															trackColor={{ false: "red", true: "#C5DB5F" }}
															thumbColor={cbItem27 ? "#fff" : "#fff"}
															ios_backgroundColor="#fff"
															onValueChange={toggleSwitchItem27}
															value={cbItem27}
														/>
													</ListItem>	
												)
											}
											{ /* RADIO BUTTON ITEM 27 */ }
											{
												quesito.IND_RADIO == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 27  &&
												(
													quesito.componentes.radio.OPCOES.map((radio, i) => {
														return (
															<ListItem 
																key={radio.DES_OPCAO}
																onPress={() => setRbItem27(radio.COD_OPCAO)}
																selected={ rbItem27 == radio.COD_OPCAO ? true : false } >
																<Left>
																<Text>{radio.DES_OPCAO}</Text>
																</Left>
																<Right>
																<Radio
																	onPress={() => setRbItem27(radio.COD_OPCAO)}
																	color={"#f0ad4e"}
																	selectedColor={"#5cb85c"}
																	selected={ rbItem27 == radio.COD_OPCAO ? true : false }
																/>
																</Right>
															</ListItem>
														);
													})
												)
											}
											{ /* LIST BOX ITEM 27 */ }
											{
												quesito.IND_LISTA == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 27  &&
												(
													
														<Picker
															selectedValue={lbItem27}
															style={{ height: 50, margin:5, width: '100%'}}
															onValueChange={(itemValue, itemIndex) => setLbItem27(itemValue)}
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
											{ /* INPUT INTEIRO ITEM 27 */ }
											{
												quesito.IND_INTEIRO == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 27 && 
												(
													<Input 
														value={inputInteiroItem27}
														onChangeText={value => setInputInteiroItem27(value)}
														placeholder='Inteiro'
													/>
												)
											}
											{ /* INPUT TEXTO ITEM 27 */ }
											{
												quesito.IND_TEXTO == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 27 && 
												(
													<Input 
														value={inputTextoItem27}
														onChangeText={value => setInputTextoItem27(value)}
														placeholder='Observação'
													/>
												)
											}
											{/* INPUT TEXTO ITEM 27 */ }
											{
												quesito.IND_TEXTO == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 27 && 
												(
													<Input 
														value={inputDecimalItem27}
														onChangeText={value => setInputDecimalItem27(value)}
														placeholder='Decimal'
													/>
												)
											}

											{ 
												/* ITEM 28 */
											}
											{ /* CHECKBOX ITEM 28 */ }
											{
												quesito.IND_CHECKBOX == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 28 && 
												(
													<ListItem >
														<Switch
															trackColor={{ false: "red", true: "#C5DB5F" }}
															thumbColor={cbItem28 ? "#fff" : "#fff"}
															ios_backgroundColor="#fff"
															onValueChange={toggleSwitchItem28}
															value={cbItem28}
														/>
													</ListItem>	
												)
											}
											{ /* RADIO BUTTON ITEM 28 */ }
											{
												quesito.IND_RADIO == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 28  &&
												(
													quesito.componentes.radio.OPCOES.map((radio, i) => {
														return (
															<ListItem 
																key={radio.DES_OPCAO}
																onPress={() => setRbItem28(radio.COD_OPCAO)}
																selected={ rbItem28 == radio.COD_OPCAO ? true : false } >
																<Left>
																<Text>{radio.DES_OPCAO}</Text>
																</Left>
																<Right>
																<Radio
																	onPress={() => setRbItem28(radio.COD_OPCAO)}
																	color={"#f0ad4e"}
																	selectedColor={"#5cb85c"}
																	selected={ rbItem28 == radio.COD_OPCAO ? true : false }
																/>
																</Right>
															</ListItem>
														);
													})
												)
											}
											{ /* LIST BOX ITEM 28 */ }
											{
												quesito.IND_LISTA == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 28  &&
												(
													
														<Picker
															selectedValue={lbItem28}
															style={{ height: 50, margin:5, width: '100%'}}
															onValueChange={(itemValue, itemIndex) => setLbItem28(itemValue)}
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
											{ /* INPUT INTEIRO ITEM 28 */ }
											{
												quesito.IND_INTEIRO == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 28 && 
												(
													<Input 
														value={inputInteiroItem28}
														onChangeText={value => setInputInteiroItem28(value)}
														placeholder='Inteiro'
													/>
												)
											}
											{ /* INPUT TEXTO ITEM 28 */ }
											{
												quesito.IND_TEXTO == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 28 && 
												(
													<Input 
														value={inputTextoItem28}
														onChangeText={value => setInputTextoItem28(value)}
														placeholder='Observação'
													/>
												)
											}
											{/* INPUT TEXTO ITEM 28 */ }
											{
												quesito.IND_TEXTO == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 28 && 
												(
													<Input 
														value={inputDecimalItem28}
														onChangeText={value => setInputDecimalItem28(value)}
														placeholder='Decimal'
													/>
												)
											}

											{ 
												/* ITEM 29 */
											}
											{ /* CHECKBOX ITEM 29 */ }
											{
												quesito.IND_CHECKBOX == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 29 && 
												(
													<ListItem >
														<Switch
															trackColor={{ false: "red", true: "#C5DB5F" }}
															thumbColor={cbItem29 ? "#fff" : "#fff"}
															ios_backgroundColor="#fff"
															onValueChange={toggleSwitchItem29}
															value={cbItem29}
														/>
													</ListItem>	
												)
											}
											{ /* RADIO BUTTON ITEM 29 */ }
											{
												quesito.IND_RADIO == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 29  &&
												(
													quesito.componentes.radio.OPCOES.map((radio, i) => {
														return (
															<ListItem 
																key={radio.DES_OPCAO}
																onPress={() => setRbItem29(radio.COD_OPCAO)}
																selected={ rbItem29 == radio.COD_OPCAO ? true : false } >
																<Left>
																<Text>{radio.DES_OPCAO}</Text>
																</Left>
																<Right>
																<Radio
																	onPress={() => setRbItem29(radio.COD_OPCAO)}
																	color={"#f0ad4e"}
																	selectedColor={"#5cb85c"}
																	selected={ rbItem29 == radio.COD_OPCAO ? true : false }
																/>
																</Right>
															</ListItem>
														);
													})
												)
											}
											{ /* LIST BOX ITEM 29 */ }
											{
												quesito.IND_LISTA == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 29  &&
												(
													
														<Picker
															selectedValue={lbItem29}
															style={{ height: 50, margin:5, width: '100%'}}
															onValueChange={(itemValue, itemIndex) => setLbItem29(itemValue)}
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
											{ /* INPUT INTEIRO ITEM 29 */ }
											{
												quesito.IND_INTEIRO == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 29 && 
												(
													<Input 
														value={inputInteiroItem29}
														onChangeText={value => setInputInteiroItem29(value)}
														placeholder='Inteiro'
													/>
												)
											}
											{ /* INPUT TEXTO ITEM 29 */ }
											{
												quesito.IND_TEXTO == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 29 && 
												(
													<Input 
														value={inputTextoItem29}
														onChangeText={value => setInputTextoItem29(value)}
														placeholder='Observação'
													/>
												)
											}
											{/* INPUT TEXTO ITEM 29 */ }
											{
												quesito.IND_TEXTO == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 29 && 
												(
													<Input 
														value={inputDecimalItem29}
														onChangeText={value => setInputDecimalItem29(value)}
														placeholder='Decimal'
													/>
												)
											}

											{ 
												/* ITEM 30 */
											}
											{ /* CHECKBOX ITEM 30 */ }
											{
												quesito.IND_CHECKBOX == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 30 && 
												(
													<ListItem >
														<Switch
															trackColor={{ false: "red", true: "#C5DB5F" }}
															thumbColor={cbItem30 ? "#fff" : "#fff"}
															ios_backgroundColor="#fff"
															onValueChange={toggleSwitchItem30}
															value={cbItem30}
														/>
													</ListItem>	
												)
											}
											{ /* RADIO BUTTON ITEM 30 */ }
											{
												quesito.IND_RADIO == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 30  &&
												(
													quesito.componentes.radio.OPCOES.map((radio, i) => {
														return (
															<ListItem 
																key={radio.DES_OPCAO}
																onPress={() => setRbItem30(radio.COD_OPCAO)}
																selected={ rbItem30 == radio.COD_OPCAO ? true : false } >
																<Left>
																<Text>{radio.DES_OPCAO}</Text>
																</Left>
																<Right>
																<Radio
																	onPress={() => setRbItem30(radio.COD_OPCAO)}
																	color={"#f0ad4e"}
																	selectedColor={"#5cb85c"}
																	selected={ rbItem30 == radio.COD_OPCAO ? true : false }
																/>
																</Right>
															</ListItem>
														);
													})
												)
											}
											{ /* LIST BOX ITEM 30 */ }
											{
												quesito.IND_LISTA == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 30  &&
												(
													
														<Picker
															selectedValue={lbItem30}
															style={{ height: 50, margin:5, width: '100%'}}
															onValueChange={(itemValue, itemIndex) => setLbItem30(itemValue)}
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
											{ /* INPUT INTEIRO ITEM 30 */ }
											{
												quesito.IND_INTEIRO == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 30 && 
												(
													<Input 
														value={inputInteiroItem30}
														onChangeText={value => setInputInteiroItem30(value)}
														placeholder='Inteiro'
													/>
												)
											}
											{ /* INPUT TEXTO ITEM 30 */ }
											{
												quesito.IND_TEXTO == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 30 && 
												(
													<Input 
														value={inputTextoItem30}
														onChangeText={value => setInputTextoItem30(value)}
														placeholder='Observação'
													/>
												)
											}
											{/* INPUT TEXTO ITEM 30 */ }
											{
												quesito.IND_TEXTO == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 30 && 
												(
													<Input 
														value={inputDecimalItem30}
														onChangeText={value => setInputDecimalItem30(value)}
														placeholder='Decimal'
													/>
												)
											}

											{ 
												/* ITEM 31 */
											}
											{ /* CHECKBOX ITEM 31 */ }
											{
												quesito.IND_CHECKBOX == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 31 && 
												(
													<ListItem >
														<Switch
															trackColor={{ false: "red", true: "#C5DB5F" }}
															thumbColor={cbItem31 ? "#fff" : "#fff"}
															ios_backgroundColor="#fff"
															onValueChange={toggleSwitchItem31}
															value={cbItem31}
														/>
													</ListItem>	
												)
											}
											{ /* RADIO BUTTON ITEM 31 */ }
											{
												quesito.IND_RADIO == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 31  &&
												(
													quesito.componentes.radio.OPCOES.map((radio, i) => {
														return (
															<ListItem 
																key={radio.DES_OPCAO}
																onPress={() => setRbItem31(radio.COD_OPCAO)}
																selected={ rbItem31 == radio.COD_OPCAO ? true : false } >
																<Left>
																<Text>{radio.DES_OPCAO}</Text>
																</Left>
																<Right>
																<Radio
																	onPress={() => setRbItem31(radio.COD_OPCAO)}
																	color={"#f0ad4e"}
																	selectedColor={"#5cb85c"}
																	selected={ rbItem31 == radio.COD_OPCAO ? true : false }
																/>
																</Right>
															</ListItem>
														);
													})
												)
											}
											{ /* LIST BOX ITEM 31 */ }
											{
												quesito.IND_LISTA == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 31  &&
												(
													
														<Picker
															selectedValue={lbItem31}
															style={{ height: 50, margin:5, width: '100%'}}
															onValueChange={(itemValue, itemIndex) => setLbItem31(itemValue)}
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
											{ /* INPUT INTEIRO ITEM 31 */ }
											{
												quesito.IND_INTEIRO == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 31 && 
												(
													<Input 
														value={inputInteiroItem31}
														onChangeText={value => setInputInteiroItem31(value)}
														placeholder='Inteiro'
													/>
												)
											}
											{ /* INPUT TEXTO ITEM 31 */ }
											{
												quesito.IND_TEXTO == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 31 && 
												(
													<Input 
														value={inputTextoItem31}
														onChangeText={value => setInputTextoItem31(value)}
														placeholder='Observação'
													/>
												)
											}
											{/* INPUT TEXTO ITEM 31 */ }
											{
												quesito.IND_TEXTO == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 31 && 
												(
													<Input 
														value={inputDecimalItem31}
														onChangeText={value => setInputDecimalItem31(value)}
														placeholder='Decimal'
													/>
												)
											}

											{ 
												/* ITEM 32 */
											}
											{ /* CHECKBOX ITEM 32 */ }
											{
												quesito.IND_CHECKBOX == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 32 && 
												(
													<ListItem >
														<Switch
															trackColor={{ false: "red", true: "#C5DB5F" }}
															thumbColor={cbItem32 ? "#fff" : "#fff"}
															ios_backgroundColor="#fff"
															onValueChange={toggleSwitchItem32}
															value={cbItem32}
														/>
													</ListItem>	
												)
											}
											{ /* RADIO BUTTON ITEM 32 */ }
											{
												quesito.IND_RADIO == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 32  &&
												(
													quesito.componentes.radio.OPCOES.map((radio, i) => {
														return (
															<ListItem 
																key={radio.DES_OPCAO}
																onPress={() => setRbItem32(radio.COD_OPCAO)}
																selected={ rbItem32 == radio.COD_OPCAO ? true : false } >
																<Left>
																<Text>{radio.DES_OPCAO}</Text>
																</Left>
																<Right>
																<Radio
																	onPress={() => setRbItem32(radio.COD_OPCAO)}
																	color={"#f0ad4e"}
																	selectedColor={"#5cb85c"}
																	selected={ rbItem32 == radio.COD_OPCAO ? true : false }
																/>
																</Right>
															</ListItem>
														);
													})
												)
											}
											{ /* LIST BOX ITEM 32 */ }
											{
												quesito.IND_LISTA == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 32  &&
												(
													
														<Picker
															selectedValue={lbItem32}
															style={{ height: 50, margin:5, width: '100%'}}
															onValueChange={(itemValue, itemIndex) => setLbItem32(itemValue)}
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
											{ /* INPUT INTEIRO ITEM 32 */ }
											{
												quesito.IND_INTEIRO == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 32 && 
												(
													<Input 
														value={inputInteiroItem32}
														onChangeText={value => setInputInteiroItem32(value)}
														placeholder='Inteiro'
													/>
												)
											}
											{ /* INPUT TEXTO ITEM 32 */ }
											{
												quesito.IND_TEXTO == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 32 && 
												(
													<Input 
														value={inputTextoItem32}
														onChangeText={value => setInputTextoItem32(value)}
														placeholder='Observação'
													/>
												)
											}
											{/* INPUT TEXTO ITEM 32 */ }
											{
												quesito.IND_TEXTO == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 32 && 
												(
													<Input 
														value={inputDecimalItem32}
														onChangeText={value => setInputDecimalItem32(value)}
														placeholder='Decimal'
													/>
												)
											}

											{ 
												/* ITEM 33 */
											}
											{ /* CHECKBOX ITEM 33 */ }
											{
												quesito.IND_CHECKBOX == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 33 && 
												(
													<ListItem >
														<Switch
															trackColor={{ false: "red", true: "#C5DB5F" }}
															thumbColor={cbItem33 ? "#fff" : "#fff"}
															ios_backgroundColor="#fff"
															onValueChange={toggleSwitchItem33}
															value={cbItem33}
														/>
													</ListItem>	
												)
											}
											{ /* RADIO BUTTON ITEM 33 */ }
											{
												quesito.IND_RADIO == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 33  &&
												(
													quesito.componentes.radio.OPCOES.map((radio, i) => {
														return (
															<ListItem 
																key={radio.DES_OPCAO}
																onPress={() => setRbItem33(radio.COD_OPCAO)}
																selected={ rbItem33 == radio.COD_OPCAO ? true : false } >
																<Left>
																<Text>{radio.DES_OPCAO}</Text>
																</Left>
																<Right>
																<Radio
																	onPress={() => setRbItem33(radio.COD_OPCAO)}
																	color={"#f0ad4e"}
																	selectedColor={"#5cb85c"}
																	selected={ rbItem33 == radio.COD_OPCAO ? true : false }
																/>
																</Right>
															</ListItem>
														);
													})
												)
											}
											{ /* LIST BOX ITEM 33 */ }
											{
												quesito.IND_LISTA == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 33  &&
												(
													
														<Picker
															selectedValue={lbItem33}
															style={{ height: 50, margin:5, width: '100%'}}
															onValueChange={(itemValue, itemIndex) => setLbItem33(itemValue)}
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
											{ /* INPUT INTEIRO ITEM 33 */ }
											{
												quesito.IND_INTEIRO == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 33 && 
												(
													<Input 
														value={inputInteiroItem33}
														onChangeText={value => setInputInteiroItem33(value)}
														placeholder='Inteiro'
													/>
												)
											}
											{ /* INPUT TEXTO ITEM 33 */ }
											{
												quesito.IND_TEXTO == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 33 && 
												(
													<Input 
														value={inputTextoItem33}
														onChangeText={value => setInputTextoItem33(value)}
														placeholder='Observação'
													/>
												)
											}
											{/* INPUT TEXTO ITEM 33 */ }
											{
												quesito.IND_TEXTO == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 33 && 
												(
													<Input 
														value={inputDecimalItem33}
														onChangeText={value => setInputDecimalItem33(value)}
														placeholder='Decimal'
													/>
												)
											}

											{ 
												/* ITEM 34 */
											}
											{ /* CHECKBOX ITEM 34 */ }
											{
												quesito.IND_CHECKBOX == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 34 && 
												(
													<ListItem >
														<Switch
															trackColor={{ false: "red", true: "#C5DB5F" }}
															thumbColor={cbItem34 ? "#fff" : "#fff"}
															ios_backgroundColor="#fff"
															onValueChange={toggleSwitchItem34}
															value={cbItem34}
														/>
													</ListItem>	
												)
											}
											{ /* RADIO BUTTON ITEM 34 */ }
											{
												quesito.IND_RADIO == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 34  &&
												(
													quesito.componentes.radio.OPCOES.map((radio, i) => {
														return (
															<ListItem 
																key={radio.DES_OPCAO}
																onPress={() => setRbItem34(radio.COD_OPCAO)}
																selected={ rbItem34 == radio.COD_OPCAO ? true : false } >
																<Left>
																<Text>{radio.DES_OPCAO}</Text>
																</Left>
																<Right>
																<Radio
																	onPress={() => setRbItem34(radio.COD_OPCAO)}
																	color={"#f0ad4e"}
																	selectedColor={"#5cb85c"}
																	selected={ rbItem34 == radio.COD_OPCAO ? true : false }
																/>
																</Right>
															</ListItem>
														);
													})
												)
											}
											{ /* LIST BOX ITEM 34 */ }
											{
												quesito.IND_LISTA == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 34  &&
												(
													
														<Picker
															selectedValue={lbItem34}
															style={{ height: 50, margin:5, width: '100%'}}
															onValueChange={(itemValue, itemIndex) => setLbItem34(itemValue)}
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
											{ /* INPUT INTEIRO ITEM 34 */ }
											{
												quesito.IND_INTEIRO == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 34 && 
												(
													<Input 
														value={inputInteiroItem34}
														onChangeText={value => setInputInteiroItem34(value)}
														placeholder='Inteiro'
													/>
												)
											}
											{ /* INPUT TEXTO ITEM 34 */ }
											{
												quesito.IND_TEXTO == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 34 && 
												(
													<Input 
														value={inputTextoItem34}
														onChangeText={value => setInputTextoItem34(value)}
														placeholder='Observação'
													/>
												)
											}
											{/* INPUT TEXTO ITEM 34 */ }
											{
												quesito.IND_TEXTO == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 34 && 
												(
													<Input 
														value={inputDecimalItem34}
														onChangeText={value => setInputDecimalItem34(value)}
														placeholder='Decimal'
													/>
												)
											}

											{ 
												/* ITEM 35 */
											}
											{ /* CHECKBOX ITEM 35 */ }
											{
												quesito.IND_CHECKBOX == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 35 && 
												(
													<ListItem >
														<Switch
															trackColor={{ false: "red", true: "#C5DB5F" }}
															thumbColor={cbItem35 ? "#fff" : "#fff"}
															ios_backgroundColor="#fff"
															onValueChange={toggleSwitchItem35}
															value={cbItem35}
														/>
													</ListItem>	
												)
											}
											{ /* RADIO BUTTON ITEM 35 */ }
											{
												quesito.IND_RADIO == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 35  &&
												(
													quesito.componentes.radio.OPCOES.map((radio, i) => {
														return (
															<ListItem 
																key={radio.DES_OPCAO}
																onPress={() => setRbItem35(radio.COD_OPCAO)}
																selected={ rbItem35 == radio.COD_OPCAO ? true : false } >
																<Left>
																<Text>{radio.DES_OPCAO}</Text>
																</Left>
																<Right>
																<Radio
																	onPress={() => setRbItem35(radio.COD_OPCAO)}
																	color={"#f0ad4e"}
																	selectedColor={"#5cb85c"}
																	selected={ rbItem35 == radio.COD_OPCAO ? true : false }
																/>
																</Right>
															</ListItem>
														);
													})
												)
											}
											{ /* LIST BOX ITEM 35 */ }
											{
												quesito.IND_LISTA == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 35  &&
												(
													
														<Picker
															selectedValue={lbItem35}
															style={{ height: 50, margin:5, width: '100%'}}
															onValueChange={(itemValue, itemIndex) => setLbItem35(itemValue)}
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
											{ /* INPUT INTEIRO ITEM 35 */ }
											{
												quesito.IND_INTEIRO == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 35 && 
												(
													<Input 
														value={inputInteiroItem35}
														onChangeText={value => setInputInteiroItem35(value)}
														placeholder='Inteiro'
													/>
												)
											}
											{ /* INPUT TEXTO ITEM 35 */ }
											{
												quesito.IND_TEXTO == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 35 && 
												(
													<Input 
														value={inputTextoItem35}
														onChangeText={value => setInputTextoItem35(value)}
														placeholder='Observação'
													/>
												)
											}
											{/* INPUT TEXTO ITEM 35 */ }
											{
												quesito.IND_TEXTO == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 35 && 
												(
													<Input 
														value={inputDecimalItem35}
														onChangeText={value => setInputDecimalItem35(value)}
														placeholder='Decimal'
													/>
												)
											}

											{ 
												/* ITEM 36 */
											}
											{ /* CHECKBOX ITEM 36 */ }
											{
												quesito.IND_CHECKBOX == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 36 && 
												(
													<ListItem >
														<Switch
															trackColor={{ false: "red", true: "#C5DB5F" }}
															thumbColor={cbItem36 ? "#fff" : "#fff"}
															ios_backgroundColor="#fff"
															onValueChange={toggleSwitchItem36}
															value={cbItem36}
														/>
													</ListItem>	
												)
											}
											{ /* RADIO BUTTON ITEM 36 */ }
											{
												quesito.IND_RADIO == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 36  &&
												(
													quesito.componentes.radio.OPCOES.map((radio, i) => {
														return (
															<ListItem 
																key={radio.DES_OPCAO}
																onPress={() => setRbItem36(radio.COD_OPCAO)}
																selected={ rbItem36 == radio.COD_OPCAO ? true : false } >
																<Left>
																<Text>{radio.DES_OPCAO}</Text>
																</Left>
																<Right>
																<Radio
																	onPress={() => setRbItem36(radio.COD_OPCAO)}
																	color={"#f0ad4e"}
																	selectedColor={"#5cb85c"}
																	selected={ rbItem36 == radio.COD_OPCAO ? true : false }
																/>
																</Right>
															</ListItem>
														);
													})
												)
											}
											{ /* LIST BOX ITEM 36 */ }
											{
												quesito.IND_LISTA == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 36  &&
												(
													
														<Picker
															selectedValue={lbItem36}
															style={{ height: 50, margin:5, width: '100%'}}
															onValueChange={(itemValue, itemIndex) => setLbItem36(itemValue)}
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
											{ /* INPUT INTEIRO ITEM 36 */ }
											{
												quesito.IND_INTEIRO == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 36 && 
												(
													<Input 
														value={inputInteiroItem36}
														onChangeText={value => setInputInteiroItem36(value)}
														placeholder='Inteiro'
													/>
												)
											}
											{ /* INPUT TEXTO ITEM 36 */ }
											{
												quesito.IND_TEXTO == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 36 && 
												(
													<Input 
														value={inputTextoItem36}
														onChangeText={value => setInputTextoItem36(value)}
														placeholder='Observação'
													/>
												)
											}
											{/* INPUT TEXTO ITEM 36 */ }
											{
												quesito.IND_TEXTO == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 36 && 
												(
													<Input 
														value={inputDecimalItem36}
														onChangeText={value => setInputDecimalItem36(value)}
														placeholder='Decimal'
													/>
												)
											}

											{ 
												/* ITEM 37 */
											}
											{ /* CHECKBOX ITEM 37 */ }
											{
												quesito.IND_CHECKBOX == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 37 && 
												(
													<ListItem >
														<Switch
															trackColor={{ false: "red", true: "#C5DB5F" }}
															thumbColor={cbItem37 ? "#fff" : "#fff"}
															ios_backgroundColor="#fff"
															onValueChange={toggleSwitchItem37}
															value={cbItem37}
														/>
													</ListItem>	
												)
											}
											{ /* RADIO BUTTON ITEM 37 */ }
											{
												quesito.IND_RADIO == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 37  &&
												(
													quesito.componentes.radio.OPCOES.map((radio, i) => {
														return (
															<ListItem 
																key={radio.DES_OPCAO}
																onPress={() => setRbItem37(radio.COD_OPCAO)}
																selected={ rbItem37 == radio.COD_OPCAO ? true : false } >
																<Left>
																<Text>{radio.DES_OPCAO}</Text>
																</Left>
																<Right>
																<Radio
																	onPress={() => setRbItem37(radio.COD_OPCAO)}
																	color={"#f0ad4e"}
																	selectedColor={"#5cb85c"}
																	selected={ rbItem37 == radio.COD_OPCAO ? true : false }
																/>
																</Right>
															</ListItem>
														);
													})
												)
											}
											{ /* LIST BOX ITEM 37 */ }
											{
												quesito.IND_LISTA == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 37  &&
												(
													
														<Picker
															selectedValue={lbItem37}
															style={{ height: 50, margin:5, width: '100%'}}
															onValueChange={(itemValue, itemIndex) => setLbItem37(itemValue)}
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
											{ /* INPUT INTEIRO ITEM 37 */ }
											{
												quesito.IND_INTEIRO == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 37 && 
												(
													<Input 
														value={inputInteiroItem37}
														onChangeText={value => setInputInteiroItem37(value)}
														placeholder='Inteiro'
													/>
												)
											}
											{ /* INPUT TEXTO ITEM 37 */ }
											{
												quesito.IND_TEXTO == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 37 && 
												(
													<Input 
														value={inputTextoItem37}
														onChangeText={value => setInputTextoItem37(value)}
														placeholder='Observação'
													/>
												)
											}
											{/* INPUT TEXTO ITEM 37 */ }
											{
												quesito.IND_TEXTO == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 37 && 
												(
													<Input 
														value={inputDecimalItem37}
														onChangeText={value => setInputDecimalItem37(value)}
														placeholder='Decimal'
													/>
												)
											}

											{ 
												/* ITEM 38 */
											}
											{ /* CHECKBOX ITEM 38 */ }
											{
												quesito.IND_CHECKBOX == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 38 && 
												(
													<ListItem >
														<Switch
															trackColor={{ false: "red", true: "#C5DB5F" }}
															thumbColor={cbItem38 ? "#fff" : "#fff"}
															ios_backgroundColor="#fff"
															onValueChange={toggleSwitchItem38}
															value={cbItem38}
														/>
													</ListItem>	
												)
											}
											{ /* RADIO BUTTON ITEM 38 */ }
											{
												quesito.IND_RADIO == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 38  &&
												(
													quesito.componentes.radio.OPCOES.map((radio, i) => {
														return (
															<ListItem 
																key={radio.DES_OPCAO}
																onPress={() => setRbItem38(radio.COD_OPCAO)}
																selected={ rbItem38 == radio.COD_OPCAO ? true : false } >
																<Left>
																<Text>{radio.DES_OPCAO}</Text>
																</Left>
																<Right>
																<Radio
																	onPress={() => setRbItem38(radio.COD_OPCAO)}
																	color={"#f0ad4e"}
																	selectedColor={"#5cb85c"}
																	selected={ rbItem38 == radio.COD_OPCAO ? true : false }
																/>
																</Right>
															</ListItem>
														);
													})
												)
											}
											{ /* LIST BOX ITEM 38 */ }
											{
												quesito.IND_LISTA == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 38  &&
												(
													
														<Picker
															selectedValue={lbItem38}
															style={{ height: 50, margin:5, width: '100%'}}
															onValueChange={(itemValue, itemIndex) => setLbItem38(itemValue)}
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
											{ /* INPUT INTEIRO ITEM 38 */ }
											{
												quesito.IND_INTEIRO == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 38 && 
												(
													<Input 
														value={inputInteiroItem38}
														onChangeText={value => setInputInteiroItem38(value)}
														placeholder='Inteiro'
													/>
												)
											}
											{ /* INPUT TEXTO ITEM 38 */ }
											{
												quesito.IND_TEXTO == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 38 && 
												(
													<Input 
														value={inputTextoItem38}
														onChangeText={value => setInputTextoItem38(value)}
														placeholder='Observação'
													/>
												)
											}
											{/* INPUT TEXTO ITEM 38 */ }
											{
												quesito.IND_TEXTO == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 38 && 
												(
													<Input 
														value={inputDecimalItem38}
														onChangeText={value => setInputDecimalItem38(value)}
														placeholder='Decimal'
													/>
												)
											}

											{ 
												/* ITEM 39 */
											}
											{ /* CHECKBOX ITEM 39 */ }
											{
												quesito.IND_CHECKBOX == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 39 && 
												(
													<ListItem >
														<Switch
															trackColor={{ false: "red", true: "#C5DB5F" }}
															thumbColor={cbItem39 ? "#fff" : "#fff"}
															ios_backgroundColor="#fff"
															onValueChange={toggleSwitchItem39}
															value={cbItem39}
														/>
													</ListItem>	
												)
											}
											{ /* RADIO BUTTON ITEM 39 */ }
											{
												quesito.IND_RADIO == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 39  &&
												(
													quesito.componentes.radio.OPCOES.map((radio, i) => {
														return (
															<ListItem 
																key={radio.DES_OPCAO}
																onPress={() => setRbItem39(radio.COD_OPCAO)}
																selected={ rbItem39 == radio.COD_OPCAO ? true : false } >
																<Left>
																<Text>{radio.DES_OPCAO}</Text>
																</Left>
																<Right>
																<Radio
																	onPress={() => setRbItem39(radio.COD_OPCAO)}
																	color={"#f0ad4e"}
																	selectedColor={"#5cb85c"}
																	selected={ rbItem39 == radio.COD_OPCAO ? true : false }
																/>
																</Right>
															</ListItem>
														);
													})
												)
											}
											{ /* LIST BOX ITEM 39 */ }
											{
												quesito.IND_LISTA == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 39  &&
												(
													
														<Picker
															selectedValue={lbItem39}
															style={{ height: 50, margin:5, width: '100%'}}
															onValueChange={(itemValue, itemIndex) => setLbItem39(itemValue)}
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
											{ /* INPUT INTEIRO ITEM 39 */ }
											{
												quesito.IND_INTEIRO == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 39 && 
												(
													<Input 
														value={inputInteiroItem39}
														onChangeText={value => setInputInteiroItem39(value)}
														placeholder='Inteiro'
													/>
												)
											}
											{ /* INPUT TEXTO ITEM 39 */ }
											{
												quesito.IND_TEXTO == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 39 && 
												(
													<Input 
														value={inputTextoItem39}
														onChangeText={value => setInputTextoItem39(value)}
														placeholder='Observação'
													/>
												)
											}
											{/* INPUT TEXTO ITEM 39 */ }
											{
												quesito.IND_TEXTO == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 39 && 
												(
													<Input 
														value={inputDecimalItem39}
														onChangeText={value => setInputDecimalItem39(value)}
														placeholder='Decimal'
													/>
												)
											}

											{ 
												/* ITEM 40 */
											}
											{ /* CHECKBOX ITEM 40 */ }
											{
												quesito.IND_CHECKBOX == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 40 && 
												(
													<ListItem >
														<Switch
															trackColor={{ false: "red", true: "#C5DB5F" }}
															thumbColor={cbItem40 ? "#fff" : "#fff"}
															ios_backgroundColor="#fff"
															onValueChange={toggleSwitchItem40}
															value={cbItem40}
														/>
													</ListItem>	
												)
											}
											{ /* RADIO BUTTON ITEM 40 */ }
											{
												quesito.IND_RADIO == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 40  &&
												(
													quesito.componentes.radio.OPCOES.map((radio, i) => {
														return (
															<ListItem 
																key={radio.DES_OPCAO}
																onPress={() => setRbItem40(radio.COD_OPCAO)}
																selected={ rbItem40 == radio.COD_OPCAO ? true : false } >
																<Left>
																<Text>{radio.DES_OPCAO}</Text>
																</Left>
																<Right>
																<Radio
																	onPress={() => setRbItem40(radio.COD_OPCAO)}
																	color={"#f0ad4e"}
																	selectedColor={"#5cb85c"}
																	selected={ rbItem40 == radio.COD_OPCAO ? true : false }
																/>
																</Right>
															</ListItem>
														);
													})
												)
											}
											{ /* LIST BOX ITEM 40 */ }
											{
												quesito.IND_LISTA == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 40  &&
												(
													
														<Picker
															selectedValue={lbItem40}
															style={{ height: 50, margin:5, width: '100%'}}
															onValueChange={(itemValue, itemIndex) => setLbItem40(itemValue)}
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
											{ /* INPUT INTEIRO ITEM 40 */ }
											{
												quesito.IND_INTEIRO == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 40 && 
												(
													<Input 
														value={inputInteiroItem40}
														onChangeText={value => setInputInteiroItem40(value)}
														placeholder='Inteiro'
													/>
												)
											}
											{ /* INPUT TEXTO ITEM 40 */ }
											{
												quesito.IND_TEXTO == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 40 && 
												(
													<Input 
														value={inputTextoItem40}
														onChangeText={value => setInputTextoItem40(value)}
														placeholder='Observação'
													/>
												)
											}
											{/* INPUT TEXTO ITEM 40 */ }
											{
												quesito.IND_TEXTO == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 40 && 
												(
													<Input 
														value={inputDecimalItem40}
														onChangeText={value => setInputDecimalItem40(value)}
														placeholder='Decimal'
													/>
												)
											}

											{ 
												/* ITEM 41 */
											}
											{ /* CHECKBOX ITEM 41 */ }
											{
												quesito.IND_CHECKBOX == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 41 && 
												(
													<ListItem >
														<Switch
															trackColor={{ false: "red", true: "#C5DB5F" }}
															thumbColor={cbItem41 ? "#fff" : "#fff"}
															ios_backgroundColor="#fff"
															onValueChange={toggleSwitchItem41}
															value={cbItem41}
														/>
													</ListItem>	
												)
											}
											{ /* RADIO BUTTON ITEM 41 */ }
											{
												quesito.IND_RADIO == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 41  &&
												(
													quesito.componentes.radio.OPCOES.map((radio, i) => {
														return (
															<ListItem 
																key={radio.DES_OPCAO}
																onPress={() => setRbItem41(radio.COD_OPCAO)}
																selected={ rbItem41 == radio.COD_OPCAO ? true : false } >
																<Left>
																<Text>{radio.DES_OPCAO}</Text>
																</Left>
																<Right>
																<Radio
																	onPress={() => setRbItem41(radio.COD_OPCAO)}
																	color={"#f0ad4e"}
																	selectedColor={"#5cb85c"}
																	selected={ rbItem41 == radio.COD_OPCAO ? true : false }
																/>
																</Right>
															</ListItem>
														);
													})
												)
											}
											{ /* LIST BOX ITEM 41 */ }
											{
												quesito.IND_LISTA == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 41  &&
												(
													
														<Picker
															selectedValue={lbItem41}
															style={{ height: 50, margin:5, width: '100%'}}
															onValueChange={(itemValue, itemIndex) => setLbItem41(itemValue)}
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
											{ /* INPUT INTEIRO ITEM 41 */ }
											{
												quesito.IND_INTEIRO == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 41 && 
												(
													<Input 
														value={inputInteiroItem41}
														onChangeText={value => setInputInteiroItem41(value)}
														placeholder='Inteiro'
													/>
												)
											}
											{ /* INPUT TEXTO ITEM 41 */ }
											{
												quesito.IND_TEXTO == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 41 && 
												(
													<Input 
														value={inputTextoItem41}
														onChangeText={value => setInputTextoItem41(value)}
														placeholder='Observação'
													/>
												)
											}
											{/* INPUT TEXTO ITEM 41 */ }
											{
												quesito.IND_TEXTO == true && quesito.IND_ATIVO == true && quesito.COD_ITEM == 41 && 
												(
													<Input 
														value={inputDecimalItem41}
														onChangeText={value => setInputDecimalItem41(value)}
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