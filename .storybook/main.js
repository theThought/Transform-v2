const path = require('path');

module.exports = {
    stories: ['../UI/stories/**/*.stories.@(js|jsx|ts|tsx)'], // Include your stories
    addons: [
        '@storybook/addon-links',
        '@storybook/addon-essentials',
    ],
    staticDirs: ['../UI/stories/Dimensions'], // Correct path to the Dimensions folder
    framework: '@storybook/web-components-vite', // Specify the framework
};