import { Config } from '@stencil/core';

export const config: Config = {
  outputTargets: [
    {
      type: 'www',
      serviceWorker: null,
      baseUrl: 'https://conference.ionicframework.com/'
    }
  ],
  globalStyle: 'src/global.css',
  copy: [
    { src: 'robots.txt' }
  ]
};
