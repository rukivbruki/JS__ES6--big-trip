import {SortType} from '../components/sort.js';

export const getSortedEvents = (events, sortType) => {
  switch (sortType) {
    case SortType.DEFAULT:
      return events.slice();
    case SortType.TIME:
      return events.slice().sort((a, b) => {
        const durationFirst = a.endDate - a.startDate;
        const durationSecond = b.endDate - b.startDate;

        return durationSecond - durationFirst;
      });
    case SortType.PRICE:
      return events.slice().sort((a, b) => b.price - a.price);
  }

  return events;
};
