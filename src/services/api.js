import axios from 'axios';

const url = axios.create({
    baseURL: 'https://web.gruposol.com.br/ws/abastecimento/api',
    headers: {'Content-Type' : 'application/json' }
});

export const buscarMotoristas = async function(dominio) {
    
    var dados = { 'chave': '095d0754-9ed5-4da9-aa16-cdd3b2dc42b1' };

    var endPoint = 'https://web.gruposol.com.br/ws/abastecimento/api/buscarMotoristasOrm';
    
    if( dominio == 'intranet'){
        endPoint = 'https://intranet.gruposol.com.br/ws/abastecimento/api/buscarMotoristasOrm';
    }
    
    return await axios.post(endPoint, dados)
    .then(function (response) {
        return({status: true, resultado: response.data.resultado});
    })
    .catch(function (error) {
        console.log(error);
        return({status: false, mensagem: 'Não foi possível carregar os motoristas.', erro: error});
    });
}

export const buscarEquipamentos = async function(dominio) {
    
    var dados = { 'chave': '095d0754-9ed5-4da9-aa16-cdd3b2dc42b1' };

    var endPoint = 'https://web.gruposol.com.br/ws/abastecimento/api/buscarEquipamentosOrm';
    if( dominio == 'intranet'){
        endPoint = 'https://intranet.gruposol.com.br/ws/abastecimento/api/buscarEquipamentosOrm';
    }

    return await axios.post(endPoint, dados)
    .then(function (response) {
        return({status: true, resultado: response.data.resultado});
    })
    .catch(function (error) {
        console.log(error);
        return({status: false, mensagem: 'Não foi possível carregar os equipamentos.', erro: error});
    });
}

export const buscarQuesitos = async function(dominio, qrCode) {

    var endPoint = 'https://web.gruposol.com.br/ws/abastecimento/api/getQuesitos';
    if( dominio == 'intranet'){
        endPoint = 'https://intranet.gruposol.com.br/ws/abastecimento/api/getQuesitos';
    }
    
    return await axios.get(endPoint, {
        params: {
            QrCode: qrCode
        }
      })
    .then(function (response) {
        return({status: true, resultado: response});
    })
    .catch(function (error) {
        console.log(error);
        return({status: false, mensagem: 'Não foi possível carregar os quesitos.', erro: error});
    });
}




