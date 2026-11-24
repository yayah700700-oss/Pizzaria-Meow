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
    const nomeProduto = document.createElement('h2')
    nomeProduto.textContent = produto.nome
    const precoProduto = document.createElement('p')
    precoProduto.textContent = `R$${produto.preco} `
    card.replaceChildren(nomeProduto, precoProduto)
    return card
}

function  criarCardFuncionarios(funcionario){
    const card = document.createElement('ul')
    card.className = 'card'
    const id = document.createElement('li')
    id.textContent = `ID do Funcionario: ${funcionario.id}`
    const nome = document.createElement('li')
    nome.textContent = funcionario.nome
    const cargo = document.createElement('li')
    cargo.textContent = funcionario.cargo

    card.replaceChildren(id, nome, cargo)
    return card
}

// async function preencherGaleriaDeTodas() {
//   const galeria = document.getElementById('teste')
//   const repositorio = await getFuncionarios()
//   const cards = repositorio.map(criarCardFuncionarios)

//   galeria.replaceChildren(...cards)
// }

async function preencherGaleriaDeProdutos(listaProdutos) {
  const galeria = document.getElementById('teste')
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