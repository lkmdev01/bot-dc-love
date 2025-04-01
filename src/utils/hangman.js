const palavras = [
    { palavra: 'AMOR', dica: 'Sentimento mais puro' },
    { palavra: 'CARINHO', dica: 'Demonstração de afeto' },
    { palavra: 'BEIJO', dica: 'Gesto romântico' },
    { palavra: 'ABRAÇO', dica: 'Aconchego especial' },
    { palavra: 'PAIXAO', dica: 'Sentimento intenso' },
    { palavra: 'SAUDADE', dica: 'Sentimos quando estamos longe' },
    { palavra: 'ROMANCE', dica: 'História de amor' },
    { palavra: 'TERNURA', dica: 'Suavidade no jeito' },
    { palavra: 'AFETO', dica: 'Demonstração de carinho' },
    { palavra: 'NAMORO', dica: 'Relacionamento romântico' }
];

const estados = [
    '```\n  +---+\n  |   |\n      |\n      |\n      |\n      |\n=========```',
    '```\n  +---+\n  |   |\n  O   |\n      |\n      |\n      |\n=========```',
    '```\n  +---+\n  |   |\n  O   |\n  |   |\n      |\n      |\n=========```',
    '```\n  +---+\n  |   |\n  O   |\n /|   |\n      |\n      |\n=========```',
    '```\n  +---+\n  |   |\n  O   |\n /|\\  |\n      |\n      |\n=========```',
    '```\n  +---+\n  |   |\n  O   |\n /|\\  |\n /    |\n      |\n=========```',
    '```\n  +---+\n  |   |\n  O   |\n /|\\  |\n / \\  |\n      |\n=========```'
];

class Forca {
    constructor() {
        this.jogos = new Map();
    }

    normalizeChar(char) {
        return char.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();
    }

    novoJogo(channelId) {
        const palavraObj = palavras[Math.floor(Math.random() * palavras.length)];
        const jogo = {
            palavra: palavraObj.palavra,
            dica: palavraObj.dica,
            letrasUsadas: new Set(),
            tentativas: 0,
            palavraAtual: '_ '.repeat(palavraObj.palavra.length).trim(),
            finalizado: false,
            mensagens: [] // Armazenar IDs das mensagens
        };
        this.jogos.set(channelId, jogo);
        return this.getStatusMessage(jogo);
    }

    tentativa(channelId, letra) {
        const jogo = this.jogos.get(channelId);
        if (!jogo || jogo.finalizado) return 'Não há jogo ativo. Use !forca para começar!';

        // Se for uma palavra completa, verifica se acertou
        if (letra.length > 1) {
            const palavraTentativa = this.normalizeChar(letra);
            const palavraCorreta = this.normalizeChar(jogo.palavra);
            
            if (palavraTentativa === palavraCorreta) {
                jogo.palavraAtual = jogo.palavra;
                jogo.finalizado = true;
                return this.getStatusMessage(jogo);
            } else {
                jogo.tentativas++;
                return this.getStatusMessage(jogo);
            }
        }

        letra = this.normalizeChar(letra);
        if (jogo.letrasUsadas.has(letra)) {
            return 'Essa letra já foi usada!';
        }

        jogo.letrasUsadas.add(letra);
        
        // Verificar se a letra existe na palavra (considerando acentos)
        let acertou = false;
        const palavraArray = jogo.palavraAtual.split(' ');
        for (let i = 0; i < jogo.palavra.length; i++) {
            if (this.normalizeChar(jogo.palavra[i]) === letra) {
                palavraArray[i] = jogo.palavra[i];
                acertou = true;
            }
        }

        if (!acertou) {
            jogo.tentativas++;
        }
        
        jogo.palavraAtual = palavraArray.join(' ');

        // Verificar vitória comparando as palavras normalizadas
        const palavraAtualNormalizada = this.normalizeChar(jogo.palavraAtual.replace(/ /g, ''));
        const palavraCorretaNormalizada = this.normalizeChar(jogo.palavra);

        if (jogo.tentativas >= 6 || palavraAtualNormalizada === palavraCorretaNormalizada) {
            jogo.finalizado = true;
            // Se ganhou, mostra a palavra original com acentos
            if (palavraAtualNormalizada === palavraCorretaNormalizada) {
                jogo.palavraAtual = jogo.palavra;
            }
        }

        return this.getStatusMessage(jogo);
    }

    getStatusMessage(jogo) {
        const status = estados[jogo.tentativas];
        const letrasUsadas = Array.from(jogo.letrasUsadas).sort().join(', ');
        let message = `${status}\n`;
        message += `💡 Dica: ${jogo.dica}\n`;
        message += `🎯 Palavra: ${jogo.palavraAtual}\n`;
        message += `📝 Letras usadas: ${letrasUsadas || 'Nenhuma'}`;

        if (jogo.finalizado) {
            if (jogo.tentativas >= 6) {
                message += `\n❌ Game Over! A palavra era: ${jogo.palavra}`;
            } else if (jogo.palavraAtual.replace(/ /g, '') === jogo.palavra) {
                message += '\n✨ Parabéns! Você venceu! 🎉';
            }
            // Limpar jogo após finalizado
            return { content: message, finalizado: true };
        }

        return { content: message, finalizado: false };
    }
}

module.exports = new Forca();
