export const FilterType = {
  EVERYTHING: `everything`,
  FUTURE: `future`,
  PAST: `past`
};

export const MenuItem = {
  TABLE: `Table`,
  STATS: `Stats`
};

export const HIDDEN_CLASS = `visually-hidden`;

export const EVENT_TYPE = [
  {name: `taxi`, group: `Transfer`, description: `Taxi to`},
  {name: `bus`, group: `Transfer`, description: `Bus to`},
  {name: `train`, group: `Transfer`, description: `Train to`},
  {name: `ship`, group: `Transfer`, description: `Ship to`},
  {name: `transport`, group: `Transfer`, description: `Transport to`},
  {name: `drive`, group: `Transfer`, description: `Drive to`},
  {name: `flight`, group: `Transfer`, description: `Flight to`},
  {name: `check-in`, group: `Activity`, description: `Check into hotel in`},
  {name: `sightseeing`, group: `Activity`, description: `Natural History Museum in`},
  {name: `restaurant`, group: `Activity`, description: `Restaurant in`}
];

export const VISIBLE_OFFERS_COUNT = 3;
