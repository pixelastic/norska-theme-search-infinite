const instantsearch = require('norska/frontend/algolia/instantsearch');
const config = require('./config.js');
const hits = require('./hits.js');
module.exports = {
  /**
   * Return the InstantSearch widget
   * @returns {object} InstantSearch widget
   **/
  init() {
    const connectInfiniteHits = instantsearch.connectors.connectInfiniteHits;
    return connectInfiniteHits((renderArgs, isFirstRender) => {
      const { hits: hitList, showMore, widgetParams } = renderArgs;

      // Init the widget
      if (isFirstRender) {
        config.setStable(widgetParams);
        hits.onInfiniteScroll(() => {
          config.set('appendMode', true);
          showMore();
        });
        return;
      }

      // Start a new search
      if (!config.get('appendMode')) {
        config.clear();
        window.scrollTo(0, 0);
      }

      hits.append(hitList);
      config.set('appendMode', false);
    });
  },
};
