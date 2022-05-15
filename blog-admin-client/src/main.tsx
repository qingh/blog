import hmr from '.';
if (module.hot) {
  module.hot.accept('./index.js', () => {
    console.clear();
    hmr();
    console.clear();
  });
}
hmr();
