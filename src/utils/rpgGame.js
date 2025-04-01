const adventures = [
    {
        id: 'inicio',
        message: 'Você está em uma floresta mágica. À sua frente há dois caminhos:\n1️⃣ Seguir pela trilha iluminada\n2️⃣ Entrar na caverna escura',
        options: {
            '1': { next: 'trilha', text: 'Você escolhe a trilha iluminada...' },
            '2': { next: 'caverna', text: 'Você entra corajosamente na caverna...' }
        }
    },
    {
        id: 'trilha',
        message: 'Na trilha, você encontra um pequeno fada!\n1️⃣ Conversar com ela\n2️⃣ Ignorar e seguir em frente',
        options: {
            '1': { next: 'fada', text: 'A fada sorri e oferece ajuda...' },
            '2': { next: 'floresta', text: 'Você segue seu caminho...' }
        }
    },
    {
        id: 'caverna',
        message: 'Na caverna, você vê um brilho estranho...\n1️⃣ Investigar o brilho\n2️⃣ Voltar para a entrada',
        options: {
            '1': { next: 'tesouro', text: 'Você encontra um tesouro mágico!' },
            '2': { next: 'inicio', text: 'Você decide que é mais seguro voltar...' }
        }
    }
    // Adicione mais cenas aqui
];

class RPGGame {
    constructor() {
        this.games = new Map();
    }

    isPlaying(userId) {
        return this.games.has(userId);
    }

    startGame(userId) {
        const game = {
            currentScene: 'inicio',
            inventory: [],
            health: 100
        };
        this.games.set(userId, game);
        return this.getSceneMessage(game.currentScene);
    }

    makeChoice(userId, choice) {
        const game = this.games.get(userId);
        if (!game) return 'Nenhum jogo ativo. Use !rpg para começar!';

        const currentScene = adventures.find(a => a.id === game.currentScene);
        if (!currentScene) return 'Erro: Cena não encontrada';

        const option = currentScene.options[choice];
        if (!option) return 'Escolha inválida! Use os números das opções.';

        game.currentScene = option.next;
        const nextScene = adventures.find(a => a.id === option.next);
        
        return `${option.text}\n\n${nextScene ? nextScene.message : 'Fim da aventura!'}`;
    }

    getSceneMessage(sceneId) {
        const scene = adventures.find(a => a.id === sceneId);
        return scene ? scene.message : 'Cena não encontrada';
    }
}

module.exports = new RPGGame();
