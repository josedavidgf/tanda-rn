import pluginImport from 'eslint-plugin-import';

/** @type {import("eslint").Linter.FlatConfig[]} */
export default [
  {
    plugins: {
      import: pluginImport,
    },
    rules: {
      'import/no-unresolved': 'error',
    },
  },
];
