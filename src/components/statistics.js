import AbstractSmartComponent from './abstract-smart-component';
import Chart from 'chart.js';
import moment from 'moment';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {getSetFromArray} from '../utils/common.js';

const renderMoneyChart = (ctx, events) => {
  const eventsType = getSetFromArray(
      events.map((event) => event.type.name)
  );

  const amount = eventsType.map((type) => {
    return events
      .filter((event) => event.type.name === type)
      .reduce((sum, it) => sum + +it.price, 0);
  });

  return new Chart(ctx, {
    plugins: ChartDataLabels,
    type: `horizontalBar`,
    data: {
      labels: eventsType,
      datasets: [{
        backgroundColor: `white`,
        data: amount,
        minBarLength: 50,
        maxBarThickness: 40,
        barThickness: 30
      }]
    },
    options: {
      plugins: {
        datalabels: {
          align: `left`,
          anchor: `end`,
          color: `black`,
          font: {
            size: 12,
            weight: 700
          },
          formatter: (value) => `€ ${value}`
        }
      },
      title: {
        display: true,
        fontSize: 22,
        fontColor: `#000000`,
        position: `left`,
        padding: 50,
        text: `MONEY`
      },
      legend: {
        display: false
      },
      scales: {
        xAxes: [{
          display: false,
          ticks: {
            suggestedMin: 0
          }
        }],
        yAxes: [{
          gridLines: {
            display: false
          },
          ticks: {
            fontSize: 13,
            callback: (value) => value.toUpperCase()
          }
        }]
      }
    }
  });
};

const renderTransportChart = (ctx, events) => {
  const eventsType = getSetFromArray(
      events.map((event) => event.type.name)
  );
  const transport = eventsType.map((type) => {
    return events
      .filter((event) => event.type.name === type)
      .reduce((sum) => sum + 1, 0);
  });

  return new Chart(ctx, {
    plugins: ChartDataLabels,
    type: `horizontalBar`,
    data: {
      labels: eventsType,
      datasets: [{
        backgroundColor: `white`,
        data: transport,
        minBarLength: 50,
        barThickness: 35
      }]
    },
    options: {
      plugins: {
        datalabels: {
          align: `left`,
          anchor: `end`,
          color: `black`,
          font: {
            size: 12,
            weight: 700
          },
          formatter: (value) => `${value}x`
        }
      },
      title: {
        display: true,
        fontSize: 22,
        fontColor: `#000000`,
        position: `left`,
        padding: 50,
        text: `TRANSPORT`
      },
      legend: {
        display: false
      },
      scales: {
        xAxes: [{
          display: false,
          ticks: {
            suggestedMin: 0
          }
        }],
        yAxes: [{
          gridLines: {
            display: false
          },
          ticks: {
            fontSize: 13,
            callback: (value) => value.toUpperCase()
          }
        }]
      }
    }
  });
};

const renderTimeChart = (ctx, events) => {
  const eventsType = getSetFromArray(
      events.map((event) => event.type.name)
  );

  const time = eventsType.map((type) => {
    return events
      .filter((event) => event.type.name === type)
      .reduce((sum, it) => {
        const duration = moment(it.endDate) - moment(it.startDate);
        return sum + Math.round(moment.duration(duration).asHours());
      }, 0);
  });

  return new Chart(ctx, {
    plugins: ChartDataLabels,
    type: `horizontalBar`,
    data: {
      labels: eventsType,
      datasets: [{
        backgroundColor: `white`,
        data: time,
        minBarLength: 50,
        barThickness: 35
      }]
    },
    options: {
      plugins: {
        datalabels: {
          align: `left`,
          anchor: `end`,
          color: `black`,
          font: {
            size: 12,
            weight: 700
          },
          formatter: (value) => `${value}H`
        }
      },
      title: {
        display: true,
        fontSize: 22,
        fontColor: `#000000`,
        position: `left`,
        padding: 50,
        text: `TIME SPENT`
      },
      legend: {
        display: false
      },
      scales: {
        xAxes: [{
          display: false,
          ticks: {
            suggestedMin: 0
          }
        }],
        yAxes: [{
          gridLines: {
            display: false
          },
          ticks: {
            fontSize: 13,
            callback: (value) => value.toUpperCase()
          }
        }]
      }
    }
  });
};

const createStatisticsTemplate = () => {
  return (
    `<section class="statistics">
        <h2 class="visually-hidden">Trip statistics</h2>

        <div class="statistics__item statistics__item--money">
          <canvas class="statistics__chart  statistics__chart--money" width="900"></canvas>
        </div>

        <div class="statistics__item statistics__item--transport">
          <canvas class="statistics__chart  statistics__chart--transport" width="900"></canvas>
        </div>

        <div class="statistics__item statistics__item--time-spend">
          <canvas class="statistics__chart  statistics__chart--time" width="900"></canvas>
        </div>
      </section>`
  );
};

export default class Statistics extends AbstractSmartComponent {
  constructor(events) {
    super();

    this._events = events;

    this._moneyChart = null;
    this._transportChart = null;
    this._timeChart = null;

    this._renderCharts();
  }

  getTemplate() {
    return createStatisticsTemplate(this._events.getEvents());
  }

  recoveryListeners() {

  }

  rerender(events) {
    this._events = events;

    super.rerender();
    this._renderCharts();
  }

  show() {
    super.show();

    this.rerender(this._events);
  }

  _renderCharts() {
    const element = this.getElement();

    const moneyCtx = element.querySelector(`.statistics__chart--money`);
    const transportCtx = element.querySelector(`.statistics__chart--transport`);
    const timeCtx = element.querySelector(`.statistics__chart--time`);

    this._resetCharts();

    this._moneyChart = renderMoneyChart(moneyCtx, this._events.getEvents());
    this._transportChart = renderTransportChart(transportCtx, this._events.getEvents());
    this._timeChart = renderTimeChart(timeCtx, this._events.getEvents());
  }

  _resetCharts() {
    if (this._moneyChart) {
      this._moneyChart.destroy();
      this._moneyChart = null;
    }

    if (this._transportChart) {
      this._transportChart.destroy();
      this._transportChart = null;
    }

    if (this._timeChart) {
      this._timeChart.destroy();
      this._timeChart = null;
    }
  }
}
