import AbstractComponent from './abstract-component.js';

const createLoadingMarkup = () => {
  return (
    `<p class="trip-events__msg">Loading...</p>`
  );
};

const createLoadingTemplate = () => {
  return createLoadingMarkup();
};

export default class NoEvents extends AbstractComponent {
  getTemplate() {
    return createLoadingTemplate();
  }
}
