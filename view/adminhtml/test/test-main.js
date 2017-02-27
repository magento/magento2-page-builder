var allTestFiles = [];
var srcPaths = {
    'jquery': 'test/lib/jquery',
    'bluefoot/jquery': 'test/lib/jquery',
    'bluefoot/utils/ajax': 'test/mock/ajax',
    'bluefoot/utils/persistence': 'test/mock/persistence',
    'bluefoot/cms-config': 'test/data/cms-config'
};
var TEST_REGEXP = /(spec|test)\.js$/i
var SRC_REGEXP = /^\/base\/web\//

// Get a list of all the test files to include
Object.keys(window.__karma__.files).forEach(function (file) {
    if (SRC_REGEXP.test(file)) {
        // get first subdirectory to establish all future path mappings
        var basedir = file.replace(SRC_REGEXP, '').split('/')[0];
        srcPaths[basedir] = basedir;
    } else if (TEST_REGEXP.test(file)) {
        // Normalize paths to RequireJS module names.
        // If you require sub-dependencies of test files to be loaded as-is (requiring file extension)
        // then do not normalize the paths
        var normalizedTestModule = file.replace(/^\/base\/|\.js$/g, '')
        allTestFiles.push(normalizedTestModule)
    }
});

require.config({
    // Karma serves files under /base, which is the basePath from your config file
    baseUrl: '/base',

    // remap paths so that file can use the same module path as in M2
    paths: srcPaths,

    // dynamically load all test files
    deps: allTestFiles,

    // we have to kickoff jasmine, as it is asynchronous
    callback: window.__karma__.start
})
