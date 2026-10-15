import moment from 'moment';

const CURRENT_COLOR = '#D662B7';
const PREDICTED_COLOR = '#EBB0DC'; 
const getMarkedRange = (startDateStr, endDateStr, color = CURRENT_COLOR) => {
  const end = moment(endDateStr);
  const current = moment(startDateStr);
  const markedDates = {};

  while (current.isSameOrBefore(end)) {
    markedDates[current.format('YYYY-MM-DD')] = {
      selected: true,
      selectedColor: color,
      selectedTextColor: 'white', 
    };
    current.add(1, 'day');
  }

  return markedDates;
};

export const toMarkedDates = (cycles) =>
  cycles.reduce(
    (marked, c) => ({
      ...marked,
      ...getMarkedRange(c.start_date, c.end_date, c.is_predicted ? PREDICTED_COLOR : CURRENT_COLOR),
    }),
    {},
  );

export const toDraftMarkedDates = (days) =>
  Object.fromEntries(
    [...days].map((day) => [
      day,
      { selected: true, selectedColor: CURRENT_COLOR, selectedTextColor: 'white' },
    ]),
  );

export default getMarkedRange;