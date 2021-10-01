import Operador from './pages/Operador';
import Equipamento from './pages/Equipamento';
import Checklist from './pages/Checklist';
import Camera from './components/Camera';
import QRCode from './components/QRCode';
import Menu from './pages/Menu';

import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

const Routes = createAppContainer(
    createStackNavigator({
        Camera: {
            screen: Camera
        },
        Operador: {
            screen: Operador
        },
        Checklist: {
            screen: Checklist
        },
        Equipamento: {
            screen: Equipamento
        },
        QRCode: {
            screen: QRCode
        },
        Menu: {
            screen: Menu
        }
    },
    {   
        defaultNavigationOptions: {
        headerShown: true,
        title: 'Identificação Funcional',
            headerStyle: {
                backgroundColor: '#DDDDDD',
            },
        },
        initialRouteName: 'Operador'
    },
    ));

export default Routes;