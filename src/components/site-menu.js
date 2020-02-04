import AbstractComponent from './abstract-component.js';
import {MenuItem} from '../const.js';

const ACTIVE_ITEM_CLASS = `trip-tabs__btn--active`;

const createSiteMenuMarkup = (item, isActive) => {
  return (
    `<a class="trip-tabs__btn  ${isActive ? ACTIVE_ITEM_CLASS : ``}" href="#">${item}</a>`
  );
};

export const createSiteMenuTemplate = (menuItems, activeItem) => {
  const siteMenuMarkup = Object.values(menuItems)
    .map((it) => createSiteMenuMarkup(it, it === activeItem))
    .join(`\n`);

  return (
    `<nav class="trip-controls__trip-tabs  trip-tabs">
      ${siteMenuMarkup}
      </nav>`
  );
};

export default class SiteMenu extends AbstractComponent {
  constructor() {
    super();
    this._menuItems = MenuItem;
    this._activeItem = MenuItem.TABLE;
  }

  getTemplate() {
    return createSiteMenuTemplate(this._menuItems, this._activeItem);
  }

  setActiveItem(menuItem) {
    if (menuItem.textContent === this._activeItem) {
      return;
    }

    this.getElement().querySelector(`.${ACTIVE_ITEM_CLASS}`).classList.remove(ACTIVE_ITEM_CLASS);
    menuItem.classList.add(ACTIVE_ITEM_CLASS);
    this._activeItem = menuItem.textContent;
  }

  setOnChange(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      evt.preventDefault();

      if (evt.target.tagName !== `A`) {
        return;
      }

      handler(evt.target);
    });
  }
}
