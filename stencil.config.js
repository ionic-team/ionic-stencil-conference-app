exports.config = {
  globalStyle: 'src/global.css',
  serviceWorker: {
    globPatterns: [
      '**/*.{js,css,json,html,ico,png,jpeg}'
    ],
    globIgnores: [
      'build/app/svg/*.js',
      'build/app/*.es5.js'
    ]
  }
};

exports.devServer = {
  root: 'www',
  watchGlob: '**/**'
};
