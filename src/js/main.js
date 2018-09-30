const main = (function () {
  function setup() {
    window.viewportUnitsBuggyfill.init();
  }

  return setup;
})();
window.addEventListener('DOMContentLoaded',main);
