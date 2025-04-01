const palavrasPositivas = ['amor', 'feliz', 'amo', 'adoro', 'legal', 'incrível', 'maravilhoso', 'ótimo', 'bom', 'alegre'];
const palavrasNegativas = ['triste', 'chato', 'ruim', 'péssimo', 'mal', 'odeio', 'irritado', 'raiva', 'bravo', 'cansado'];
const palavrasNeutras = ['ok', 'normal', 'mais ou menos', 'talvez', 'pode ser', 'tanto faz'];

async function analisarHumor(channel, userId) {
    try {
        // Buscar últimas 50 mensagens do usuário
        const messages = await channel.messages.fetch({ limit: 50 });
        const userMessages = messages.filter(msg => msg.author.id === userId);
        
        if (userMessages.size === 0) {
            return '❓ Não encontrei mensagens suficientes para análise.';
        }

        let pontuacao = 0;
        let totalPalavras = 0;

        userMessages.forEach(msg => {
            const palavras = msg.content.toLowerCase().split(' ');
            palavras.forEach(palavra => {
                if (palavrasPositivas.includes(palavra)) pontuacao += 1;
                if (palavrasNegativas.includes(palavra)) pontuacao -= 1;
                if (palavrasNeutras.includes(palavra)) pontuacao += 0;
                totalPalavras++;
            });
        });

        const mediaHumor = pontuacao / totalPalavras;
        const emoji = mediaHumor > 0.2 ? '😊' : mediaHumor < -0.2 ? '😔' : '😐';

        let humor;
        if (mediaHumor > 0.2) humor = 'positivo';
        else if (mediaHumor < -0.2) humor = 'negativo';
        else humor = 'neutro';

        return `🔍 Análise de Humor ${emoji}\n\nBaseado nas suas últimas mensagens, seu humor parece estar ${humor}!\n\nDetalhes da análise:\nMensagens analisadas: ${userMessages.size}\nPalavras analisadas: ${totalPalavras}\nÍndice de humor: ${(mediaHumor * 100).toFixed(1)}%`;
    } catch (error) {
        throw new Error('Erro ao analisar humor: ' + error.message);
    }
}

module.exports = { analisarHumor };
