// =========================
// 1. BANCO DE DADOS
// =========================
const produtos = [
    { // HAMBURGERES
        nome: "X-Predilettus",
        preco: 35.00,
        descricao: "Pão brioche, blend 160g, cheddar, bacon e maionese artesanal.",
        imagem: "img/burguer-1.png",
        categoria: "hamburguer"
    },
    {// PIZZAS
        nome: "Calabresa Premium",
        preco: 55.00,
        descricao: "Molho pomodoro, muçarela, calabresa e cebola roxa.",
        imagem: "img/pizza-calabresa.png",
        categoria: "pizza"
    },
    {// SORVETES/AÇAI
        nome: "Taça de Açaí Especial",
        preco: 28.00,
        descricao: "Açaí 500ml, leite condensado, leite em pó e frutas.",
        imagem: "img/taça-açai.jpg",
        categoria: "sorvete"
    },
    
    {// BEBIDAS
        nome: "Coca-Cola 2 Litros",
        preco: 14,
        descricao: "Refrigerante clássico perfeito para compartilhar.",
        imagem: "img/coca-cola-2l.webp",
        categoria: "bebidas"
    },
    {
        nome: "Coca-Cola 2L Zero",
        preco: 14,
        descricao: "Todo o sabor da Coca-Cola tradicional, sem açúcar.",
        imagem: "img/coca-cola-zero-2l.webp",
        categoria: "bebidas"
    },
    {
        nome: "Coca-Cola 1 Litro",
        preco: 8,
        descricao: "Versão prática do refrigerante mais famoso do mundo.",
        imagem: "img/coca-cola-1l.jpg",
        categoria: "bebidas"
    },
    {
        nome: "Coca-Cola Lata",
        preco: 5,
        descricao: "Refrescante e gelada na medida certa.",
        imagem: "img/coca-cola-lata.webp",
        categoria: "bebidas"
    },
    {
        nome: "Coca-Cola Lata Zero",
        preco: 5,
        descricao: "Refrescante e gelada na medida certa, sem açúcar.",
        imagem: "img/coca-cola-zero-lata.webp",
        categoria: "bebidas"
    },
    {
        nome: "Pepsi 2 Litros",
        preco: 12,
        descricao: "Refrigerante com sabor intenso e refrescante.",
        imagem: "img/pepsi-2l.webp",
        categoria: "bebidas"
    },
    {
        nome: "Pepsi 2L Black",
        preco: 12,
        descricao: "Versão sem açúcar da Pepsi, sabor forte e marcante.",
        imagem: "img/pepsi-black-2l.webp",
        categoria: "bebidas"
    },
    {
        nome: "Pepsi Lata",
        preco: 5,
        descricao: "Prática e gelada, perfeita para qualquer momento.",
        imagem: "img/pepsi-lata.jpg",
        categoria: "bebidas"
    },
    {
        nome: "Pepsi Lata Black",
        preco: 5,
        descricao: "Sabor intenso da Pepsi em lata, sem açúcar.",
        imagem: "img/pepsi-lata-black.webp",
        categoria: "bebidas"
    }
];

let carrinho = [];
let total = 0;

// =========================
// 2. UTIL
// =========================
function formatarPreco(valor) {
    return `R$ ${valor.toFixed(2).replace('.', ',')}`;
}

// =========================
// 3. RENDER PRODUTOS
// =========================
function renderizarProdutos() {
    const container = document.getElementById('lista-produtos');
    if (!container) return;

    container.innerHTML = '';

    produtos.forEach((produto, index) => {
        const card = document.createElement('div');
        card.className = `produto-card ${produto.categoria}`;
        card.style.animationDelay = `${index * 0.1}s`;

        card.innerHTML = `
            <img src="${produto.imagem}" class="produto-img" alt="${produto.nome}">
            <div class="produto-info">
                <div>
                    <h3 class="produto-nome">${produto.nome}</h3>
                    <p class="produto-desc">${produto.descricao}</p>
                </div>
                <div class="produto-footer">
                    <span class="produto-preco">${formatarPreco(produto.preco)}</span>
                    <button class="btn-add">+</button>
                </div>
            </div>
        `;

        // Evento de adicionar (SEM onclick)
        const btnAdd = card.querySelector('.btn-add');
        btnAdd.addEventListener('click', () => {
            alterarCarrinho(produto.nome, produto.preco, 'adicionar');
        });

        container.appendChild(card);
    });
}

// =========================
// 4. CARRINHO
// =========================
function alterarCarrinho(nome, preco, acao) {
    const itemIndex = carrinho.findIndex(item => item.nome === nome);

    if (acao === 'adicionar') {
        if (itemIndex > -1) {
            carrinho[itemIndex].quantidade++;
        } else {
            carrinho.push({ nome, preco, quantidade: 1 });
        }
        total += preco;
    } else if (acao === 'remover') {
        if (itemIndex > -1) {
            carrinho[itemIndex].quantidade--;
            total -= preco;

            if (carrinho[itemIndex].quantidade <= 0) {
                carrinho.splice(itemIndex, 1);
            }
        }
    }

    if (total < 0) total = 0;

    atualizarInterface();

    const modal = document.getElementById('modal-carrinho');
    if (modal.style.display === 'flex') {
        renderizarResumo();
    }
}

function atualizarInterface() {
    const itensCount = document.getElementById('itens-carrinho');
    const totalText = document.getElementById('total-carrinho');
    const carrinhoBar = document.getElementById('carrinho-flutuante');

    const totalItens = carrinho.reduce((acc, item) => acc + item.quantidade, 0);

    itensCount.innerText = totalItens;
    totalText.innerText = formatarPreco(total);

    carrinhoBar.style.display = totalItens > 0 ? 'flex' : 'none';
}

// =========================
// 5. MODAL
// =========================
function abrirModal() {
    const modal = document.getElementById('modal-carrinho');
    modal.style.display = 'flex';
    renderizarResumo();
}

function fecharModal() {
    document.getElementById('modal-carrinho').style.display = 'none';
}

function renderizarResumo() {
    const listaArea = document.getElementById('lista-resumo');
    const totalModal = document.getElementById('total-modal');

    listaArea.innerHTML = '';

    if (carrinho.length === 0) {
        fecharModal();
        return;
    }

    carrinho.forEach(item => {
        const div = document.createElement('div');
        div.className = 'cart-item';

        div.innerHTML = `
            <div>
                <strong>${item.quantidade}x</strong> ${item.nome}<br>
                <small>${formatarPreco(item.preco * item.quantidade)}</small>
            </div>
            <button class="btn-remover">-</button>
        `;

        div.querySelector('.btn-remover').addEventListener('click', () => {
            alterarCarrinho(item.nome, item.preco, 'remover');
        });

        listaArea.appendChild(div);
    });

    totalModal.innerText = formatarPreco(total);
}

// =========================
// 6. WHATSAPP
// =========================
function enviarPedidoWhatsApp() {
    if (carrinho.length === 0) return;

    const numeroDono = "5568992055322";
    let mensagem = "*NOVO PEDIDO - PREDILETTU'S*\n\n";

    carrinho.forEach(item => {
        mensagem += `✅ *${item.quantidade}x* ${item.nome} - ${formatarPreco(item.preco * item.quantidade)}\n`;
    });

    mensagem += `\n*TOTAL:* ${formatarPreco(total)}`;
    mensagem += `\n\n_(Taxa de entrega de R$ 4,00 a combinar)_`;
    mensagem += `\n\n*Endereço:* \n*Referência:* `;

    const url = `https://wa.me/${numeroDono}?text=${encodeURIComponent(mensagem)}`;
    window.open(url, '_blank');
}

// =========================
// 7. FILTRO
// =========================
function configurarFiltros() {
    const botoes = document.querySelectorAll('.categorias button');

    botoes.forEach(btn => {
        btn.addEventListener('click', () => {
            const categoria = btn.dataset.categoria;

            botoes.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            filtrar(categoria);
        });
    });
}

function filtrar(categoria) {
    const cards = document.querySelectorAll('.produto-card');

    cards.forEach(card => {
        if (categoria === 'todos' || card.classList.contains(categoria)) {
            card.style.display = 'flex';

            card.style.animation = 'none';
            card.offsetHeight;
            card.style.animation = 'subirEntrada 0.5s ease-out forwards';
        } else {
            card.style.display = 'none';
        }
    });
}

// =========================
// 8. EVENTOS INICIAIS
// =========================
document.addEventListener('DOMContentLoaded', () => {
    renderizarProdutos();
    configurarFiltros();

    document.getElementById('carrinho-flutuante').addEventListener('click', abrirModal);
    document.getElementById('btn-continuar').addEventListener('click', fecharModal);
    document.getElementById('btn-whatsapp').addEventListener('click', enviarPedidoWhatsApp);
});