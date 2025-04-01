async function clearMessages(channel, amount = 'all') {
    try {
        if (amount === 'all') {
            // Limpar todas as mensagens
            const messages = await channel.messages.fetch();
            await channel.bulkDelete(messages);
            // Subtrair 1 da contagem para não incluir o comando
            return `🧹 Chat limpo! ${messages.size - 1} mensagens foram removidas.`;
        } else {
            // Limpar quantidade específica
            const deleteCount = parseInt(amount);
            if (isNaN(deleteCount) || deleteCount < 1) {
                throw new Error('Por favor, forneça um número válido de mensagens para apagar.');
            }
            
            // Buscar mensagens incluindo o comando
            const messages = await channel.messages.fetch({ limit: deleteCount + 1 });
            const messagesToDelete = messages.first(deleteCount + 1);
            
            await channel.bulkDelete(messagesToDelete);
            // Retornar quantidade solicitada originalmente
            return `🧹 ${deleteCount} mensagens foram removidas.`;
        }
    } catch (error) {
        throw new Error(`Não foi possível limpar o chat: ${error.message}`);
    }
}

module.exports = { clearMessages };
