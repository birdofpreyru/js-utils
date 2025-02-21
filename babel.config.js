// Babel is used for Jest testing.

export default {
  presets: [
    ['./config/babel/preset', {
      modules: 'cjs',
      targets: 'defaults',
    }],
  ],
};
