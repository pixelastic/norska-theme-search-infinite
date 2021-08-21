const infiniteMasonry = require('./_scripts/infiniteMasonry');
const themeConfig = require('./_scripts/themeConfig.js');
const lazyloadHelper = require('norska/frontend/algolia/lazyload');

module.exports = {
  /**
   * Init the infinite search
   * @param {object} options Options to configure the display (see config.js)
   **/
  async init(options = {}) {
    lazyloadHelper.init();

    themeConfig.options = { ...themeConfig.options, ...options };
    infiniteMasonry.initSearch();
    infiniteMasonry.initLazyload();
  },
};
