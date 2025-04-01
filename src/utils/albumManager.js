async function addMemory(message, content) {
    try {
        // Procurar o canal ❤・pasta-love
        const albumChannel = message.guild.channels.cache.find(
            channel => channel.name === '❤・pasta-love'
        );

        if (!albumChannel) {
            throw new Error('Canal #❤・pasta-love não encontrado! Por favor, crie o canal primeiro.');
        }

        const attachment = message.attachments.first();
        const type = attachment ? 'image' : 'text';
        
        // Formatar a mensagem
        const authorName = message.author.username;
        const date = new Date().toLocaleDateString('pt-BR');
        const header = `💝 Memória de ${authorName} - ${date}`;
        
        // Enviar para o canal
        if (type === 'image') {
            await albumChannel.send(`${header}\n${attachment.url}`);
        } else {
            await albumChannel.send(`${header}\n${content}`);
        }

        return '💝 Memória adicionada com sucesso ao nosso álbum!';
    } catch (error) {
        console.error('Erro detalhado:', error);
        throw new Error('Não foi possível adicionar ao álbum: ' + error.message);
    }
}

async function viewAlbum(message) {
    try {
        const albumChannel = message.guild.channels.cache.find(
            channel => channel.name === '❤・pasta-love'
        );

        if (!albumChannel) {
            throw new Error('Canal #❤・pasta-love não encontrado!');
        }

        const messages = await albumChannel.messages.fetch({ limit: 10 });
        
        if (messages.size === 0) {
            return '📒 Ainda não há memórias no álbum!';
        }

        return `📒 As memórias estão disponíveis no canal ${albumChannel}!`;
    } catch (error) {
        throw new Error('Erro ao acessar o álbum: ' + error.message);
    }
}

module.exports = { addMemory, viewAlbum };
