
const today = new Date();
const todayString = today.toISOString().split('T')[0]; // Дата сегодня"

const yesterday = new Date();
yesterday.setDate(today.getDate() - 1);
const yesterdayString = yesterday.toISOString().split('T')[0];

export { todayString, yesterdayString };
