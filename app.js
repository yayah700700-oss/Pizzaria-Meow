'use strict'

const API = 'http://localhost:3000'

const getFuncionarios = async () => {
    const response = await fetch(`${API}/funcionarios`)
    const data = await response.json();
    return data;
}

const getProdutos = async () => {
    const response = await fetch(`${API}/produtos`)
    const data = await response.json();
    return data;
}

function criarCardProdutos(produto){
    const card = document.createElement('div')
    card.className = 'card'
    const fotoProduto = document.createElement('img')
    fotoProduto.src = produto.foto
    const nomeProduto = document.createElement('h2')
    nomeProduto.textContent = produto.nome
    const precoProduto = document.createElement('p')
    precoProduto.textContent = `R$${produto.preco} `
    card.replaceChildren(fotoProduto, nomeProduto, precoProduto)
    return card
}

function  criarCardFuncionarios(funcionario){
    const cardFuncionario = document.createElement('div')
    cardFuncionario.className = 'cardFuncionario'
    const foto = document.createElement('img')
    foto.src = funcionario.foto
    const nome = document.createElement('h4')
    nome.textContent = funcionario.nome
    const id = document.createElement('p')
    id.textContent = `ID do Funcionario: ${funcionario.id}`
    const cargo = document.createElement('p')
    cargo.textContent = funcionario.cargo
    const senha = document.createElement('input')
    senha.type = 'text'
    senha.placeholder = 'Digite a senha aqui:'
    const buttonConfirmar = document.createElement('button')
    buttonConfirmar.textContent = 'Confirmar'

    cardFuncionario.replaceChildren(foto, nome, id, cargo, senha, buttonConfirmar)
    return cardFuncionario
}

async function preencherGaleriaDeFuncionarios() {
  const galeria = document.getElementById('funcionarios')
  galeria.style.display = "flex"
  const repositorio = await getFuncionarios()
  const cards = repositorio.map(criarCardFuncionarios)

  galeria.replaceChildren(...cards)
}

const funcionarios = document.getElementById('funcionarios')
const sairDeFuncionarios = document.getElementById('sairDeFuncionarios')

sairDeFuncionarios.onclick = () => {
    funcionarios.style.display = "none"
}

const buttonFuncionarios = document.getElementById('buttonFuncionarios')

buttonFuncionarios.onclick = () => {
    preencherGaleriaDeFuncionarios()
}

async function preencherGaleriaDeProdutos(listaProdutos) {
  const galeria = document.getElementById('produtos')
  const repositorio = listaProdutos || await getProdutos()
  const cards = repositorio.map(criarCardProdutos)

  galeria.replaceChildren(...cards)
}

const filtrarProdutos = document.getElementById('filtrarProdutosPorOpcao')

async function filtrarProdutosPorOpcao(){
    const produtoEscolhido = filtrarProdutos.value
    const produtos = await getProdutos()

        if (produtoEscolhido === 'Todos') {
        preencherGaleriaDeProdutos(produtos)
        return
    }

    const produtosFiltrados = produtos.filter(produto => {
         return produto.valor === produtoEscolhido
    })

    preencherGaleriaDeProdutos(produtosFiltrados)
}

async function pesquisarProdutoPorNome(nome) {
    const produtos = await getProdutos()

  const produtosFiltradosPorNome = produtos.filter(
      produto => produto.nome.includes(nome)
  )

  preencherGaleriaDeProdutos(produtosFiltradosPorNome)
}

const botaoPesquisa = document.getElementById('botaoPesquisa')

botaoPesquisa.onclick = () => {
    const nome = document.getElementById('nomeProduto').value

    pesquisarProdutoPorNome(nome)
}

filtrarProdutos.addEventListener('change', filtrarProdutosPorOpcao)

preencherGaleriaDeProdutos()