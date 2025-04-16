const path = require('path');

module.exports = {
    // ...existing code...
    staticDirs: [path.resolve(__dirname, '../UI/stories/Templates')], // Use path.resolve to ensure absolute paths
};