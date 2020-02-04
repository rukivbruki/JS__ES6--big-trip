import {FilterType} from '../const.js';
import {getEventsByFilter} from '../utils/filter.js';
import {getSortedEvents} from '../utils/sort.js';

export default class Events {
  constructor() {
    this._events = [];

    this._activeFilterType = FilterType.EVERYTHING;

    this._dataChangeHandler = null;
    this._filterChangeHandler = null;
  }

  addEvent(event) {
    this._events = [].concat(event, this._events);
    this._dataChangeHandler();
  }

  getEvents() {
    return getEventsByFilter(this._events, this._activeFilterType);
  }

  getEventsAll() {
    return this._events;
  }

  getSortedEvents(sortType) {
    const events = this.getEvents();

    return getSortedEvents(events, sortType);
  }

  removeEvent(id) {
    const index = this._events.findIndex((it) => it.id === id);

    if (index === -1) {
      return false;
    }

    this._events = [].concat(this._events.slice(0, index), this._events.slice(index + 1));

    this._dataChangeHandler();

    return true;
  }

  setDataChangeHandler(handler) {
    this._dataChangeHandler = handler;
  }

  setEvents(events) {
    this._events = events;
  }

  setFilter(filterType) {
    this._activeFilterType = filterType;
    this._filterChangeHandler();
  }

  setFilterChangeHandler(handler) {
    this._filterChangeHandler = handler;
  }

  updateEvent(id, newEvent) {
    const index = this._events.findIndex((it) => it.id === id);

    if (index === -1) {
      return false;
    }

    this._events = [].concat(this._events.slice(0, index), newEvent, this._events.slice(index + 1));

    this._dataChangeHandler();

    return true;
  }
}
