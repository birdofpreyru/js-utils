export default function preset(api, options) {
  let envPreset = '@babel/env';
  if (options) envPreset = [envPreset, options];
  return {
    plugins: [
      '@babel/plugin-transform-runtime',
    ],
    presets: [envPreset, '@babel/typescript'],
  };
}
