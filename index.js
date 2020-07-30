'use strict';

const { declare } = require('@babel/helper-plugin-utils');

module.exports = declare((api, options) => {
  // see docs about api at https://babeljs.io/docs/en/config-files#apicache
  api.assertVersion('^7.0.0');

  const {
    modules = 'auto',
    corejs = 3,
    useBuiltIns = 'usage',
    looseClasses = false,
    runtimeVersion,
    runtimeHelpersUseESModules = !modules,
    transformRuntime = false,
    debug = false,
  } = options;

  if (typeof modules !== 'boolean' && modules !== 'auto') {
    throw new TypeError('babel-preset-daun only accepts `true`, `false`, or `"auto"` as the value of the "modules" option');
  }

  return {
    presets: [
      [require('@babel/preset-env'), {
        debug: Boolean(debug),
        modules: modules === false ? false : 'auto',
        corejs,
        useBuiltIns,
        shippedProposals: true,
        bugfixes: true,
      }],
    ],
    plugins: [
      [require('babel-plugin-webpack-chunkname'), {
        getChunkName: path => path.replace(/^[./]+|(\.js$)|@|\bdaun[-_/]/g, ''),
      }],
      looseClasses ? [require('@babel/plugin-transform-classes'), {
        loose: looseClasses,
      }] : null,
      require('@babel/plugin-proposal-class-properties'),
      require('@babel/plugin-transform-property-mutators'),
      require('@babel/plugin-transform-member-expression-literals'),
      require('@babel/plugin-proposal-nullish-coalescing-operator'),
      require('@babel/plugin-proposal-numeric-separator'),
      require('@babel/plugin-proposal-optional-catch-binding'),
      require('@babel/plugin-proposal-optional-chaining'),
      [require('@babel/plugin-proposal-object-rest-spread'), {
        useBuiltIns: true,
      }],
      transformRuntime ? [require('@babel/plugin-transform-runtime'), {
        absoluteRuntime: false,
        corejs: false,
        helpers: true,
        regenerator: false,
        useESModules: runtimeHelpersUseESModules,
        version: runtimeVersion,
      }] : null,
    ].filter(Boolean),
  };
});
