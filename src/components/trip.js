import AbstractComponent from './abstract-component.js';
import {formatTime} from '../utils/common.js';
import moment from 'moment';
import {VISIBLE_OFFERS_COUNT} from '../const.js';

const createOffersMarkup = (offers) => {
  const offersMarkup = offers
    .map((it) => {
      return `<li class="event__offer">
                <span class="event__offer-title">${it.title}</span>
                &plus;
                &euro;&nbsp;<span class="event__offer-price">${it.price}</span>
              </li>`;
    });

  return offersMarkup.slice(0, VISIBLE_OFFERS_COUNT).join(`\n`);
};

const getEventDuration = (eventStartDate, eventEndDate) => {
  const durationTimeStamp = moment.duration(moment(eventEndDate).diff(eventStartDate));

  const durationDays = durationTimeStamp.days();
  const durationHours = durationTimeStamp.hours();
  const durationMinutes = durationTimeStamp.minutes();
  const durationDaysString = durationDays < 10 ? `0${durationDays}D` : `${durationDays}D`;
  const durationHoursString = durationHours < 10 ? `0${durationHours}H` : `${durationHours}H`;
  const durationMinutesString = durationMinutes < 10 ? `0${durationMinutes}M` : `${durationMinutes}M`;

  let duration = ``;

  if (durationDays < 1 && durationHours < 1) {
    duration = durationMinutesString;
  } else if (durationDays < 1) {
    duration = `${durationHoursString} ${durationMinutesString}`;
  } else {
    duration = `${durationDaysString} ${durationHoursString} ${durationMinutesString}`;
  }

  return duration;
};

const createTripMarkup = (event) => {
  const eventDuration = getEventDuration(event.startDate, event.endDate);

  return (
    `<div class="event">
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${event.type.name}.png" alt="${event.type.name} icon">
        </div>
        <h3 class="event__title">${event.type.description} ${event.city}</h3>

        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="2019-03-18T10:30">${formatTime(event.startDate)}</time>
            &mdash;
            <time class="event__end-time" datetime="2019-03-18T11:00">${formatTime(event.endDate)}</time>
          </p>
          <p class="event__duration">${eventDuration}</p>
        </div>

        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${event.price}</span>
        </p>

        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
          ${createOffersMarkup(event.offers)}
        </ul>

        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>`
  );
};

const createTripTemplate = (event) => {
  return (
    `<li class="trip-events__item">
        ${createTripMarkup(event)}
      </li>`
  );
};

export default class TripTemplate extends AbstractComponent {
  constructor(event) {
    super();
    this._event = event;
  }

  getTemplate() {
    return createTripTemplate(this._event);
  }

  setEditButtonClickHandler(handler) {
    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, handler);
  }
}
