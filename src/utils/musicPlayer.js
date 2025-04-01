const { createAudioPlayer, createAudioResource, joinVoiceChannel, AudioPlayerStatus } = require('@discordjs/voice');
const youtubeDl = require('youtube-dl-exec');
const ytSearch = require('yt-search');
const { spawn } = require('child_process');
const { Readable } = require('stream');

async function playMusic(message, query) {
    try {
        const voiceChannel = message.member?.voice?.channel;
        if (!voiceChannel) {
            throw new Error('❌ Você precisa estar em um canal de voz primeiro!');
        }

        // Pesquisar vídeo no YouTube
        const { videos } = await ytSearch(query);
        if (!videos.length) {
            throw new Error('❌ Nenhum vídeo encontrado!');
        }

        const video = videos[0];
        
        // Criar player e conexão
        const player = createAudioPlayer();
        let connection;

        try {
            // Usar youtube-dl para obter a URL do áudio
            const videoInfo = await youtubeDl(video.url, {
                dumpSingleJson: true,
                format: 'bestaudio',
            });

            // Criar processo ffmpeg para stream de áudio
            const ffmpeg = spawn('ffmpeg', [
                '-i', videoInfo.url,
                '-f', 's16le',
                '-ar', '48000',
                '-ac', '2',
                '-loglevel', 'error',
                'pipe:1'
            ]);

            const stream = new Readable();
            stream._read = () => {};

            ffmpeg.stdout.on('data', (chunk) => {
                stream.push(chunk);
            });

            ffmpeg.stdout.on('end', () => {
                stream.push(null);
            });

            connection = joinVoiceChannel({
                channelId: voiceChannel.id,
                guildId: message.guild.id,
                adapterCreator: message.guild.voiceAdapterCreator,
            });

            const resource = createAudioResource(stream, {
                inputType: 'raw',
                inlineVolume: true,
            });

            resource.volume?.setVolume(0.5);

            // Event handlers
            connection.on('error', error => {
                console.error('Erro na conexão:', error);
                connection.destroy();
            });

            let statusMessage = null;
            let hasStartedPlaying = false;

            player.on(AudioPlayerStatus.Playing, () => {
                if (!hasStartedPlaying) {
                    hasStartedPlaying = true;
                    message.channel.send('▶️ Começou a tocar!')
                        .then(msg => statusMessage = msg)
                        .catch(() => {});
                }
            });

            player.on(AudioPlayerStatus.Idle, () => {
                if (statusMessage) {
                    statusMessage.delete().catch(() => {});
                }
                message.channel.send('⏹️ Música finalizada!')
                    .then(msg => setTimeout(() => msg.delete().catch(() => {}), 5000))
                    .catch(() => {});
                connection.destroy();
            }); 

            connection.subscribe(player);
            player.play(resource);

            return `🎵 Tocando: ${video.title}\n⏱️ Duração: ${video.duration.timestamp}`;
        } catch (error) {
            if (connection) connection.destroy();
            throw error;
        }
    } catch (error) {
        console.error('Erro detalhado:', error);
        throw new Error(`❌ Erro ao tocar música: ${error.message}`);
    }
}

module.exports = { playMusic };
