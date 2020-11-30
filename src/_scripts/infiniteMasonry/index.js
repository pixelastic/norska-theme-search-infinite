const lazyload = require('norska/frontend/lazyload');
const algolia = require('norska/frontend/algolia');
const {
  configure,
  refinementList,
  searchBox,
  sortBy,
  stats,
  toggleRefinement,
} = require('norska/frontend/algolia/widgets');
const credentials = window.CONFIG.algolia;
const widget = require('./widget');
const themeConfig = require('../../themeConfig.js');

module.exports = {
  initSearch() {
    const { placeholder, hitName } = themeConfig.options;
    const widgets = [
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
              const poweredByUrl =
                'https://www.algolia.com/?utm_source=instantsearch.js&utm_medium=website&utm_content=gamemaster.pixelastic.com/maps&utm_campaign=poweredby';
              const suffix = `thanks to <a class="ais-Stats-link" href="${poweredByUrl}" target="_blank">Algolia</a>`;
              const { query, nbHits } = options;
              if (!query) {
                return `${nbHits} ${hitName}s indexed, ${suffix}`;
              }
              return `${nbHits} ${hitName}s found, ${suffix}`;
            },
          },
        },
      },
      {
        type: toggleRefinement,
        options: {
          container: '#curated',
          attribute: 'score.isCurated',
          templates: {
            labelText: 'Only curated authors:',
          },
        },
      },
      {
        type: refinementList,
        options: {
          container: '#tags',
          attribute: 'tags',
          sortBy: ['count:desc', 'name:asc'],
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
      /**
       * Sorting
       **/
      {
        type: sortBy,
        options: {
          container: '#sortBy',
          items: [
            { label: 'most recent', value: credentials.indexName },
            {
              label: 'most popular',
              value: `${credentials.indexName}_popularity`,
            },
          ],
        },
      },
    ];

    algolia
      .init(credentials, { routerIgnore: ['page'] })
      .setWidgets(widgets)
      .start();
  },
  initLazyload() {
    lazyload.init();
  },
};
