import Event from '../models/event.js';

const getSyncedEvents = (items) => items
  .filter(({success}) => success)
  .map(({payload}) => payload.point);

export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
    this._isSynchronized = true;
  }

  getEvents() {
    if (this._isOnLine()) {
      return this._api.getEvents()
        .then((events) => {
          events.forEach((event) => this._store.setItem(event.id, event.toRAW()));
          return events;
        });
    }

    const storeEvents = Object.values(this._store.getEvents());

    this._isSynchronized = false;

    return Promise.resolve(Event.parseEvents(storeEvents));
  }

  getDestinations() {
    if (this._isOnLine()) {
      return this._api.getDestinations()
        .then((destinations) => {
          this._store.setDestinations(destinations);
          return destinations;
        });
    }

    return Promise.resolve(this._store.getDestinations());
  }

  getOffers() {
    if (this._isOnLine()) {
      return this._api.getOffers()
        .then((offers) => {
          this._store.setOffers(offers);
          return offers;
        });
    }

    return Promise.resolve(this._store.getOffers());
  }

  createEvent(event) {
    if (this._isOnLine()) {
      return this._api.createEvent(event)
        .then((newEvent) => {
          this._store.setItem(newEvent.id, newEvent.toRAW());
          return newEvent;
        });
    }

    this._isSynchronized = false;
    this._store.setItem(event.id, Object.assign({}, event.toRAW(), {offline: true}));

    return Promise.resolve(event);
  }

  updateEvent(id, event) {
    if (this._isOnLine()) {
      return this._api.updateEvent(id, event)
        .then((newEvent) => {
          this._store.setItem(newEvent.id, newEvent.toRAW());
          return newEvent;
        });
    }

    this._isSynchronized = false;
    this._store.setItem(id, Object.assign({}, event.toRAW(), {offline: true}));

    return Promise.resolve(event);
  }

  deleteEvent(id) {
    if (this._isOnLine()) {
      return this._api.deleteEvent(id)
        .then(() => {
          this._store.removeItem(id);
        });
    }

    this._isSynchronized = false;
    this._store.removeItem(id);

    return Promise.resolve();
  }

  sync() {
    if (this._isOnLine()) {
      const storeEvents = Object.values(this._store.getEvents());

      return this._api.sync(storeEvents)
        .then((response) => {
          storeEvents.filter((event) => event.offline).forEach((event) => {
            this._store.removeItem(event.id);
          });

          const createdEvents = response.created.map((event) => {
            event.offline = false;
            return event;
          });

          const updatedEvents = getSyncedEvents(response.updated);

          [...createdEvents, ...updatedEvents].forEach((event) => {
            this._store.setItem(event.id, event);
          });

          this._isSynchronized = true;

          return Promise.resolve(this.getEvents());
        });
    }

    return Promise.reject(new Error(`Sync data failed`));
  }

  getSynchronize() {
    return this._isSynchronized;
  }

  _isOnLine() {
    return window.navigator.onLine;
  }
}
