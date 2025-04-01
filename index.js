require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const { getRandomMessage } = require('./src/utils/messages');
const { getDailyQuote } = require('./src/utils/dailyQuotes');
const { addXP, getRanking } = require('./src/utils/database');
const { playMusic } = require('./src/utils/musicPlayer');
const forca = require('./src/utils/hangman');
const { clearMessages } = require('./src/utils/clearMessages');
const { analisarHumor } = require('./src/utils/moodAnalyzer');
const { getRandomQuestion } = require('./src/utils/questions');
const { addMemory, viewAlbum } = require('./src/utils/albumManager');
const rpg = require('./src/utils/rpgGame');
const { keepAlive } = require('./server');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates  // Adicionar esta intent
  ]
});

client.once('ready', () => {
  console.log(`🤖 Bot está online em ${client.guilds.cache.size} servidores!`);
  console.log('⚙️ Ambiente: Produção');
  console.log('🔗 URL para UptimeRobot:', process.env.PROJECT_DOMAIN);
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  
  // Adiciona XP para cada mensagem (exceto comandos)
  if (!message.content.startsWith('!')) {
    addXP(message.author.id, message.author.username, 1);
  }

  async function sendAndDelete(content) {
    try {
      // Envia a mensagem e armazena a referência
      const botReply = await message.reply(content);
      
      // Deleta a mensagem do comando após 500ms
      setTimeout(() => {
        message.delete().catch(err => console.error('Erro ao deletar comando:', err));
      }, 500);

      // Deleta a resposta do bot após 10 segundos
      setTimeout(() => {
        botReply.delete().catch(err => console.error('Erro ao deletar resposta:', err));
      }, 10000); // Reduzido para 10 segundos
    } catch (error) {
      console.error('Erro no sendAndDelete:', error);
    }
  }

  if (message.content.toLowerCase() === '!love') {
    try {
      const prefix = "🌞 - Uma mensagem do love da Sol: \n";
      await sendAndDelete(prefix + getRandomMessage());
    } catch (error) {
      console.error('Erro ao processar comando:', error);
    }
  }
  
  if (message.content.toLowerCase() === '!frase') {
    try {
      const prefix = "☀️ - Frase do dia: \n";
      await sendAndDelete(prefix + getDailyQuote());
    } catch (error) {
      console.error('Erro ao processar comando:', error);
    }
  }

  // Modificar o comando !ranking para usar async/await corretamente
  if (message.content.toLowerCase() === '!ranking') {
    try {
      const rows = await new Promise((resolve, reject) => {
        getRanking((err, data) => {
          if (err) reject(err);
          else resolve(data);
        });
      });
      
      const rankingMessage = rows.map((user, index) => 
        `${index + 1}. ${user.username} - ${user.xp} XP`
      ).join('\n');
      
      const prefix = "🏆 - Ranking de Interações:\n\n";
      await sendAndDelete(prefix + rankingMessage);
    } catch (error) {
      console.error('Erro ao processar comando ranking:', error);
    }
  }

  // Comando de música
  if (message.content.toLowerCase().startsWith('!play ')) {
    try {
      const query = message.content.slice(6); // Remove '!play ' do início
      const response = await playMusic(message, query);
      // Apenas deleta o comando, mantém a resposta
      setTimeout(() => {
        message.delete().catch(err => console.error('Erro ao deletar comando:', err));
      }, 500);
      // Envia resposta sem auto-delete
      await message.channel.send(response);
    } catch (error) {
      message.channel.send(`❌ Erro: ${error.message}`);
      console.error('Erro ao reproduzir música:', error);
    }
  }

  if (message.content.toLowerCase() === '!forca') {
    try {
      const response = forca.novoJogo(message.channel.id);
      await message.delete().catch(() => {});
      await message.channel.send(response.content);
    } catch (error) {
      console.error('Erro ao iniciar jogo da forca:', error);
    }
  }

  // Verificar tentativa na forca (quando é apenas uma letra)
  if (message.content.length === 1 && /[a-zA-Z]/.test(message.content)) {
    try {
      const response = forca.tentativa(message.channel.id, message.content);
      if (response) {
        await message.delete().catch(() => {});
        const gameMessage = await message.channel.send(response.content);
        
        // Apaga a mensagem apenas se for game over, mantém se for vitória
        if (response.finalizado && response.content.includes('Game Over')) {
          setTimeout(() => {
            gameMessage.delete().catch(() => {});
          }, 10000);
        }
      }
    } catch (error) {
      console.error('Erro ao processar tentativa da forca:', error);
    }
  }

  // Comandos de limpeza
  if (message.content.toLowerCase().startsWith('!limpar')) {
    try {
      // Verificar permissões do usuário
      if (!message.member.permissions.has('ManageMessages')) {
        await message.reply('❌ Você não tem permissão para limpar mensagens!');
        return;
      }

      const args = message.content.split(' ')[1]; // Pega o argumento após !limpar
      const response = await clearMessages(message.channel, args);
      
      const notification = await message.channel.send(response);
      // Apaga a mensagem de notificação após 5 segundos
      setTimeout(() => notification.delete().catch(() => {}), 5000);
    } catch (error) {
      console.error('Erro ao limpar mensagens:', error);
      message.reply(`❌ Erro: ${error.message}`);
    }
  }

  if (message.content.toLowerCase() === '!humor') {
    try {
      const response = await analisarHumor(message.channel, message.author.id);
      await message.reply(response);
      // Deleta apenas o comando após responder
      setTimeout(() => {
        message.delete().catch(err => console.error('Erro ao deletar comando:', err));
      }, 500);
    } catch (error) {
      console.error('Erro ao analisar humor:', error);
      await message.reply('❌ Não foi possível analisar o humor: ' + error.message);
    }
  }

  if (message.content.toLowerCase() === '!pergunta') {
    try {
      const prefix = "💭 - Pergunta para conhecer melhor você: \n\n";
      await message.reply(prefix + getRandomQuestion());
      setTimeout(() => {
        message.delete().catch(err => console.error('Erro ao deletar comando:', err));
      }, 500);
    } catch (error) {
      console.error('Erro ao gerar pergunta:', error);
    }
  }

  if (message.content.toLowerCase().startsWith('!album')) {
    const args = message.content.split(' ');
    const subCommand = args[1]?.toLowerCase() || '';

    try {
      if (subCommand === 'add') {
        const content = args.slice(2).join(' ');
        if (!content && !message.attachments.size) {
          throw new Error('Por favor, forneça uma mensagem ou imagem para adicionar ao álbum.');
        }
        const response = await addMemory(message, content);
        await sendAndDelete(response);
      } else {
        // Visualizar álbum
        const response = await viewAlbum(message);
        await sendAndDelete(response);
      }
    } catch (error) {
      console.error('Erro no comando álbum:', error);
      await sendAndDelete(`❌ Erro: ${error.message}`);
    }
  }

  if (message.content.toLowerCase() === '!rpg') {
    try {
      const response = rpg.startGame(message.author.id);
      await message.reply(`🎮 Bem-vindo à Aventura!\n\n${response}`);
      setTimeout(() => {
        message.delete().catch(err => console.error('Erro ao deletar comando:', err));
      }, 500);
    } catch (error) {
      console.error('Erro ao iniciar RPG:', error);
    }
  }

  // Verificar escolhas do RPG (quando é apenas um número)
  if (message.content.length === 1 && /[1-2]/.test(message.content) && rpg.isPlaying(message.author.id)) {
    try {
      const response = rpg.makeChoice(message.author.id, message.content);
      if (response) {
        await message.delete().catch(() => {});
        await message.channel.send(`🎮 ${message.author.username}: ${response}`);
      }
    } catch (error) {
      console.error('Erro no RPG:', error);
    }
  }
});

keepAlive();
client.login(process.env.DISCORD_TOKEN);

// Exporte todas as funções aqui para facilitar o acesso
module.exports = {
    getRandomMessage,
    // Adicione novas funções aqui no futuro
};
