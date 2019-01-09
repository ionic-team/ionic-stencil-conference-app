import { Config } from '@stencil/core';

export const config: Config = {
  outputTargets: [
    { type: 'www' }
  ],
  globalStyle: 'src/global.css',
  copy: [
    { src: 'robots.txt' }
  ]
};
