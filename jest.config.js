const jestMagento2 = require('jest-magento2');
const path = require('path');

const buildDir = path.join(__dirname, 'dev/build/dev');

module.exports = jestMagento2.configure(
    {
        testMatch: [
            "<rootDir>/dev/tests/js/**/*.test.js"
        ],
        modulePaths: [
            "<rootDir>/app/code/Gene/BlueFoot/view/adminhtml/web/ts",
            "<rootDir>/dev/tests/js/unit/stubs"
        ],
        moduleFileExtensions: ["js", "jsx", "json", "ts", "tsx"],
        transform: {
            "^.+\\.ts$": "<rootDir>/jest.transform.js"
        }
    },
    {
        rootDir: __dirname,
        buildDir: buildDir
    }
);
