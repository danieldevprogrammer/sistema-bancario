const { contas, saques, depositos, transferencias } = require('../bancodedados')

//Controladores -> listar, criar, atualizar e excluir contas:
const listagemContas = (req, res) => {
    //listagem de todas as contas bancárias existentes
    if (contas.length !== 0) {
        return res.status(200).json(contas)
    } else {
        return res.status(200).json({ "mensagem": 'Não existe nenhuma conta cadastrada!' })
    }
}

const criarConta = (req, res) => {
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body
    //Criar uma nova conta cujo número é único
    let identificadorNumero = 0
    if (contas.length === 0) {
        identificadorNumero++
    } else {
        identificadorNumero = contas[contas.length - 1].numero + 1
    }
    contas.push({
        numero: identificadorNumero,
        saldo: 0,
        usuario: { nome, cpf, data_nascimento, telefone, email, senha },
    })

    return res.status(204).json()
}

const atualizarUsuario = (req, res) => {
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body
    const { numeroConta } = req.params
    //Atualizar os dados do usuário de uma conta bancária
    const atualizacaoDeUsuario = contas.find((conta) => {
        return conta.numero === Number(numeroConta)
    });

    atualizacaoDeUsuario.usuario.nome = nome
    atualizacaoDeUsuario.usuario.cpf = cpf
    atualizacaoDeUsuario.usuario.data_nascimento = data_nascimento
    atualizacaoDeUsuario.usuario.telefone = telefone
    atualizacaoDeUsuario.usuario.email = email
    atualizacaoDeUsuario.usuario.senha = senha

    return res.status(204).json();
}

const excluirConta = (req, res) => {
    const { numeroConta } = req.params
    //Remover a conta do objeto de persistência de dados.
    const conta = contas.indexOf(numeroConta)
    contas.splice(conta, 1)

    return res.status(200).json()
}

//Controladores -> Saldo e Extrato:
const saldo = (req, res) => {
    const { numero_conta, senha } = req.query

    const contaExiste = contas.find((conta) => {
        return conta.numero === Number(numero_conta)
    })
    // Exibir o saldo da conta bancária em questão
    const saldo = contaExiste.saldo
    return res.status(200).json(saldo)
}

const extrato = (req, res) => {
    const { numero_conta, senha } = req.query

    const contaExiste = contas.find((conta) => {
        return conta.numero === Number(numero_conta)
    })

    // Retornar a lista de transferências, depósitos e saques da conta em questão.

    const listaDeTrasferenciasEnviadas = transferencias.filter((conta) => {
        return Number(conta.numero_conta_origem) === Number(contaExiste.numero)
    })

    const listaDeTrasferenciasRecebidas = transferencias.filter((conta) => {
        return Number(conta.numero_conta_destino) === Number(contaExiste.numero)
    })

    const listaDeDepositos = depositos.filter((conta) => {
        return Number(conta.numero_conta) === Number(contaExiste.numero)
    })

    const listaDeSaques = saques.filter((conta) => {
        return Number(conta.numero_conta) === Number(contaExiste.numero)
    })

    const extrato = {
        depositos: listaDeDepositos,
        saques: listaDeSaques,
        transferenciasEnviadas: listaDeTrasferenciasEnviadas,
        transferenciasRecebidas: listaDeTrasferenciasRecebidas,
    }

    return res.status(200).json(extrato)
}


// 200 (OK) = requisição bem sucedida
// 201 (Created) = requisição bem sucedida e algo foi criado
// 204 (No Content) = requisição bem sucedida, sem conteúdo no corpo da resposta
// 400 (Bad Request) = o servidor não entendeu a requisição pois está com uma sintaxe/formato inválido
// 401 (Unauthorized) = o usuário não está autenticado (logado)
// 403 (Forbidden) = o usuário não tem permissão de acessar o recurso solicitado
// 404 (Not Found) = o servidor não pode encontrar o recurso solicitado
// 500 (Internal Server Error) = falhas causadas pelo servidor

module.exports = {
    listagemContas,
    criarConta,
    atualizarUsuario,
    excluirConta,
    saldo,
    extrato
}