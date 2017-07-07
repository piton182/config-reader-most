const most = require('most');

const configReader = require('./ConfigReader.js');

const latestCfg$ = configReader.ask()
  .tap(x => console.log('update', x))
  .multicast()
  ;

const request1$ = most.periodic(700);
const request2$ = most.periodic(600);

const handler = function (request, cb) {
  latestCfg$.take(1).map(cfg => {
    return cfg;
  })
  .subscribe(
    {
      next: x => cb(null, x),
      error: err => cb(err, null)
    }
  );
}


const response1$ = most.combine( (request, cfg) => {
  return cfg;
}, request1$, latestCfg$ ).tap(x => console.log('thread1', x));

const response2$ = most.combine( (request, cfg) => {
  return cfg;
}, request2$, latestCfg$ ).tap(x => console.log('thread2', x));

response1$.drain();
response2$.drain();
