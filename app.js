'use strict'

const API = 'https://api-render-zwne.onrender.com'

// GET - Buscar funcionários
const getFuncionarios = async () => {
    const response = await fetch(`${API}/funcionarios`)
    const data = await response.json()
    return data
}

// GET - Buscar produtos
const getProdutos = async () => {
    const response = await fetch(`${API}/produtos`)
    const data = await response.json()
    return data
}

// GET - Buscar estoque
const getEstoque = async () => {
    const response = await fetch(`${API}/estoque`)
    const data = await response.json()
    return data
}

// PUT - Atualizar produto no estoque
const putProduto = async (estoque) => {
    const options = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(estoque)
    }

    const response = await fetch(`${API}/estoque/${estoque.id}`, options)
    const data = await response.json()
    return data
}

// DELETE - Excluir produto do estoque
const deleteProduto = async (id) => {
    const options = {
        method: 'DELETE'
    }

    const res = await fetch(`${API}/estoque/${id}`, options)
    const data = await res.json()
    return data
}

// POST - Cadastrar produto no estoque
const postProduto = async (estoque) => {
    const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(estoque)
    }

    const response = await fetch(`${API}/estoque`, options)
    const data = await response.json()
    return data
}

// Modal de edição
const modalEditar = document.getElementById('modalEditar')
const inputEditar = document.getElementById('inputEditarNomeProduto')
const inputQuantidadeEstoque = document.getElementById('inputQuantidadeEstoque')
const botaoConfirmarEdicao = document.getElementById('botaoConfirmarEdicao')
const botaoCancelarEdicao = document.getElementById('botaoCancelarEdicao')

// Modal de cadastro
const modalAdicionarProduto = document.getElementById('modalAdicionarProduto')
const botaoCancelar = document.getElementById('botaoCancelar')
const botaoCadastrarProduto = document.getElementById('botaoCadastrarProduto')

// Botões de navegação
const buttonUsuario = document.getElementById('buttonUsuario')
const buttonFuncionarios = document.getElementById('buttonFuncionarios')
const buttonAdicionarProduto = document.getElementById('buttonAdicionarProduto')

// Galerias
const funcionarios = document.getElementById('funcionarios')
const sairDeFuncionarios = document.getElementById('sairDeFuncionarios')

// Pesquisa e filtros
const filtrarProdutos = document.getElementById('filtrarProdutosPorOpcao')
const botaoPesquisa = document.getElementById('botaoPesquisa')

let produtoSelecionado = null

// Card do estoque
function cardEstoque(estoque) {
    const card = document.createElement('div')
    card.className = 'card'

    const nomeProdutoEstoque = document.createElement('h2')
    nomeProdutoEstoque.textContent = estoque.nome

    const idProdutoEstoque = document.createElement('p')
    idProdutoEstoque.textContent = `ID do produto: ${estoque.id}`

    const quantidadeEstoque = document.createElement('p')
    quantidadeEstoque.textContent = `Quantidade em estoque: ${estoque.quantidade}`

    const botoesEstoque = document.createElement('div')
    botoesEstoque.className = 'botoesEstoque'

    const botaoEditar = document.createElement('button')
    botaoEditar.textContent = 'Editar'

    const botaoExcluir = document.createElement('button')
    botaoExcluir.textContent = 'Excluir'

    botaoEditar.onclick = () => {
        produtoSelecionado = estoque
        inputEditar.value = estoque.nome
        inputQuantidadeEstoque.value = estoque.quantidade

        modalEditar.style.display = 'flex'
    }

    botaoExcluir.onclick = () => {
        deletarProduto(estoque)
    }

    botoesEstoque.replaceChildren(botaoEditar, botaoExcluir)
    card.replaceChildren(nomeProdutoEstoque, idProdutoEstoque, quantidadeEstoque, botoesEstoque)

    return card
}

// Card dos produtos
function criarCardProdutos(produto) {
    const cardEstoque = document.createElement('div')
    cardEstoque.className = 'card'

    const fotoProduto = document.createElement('img')
    fotoProduto.src = produto.foto

    const nomeProduto = document.createElement('h2')
    nomeProduto.textContent = produto.nome

    const precoProduto = document.createElement('p')
    precoProduto.textContent = `R$${produto.preco}`

    cardEstoque.replaceChildren(fotoProduto, nomeProduto, precoProduto)

    return cardEstoque
}

// Card dos funcionários
function criarCardFuncionarios(funcionario) {
    const cardFuncionario = document.createElement('div')
    cardFuncionario.className = 'cardFuncionario'

    const foto = document.createElement('img')
    foto.src = funcionario.foto

    const nome = document.createElement('h4')
    nome.textContent = funcionario.nome

    const id = document.createElement('p')
    id.textContent = `ID do Funcionario: ${funcionario.id}`

    const cargo = document.createElement('p')
    cargo.textContent = `Cargo: ${funcionario.cargo}`

    const senha = document.createElement('input')
    senha.type = 'text'
    senha.placeholder = 'Digite a senha aqui:'

    const buttonConfirmar = document.createElement('button')
    buttonConfirmar.textContent = 'Confirmar'

    buttonConfirmar.onclick = () => {
        const valorSenha = senha.value

        if (valorSenha === funcionario.senha) {
            const produtos = document.getElementById('produtos')

            produtos.style.display = 'none'
            filtrarProdutos.style.display = 'none'
            funcionarios.style.display = 'none'
            buttonFuncionarios.style.display = 'none'
            buttonAdicionarProduto.style.display = 'flex'
            buttonUsuario.style.display = 'flex'

            preencherGaleriaDeEstoque()
        } else {
            alert('Senha incorreta.')
        }
    }

    cardFuncionario.replaceChildren(foto, nome, id, cargo, senha, buttonConfirmar)

    return cardFuncionario
}

// Excluir produto
async function deletarProduto(estoque) {
    const confirmou = confirm(`Tem certeza que deseja excluir o produto ${estoque.nome}?`)

    if (confirmou) {
        await deleteProduto(estoque.id)
        preencherGaleriaDeEstoque()
    }
}

// Confirmar edição
botaoConfirmarEdicao.onclick = async () => {
    const nome = inputEditar.value

    const quantidade = Number(inputQuantidadeEstoque.value)

    const estoqueAtualizado = {
        ...produtoSelecionado,
        nome: nome,
        quantidade: quantidade
    }

    try {
        const resposta = await putProduto(estoqueAtualizado)

        console.log('Resposta da API:', resposta)

        alert('Produto atualizado com sucesso!')

        preencherGaleriaDeEstoque()

        modalEditar.style.display = 'none'

        produtoSelecionado = null

    } catch (erro) {
        console.error('Erro ao atualizar produto:', erro)
        alert('Não foi possível atualizar o produto.')
    }
}

// Cancelar edição
botaoCancelarEdicao.onclick = () => {
    modalEditar.style.display = 'none'
}

// Cadastrar produto
botaoCadastrarProduto.onclick = async () => {
    const nome = document.getElementById('inputCadastrarNomeProduto').value

    const quantidade = document.getElementById('inputCadastrarQuantidadeEstoque').value

    const produtoCadastrado = {
        nome: nome,
        quantidade: Number(quantidade)
    }

    try {
        await postProduto(produtoCadastrado)

        alert('Produto cadastrado com sucesso!')

        modalAdicionarProduto.style.display = 'none'

        document.getElementById('inputCadastrarNomeProduto').value = ''
        document.getElementById('inputCadastrarQuantidadeEstoque').value = ''

        preencherGaleriaDeEstoque()

    } catch (erro) {
        console.error(erro)
        alert('Não foi possível cadastrar o produto!')
    }
}

// Cancelar cadastro
botaoCancelar.onclick = () => {
    modalAdicionarProduto.style.display = 'none'
}

// Galeria de funcionários
async function preencherGaleriaDeFuncionarios() {
    const galeria = document.getElementById('funcionarios')

    galeria.style.display = 'flex'

    const repositorio = await getFuncionarios()

    const cards = repositorio.map(criarCardFuncionarios)

    galeria.replaceChildren(...cards, sairDeFuncionarios)
}

// Galeria de produtos
async function preencherGaleriaDeProdutos(listaProdutos) {
    const galeria = document.getElementById('produtos')

    const repositorio = listaProdutos || await getProdutos()

    const cards = repositorio.map(criarCardProdutos)

    galeria.replaceChildren(...cards)
}

// Galeria de estoque
async function preencherGaleriaDeEstoque(listaProdutosEstoque) {
    const galeria = document.getElementById('estoque')

    const repositorio = listaProdutosEstoque || await getEstoque()

    const cards = repositorio.map(cardEstoque)

    galeria.replaceChildren(...cards)
}

// Filtrar produtos
async function filtrarProdutosPorOpcao() {
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

// Pesquisar produtos pelo nome
async function pesquisarProdutoPorNome(nome) {
    const termoBusca = nome.toLowerCase().trim()

    const produtos = await getProdutos()
    const estoques = await getEstoque()

    const produtosFiltradosPorNome = produtos.filter(
        produto => produto.nome.toLowerCase().includes(termoBusca)
    )

    const produtosFiltradosPorNomeEstoque = estoques.filter(
        estoque => estoque.nome.toLowerCase().includes(termoBusca)
    )

    preencherGaleriaDeProdutos(produtosFiltradosPorNome)
    preencherGaleriaDeEstoque(produtosFiltradosPorNomeEstoque)
}

// Abrir galeria de funcionários
buttonFuncionarios.onclick = () => {
    preencherGaleriaDeFuncionarios()
}

// Sair da galeria de funcionários
sairDeFuncionarios.onclick = () => {
    funcionarios.style.display = 'none'
}

// Abrir modal de cadastro
buttonAdicionarProduto.onclick = () => {
    modalAdicionarProduto.style.display = 'flex'
}

// Voltar para os produtos
buttonUsuario.onclick = () => {
    const estoque = document.getElementById('estoque')

    estoque.style.display = 'none'

    preencherGaleriaDeProdutos()
}

// Botão de pesquisa
botaoPesquisa.onclick = () => {
    const nome = document.getElementById('nomeProduto').value

    pesquisarProdutoPorNome(nome)
}

// Evento do filtro
filtrarProdutos.addEventListener('change', filtrarProdutosPorOpcao)

preencherGaleriaDeProdutos()
