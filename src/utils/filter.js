import {FilterType} from '../const.js';

const getEventsByDate = (events) => {
  return events.sort((a, b) => a.startDate - b.startDate);
};

export const getFutureEvents = (events, now) => {
  return events.filter((event) => event.startDate >= now);
};

export const getPastEvents = (events, now) => {
  return events.filter((event) => event.endDate < now);
};

export const getEventsByFilter = (events, filterType) => {
  const now = new Date();

  switch (filterType) {
    case FilterType.EVERYTHING:
      return getEventsByDate(events);
    case FilterType.FUTURE:
      return getFutureEvents(events, now);
    case FilterType.PAST:
      return getPastEvents(events, now);
  }

  return events;
};
