const { banco, contas } = require('../bancodedados')

//Intermediários -> listar, criar, atualizar e excluir contas:
const validacaoSenha = (req, res, next) => {
    const { senha_banco } = req.query
    //Verificar se a senha do banco foi informada (passado como query params na url)
    if (!senha_banco) {
        return res.status(401).json({ "mensagem": 'A senha do banco não foi informada!' })
    }
    //Validar se a senha do banco está correta
    if (senha_banco !== banco.senha) {
        return res.status(401).json({ "mensagem": 'A senha do banco informada é inválida!' })
    }

    next()
}

const validacaoDados = (req, res, next) => {
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body
    //Verificar se todos os campos foram informados (todos são obrigatórios)
    if (!nome) {
        return res.status(400).json({ "mensagem": 'Todos os campos são obrigatórios, informe o nome!' })
    } else if (!cpf) {
        return res.status(400).json({ "mensagem": 'Todos os campos são obrigatórios, informe o CPF!' })
    } else if (!data_nascimento) {
        return res.status(400).json({ "mensagem": 'Todos os campos são obrigatórios, informe a data de nascimento!' })
    } else if (!telefone) {
        return res.status(400).json({ "mensagem": 'Todos os campos são obrigatórios, informe o telefone!' })
    } else if (!email) {
        return res.status(400).json({ "mensagem": 'Todos os campos são obrigatórios, informe o e-mail!' })
    } else if (!senha) {
        return res.status(400).json({ "mensagem": 'Todos os campos são obrigatórios, informe a senha!' })
    }

    next()
}

const validacaoCpfEEmail = (req, res, next) => {
    const { cpf, email } = req.body
    ////CPF deve ser um campo único e E-mail deve ser um campo único.
    const verificaoCpf = contas.find((conta) => {
        return conta.usuario.cpf === cpf
    })

    const verificaoEmail = contas.find((conta) => {
        return conta.usuario.email === email
    })

    if (verificaoCpf, verificaoEmail) {
        return res.status(400).json({ "mensagem": 'Já existe uma conta com o cpf ou e-mail informado!' })
    }

    next()
}

const vreficacaoCpfEmailEmOutraConta = (req, res, next) => {
    const { cpf, email } = req.body
    const { numeroConta } = req.params

    //Se o CPF for informado, verificar se já existe outro registro com o mesmo CPF
    const verificacaoCpfEmOutraConta = contas.find((conta) => {
        return conta.usuario.cpf === cpf
    })

    if (verificacaoCpfEmOutraConta && numeroConta !== verificacaoCpfEmOutraConta.numero) {
        return res.status(400).json({ "mensagem": 'O CPF informado já existe cadastrado!' })
    }

    //Se o E-mail for informado, verificar se já existe outro registro com o mesmo E-mail
    const verificacaoEmailEmOutraConta = contas.find((conta) => {
        return conta.usuario.email === email
    })

    if (verificacaoEmailEmOutraConta && numeroConta !== verificacaoEmailEmOutraConta.numero) {
        return res.status(400).json({ "mensagem": 'O e-mail informado já existe cadastrado!' })
    }

    next()
}

const verificacaoNumeroDaconta = (req, res, next) => {
    const { numeroConta } = req.params
    //Verificar se o numero da conta passado como parametro na URL é válida
    const verificacaoNumeroDaconta = contas.find((conta) => {
        return conta.numero === Number(numeroConta)
    })

    if (!verificacaoNumeroDaconta) {
        return res.status(404).json({ "mensagem": 'Número da conta inválido ou não existe!' })
    }

    next()
}

const verificacaoSaldoZero = (req, res, next) => {
    const { numeroConta } = req.params
    //Permitir excluir uma conta bancária apenas se o saldo for 0 (zero)
    const verificacaoNumeroDaconta = contas.find((conta) => {
        return conta.numero === Number(numeroConta)
    })

    if (!verificacaoNumeroDaconta) {
        return res.status(404).json({ "mensagem": 'Número da conta inválido ou não existe.' })
    } else if (verificacaoNumeroDaconta.saldo !== 0) {
        return res.status(403).json({ "mensagem": 'A conta só pode ser removida se o saldo for zero!' })
    }

    next()
}

//Intermediários -> Saldo e Extrato:

const verificacaoDadosSaldoExtrato = (req, res, next) => {
    const { numero_conta, senha } = req.query
    // Verificar se o numero da conta e a senha foram informadas (passado como query params na url)
    if (!numero_conta) {
        return res.status(400).json({ "mensagem": 'Todos os campos são obrigatórios, informe o número da conta!' })
    } else if (!senha) {
        return res.status(400).json({ "mensagem": 'Todos os campos são obrigatórios, informe a senha!' })
    }

    next()
}

const verificacaoContaExisteSaldoExtrato = (req, res, next) => {
    const { numero_conta } = req.query
    // Verificar se a conta bancária informada existe
    const contaExiste = contas.find((conta) => {
        return conta.numero === Number(numero_conta)
    })

    if (!contaExiste) {
        return res.status(400).json({ "mensagem": 'Conta bancária não encontada!' })
    }

    next()
}

const verificacaoSenhaInformadaSaldoExtrato = (req, res, next) => {
    const { numero_conta, senha } = req.query
    // Verificar se a senha informada é uma senha válida
    const contaExiste = contas.find((conta) => {
        return conta.numero === Number(numero_conta)
    })
    if (senha !== contaExiste.usuario.senha) {
        return res.status(400).json({ 'mensagem': 'Senha informada inválida!' })
    }

    next()
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
    validacaoSenha,
    validacaoDados,
    validacaoCpfEEmail,
    verificacaoNumeroDaconta,
    vreficacaoCpfEmailEmOutraConta,
    verificacaoSaldoZero,
    verificacaoDadosSaldoExtrato,
    verificacaoContaExisteSaldoExtrato,
    verificacaoSenhaInformadaSaldoExtrato
}
