const lazyload = require('norska/frontend/lazyload');
const algolia = require('norska/frontend/algolia');
const {
  configure,
  searchBox,
  stats,
} = require('norska/frontend/algolia/widgets');
const credentials = window.CONFIG.algolia;
const widget = require('./widget');
const themeConfig = require('../../themeConfig.js');

module.exports = {
  initSearch() {
    const { placeholder, hitName, widgets } = themeConfig.options;
    const defaultWidgets = [
      /**
       * Main configuration
       **/
      {
        type: configure,
        options: {
          hitsPerPage: 40,
        },
      },
      /**
       * Searchbar
       **/
      {
        type: searchBox,
        options: {
          container: '#searchbox',
          placeholder,
          autofocus: true,
          showReset: false,
          showSubmit: false,
          showLoadingIndicator: false,
        },
      },
      {
        type: stats,
        options: {
          container: '#stats',
          templates: {
            text(options) {
              const { hostname, pathname } = window.location;
              const utmContent = `${hostname}${pathname}`;
              const poweredByUrl = `https://www.algolia.com/?utm_source=instantsearch.js&utm_medium=website&utm_content=${utmContent}&utm_campaign=poweredby`;
              const suffix = `thanks to <a class="ais-Stats-link" href="${poweredByUrl}" target="_blank">Algolia</a>`;
              const { query, nbHits } = options;
              const pluralizedHitName = nbHits === 1 ? hitName : `${hitName}s`;
              if (!query) {
                return `${nbHits} ${pluralizedHitName} indexed, ${suffix}`;
              }
              return `${nbHits} ${pluralizedHitName} found, ${suffix}`;
            },
          },
        },
      },
      /**
       * Hits
       **/
      {
        type: widget.init(),
        options: {
          container: '#hits',
          templates: {
            item: document.getElementById('hitTemplate').value,
            empty: document.getElementById('emptyTemplate').value,
          },
        },
      },
    ];

    algolia
      .init(credentials, { routerIgnore: ['page'] })
      .setWidgets([...defaultWidgets, ...widgets])
      .start();
  },
  initLazyload() {
    lazyload.init();
  },
};
