// Karma configuration
// Generated on Wed Feb 08 2017 11:58:29 GMT-0600 (CST)
// Updated on Wed Feb 22 2017

module.exports = function(config) {
    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '../',


        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['jasmine', 'requirejs'],


        // list of files / patterns to load in the browser
        files: [
            'requirejs-config.js',
            'test/test-main.js',
            { pattern: 'web/js/**/*.js', included: false },
            { pattern: 'test/**/*.js', included: false }
        ],


        // list of files to exclude
        exclude: [
            "test/karma.conf.js"
        ],


        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: process.env.KARMA_DEBUG ? {} : {
                'web/js/**/*.js': ['coverage']
            },


        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: process.env.KARMA_DEBUG ? ['mocha'] : ['coverage', 'mocha'],

        coverageReporter: {
            dir: 'coverage/',
            reporters: [
                { type: 'text-summary' },
                { type: 'html', subdir: '.' }
            ]
        },

        mochaReporter: {
            maxLogLines: 3
        },

        // web server port
        port: 9876,


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,


        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['PhantomJS'],


        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: true,

        // Concurrency level
        // how many browser should be started simultaneous
        concurrency: Infinity
    })
}

