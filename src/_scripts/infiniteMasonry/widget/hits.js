const config = require('./config.js');
const resize = require('./resize.js');
const events = require('./events.js');
const transformHits = require('norska/frontend/algolia/transformHits');
const themeConfig = require('../../themeConfig.js');
module.exports = {
  /**
   * Appends new hits to the existing list
   * @param {Array} hits List of hits
   **/
  append(hits) {
    const container = config.get('container');
    const isAppendMode = config.get('appendMode');

    // Hide/show the "Sorry, no result found"
    document.getElementById('empty').classList.toggle('hidden', hits.length);

    // Return early if no results
    if (!hits.length) {
      container.innerHTML = '';
      return;
    }

    // Rendering the hits
    const newHits = hits.slice(config.get('hitCount'), hits.length);
    const newHitsHtml = this.getHitsHtml(newHits);
    container.innerHTML = isAppendMode
      ? `${container.innerHTML}${newHitsHtml}`
      : newHitsHtml;
    // Resizing them
    const newHitsIds = newHits.map((hit) => {
      return hit.objectID;
    });
    resize(newHitsIds);

    // Keeping track of how many hits we have rendered so far
    config.set('hitCount', hits.length);

    // Stop the infinite scroll if we're at the bottom
    if (this.hasReachedBottom(newHits)) {
      this.addBackToTopButton();
      config.set('disableInfiniteScroll', true);
      return;
    }

    // Add a sentinel at the bottom, to enable the infinite scroll
    this.addSentinel();
  },
  /**
   * Returns the HTML representation of the specified hits
   * @param {Array} hits List of hits to render
   * @returns {string} HTML string of the rendered hits
   **/
  getHitsHtml(hits) {
    const render = config.get('render');
    const transformedHits = transformHits(hits, themeConfig.options.transforms);
    return transformedHits
      .map((hit) => {
        return render(hit);
      })
      .join('\n');
  },
  /**
   * Check if we have reached the bottom of the page
   * @param {Array} newHits List of new hits to add to the page
   * @returns {boolean} true if bottom is reached, false otherwise
   **/
  hasReachedBottom(newHits) {
    // Bottom is reached when no more search results are available
    if (!newHits.length) {
      return true;
    }

    // Bottom is never reached on first display
    if (!config.get('appendMode')) {
      return false;
    }

    // Browsers have a limit to the number of CSS grid rows. If we add more than
    // this limit, items will stack on top of each other. Chrome has a limit to
    // 1000, Firefox to 10.000. Just to be sure we'll consider having reached
    // the bottom if we're nearing 800 rows
    const container = config.get('container');
    const rowCount = resize.getSpanHeight(container);
    const maxRowCount = 800;
    return rowCount > maxRowCount;
  },
  /**
   * Add a sentinel at the bottom of the list
   **/
  addSentinel() {
    const container = config.get('container');
    const sentinelId = 'masonrySentinel';

    // Re-use existing one, or create a new one
    let sentinel = document.getElementById(sentinelId);
    if (!sentinel) {
      sentinel = document.createElement('div');
      sentinel.style.gridRowEnd = 'span 1';
      sentinel.id = sentinelId;
    }

    // Add it, and wait for it to come into view
    // Note that we need to re-watch it each time we move it around
    container.appendChild(sentinel);
    events.onNodeVisible(sentinel, () => {
      // Do not trigger more result if the infinite scroll is temporarily
      // disabled
      if (config.get('disableInfiniteScroll')) {
        return;
      }
      this.__infiniteScrollCallback();
    });
  },
  /**
   * Add a "Back to top" button at the bottom of the list
   **/
  addBackToTopButton() {
    const backToTopId = 'masonryBackToTop';
    // Do nothing if already added
    if (document.getElementById(backToTopId)) {
      return;
    }

    const container = config.get('container');

    const button = document.createElement('div');
    button.id = backToTopId;
    button.classList.add('js-masonryBackToTop');
    button.innerHTML = 'Back to top ↺';
    button.addEventListener('click', () => {
      window.scrollTo(0, 0);
    });

    container.appendChild(button);
  },
  /**
   * Register the callback to fire when we reach the bottom of the page
   * @param {Function} callback Function to call when bottom of page is reached
   **/
  onInfiniteScroll(callback) {
    this.__infiniteScrollCallback = callback;
  },
  __infiniteScrollCallback: () => {},
};
