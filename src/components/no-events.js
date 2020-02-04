import AbstractComponent from './abstract-component.js';

const createNoEventsMarkup = () => {
  return (
    `<p class="trip-events__msg">Click New Event to create your first point</p>`
  );
};

const createNoEventsTemplate = () => {
  return createNoEventsMarkup();
};

export default class NoEvents extends AbstractComponent {
  getTemplate() {
    return createNoEventsTemplate();
  }
}
