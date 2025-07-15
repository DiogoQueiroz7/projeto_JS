// --- ESTADO DO JOGO (A "memória" do nosso jogo) ---
const jogo = {
    jogador: {
        posicao: 'salaInicial',
        vida: 10,
        inventario: []
    },
    mapa: {
        'salaInicial': {
            titulo: 'Uma Sala Fria de Pedra',
            descricao: 'Você está em uma sala úmida com paredes de pedra. Há corredores em todas as direções.',
            saidas: { norte: 'salaChave', sul: 'salaMonstro', leste: 'salaVazia', oeste: 'becoSemSaida' },
            item: null
        },
        'salaChave': {
            titulo: 'O Altar',
            descricao: 'Uma pequena sala com um altar de pedra no centro. Algo brilha em cima dele.',
            saidas: { sul: 'salaInicial' },
            item: 'Chave de Ferro'
        },
        'salaMonstro': {
            titulo: 'Covil da Fera',
            descricao: 'O ar é pesado e um rosnado baixo ecoa. Um Goblin raivoso bloqueia o caminho para o sul!',
            saidas: { norte: 'salaInicial' },
            monstro: { nome: 'Goblin', vida: 5 }
        },
        'salaVazia': {
            titulo: 'Sala Vazia',
            descricao: 'Esta sala está completamente vazia, exceto por poeira e teias de aranha.',
            saidas: { oeste: 'salaInicial' }
        },
        'becoSemSaida': {
            titulo: 'Beco sem Saída',
            descricao: 'A parede à sua frente é um beco sem saída. Você precisa voltar.',
            saidas: { leste: 'salaInicial' }
        },
        'saidaFinal': {
            titulo: 'A Saída!',
            descricao: 'Você vê a luz do sol! Você usou a chave e abriu a grande porta de ferro!',
            saidas: {}
        }
    },
    jogoFinalizado: false
};


// --- ELEMENTOS DO DOM (Nossas "ferramentas" para interagir com o HTML) ---
const roomTitleEl = document.getElementById('room-title');
const roomDescriptionEl = document.getElementById('room-description');
const playerHealthEl = document.getElementById('player-health');
const inventoryListEl = document.getElementById('inventory-list');
const navButtons = document.querySelectorAll('#navigation-buttons .action-btn');
const specialActionButton = document.getElementById('action-special');


// --- FUNÇÕES (A "lógica" do nosso jogo) ---

/**
 * Função principal que atualiza TODA a interface do usuário com base no estado atual do jogo.
 * Este é um conceito poderoso: uma função para "desenhar" o estado.
 */
function renderizarJogo() {
    // Se o jogo acabou, não faz mais nada
    if (jogo.jogoFinalizado) return;

    const jogador = jogo.jogador;
    const salaAtual = jogo.mapa[jogador.posicao];

    // ATUALIZAR DOM: Informações da sala
    roomTitleEl.textContent = salaAtual.titulo;
    roomDescriptionEl.textContent = salaAtual.descricao;

    // ATUALIZAR DOM: Status do jogador
    playerHealthEl.textContent = jogador.vida;

    // ATUALIZAR DOM: Inventário (Uso de REPETIÇÃO)
    inventoryListEl.innerHTML = ''; // Limpa a lista antes de adicionar itens
    if (jogador.inventario.length === 0) {
        inventoryListEl.innerHTML = '<li>(vazio)</li>';
    } else {
        jogador.inventario.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            inventoryListEl.appendChild(li);
        });
    }

    // ATUALIZAR DOM: Botões de Navegação (Uso de REPETIÇÃO e CONDICIONAL)
    navButtons.forEach(button => {
        const direcao = button.dataset.direction;
        if (salaAtual.saidas[direcao]) {
            button.disabled = false;
        } else {
            button.disabled = true;
        }
    });
    
    // Lógica para o botão de ação especial
    specialActionButton.style.display = 'none'; // Esconde por padrão
    
    // CONDICIONAL: Verifica se há item na sala
    if (salaAtual.item) {
        specialActionButton.textContent = `Pegar ${salaAtual.item}`;
        specialActionButton.style.display = 'block';
        specialActionButton.onclick = pegarItem; // Associa a função de pegar
    }

    // CONDICIONAL: Verifica se há monstro na sala
    if (salaAtual.monstro) {
        specialActionButton.textContent = `Lutar contra ${salaAtual.monstro.nome}`;
        specialActionButton.style.display = 'block';
        specialActionButton.onclick = lutar; // Associa a função de lutar
    }
}


/**
 * Função para mover o jogador.
 * @param {string} direcao - 'norte', 'sul', 'leste', 'oeste'
 */
function mover(direcao) {
    const salaAtual = jogo.mapa[jogo.jogador.posicao];
    const novaSala = salaAtual.saidas[direcao];

    // CONDICIONAL: Verifica se a saída existe
    if (novaSala) {
        // Condicional especial para a saída final
        if (novaSala === 'saidaFinal') {
            if (jogo.jogador.inventario.includes('Chave de Ferro')) {
                finalizarJogo(true); // Vitória
            } else {
                alert('A porta está trancada. Você precisa de uma chave!');
                return;
            }
        }
        jogo.jogador.posicao = novaSala;
        renderizarJogo();
    }
}

/**
 * Função para o jogador pegar um item.
 */
function pegarItem() {
    const salaAtual = jogo.mapa[jogo.jogador.posicao];
    if (salaAtual.item) {
        jogo.jogador.inventario.push(salaAtual.item); // Adiciona ao inventário
        alert(`Você pegou: ${salaAtual.item}!`);
        salaAtual.item = null; // Remove o item da sala
        renderizarJogo();
    }
}

/**
 * Função de combate simples.
 */
function lutar() {
    const salaAtual = jogo.mapa[jogo.jogador.posicao];
    if (salaAtual.monstro) {
        const monstro = salaAtual.monstro;
        
        // Simulação de combate
        const danoJogador = Math.ceil(Math.random() * 4); // Dano de 1 a 4
        const danoMonstro = Math.ceil(Math.random() * 3); // Dano de 1 a 3
        
        monstro.vida -= danoJogador;
        jogo.jogador.vida -= danoMonstro;
        
        alert(`Você ataca o ${monstro.nome} e causa ${danoJogador} de dano.\nO ${monstro.nome} revida e causa ${danoMonstro} de dano.`);

        if (jogo.jogador.vida <= 0) {
            finalizarJogo(false); // Derrota
            return;
        }

        if (monstro.vida <= 0) {
            alert(`Você derrotou o ${monstro.nome}!`);
            salaAtual.descricao = 'O corpo do monstro derrotado jaz no chão. O caminho ao sul agora parece levar à saída final.';
            salaAtual.saidas.sul = 'saidaFinal'; // Abre a saída final
            salaAtual.monstro = null; // Remove o monstro da sala
        }
        
        renderizarJogo();
    }
}

/**
 * Função para terminar o jogo.
 * @param {boolean} vitoria - true se o jogador venceu, false se perdeu.
 */
function finalizarJogo(vitoria) {
    jogo.jogoFinalizado = true;
    specialActionButton.style.display = 'none';
    navButtons.forEach(btn => btn.disabled = true);
    
    if (vitoria) {
        roomTitleEl.textContent = 'VITÓRIA!';
        roomDescriptionEl.textContent = 'Você escapou da masmorra!';
    } else {
        roomTitleEl.textContent = 'FIM DE JOGO';
        roomDescriptionEl.textContent = 'Você foi derrotado...';
    }
}


// --- INICIALIZAÇÃO ---

// Adiciona os eventos de clique aos botões de navegação
navButtons.forEach(button => {
    button.addEventListener('click', () => {
        mover(button.dataset.direction);
    });
});

// Inicia o jogo pela primeira vez
renderizarJogo();