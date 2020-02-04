import moment from 'moment';

const getRandomArrayItem = (array) => {
  const randomIndex = getRandomIntegerNumber(0, array.length - 1);

  return array[randomIndex];
};

const getRandomNumber = (min, max) => {
  return min + Math.random() * (max - min);
};

const getRandomIntegerNumber = (min, max) => {
  return Math.floor(min + Math.random() * (max + 1 - min));
};

const formatDate = (date) => {
  return moment(date).format();
};

const formatTime = (date) => {
  return moment(date).format(`HH:mm`);
};

const getSetFromArray = (arr) => {
  return Array.from(new Set(arr));
};

const getRandomString = (length) => {
  return [...Array(length)].map(() => Math.random().toString(36)[3]).join(``);
};

export {getRandomArrayItem, getRandomNumber, getRandomIntegerNumber, formatDate, formatTime, getSetFromArray, getRandomString};
