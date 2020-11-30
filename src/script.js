const infiniteMasonry = require('./_scripts/infiniteMasonry');
const themeConfig = require('./themeConfig.js');

module.exports = {
  /**
   * Init the infinite search
   * @param {object} options Options to configure the display (see config.js)
   **/
  async init(options = {}) {
    themeConfig.options = { ...themeConfig.options, ...options };
    infiniteMasonry.initSearch();
    infiniteMasonry.initLazyload();
  },
};
