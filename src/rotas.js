const express = require('express')

const { validacaoSenha, validacaoDados, validacaoCpfEEmail, verificacaoNumeroDaconta, verificacaoSaldoZero, vreficacaoCpfEmailEmOutraConta,
    verificacaoDadosSaldoExtrato, verificacaoContaExisteSaldoExtrato, verificacaoSenhaInformadaSaldoExtrato } = require('./intermediarios/interContas')

const { listagemContas, criarConta, atualizarUsuario, excluirConta, saldo, extrato } = require('./controladores/contas')

const { depositar, sacar, transferir } = require('./controladores/transacoes')


const rotas = express()

// Listar contas bancárias
rotas.get('/contas', validacaoSenha, listagemContas)
// Criar conta bancária
rotas.post('/contas', validacaoDados, validacaoCpfEEmail, criarConta)
// Atualizar os dados do usuário da conta bancária
rotas.put('/contas/:numeroConta/usuario', validacaoDados, verificacaoNumeroDaconta, vreficacaoCpfEmailEmOutraConta, atualizarUsuario)
// Excluir uma conta bancária
rotas.delete('/contas/:numeroConta', verificacaoNumeroDaconta, verificacaoSaldoZero, excluirConta)

// Depósitar em uma conta bancária
rotas.post('/transacoes/depositar', depositar)
// Sacar de uma conta bancária
rotas.post('/transacoes/sacar', sacar)
// Transferir valores entre contas bancárias
rotas.post('/transacoes/transferir', transferir)

// Consultar saldo da conta bancária
rotas.get('/contas/saldo', verificacaoDadosSaldoExtrato, verificacaoContaExisteSaldoExtrato, verificacaoSenhaInformadaSaldoExtrato, saldo)
// Emitir extrato bancário
rotas.get('/contas/extrato', verificacaoDadosSaldoExtrato, verificacaoContaExisteSaldoExtrato, verificacaoSenhaInformadaSaldoExtrato, extrato)


module.exports = rotas










