/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint no-console: ["warn", { allow: ["log"] }] */

/**
 * Function for copying build assets into a folder for local testing.
 *
 * @return {void}
 */

const fs = require('fs');
const path = require('path');
const colors = require('colors/safe');
const sourceDirectoryPath = path.join(__dirname, '../public');
const destDirectoryPath = path.join(__dirname, '../_example-pages/');

// Copy all build assets to the local server folder.
const copyAssets = () => {
    try {
        fs.cpSync(sourceDirectoryPath, destDirectoryPath, { recursive: true });
        console.log(colors.green.bold('Successfully copied all build assets!'));
    } catch (err) {
        console.log(colors.red.bold('Build asset copy problem: ' + err));
    }
};

const backupIndexFile = (filename) => {
    fs.copyFile(
        destDirectoryPath + '/' + filename,
        destDirectoryPath + '/' + filename + '_bk',
        (err) => {
            if (err) {
                console.log(colors.red.bold('Index restore problem: ' + err));
            }
        },
    );
};

const restoreIndexFile = (filename) => {
    fs.copyFile(
        destDirectoryPath + '/' + filename + '_bk',
        destDirectoryPath + '/' + filename,
        (err) => {
            if (err) {
                console.log(colors.red.bold('Index restore problem: ' + err));
            }
        },
    );
    fs.unlink(destDirectoryPath + '/' + filename + '_bk', (err) => {
        if (err) {
            console.log(colors.red.bold('Backup delete problem: ' + err));
        }
    });
};

backupIndexFile('index.html');
copyAssets();
restoreIndexFile('index.html');
