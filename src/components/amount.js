import AbstractComponent from './abstract-component.js';

const createAmountMarkup = (eventsList) => {
  const calculateAmount = () => {
    return !eventsList.length ? 0 :
      eventsList.reduce((amount, item) => {
        const offersAmount = item.offers.reduce((sum, offer) => sum + offer.price, 0);

        return amount + item.price + offersAmount;
      }, 0);
  };

  return (
    `<p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">${calculateAmount(eventsList)}</span>
      </p>`
  );
};

const createAmountTemplate = (eventsList) => {
  return createAmountMarkup(eventsList);
};

export default class Amount extends AbstractComponent {
  constructor(eventsList) {
    super();
    this._eventsList = eventsList;
  }

  getTemplate() {
    return createAmountTemplate(this._eventsList);
  }
}
