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

function  criarCard(funcionario){
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

async function preencherGaleriaDeTodas() {
  const galeria = document.getElementById('teste')
  const repositorio = await getFuncionarios()
  const cards = repositorio.map(criarCard)

  galeria.replaceChildren(...cards)
}

preencherGaleriaDeTodas()