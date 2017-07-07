const most = require('most');
const { create } = require('@most/create');
const request = require('request-promise-native');

const poller$ = most.periodic(3000).delay(5000).flatMap(() =>
  most.fromPromise(
    request({
      method: 'GET',
      uri: 'http://google.com',
      resolveWithFullResponse: true
    })
  ).map(response => response.statusCode).tap(x => console.log('poll', x))
);
const pollerEquals = () => true; // TODO:

const periodicCounter$ = most.periodic(3000).scan( (acc, x) => acc + 1, 0 );
const periodicCounterEquals = (x,y) => x === y;

// const sampler$ = periodicCounter$;
// const equals = periodicCounterEquals;
const sampler$ = poller$;
const equals = pollerEquals;

exports.ask = () =>
  sampler$.skipRepeatsWith(equals);
