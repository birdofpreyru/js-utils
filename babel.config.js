// Babel is used for Jest testing.

export default {
  plugins: [
    '@babel/transform-runtime',
    '@dr.pogodin/add-import-extension',
  ],
  presets: [
    '@babel/env',
    '@babel/typescript',
  ],
};
