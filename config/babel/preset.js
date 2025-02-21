export default function preset(api, options) {
  let envPreset = '@babel/env';
  if (options) envPreset = [envPreset, options];
  return {
    presets: [envPreset, '@babel/typescript'],
    plugins: [
      '@babel/plugin-transform-runtime',
    ],
  };
}
