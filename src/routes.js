import Operador from './pages/Operador';
import Equipamento from './pages/Equipamento';
import Checklist from './pages/Checklist';
import Camera from './components/Camera';

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
    },
    {   
        defaultNavigationOptions: {
        headerShown: true,
        title: 'Identificação Funcional',
            headerStyle: {
                backgroundColor: '#DDDDDD',
            },
        },
        initialRouteName: 'Checklist'
    },
    ));

export default Routes;