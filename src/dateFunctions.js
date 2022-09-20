export function formatMonth(month) {
  return month < 10 ? (month = "0" + month) : month;
}

export function calculatePreviousMonth() {
  let previousGameYear = currentYear;
  let previousGameMonth = currentMonth - 1;
  if (previousGameMonth < 0) {
    previousGameMonth = 12;
    previousGameYear = currentYear - 1;
  }
  previousGameMonth = formatMonth(previousGameMonth);
  return { previousGameMonth, previousGameYear };
}

export function isTodaysGame(game) {
  const gameEndDate = new Date(game.end_time * 1000).getDate();
  const gameEndMonth = new Date(game.end_time * 1000).getMonth() + 1;
  const todaysDate = new Date().getDate();
  const todaysMonth = new Date().getMonth() + 1;
  return gameEndDate === todaysDate && gameEndMonth === todaysMonth;
}

export default function getDateInfo() {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentDay = currentDate.getDate();
  const currentMonth = formatMonth(currentDate.getMonth() + 1);
  return { currentYear, currentMonth, currentDay };
}

export const { currentYear, currentMonth, currentDay } = getDateInfo();
