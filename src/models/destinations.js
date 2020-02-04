export default class Destinations {
  constructor() {
    this._destinations = [];
  }

  getDestinations() {
    return this._destinations;
  }

  setDestinations(data) {
    this._destinations = data.map((it) => {
      return {
        description: it.description,
        name: it.name,
        pictures: it.pictures
      };
    });
  }
}
