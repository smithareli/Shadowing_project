import moment from 'moment';

const getMarkedRange = (startDateStr, endDateStr, color = '#00adf5') => {
  let start = moment(startDateStr);
  let end = moment(endDateStr);
  let markedDates = {};
  
  let current = start;
  while (current.isBefore(end) || current.isSame(end)) {
    let dateString = current.format('YYYY-MM-DD');
    
    let isStart = current.isSame(start);
    let isEnd = current.isSame(end);

    markedDates[dateString] = {
      startingDay: isStart,
      endingDay: isEnd,
      selected: true,
      selectedColor: color,
      textColor: 'white',
    };

    current = current.add(1, 'day');
  }
  
  return markedDates;
};
export default getMarkedRange;