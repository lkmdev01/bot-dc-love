const messages = [
    "Você é especial! 🌟",
    "Você é incrível! ✨",
    "Você ilumina meus dias com seu sorriso! 🌅",
    "Cada momento com você é precioso! 💎",
    "Meu coração bate mais forte quando penso em você! 💓",
    "Você é o melhor presente que a vida poderia me dar! 🎁",
    "Sua existência torna o mundo mais bonito! 🌺",
    "Com você, tudo faz mais sentido! ✨",
    "Você é meu porto seguro! ⚓",
    "Seu amor me inspira a ser uma pessoa melhor! 🦋",
    "Quero construir milhões de memórias ao seu lado! 📸",
    "Seu sorriso é minha fonte de alegria! 😊",
    "Você é meu pedacinho de céu na Terra! ☁️",
    "Com você, até os dias nublados são especiais! 🌈"
];

function getRandomMessage() {
    return messages[Math.floor(Math.random() * messages.length)];
}

module.exports = {
    getRandomMessage
};
