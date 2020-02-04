import AbstractComponent from './abstract-component.js';

const createTripInfoMainMarkup = (list) => {
  if (!list.length) {
    return ``;
  }

  const tripInfoTitle = [];

  tripInfoTitle.push(list[0].city);

  if (list.length > 1 && list.length <= 3) {
    tripInfoTitle.push(list[1].city);
  }
  if (list.length === 3) {
    tripInfoTitle.push(list[2].city);
  } else if (list.length > 3) {
    tripInfoTitle.push(`...`);
    tripInfoTitle.push(list[list.length - 1].city);
  }

  const startDate = list[0].startDate;
  const endDate = list[list.length - 1].endDate;

  const startDateString = `${startDate.toLocaleString(`en-US`, {month: `short`})} ${startDate.getDate()}`;
  const endDateString = startDate.getMonth() === endDate.getMonth() ? `${endDate.getDate()}` :
    `${endDate.toLocaleString(`en-US`, {month: `short`})} ${endDate.getDate()}`;

  return (
    `<h1 class="trip-info__title">${tripInfoTitle.join(`&nbsp;&mdash;&nbsp;`)}</h1>
      <p class="trip-info__dates">${startDateString}&nbsp;&mdash;&nbsp;${endDateString}</p>`
  );
};

const createTripInfoMainTemplate = (eventsList) => {
  const tripInfoMarkup = createTripInfoMainMarkup(eventsList);

  return (
    `<div class="trip-info__main">
        ${tripInfoMarkup}
      </div>`
  );
};

export default class TripInfoMain extends AbstractComponent {
  constructor(eventsList) {
    super();
    this._eventsList = eventsList;
  }

  getTemplate() {
    return createTripInfoMainTemplate(this._eventsList);
  }
}
