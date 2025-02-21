// Babel is used for Jest testing.

export default {
  presets: [
    ['./config/babel/preset', {
      modules: false,
      targets: 'defaults',
    }],
  ],
};
