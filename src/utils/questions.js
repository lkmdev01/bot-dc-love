const questions = [
    // Perguntas românticas existentes
    "O que mais te encanta em mim? ✨",
    "Qual é seu jeito favorito de receber carinho? 🤗",
    "Onde seria seu encontro dos sonhos? 🌟",
    "Qual foi seu primeiro pensamento quando me conheceu? 💭",
    "O que te faz sorrir quando pensa em mim? 😊",
    "Qual é nossa memória mais divertida juntos? 😄",
    "O que você mais gosta de fazer comigo? 💑",
    "Qual é seu apelido carinhoso favorito? 💝",
    "Em que momento você percebeu que estava apaixonado(a)? 💘",
    "Qual é sua forma favorita de demonstrar amor? ❤️",
    "O que você imagina para nosso futuro juntos? 🔮",
    "Qual é sua data especial favorita nossa? 📅",

    // Perguntas sobre sonhos e aspirações
    "Qual é seu maior sonho? 💫",
    "Se pudesse viajar para qualquer lugar agora, onde seria? ✈️",
    "O que você gostaria de aprender este ano? 📚",
    "Qual superpoder você escolheria ter? 🦸",

    // Perguntas sobre preferências
    "Qual sua estação do ano favorita e por quê? 🌸",
    "Se fosse um animal, qual seria? 🐾",
    "Qual sua comida favorita? 🍝",
    "Qual filme te marcou mais? 🎬",
    "Qual sua música favorita no momento? 🎵",

    // Perguntas reflexivas
    "O que te faz sentir mais vivo(a)? 🌟",
    "Qual foi a melhor decisão que você já tomou? 🎯",
    "O que te faz rir sem parar? 😂",
    "Qual seu lugar favorito para relaxar? 🌅",

    // Perguntas divertidas
    "Se ganhasse na loteria hoje, o que faria primeiro? 💰",
    "Qual sua teoria da conspiração favorita? 🕵️",
    "Se pudesse jantar com qualquer pessoa da história, quem seria? 🍽️",
    "Qual sua memória mais embaraçosa? 😅",

    // Perguntas sobre vida
    "O que te motiva a levantar toda manhã? 🌅",
    "Qual conselho você daria para seu eu do passado? 🤔",
    "O que te faz perder a noção do tempo? ⏰",
    "Qual sua maior conquista até hoje? 🏆"
];

function getRandomQuestion() {
    return questions[Math.floor(Math.random() * questions.length)];
}

module.exports = { getRandomQuestion };
