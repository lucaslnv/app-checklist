import axios from 'axios';

const url = axios.create({
    baseURL: 'https://web.gruposol.com.br/ws/abastecimento/api',
    headers: {'Content-Type' : 'application/json' }
});

export const buscarMotoristas = async function(dominio, operador) {
    
    var dados = { 
        'chave': '095d0754-9ed5-4da9-aa16-cdd3b2dc42b1' ,
        'operator': operador
    };
    
    var endPoint = 'https://web.gruposol.com.br/ws/abastecimento/api/getOperator';
    
    if( dominio == 'intranet'){
        endPoint = 'https://intranet.gruposol.com.br/ws/abastecimento/api/getOperator';
    }
    
    return await axios.post(endPoint, dados)
    .then(function (response) {
        return({status: true, resultado: response.data});
    })
    .catch(function (error) {
        var mensagem = 'Não foi possível autenticar o operador.';
        if(error.response.status == 403 ){ mensagem = 'Chave inválida ou operador inativo.'; }
        if(error.response.status == 404 ){ mensagem = 'Operador não existe.'; }

        return({status: false, mensagem: mensagem, erro: error});
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
            'QrCode': qrCode,
            'chave': '095d0754-9ed5-4da9-aa16-cdd3b2dc42b1'
        }
      })
    .then(function (response) {
        return({status: true, resultado: response});
    })
    .catch(function (error) {
        console.log(error);
        return({status: false, mensagem: 'Não foi possível carregar os quesitos.', erro: error, statusCode: error.response.status});
    });
}

export const registrarChecklist = async function(dominio, quesitosJson, codEmitente, nomeEquipamento, codOperador) {
    
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours()+':'+today.getMinutes()+':'+today.getSeconds();

    var dados = { 
        'CHAVE': '095d0754-9ed5-4da9-aa16-cdd3b2dc42b1',
        'COD_EMITENTE' : codEmitente,
        'EQUIPAMENTO': nomeEquipamento,
        'codOperador' : codOperador ,
        'DATETIME': date+' '+time,
        'QUESITOS': quesitosJson
    };
   
    var endPoint = 'https://web.gruposol.com.br/ws/abastecimento/api/postQuesitos';
    if( dominio == 'intranet'){
        endPoint = 'https://intranet.gruposol.com.br/ws/abastecimento/api/postQuesitos';
    }
    
    return await axios.post(endPoint, dados)
    .then(function (response) {
        return({status: true, resultado: response.data});
    })
    .catch(function (error) {
        console.log(error);
        return({status: false, mensagem: 'Não foi possível registrar o checklist.', erro: error});
    });
}




