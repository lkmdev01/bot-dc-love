const dailyQuotes = [
    "Nada é tão ruim que não possa piorar! 😅",
    "Seja a mudança que você quer ver no mundo! 🌍",
    "O não você já tem, agora falta buscar a humilhação! 😂",
    "Acredite em você, mas não seja besta! 🤪",
    "Todo dia é dia de reinventar a roda! 🎡",
    "O segredo do sucesso é começar! ⭐",
    "Não deixe para amanhã o que você pode fazer depois de amanhã! 📅",
    "Você é mais forte do que imagina! 💪",
    "Se seu plano A falhar, relaxa... O alfabeto tem mais 25 letras! 📚",
    "Sorria, amanhã pode ser pior! 😁",
    "Tudo posso naquele que me fortalece... O café! ☕",
    "Seja feliz hoje, porque amanhã é segunda! 🎉",
    "O importante não é vencer, é comprar pizza! 🍕"
];

function getDailyQuote() {
    return dailyQuotes[Math.floor(Math.random() * dailyQuotes.length)];
}

module.exports = {
    getDailyQuote
};
