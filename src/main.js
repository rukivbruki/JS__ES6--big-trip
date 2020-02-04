import Api from './api/index.js';
import Store from './api/store.js';
import Provider from './api/provider.js';
import SiteMenu from './components/site-menu.js';
import FilterController from './controllers/filter.js';
import TripController from './controllers/trip-controller.js';
import Loading from './components/loading.js';
import EventsModel from './models/points.js';
import DestinationsModel from './models/destinations.js';
import OffersModel from './models/offers.js';
import Statistics from './components/statistics.js';
import {MenuItem} from './const.js';

import {render, RenderPosition, remove} from './utils/render.js';

const AUTHORIZATION = `Basic er883jdzbd=`;
const END_POINT = `https://htmlacademy-es-10.appspot.com/big-trip`;

window.addEventListener(`load`, () => {
  navigator.serviceWorker.register(`/sw.js`);
});

const api = new Api(END_POINT, AUTHORIZATION);
const store = new Store(window.localStorage);
const apiWithProvider = new Provider(api, store);

const siteMainElement = document.querySelector(`.trip-main`);
const siteControlsElement = siteMainElement.querySelector(`.trip-controls`);
const tripEventsElement = document.querySelector(`.trip-events`);

const siteMenuComponent = new SiteMenu();

const loadingComponent = new Loading();
render(tripEventsElement, loadingComponent, RenderPosition.BEFOREEND);

siteMainElement.querySelector(`.trip-main__event-add-btn`).addEventListener(`click`, () => tripController.createEvent());

render(siteControlsElement.firstElementChild, siteMenuComponent, RenderPosition.AFTEREND);

const eventsModel = new EventsModel();
const destinationsModel = new DestinationsModel();
const offersModel = new OffersModel();
const tripController = new TripController(tripEventsElement, eventsModel, destinationsModel, offersModel, apiWithProvider);

const filterController = new FilterController(siteControlsElement, eventsModel);
filterController.render();

const statisticsComponent = new Statistics(eventsModel);
render(tripEventsElement, statisticsComponent, RenderPosition.AFTEREND);
statisticsComponent.hide();

siteMenuComponent.setOnChange((menuItem) => {
  siteMenuComponent.setActiveItem(menuItem);

  switch (menuItem.textContent) {
    case MenuItem.TABLE:
      tripController.show();
      statisticsComponent.hide();
      break;
    case MenuItem.STATS:
      statisticsComponent.show();
      tripController.hide();
      break;
  }
});

const tripInfoElement = siteMainElement.querySelector(`.trip-info`);

Promise.all([apiWithProvider.getEvents(), apiWithProvider.getDestinations(), apiWithProvider.getOffers()])
  .then(([events, destinations, offers]) => {
    remove(loadingComponent);

    destinationsModel.setDestinations(destinations);
    offersModel.setOffers(offers);
    eventsModel.setEvents(events);
    tripController.init();
    tripController.render();
    tripController.renderTripInfo(tripInfoElement);
  });

window.addEventListener(`online`, () => {
  document.title = document.title.replace(` [offline]`, ``);

  if (!apiWithProvider.getSynchronize()) {
    apiWithProvider.sync()
      .then((events) => {
        eventsModel.setEvents(events);
        tripController.rerender();
      })
      .catch((error) => {
        return new Error(error);
      });
  }
});

window.addEventListener(`offline`, () => {
  document.title += ` [offline]`;
});
