'use strict'

const API = 'https://api-render-zwne.onrender.com'

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

const getEstoque = async () => {
    const response = await fetch(`${API}/estoque`)
    const data = await response.json();
    return data;
}

const putProduto = async (estoque) => {
  const options = {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(estoque)
  };

  const response = await fetch(`${API}/estoque/${estoque.id}`, options);
  const data = await response.json();
  return data;
};

const deleteProduto = async (id) => {
  const options = {
    method: 'DELETE'
  };

  const res = await fetch(`${API}/estoque/${id}`, options);
  const data = await res.json();
  return data;
};

async function deletarProduto(estoque) {
  const confirmou = confirm(`Tem certeza que deseja excluir o aluno ${estoque.nome}?`);
  
  if (confirmou) {
    await deleteProduto(estoque.id);
    
    // // Caso você estivesse editando exatamente esse aluno no formulário, limpa os campos
    // if (produtoSelecionado === estoque.id) {
    //     document.getElementById('inputCadastrarNomeProduto').value = ''
    //     document.getElementById('inputCadastrarQuantidadeEstoque').value = ''
    // }

    preencherGaleriaDeEstoque(); // Atualiza a lista de cards na tela
  }
}

const postProduto = async (estoque) => {
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(estoque)
  };

  const response = await fetch(`${API}/estoque`, options);
  const data = await response.json();
  return data;
};

const modalEditar = document.getElementById('modalEditar');
const inputEditar = document.getElementById('inputEditarNomeProduto');
const inputQuantidadeEstoque = document.getElementById('inputQuantidadeEstoque');
const botaoConfirmarEdicao = document.getElementById('botaoConfirmarEdicao');
const botaoCancelarEdicao = document.getElementById('botaoCancelarEdicao');

let produtoSelecionado = null

function cardEstoque(estoque){
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
    };

    botaoExcluir.onclick = () => {
        deletarProduto(estoque)
    }

    botoesEstoque.replaceChildren(botaoEditar, botaoExcluir)
    card.replaceChildren(nomeProdutoEstoque, idProdutoEstoque, quantidadeEstoque, botoesEstoque)
    return card
}

botaoConfirmarEdicao.onclick = async () => {
 const nome = document.getElementById('inputEditarNomeProduto').value

    const quantidade = Number(
        document.getElementById('inputQuantidadeEstoque').value
    )
 const estoqueAtualizado = {
    ...produtoSelecionado,
        nome: nome,
        quantidade: Number(quantidade)
    }
    console.log('Dados enviados:', estoqueAtualizado)

    try {
        const resposta = await putProduto(estoqueAtualizado)

        console.log('Resposta da API:', resposta)

        alert('Produto atualizado com sucesso!')

        preencherGaleriaDeEstoque()

        document.getElementById('modalEditar').style.display = 'none'

        produtoSelecionado = null

    } catch (erro) {
        console.error('Erro ao atualizar produto:', erro)
        alert('Não foi possível atualizar o produto.')
    }

};


botaoCancelarEdicao.onclick = () => {
    modalEditar.style.display = 'none'
}

function criarCardProdutos(produto){
    const cardEstoque = document.createElement('div')
    cardEstoque.className = 'card'
    const fotoProduto = document.createElement('img')
    fotoProduto.src = produto.foto
    const nomeProduto = document.createElement('h2')
    nomeProduto.textContent = produto.nome
    const precoProduto = document.createElement('p')
    precoProduto.textContent = `R$${produto.preco} `
    
    cardEstoque.replaceChildren(fotoProduto, nomeProduto, precoProduto)
    return cardEstoque
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

    buttonConfirmar.onclick = () => {
        const valorSenha = senha.value
        if(valorSenha === funcionario.senha){
            const produtos = document.getElementById('produtos')
            const buttonAdicionarProduto = document.getElementById('buttonAdicionarProduto')
            produtos.style.display = 'none'
            filtrarProdutos.style.display = 'none'
            buttonAdicionarProduto.style.display = 'flex'
            preencherGaleriaDeEstoque()
        }
        else{
            alert('Senha incorreta.')
        }
    }

    cardFuncionario.replaceChildren(foto, nome, id, cargo, senha, buttonConfirmar)
    return cardFuncionario
}

async function preencherGaleriaDeFuncionarios() {
  const galeria = document.getElementById('funcionarios')
  galeria.style.display = "flex"
  const repositorio = await getFuncionarios()
  const cards = repositorio.map(criarCardFuncionarios)

  galeria.replaceChildren( ...cards, sairDeFuncionarios)
}

const funcionarios = document.getElementById('funcionarios')
const sairDeFuncionarios = document.getElementById('sairDeFuncionarios')

sairDeFuncionarios.onclick = () => {
    funcionarios.style.display = "none"
}

const buttonFuncionarios = document.getElementById('buttonFuncionarios')
const buttonAdicionarProduto = document.getElementById('buttonAdicionarProduto')
const modalAdicionarProduto = document.getElementById('modalAdicionarProduto')
const botaoCancelar = document.getElementById('botaoCancelar')

buttonFuncionarios.onclick = () => {
    preencherGaleriaDeFuncionarios()
}

buttonAdicionarProduto.onclick = () => {
    modalAdicionarProduto.style.display = 'flex'
}

const botaoCadastrarProduto = document.getElementById('botaoCadastrarProduto')
botaoCadastrarProduto.onclick = async () => {
    const nome = document.getElementById('inputCadastrarNomeProduto').value
    const quantidade = document.getElementById('inputCadastrarQuantidadeEstoque').value

    const produtoCadastrado = {
        nome: nome,
        quantidade: Number(quantidade)
    }

    try{
        await postProduto(produtoCadastrado)

         alert('Produto cadastrado com sucesso!')

        modalAdicionarProduto.style.display = 'none'

        // Limpa os campos
        document.getElementById('inputCadastrarNomeProduto').value = ''
        document.getElementById('inputCadastrarQuantidadeEstoque').value = ''

        preencherGaleriaDeEstoque()
    } catch (erro) {
        console.error(erro)
        alert('Não foi possível cadastrar o produto!')
    }
}

botaoCancelar.onclick = () => {
    modalAdicionarProduto.style.display = 'none'
}

///////////////////////////////////////////////////////////////////////////////////////////////////

async function preencherGaleriaDeProdutos(listaProdutos) {
  const galeria = document.getElementById('produtos')
  const repositorio = listaProdutos || await getProdutos()
  const cards = repositorio.map(criarCardProdutos)

  galeria.replaceChildren(...cards)
}

async function preencherGaleriaDeEstoque(listaProdutosEstoque) {
    const galeria = document.getElementById('estoque')
    const repositorio = listaProdutosEstoque || await getEstoque()
    const cards = repositorio.map(cardEstoque)
  
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

const botaoPesquisa = document.getElementById('botaoPesquisa')

botaoPesquisa.onclick = () => {
    const nome = document.getElementById('nomeProduto').value

    pesquisarProdutoPorNome(nome)
}

filtrarProdutos.addEventListener('change', filtrarProdutosPorOpcao)

preencherGaleriaDeProdutos()

