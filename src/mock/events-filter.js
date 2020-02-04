const eventsFilterNames = [
  {
    name: `Event`,
    ischecked: true
  },
  {
    name: `Time`,
    ischecked: false
  },
  {
    name: `Price`,
    ischecked: false
  }
];

export const generateEventsFilter = () => {
  return eventsFilterNames;
};
