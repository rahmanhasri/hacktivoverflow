export default function (date) {
  const month = {
    0: 'January',
    1: 'February',
    2: 'March',
    3: 'April',
    4: 'May',
    5: 'June',
    6: 'July',
    7: 'August',
    8: 'September',
    9: 'October',
    10: 'November',
    11: 'December',
  };

  const time = new Date(date)
    .toLocaleTimeString()
    .replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, '$1$3');
  return `${time}, ${new Date(date).getDate()} ${
    month[new Date(date).getMonth()]
  } ${new Date(date).getFullYear()}`;
}
