const { contas, saques, depositos, transferencias } = require('../bancodedados')
const { format } = require('date-fns')

const depositar = (req, res) => {
    const { numero_conta, valor } = req.body
    //Verificar se o numero da conta e o valor do deposito foram informados no body
    if (!numero_conta) {
        return res.status(400).json({ "mensagem": 'Todos os campos são obrigatórios, informe o número da conta!' })
    } else if (!valor) {
        return res.status(400).json({ "mensagem": 'Todos os campos são obrigatórios, informe o valor!' })
    }

    //Verificar se a conta bancária informada existe
    const contaExiste = contas.find((conta) => {
        return conta.numero === Number(numero_conta)
    })

    if (!contaExiste) {
        return res.status(400).json({ "mensagem": 'Número da conta inválido ou não existe.' })
    }

    //Não permitir depósitos com valores negativos ou zerados
    if (valor <= 0) {
        return res.status(400).json({ "mensagem": 'Valor do depósito inválido!' })
    }

    const dataDoDeposito = format(new Date(), "yyyy-MM-dd' 'hh:mm:ss").toString()
    depositos.push({
        data: dataDoDeposito,
        numero_conta: numero_conta,
        valor: valor
    })

    //Somar o valor de depósito ao saldo da conta encontrada
    contaExiste.saldo += valor

    return res.status(201).json()
}

const sacar = (req, res) => {
    const { numero_conta, valor, senha } = req.body
    //Verificar se o numero da conta, o valor do saque e a senha foram informados no body
    if (!numero_conta) {
        return res.status(400).json({ "mensagem": 'Todos os campos são obrigatórios, informe o número da conta!' })
    } else if (!valor) {
        return res.status(400).json({ "mensagem": 'Todos os campos são obrigatórios, informe o valor!' })
    } else if (!senha) {
        return res.status(400).json({ "mensagem": 'Todos os campos são obrigatórios, informe a senha!' })
    }

    //Verificar se a conta bancária informada existe
    const contaExiste = contas.find((conta) => {
        return conta.numero === Number(numero_conta)
    })

    if (!contaExiste) {
        return res.status(400).json({ "mensagem": 'Número da conta inválido ou não existe.' })
    }

    //Verificar se a senha informada é uma senha válida para a conta informada
    if (senha !== contaExiste.usuario.senha) {
        return res.status(400).json({ 'mensagem': 'Senha informada inválida!' })
    }

    //Verificar se há saldo disponível para saque
    if (valor <= 0) {
        return res.status(400).json({ "mensagem": 'O valor não pode ser menor que zero!' })
    } else if (contaExiste.saldo < valor) {
        return res.status(400).json({ "mensagem": 'O valor de saque é maior que o saldo da conta!' })
    }

    //Subtrair o valor sacado do saldo da conta encontrada
    const dataDoSaque = format(new Date(), "yyyy-MM-dd' 'hh:mm:ss").toString()
    saques.push({
        data: dataDoSaque,
        numero_conta: numero_conta,
        valor: valor
    })

    contaExiste.saldo -= valor

    return res.status(201).json()
}

const transferir = (req, res) => {
    const { numero_conta_origem, numero_conta_destino, valor, senha } = req.body

    // Verificar se o número da conta de origem, de destino, senha da conta de origem e valor da transferência foram informados no body
    if (!numero_conta_origem) {
        return res.status(400).json({ "mensagem": 'Todos os campos são obrigatórios, informe o número da conta de origem!' })
    } else if (!numero_conta_destino) {
        return res.status(400).json({ "mensagem": 'Todos os campos são obrigatórios, informe o número da conta de destino!' })
    } else if (!valor) {
        return res.status(400).json({ "mensagem": 'Todos os campos são obrigatórios, informe o valor!' })
    } else if (!senha) {
        return res.status(400).json({ "mensagem": 'Todos os campos são obrigatórios, informe a senha!' })
    }

    // Verificar se a conta bancária de origem informada existe
    const contaDeOrigem = contas.find((conta) => {
        return conta.numero === Number(numero_conta_origem)
    })

    if (!contaDeOrigem) {
        return res.status(400).json({ 'mensagem': 'Conta de origem inválida ou inexistente!' })
    } else if (numero_conta_origem === numero_conta_destino) {
        return res.status(400).json({ 'mensagem': 'Conta de origem não pode ser a mesma da conta de destino!' })
    }

    // Verificar se a conta bancária de destino informada existe
    const contaDeDestino = contas.find((conta) => {
        return conta.numero === Number(numero_conta_destino)
    })

    if (!contaDeDestino) {
        return res.status(400).json({ 'mensagem': 'Conta de origem inválida ou inexistente!' })
    }

    //Verificar se a senha informada é uma senha válida para a conta de origem informada
    if (senha !== contaDeOrigem.usuario.senha) {
        return res.status(400).json({ 'mensagem': 'Senha informada inválida!' })
    }

    // Verificar se há saldo disponível na conta de origem para a transferência
    if (contaDeOrigem.saldo < valor) {
        return res.status(400).json({ "mensagem": 'Saldo insuficiente!' })
    } else if (valor <= 0) {
        return res.status(400).json({ "mensagem": 'O valor da tranferência não pode ser menor que zero!' })
    }

    // Subtrair o valor da transfência do saldo na conta de origem
    contaDeOrigem.saldo -= valor
    // Somar o valor da transferência no saldo da conta de destino
    contaDeDestino.saldo += valor

    // Registrar a transação de tranferência
    const dataDaTransferencia = format(new Date(), "yyyy-MM-dd' 'hh:mm:ss").toString()
    transferencias.push({
        data: dataDaTransferencia,
        numero_conta_origem: numero_conta_origem,
        numero_conta_destino: numero_conta_destino,
        valor: valor
    })

    res.status(201).json()
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
    depositar,
    sacar,
    transferir
}