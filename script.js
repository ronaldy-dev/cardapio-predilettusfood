let carrinho = [];
let total = 0;

function adicionarAoCarrinho(nome, preco) {
    carrinho.push({ nome, preco });
    total += preco;
    atualizarInterface();
}

function atualizarInterface() {
    const itensCount = document.getElementById('itens-carrinho');
    const totalText = document.getElementById('total-carrinho');
    const carrinhoBar = document.getElementById('carrinho-flutuante');

    itensCount.innerText = carrinho.length;
    totalText.innerText = `R$ ${total.toFixed(2).replace('.', ',')}`;

    // Mostra o carrinho apenas se houver itens
    carrinhoBar.style.display = carrinho.length > 0 ? 'flex' : 'none';
}

function enviarPedidoWhatsApp() {
    if (carrinho.length === 0) return;

    const numeroDono = "5568992055322"; // Número real extraído do Instagram
    
    // Organiza os itens para a mensagem
    let mensagem = "*NOVO PEDIDO - PREDILETTU'S*\n\n";
    
    // Agrupar itens repetidos
    const contagem = {};
    carrinho.forEach(item => {
        contagem[item.nome] = (contagem[item.nome] || 0) + 1;
    });

    for (const [nome, qtd] of Object.entries(contagem)) {
        mensagem += `✅ *${qtd}x* ${nome}\n`;
    }

    mensagem += `\n*TOTAL:* R$ ${total.toFixed(2).replace('.', ',')}`;
    mensagem += `\n\n*Endereço:* _Digite aqui seu endereço..._`;

    const url = `https://wa.me/${numeroDono}?text=${encodeURIComponent(mensagem)}`;
    window.open(url, '_blank');
}

function filtrar(categoria) {
    // Atualiza os botões
    const botoes = document.querySelectorAll('.categorias button');
    botoes.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    // Filtra os cards
    const cards = document.querySelectorAll('.produto-card');
    cards.forEach(card => {
        if (categoria === 'todos' || card.classList.contains(categoria)) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
}