import moment from 'moment';

const getMarkedRange = (startDateStr, endDateStr, color = '#00adf5') => {
  let start = moment(startDateStr);
  let end = moment(endDateStr);
  let markedDates = {};
  
  let current = start.clone();
  while (current.isBefore(end) || current.isSame(end)) {
    let dateString = current.format('YYYY-MM-DD');
    
    let isStart = current.isSame(start, 'day');
    let isEnd = current.isSame(end, 'day');

    markedDates[dateString] = {
      startingDay: isStart,
      endingDay: isEnd,
      color,
      textColor: 'white',
    };

    current = current.add(1, 'day');
  }
  
  return markedDates;
};
export default getMarkedRange;