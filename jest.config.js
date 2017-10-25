const jestMagento2 = require('jest-magento2');
const path = require('path');

const buildDir = path.join(__dirname, 'dev/build/dev');

const jestConfig = jestMagento2.configure(
    {
        testMatch: [
            "<rootDir>/dev/tests/js/**/*.test.js"
        ],
        modulePaths: [
            "<rootDir>/dev/tests/js/fakes",
            "<rootDir>/dev/tests/js/wrapper",
            "<rootDir>/app/code/Gene/BlueFoot/view/adminhtml/ts",
            "<rootDir>/node_modules"
        ],
        moduleFileExtensions: ["ts", "js", "json"],
        transform: {
            "^.+\\.ts$": "<rootDir>/jest.transform.js",
            "^.+\\.html": "<rootDir>/jest.transform-html.js"
        },
        testEnvironment: "jsdom-latest"
    },
    {
        rootDir: __dirname,
        buildDir: buildDir,
        pathMapping: {
            Gene_BlueFoot: path.join(__dirname, 'app/code/Gene/BlueFoot/view/adminhtml/ts')
        }
    }
);

module.exports = Object.assign(jestConfig);
