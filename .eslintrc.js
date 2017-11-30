module.exports = {
  plugins: [
    //'chai-expect',
    //'mocha'
  ],
  extends: [
    'airbnb-base'
  ],
  parserOptions: {
    'sourceType': 'script'
  },
  ecmaFeatures: {
    'modules': false
  },
  rules: {
    'space-before-function-paren': ['error', 'never'],
    'no-use-before-define': ['error', { functions: false, classes: true, variables: true }],
    'jsdoc/check-param-names': 0,
    'strict': ['error', 'safe'],
    'no-confusing-arrow': 0,
    'comma-dangle': 0,
    'arrow-parens': ['error', 'as-needed'],
    'object-curly-newline': ['error', {
      ObjectExpression: {
        minProperties: 5,
        multiline: true,
        consistent: true
      }
    }],
    'no-shadow': 0,
    'arrow-body-style': 0
  }
}
