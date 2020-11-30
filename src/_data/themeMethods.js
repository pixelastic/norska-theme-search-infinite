module.exports = {
  hitTemplate({ include }) {
    const templatePath = '_includes/templates/hit.pug';
    try {
      return include(templatePath);
    } catch (_err) {
      return `Create your template in ${templatePath}`;
    }
  },
};
