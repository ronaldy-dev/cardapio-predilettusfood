let carrinho = [];
let total = 0;

// 1. ADICIONAR OU REMOVER (Substitui sua adicionarAoCarrinho)
function alterarCarrinho(nome, preco, acao) {
    const itemIndex = carrinho.findIndex(item => item.nome === nome);

    if (acao === 'adicionar') {
        if (itemIndex > -1) {
            carrinho[itemIndex].quantidade += 1;
        } else {
            carrinho.push({ nome, preco, quantidade: 1 });
        }
        total += preco;
    } else if (acao === 'remover') {
        if (itemIndex > -1) {
            total -= preco;
            carrinho[itemIndex].quantidade -= 1;
            
            if (carrinho[itemIndex].quantidade <= 0) {
                carrinho.splice(itemIndex, 1);
            }
        }
    }
    
    // Garante que o total nunca fique negativo por erro de arredondamento
    if (total < 0) total = 0;
    
    atualizarInterface();
    renderizarResumo(); // Atualiza a lista dentro da modal
}

// 2. ATUALIZAR INTERFACE (Seu código com ajuste de contagem)
function atualizarInterface() {
    const itensCount = document.getElementById('itens-carrinho');
    const totalText = document.getElementById('total-carrinho');
    const carrinhoBar = document.getElementById('carrinho-flutuante');

    // Soma a quantidade total de itens
    const totalItens = carrinho.reduce((acc, item) => acc + item.quantidade, 0);

    itensCount.innerText = totalItens;
    totalText.innerText = `R$ ${total.toFixed(2).replace('.', ',')}`;

    carrinhoBar.style.display = totalItens > 0 ? 'flex' : 'none';
}

// 3. FUNÇÕES DA MODAL (Novas)
function abrirModal() {
    document.getElementById('modal-carrinho').style.display = 'flex';
    renderizarResumo();
}

function fecharModal() {
    document.getElementById('modal-carrinho').style.display = 'none';
}

// 4. RENDERIZAR RESUMO NA MODAL (Nova)
function renderizarResumo() {
    const listaArea = document.getElementById('lista-resumo');
    const totalModal = document.getElementById('total-modal');
    listaArea.innerHTML = '';

    carrinho.forEach(item => {
        listaArea.innerHTML += `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; border-bottom: 1px solid #333; padding-bottom: 5px;">
                <div>
                    <strong>${item.quantidade}x</strong> ${item.nome}<br>
                    <small>R$ ${(item.preco * item.quantidade).toFixed(2).replace('.', ',')}</small>
                </div>
                <button onclick="alterarCarrinho('${item.nome}', ${item.preco}, 'remover')" style="background: #e91e63; color: white; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer;">-</button>
            </div>
        `;
    });

    totalModal.innerText = `R$ ${total.toFixed(2).replace('.', ',')}`;
}

// 5. ENVIAR PEDIDO (Seu código adaptado para a nova estrutura)
function enviarPedidoWhatsApp() {
    if (carrinho.length === 0) return;

    const numeroDono = "5568992055322"; 
    let mensagem = "*NOVO PEDIDO - PREDILETTU'S*\n\n";
    
    carrinho.forEach(item => {
        mensagem += `✅ *${item.quantidade}x* ${item.nome} - R$ ${(item.preco * item.quantidade).toFixed(2).replace('.', ',')}\n`;
    });

    mensagem += `\n*TOTAL:* R$ ${total.toFixed(2).replace('.', ',')}`;
    mensagem += `\n\n*Endereço:* _Digite aqui seu endereço..._`;

    const url = `https://wa.me/${numeroDono}?text=${encodeURIComponent(mensagem)}`;
    window.open(url, '_blank');
}

// 6. FILTRAR (Seu código original mantido)
function filtrar(categoria) {
    const botoes = document.querySelectorAll('.categorias button');
    botoes.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    const cards = document.querySelectorAll('.produto-card');
    cards.forEach(card => {
        if (categoria === 'todos' || card.classList.contains(categoria)) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
}