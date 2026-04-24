// =========================
// CONFIG — única fonte de verdade
// =========================
const CONFIG = {
    WHATSAPP_NUMBER: "5568992055322",
    DELIVERY_FEE: 4.00
};

// =========================
// 1. BANCO DE DADOS
// =========================
const produtos = [
    {
        id: 1,
        nome: "X-Predilettus",
        preco: 35.00,
        descricao: "Pão brioche, blend 160g, cheddar, bacon e maionese artesanal.",
        imagem: "img/burguer-1.png",
        categoria: "hamburguer"
    },
    {
        id: 2,
        nome: "Calabresa Premium",
        preco: 55.00,
        descricao: "Molho pomodoro, muçarela, calabresa e cebola roxa.",
        imagem: "img/pizza-calabresa.png",
        categoria: "pizza"
    },
    {
        id: 3,
        nome: "Taça de Açaí Especial",
        preco: 28.00,
        descricao: "Açaí 500ml, leite condensado, leite em pó e frutas.",
        imagem: "img/taca-acai.jpg",
        categoria: "sorvete"
    },
    {
        id: 4,
        nome: "Coca-Cola 2 Litros",
        preco: 14,
        descricao: "Refrigerante clássico perfeito para compartilhar.",
        imagem: "img/coca-cola-2l.webp",
        categoria: "bebidas"
    },
    {
        id: 5,
        nome: "Coca-Cola 2L Zero",
        preco: 14,
        descricao: "Todo o sabor da Coca-Cola tradicional, sem açúcar.",
        imagem: "img/coca-cola-zero-2l.webp",
        categoria: "bebidas"
    },
    {
        id: 6,
        nome: "Coca-Cola 1 Litro",
        preco: 8,
        descricao: "Versão prática do refrigerante mais famoso do mundo.",
        imagem: "img/coca-cola-1l.jpg",
        categoria: "bebidas"
    },
    {
        id: 7,
        nome: "Coca-Cola Lata",
        preco: 5,
        descricao: "Refrescante e gelada na medida certa.",
        imagem: "img/coca-cola-lata.webp",
        categoria: "bebidas"
    },
    {
        id: 8,
        nome: "Coca-Cola Lata Zero",
        preco: 5,
        descricao: "Refrescante e gelada na medida certa, sem açúcar.",
        imagem: "img/coca-cola-zero-lata.webp",
        categoria: "bebidas"
    },
    {
        id: 9,
        nome: "Pepsi 2 Litros",
        preco: 12,
        descricao: "Refrigerante com sabor intenso e refrescante.",
        imagem: "img/pepsi-2l.webp",
        categoria: "bebidas"
    },
    {
        id: 10,
        nome: "Pepsi 2L Black",
        preco: 12,
        descricao: "Versão sem açúcar da Pepsi, sabor forte e marcante.",
        imagem: "img/pepsi-black-2l.webp",
        categoria: "bebidas"
    },
    {
        id: 11,
        nome: "Pepsi Lata",
        preco: 5,
        descricao: "Prática e gelada, perfeita para qualquer momento.",
        imagem: "img/pepsi-lata.jpg",
        categoria: "bebidas"
    },
    {
        id: 12,
        nome: "Pepsi Lata Black",
        preco: 5,
        descricao: "Sabor intenso da Pepsi em lata, sem açúcar.",
        imagem: "img/pepsi-lata-black.webp",
        categoria: "bebidas"
    }
];

// =========================
// 2. ESTADO
// =========================
let carrinho = [];
let modalAberto = false;

// =========================
// 3. UTIL
// =========================
function formatarPreco(valor) {
    return `R$ ${valor.toFixed(2).replace('.', ',')}`;
}

// Recalcula do zero — sem acúmulo float (BUG-JS-01)
function calcularTotal() {
    return carrinho.reduce((acc, item) => acc + item.preco * item.quantidade, 0);
}

function calcularTotalFinal() {
    const modoEntregaEl = document.getElementById('modo-entrega');
    const taxa = modoEntregaEl && modoEntregaEl.value === 'entrega' ? CONFIG.DELIVERY_FEE : 0;
    return calcularTotal() + taxa;
}

function salvarCarrinho() {
    localStorage.setItem('predilettuCarrinho', JSON.stringify(carrinho));
}

function carregarCarrinho() {
    try {
        const saved = localStorage.getItem('predilettuCarrinho');
        if (saved) carrinho = JSON.parse(saved);
    } catch {
        carrinho = [];
    }
}

// Remove caracteres de formatação WhatsApp de nomes de produto
function escaparWhatsApp(texto) {
    return texto.replace(/[*_~`]/g, '');
}

// =========================
// 4. RENDER PRODUTOS — DOM API (sem innerHTML, sem XSS)
// =========================
function renderizarProdutos() {
    const container = document.getElementById('lista-produtos');
    if (!container) return;

    container.innerHTML = '';

    produtos.forEach((produto, index) => {
        const card = document.createElement('div');
        card.className = `produto-card ${produto.categoria}`;
        card.style.animationDelay = `${index * 0.1}s`;
        card.dataset.id = produto.id;

        // Imagem com lazy loading
        const img = document.createElement('img');
        img.src = produto.imagem;
        img.alt = produto.nome;
        img.className = 'produto-img';
        img.loading = 'lazy';
        img.decoding = 'async';
        img.width = 130;
        img.height = 140;

        const info = document.createElement('div');
        info.className = 'produto-info';

        const textos = document.createElement('div');

        const h3 = document.createElement('h3');
        h3.className = 'produto-nome';
        h3.textContent = produto.nome;

        const p = document.createElement('p');
        p.className = 'produto-desc';
        p.textContent = produto.descricao;

        textos.appendChild(h3);
        textos.appendChild(p);

        const footer = document.createElement('div');
        footer.className = 'produto-footer';

        const preco = document.createElement('span');
        preco.className = 'produto-preco';
        preco.textContent = formatarPreco(produto.preco);

        const btnAdd = document.createElement('button');
        btnAdd.className = 'btn-add';
        btnAdd.textContent = '+';
        btnAdd.setAttribute('aria-label', `Adicionar ${produto.nome} ao carrinho`);
        btnAdd.type = 'button';

        btnAdd.addEventListener('click', () => {
            alterarCarrinho(produto.id, produto.nome, produto.preco, 'adicionar');
            // Feedback visual (BUG-UX-03)
            btnAdd.textContent = '✓';
            btnAdd.disabled = true;
            setTimeout(() => {
                btnAdd.textContent = '+';
                btnAdd.disabled = false;
            }, 600);
        });

        footer.appendChild(preco);
        footer.appendChild(btnAdd);

        info.appendChild(textos);
        info.appendChild(footer);

        card.appendChild(img);
        card.appendChild(info);

        container.appendChild(card);
    });
}

// =========================
// 5. CARRINHO
// =========================
function alterarCarrinho(id, nome, preco, acao) {
    const itemIndex = carrinho.findIndex(item => item.id === id);

    if (acao === 'adicionar') {
        if (itemIndex > -1) {
            carrinho[itemIndex].quantidade++;
        } else {
            carrinho.push({ id, nome, preco, quantidade: 1 });
        }
    } else if (acao === 'remover') {
        if (itemIndex > -1) {
            carrinho[itemIndex].quantidade--;
            if (carrinho[itemIndex].quantidade <= 0) {
                carrinho.splice(itemIndex, 1);
            }
        }
    }

    salvarCarrinho();
    atualizarInterface();

    if (modalAberto) {
        renderizarResumo();
    }
}

function atualizarInterface() {
    const itensCount = document.getElementById('itens-carrinho');
    const totalText = document.getElementById('total-carrinho');
    const carrinhoBar = document.getElementById('carrinho-flutuante');

    if (!itensCount || !totalText || !carrinhoBar) return;

    const totalItens = carrinho.reduce((acc, item) => acc + item.quantidade, 0);

    itensCount.textContent = totalItens;
    totalText.textContent = formatarPreco(calcularTotal());

    carrinhoBar.style.display = totalItens > 0 ? 'flex' : 'none';
}

// =========================
// 6. MODAL
// =========================
function abrirModal() {
    const modal = document.getElementById('modal-carrinho');
    modal.style.display = 'flex';
    modalAberto = true;
    renderizarResumo();
    // Foco entra no modal (acessibilidade)
    document.getElementById('btn-continuar').focus();
}

function fecharModal() {
    document.getElementById('modal-carrinho').style.display = 'none';
    modalAberto = false;
    // Retorna foco ao botão do carrinho
    document.getElementById('carrinho-flutuante').focus();
}

function atualizarTotalModal() {
    const totalModal = document.getElementById('total-modal');
    if (totalModal) totalModal.textContent = formatarPreco(calcularTotalFinal());
}

function renderizarResumo() {
    const listaArea = document.getElementById('lista-resumo');
    const totalModal = document.getElementById('total-modal');

    listaArea.innerHTML = '';

    // Estado vazio — não fecha o modal (BUG-JS-04)
    if (carrinho.length === 0) {
        const vazio = document.createElement('p');
        vazio.className = 'cart-empty';
        vazio.textContent = 'Seu carrinho está vazio.';
        listaArea.appendChild(vazio);
        if (totalModal) totalModal.textContent = formatarPreco(0);
        return;
    }

    carrinho.forEach(item => {
        const div = document.createElement('div');
        div.className = 'cart-item';

        // Info do item — sem innerHTML (BUG-JS-14)
        const infoDiv = document.createElement('div');
        infoDiv.className = 'cart-item-info';

        const strong = document.createElement('strong');
        strong.textContent = `${item.quantidade}x`;

        const nomeNode = document.createTextNode(` ${item.nome}`);
        const br = document.createElement('br');
        const small = document.createElement('small');
        small.textContent = formatarPreco(item.preco * item.quantidade);

        infoDiv.appendChild(strong);
        infoDiv.appendChild(nomeNode);
        infoDiv.appendChild(br);
        infoDiv.appendChild(small);

        // Controles de quantidade com botão + (BUG-UX-02)
        const controles = document.createElement('div');
        controles.className = 'cart-item-controles';

        const btnMenos = document.createElement('button');
        btnMenos.className = 'btn-remover';
        btnMenos.textContent = '−';
        btnMenos.type = 'button';
        btnMenos.setAttribute('aria-label', `Remover ${item.nome} do carrinho`);
        btnMenos.addEventListener('click', () => {
            alterarCarrinho(item.id, item.nome, item.preco, 'remover');
        });

        const qtdSpan = document.createElement('span');
        qtdSpan.className = 'cart-item-qty';
        qtdSpan.textContent = item.quantidade;

        const btnMais = document.createElement('button');
        btnMais.className = 'btn-adicionar-modal';
        btnMais.textContent = '+';
        btnMais.type = 'button';
        btnMais.setAttribute('aria-label', `Adicionar mais ${item.nome}`);
        btnMais.addEventListener('click', () => {
            alterarCarrinho(item.id, item.nome, item.preco, 'adicionar');
        });

        controles.appendChild(btnMenos);
        controles.appendChild(qtdSpan);
        controles.appendChild(btnMais);

        div.appendChild(infoDiv);
        div.appendChild(controles);
        listaArea.appendChild(div);
    });

    atualizarTotalModal();
}

// =========================
// 7. WHATSAPP
// =========================
function enviarPedidoWhatsApp() {
    if (carrinho.length === 0) return;

    const enderecoEl = document.getElementById('input-endereco');
    const referenciaEl = document.getElementById('input-referencia');
    const modoEntregaEl = document.getElementById('modo-entrega');

    const modoEntrega = modoEntregaEl ? modoEntregaEl.value : 'entrega';
    const endereco = enderecoEl ? enderecoEl.value.trim() : '';
    const referencia = referenciaEl ? referenciaEl.value.trim() : '';

    // Validar endereço apenas quando for entrega (BUG-UX-07)
    if (modoEntrega === 'entrega' && !endereco) {
        if (enderecoEl) {
            enderecoEl.focus();
            enderecoEl.classList.add('input-erro');
        }
        alert('Por favor, informe seu endereço para entrega.');
        return;
    }

    let mensagem = "*NOVO PEDIDO - PREDILETTU'S*\n\n";

    carrinho.forEach(item => {
        const nomeSeguro = escaparWhatsApp(item.nome);
        mensagem += `✅ *${item.quantidade}x* ${nomeSeguro} - ${formatarPreco(item.preco * item.quantidade)}\n`;
    });

    const subtotal = calcularTotal();
    const taxa = modoEntrega === 'entrega' ? CONFIG.DELIVERY_FEE : 0;
    const totalFinal = subtotal + taxa;

    mensagem += `\n*Subtotal:* ${formatarPreco(subtotal)}`;
    if (taxa > 0) mensagem += `\n*Taxa de entrega:* ${formatarPreco(taxa)}`;
    mensagem += `\n*TOTAL:* ${formatarPreco(totalFinal)}`;
    mensagem += `\n\n*Tipo:* ${modoEntrega === 'entrega' ? 'Entrega' : 'Retirada no local'}`;

    if (modoEntrega === 'entrega') {
        mensagem += `\n*Endereço:* ${endereco}`;
        if (referencia) mensagem += `\n*Referência:* ${referencia}`;
    }

    const url = `https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(mensagem)}`;

    // Guard de tamanho máximo
    if (url.length > 2000) {
        alert('Pedido muito extenso. Por favor, divida em dois pedidos ou entre em contato diretamente.');
        return;
    }

    // noopener + fallback para pop-up bloqueado (BUG-JS-08, BUG-SEC-02)
    const popup = window.open(url, '_blank', 'noopener,noreferrer');
    if (!popup) {
        alert('Seu navegador bloqueou o redirecionamento. Copie o link e acesse manualmente:\n' + url);
    }
}

// =========================
// 8. FILTRO
// =========================
function configurarFiltros() {
    const botoes = document.querySelectorAll('.categorias button');

    botoes.forEach(btn => {
        btn.addEventListener('click', () => {
            const categoria = btn.dataset.categoria;

            botoes.forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-pressed', 'false');
            });
            btn.classList.add('active');
            btn.setAttribute('aria-pressed', 'true');

            filtrar(categoria);
        });
    });
}

function filtrar(categoria) {
    const cards = document.querySelectorAll('.produto-card');

    // Separar leitura de escrita — elimina os 12 reflows síncronos (BUG-JS-11)
    cards.forEach(card => {
        const visivel = categoria === 'todos' || card.classList.contains(categoria);
        card.classList.toggle('hidden', !visivel);
        if (visivel) card.style.animation = 'none';
    });

    requestAnimationFrame(() => {
        cards.forEach(card => {
            if (!card.classList.contains('hidden')) {
                card.style.animation = 'subirEntrada 0.5s ease-out forwards';
            }
        });
    });
}

// =========================
// 9. EVENTOS INICIAIS
// =========================
document.addEventListener('DOMContentLoaded', () => {
    carregarCarrinho();
    renderizarProdutos();
    configurarFiltros();

    document.getElementById('carrinho-flutuante').addEventListener('click', abrirModal);
    document.getElementById('btn-continuar').addEventListener('click', fecharModal);
    document.getElementById('btn-whatsapp').addEventListener('click', enviarPedidoWhatsApp);

    // Fechar modal clicando no fundo (BUG-UX-06)
    document.getElementById('modal-carrinho').addEventListener('click', (e) => {
        if (e.target === e.currentTarget) fecharModal();
    });

    // Fechar modal com Escape (BUG-HTML-08)
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalAberto) fecharModal();
    });

    // Mostrar/ocultar campos de endereço conforme modo de entrega
    const modoEntregaEl = document.getElementById('modo-entrega');
    const camposEndereco = document.getElementById('campos-endereco');
    if (modoEntregaEl && camposEndereco) {
        modoEntregaEl.addEventListener('change', () => {
            const isEntrega = modoEntregaEl.value === 'entrega';
            camposEndereco.style.display = isEntrega ? 'flex' : 'none';
            atualizarTotalModal();
        });
    }

    // Remover estilo de erro ao digitar
    const enderecoEl = document.getElementById('input-endereco');
    if (enderecoEl) {
        enderecoEl.addEventListener('input', () => {
            enderecoEl.classList.remove('input-erro');
        });
    }

    atualizarInterface();
});
