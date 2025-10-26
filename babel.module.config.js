// Babel is used for Jest testing.

export default {
  plugins: [
    'babel-plugin-add-import-extension',
  ],
  presets: [
    ['./config/babel/preset', {
      modules: false,
      targets: 'defaults',
    }],
  ],
};
