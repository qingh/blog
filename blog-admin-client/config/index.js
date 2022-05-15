module.exports = {
  port: 6001,
  open: false,
  proxy: {
    '/api/v1': 'http://localhost:8080',
  },
};
