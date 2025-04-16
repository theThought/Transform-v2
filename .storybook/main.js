const path = require('path');

module.exports = {
  stories: ['../UI/stories/**/*.stories.@(js|jsx|ts|tsx)'], // Include your stories
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
  ],
  staticDirs: ['../UI/src/static'], // Correct path to your static folder
  framework: {
    name: '@storybook/web-components-vite',
    options: {},
  },
};