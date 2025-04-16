const path = require('path');

module.exports = {
    // ...existing code...
    staticDirs: [path.resolve(__dirname, '../UI/stories/Templates')], // Serve the Templates directory as static
};