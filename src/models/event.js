import {EVENT_TYPE} from '../const.js';

export default class Event {
  constructor(data) {
    this.id = data[`id`];
    this.type = EVENT_TYPE.find((it) => it.name === data[`type`]);
    this.city = data[`destination`][`name`];
    this.photo = data[`destination`][`pictures`];
    this.description = data[`destination`][`description`];
    this.startDate = new Date(data[`date_from`]);
    this.endDate = new Date(data[`date_to`]);
    this.price = data[`base_price`];
    this.offers = data[`offers`];
    this.isFavorite = Boolean(data[`is_favorite`]);
  }

  toRAW() {
    return {
      'id': `${this.id}`,
      'base_price': this.price,
      'date_from': this.startDate,
      'date_to': this.endDate,
      'destination': {
        'description': this.description,
        'name': this.city,
        'pictures': this.photo,
      },
      'is_favorite': this.isFavorite,
      'offers': this.offers,
      'type': this.type.name
    };
  }

  static parseEvent(data) {
    return new Event(data);
  }

  static parseEvents(data) {
    return data.map(Event.parseEvent);
  }

  static clone(data) {
    return new Event(data.toRAW());
  }
}
