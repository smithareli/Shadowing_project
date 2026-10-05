import moment from 'moment';

const getMarkedRange = (startDateStr, endDateStr, color = '#D662B7') => {
  let start = moment(startDateStr);
  let end = moment(endDateStr);
  let markedDates = {};
  
  let current = start.clone();
  while (current.isBefore(end) || current.isSame(end)) {
    let dateString = current.format('YYYY-MM-DD');

    markedDates[dateString] = {
      selected: true,
      selectedColor: color,
      textColor: 'white',
    };

    current = current.add(1, 'day');
  }
  
  return markedDates;
};
export default getMarkedRange;