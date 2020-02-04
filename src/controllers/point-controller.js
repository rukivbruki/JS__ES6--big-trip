import Trip from '../components/trip.js';
import TripEdit from '../components/trip-edit.js';
import {render, RenderPosition, replace, remove} from '../utils/render.js';
import {EVENT_TYPE} from '../const.js';
import moment from 'moment';
import EventModel from '../models/event.js';

const SHAKE_ANIMATION_TIMEOUT = 600;

export const EventMode = {
  DEFAULT: `default`,
  EDIT: `edit`,
  ADDING: `adding`
};

export const getEmptyEvent = (id) => {
  return ({
    id,
    type: EVENT_TYPE[0],
    city: ``,
    photo: [],
    description: ``,
    startDate: Date.now(),
    endDate: Date.now(),
    price: 0,
    offers: [],
    isFavorite: false
  });
};

const parseFormData = (formData, event, destinations, offers) => {
  const type = formData.get(`event-type`);
  const city = formData.get(`event-destination`);

  const [{description, pictures}] = destinations.filter((it) => it.name === city);
  const eventOffers = offers.filter((it) => it.type === type)[0].offers;
  const checkedOffers = eventOffers.filter((it, i) => {
    return formData.get(`event-offer-${i}`) === `on`;
  });

  const startDate = moment(formData.get(`event-start-time`), `DD/MM/YY HH:mm`).valueOf();
  const endDate = moment(formData.get(`event-end-time`), `DD/MM/YY HH:mm`).valueOf();

  return new EventModel({
    'base_price': +formData.get(`event-price`),
    'date_from': new Date(startDate),
    'date_to': new Date(endDate),
    'destination': {
      description,
      'name': city,
      pictures
    },
    'id': event.id,
    'is_favorite': formData.get(`event-favorite`) === `on`,
    "offers": checkedOffers,
    'type': type
  });
};

export default class EventController {
  constructor(container, onDataChange, onViewChange) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;

    this._eventComponent = null;
    this._eventEditComponent = null;
    this._eventMode = EventMode.DEFAULT;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  destroy() {
    remove(this._eventComponent);
    remove(this._eventEditComponent);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  render(event, destinations, offers, mode) {
    const oldEvent = this._eventComponent;
    const oldEventEdit = this._eventEditComponent;
    this._eventMode = mode;
    this._eventComponent = new Trip(event);
    this._eventEditComponent = new TripEdit(event, destinations, offers, mode);

    this._eventComponent.setEditButtonClickHandler(() => {
      this._replaceEventComponent();
      document.addEventListener(`keydown`, this._onEscKeyDown);
    });

    this._eventEditComponent.setFavoriteButtonClickHandler(() => {
      const newEvent = EventModel.clone(event);
      newEvent.isFavorite = !newEvent.isFavorite;

      this._onDataChange(this, event, newEvent);
    });

    this._eventEditComponent.setEditFormSubmitHandler((evt) => {
      evt.preventDefault();

      const formData = this._eventEditComponent.getData();
      const data = parseFormData(formData, event, destinations, offers);

      this._eventEditComponent.setData({
        saveButtonText: `Saving...`,
        isBlocked: true
      }, data);

      this._onDataChange(this, event, data);
    });

    this._eventEditComponent.setDeleteButtonClickHandler(() => {
      this._eventEditComponent.setData({
        deleteButtonText: `Deletinf...`,
        isBlocked: true
      }, event);

      this._onDataChange(this, event, null);
    });

    switch (mode) {
      case EventMode.DEFAULT:
        if (oldEvent && oldEventEdit) {
          replace(this._eventComponent, oldEvent);
          replace(this._eventEditComponent, oldEventEdit);
          this._replaceEventEditComponent();
        } else {
          render(this._container, this._eventComponent, RenderPosition.BEFOREEND);
        }
        break;
      case EventMode.ADDING:
        if (oldEvent && oldEventEdit) {
          remove(oldEvent);
          remove(oldEventEdit);
        }
        document.addEventListener(`keydown`, this._onEscKeyDown);

        render(this._container.lastElementChild, this._eventEditComponent, RenderPosition.AFTERBEGIN);
        break;
    }
  }

  removeFlatpickr() {
    this._eventEditComponent.removeFlatpickr();
  }

  setDefaultView() {
    if (this._eventMode !== EventMode.DEFAULT) {
      this._replaceEventEditComponent();
    }
  }

  shake() {
    this._eventEditComponent.getElement().style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;
    this._eventComponent.getElement().style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;
    this._eventEditComponent.getElement().classList.add(`event--error`);

    setTimeout(() => {
      this._eventEditComponent.getElement().style.animation = ``;
      this._eventComponent.getElement().style.animation = ``;
      this._eventEditComponent.getElement().classList.remove(`event--error`);

      this._eventEditComponent.setData({
        saveButtonText: `Save`,
        deleteButtonText: `Delete`
      }, this._eventEditComponent._event);
    }, SHAKE_ANIMATION_TIMEOUT);
  }

  _onEscKeyDown(evt) {
    const isEscape = (evt.key === `Escape` || evt.key === `Esc`);

    if (isEscape) {
      if (this._eventMode === EventMode.ADDING) {
        this._onDataChange(this, getEmptyEvent(this._eventComponent.id), null);
        this._eventEditComponent.reset();
      }
      this._replaceEventEditComponent();
    }
  }

  _replaceEventComponent() {
    this._onViewChange();
    replace(this._eventEditComponent, this._eventComponent);
    this._eventMode = EventMode.EDIT;
  }

  _replaceEventEditComponent() {
    document.removeEventListener(`keydown`, this._onEscKeyDown);
    this._eventEditComponent.reset();

    if (document.contains(this._eventEditComponent.getElement())) {
      replace(this._eventComponent, this._eventEditComponent);
    }

    this._eventMode = EventMode.DEFAULT;
  }
}
