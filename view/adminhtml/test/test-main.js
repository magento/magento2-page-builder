var allTestFiles = [];
var pathOverrides = {
    'jquery': 'test/lib/jquery',
    'underscore': 'test/lib/underscore',
    'ko': 'test/lib/knockout',
    'es6-collections': 'test/lib/es6-collections',
    'uiRegistry': 'test/lib/registry',
    'mageUtils': 'test/lib/stub-mageUtils',
    'mage/translate': 'test/lib/stub-translate',
    'bluefoot/jquery': 'test/lib/jquery',
    'bluefoot/utils/ajax': 'test/mock/ajax',
    'bluefoot/utils/persistence': 'test/mock/persistence',
    'bluefoot/utils/array': 'web/js/utils/array'
};
var TEST_REGEXP = /(spec|test)\.js$/i
var SRC_REGEXP = /^\/base\/web\//

// Get a list of all the test files to include
Object.keys(window.__karma__.files).forEach(function (file) {
    if (SRC_REGEXP.test(file)) {
        // get first subdirectory to establish all future path mappings
        var basedir = file.replace(SRC_REGEXP, '').split('/')[0];
        pathOverrides[basedir] = basedir;
    } else if (TEST_REGEXP.test(file)) {
        // Normalize paths to RequireJS module names.
        // If you require sub-dependencies of test files to be loaded as-is (requiring file extension)
        // then do not normalize the paths
        var normalizedTestModule = file.replace(/^\/base\/|\.js$/g, '')
        allTestFiles.push(normalizedTestModule)
    }
});

// Object.assign shim for old browsers
var assign = Object.assign || function (target, source) {
    for (var key in source) {
        if (source.hasOwnProperty(key)) {
            target[key] = source[key];
        }
    }
    return target;
};

// reuse requirejs-config values included above this
// but (cheaply) replace the root module path with the test server path
var testConfig = JSON.parse(
    JSON.stringify(config)
        .replace(/Gene_BlueFoot/g, 'web')
);

require.config({
    // Karma serves files under /base, which is the basePath from your config file
    baseUrl: '/base',

    // remap paths so that file can use the same module path as in M2
    paths: assign(testConfig.paths, pathOverrides),

    // dynamically load all test files
    deps: allTestFiles,

    // we have to kickoff jasmine, as it is asynchronous
    callback: window.__karma__.start
});
