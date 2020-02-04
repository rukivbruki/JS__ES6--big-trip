const StoreKey = {
  EVENTS: `events`,
  DESTINATIONS: `destinations`,
  OFFERS: `offers`
};

export default class Store {
  constructor(storage) {
    this._storage = storage;
    this._storeKey = StoreKey;
  }

  getEvents() {
    try {
      return JSON.parse(this._storage.getItem(this._storeKey.EVENTS));
    } catch (err) {
      return {};
    }
  }

  dropAll() {
    this._storage.clear();
  }

  setItem(key, value) {
    const store = this.getEvents();

    this._storage.setItem(
        this._storeKey.EVENTS,
        JSON.stringify(Object.assign({}, store, {[key]: value}))
    );
  }

  removeItem(key) {
    const store = this.getEvents();

    delete store[key];

    this._storage.setItem(
        this._storeKey.EVENTS,
        JSON.stringify(Object.assign({}, store))
    );
  }

  setDestinations(destinations) {
    this._storage.setItem(
        this._storeKey.DESTINATIONS,
        JSON.stringify(destinations)
    );
  }

  getDestinations() {
    try {
      return JSON.parse(this._storage.getItem(this._storeKey.DESTINATIONS));
    } catch (err) {
      return {};
    }
  }

  setOffers(offers) {
    this._storage.setItem(
        this._storeKey.OFFERS,
        JSON.stringify(offers)
    );
  }

  getOffers() {
    try {
      return JSON.parse(this._storage.getItem(this._storeKey.OFFERS));
    } catch (err) {
      return {};
    }
  }
}
