define(['test/data/mock-requests'], function (requests) {

    /**
     * Define wrapping methods for the Ajax functions of your choice, this is in place if the system, or another developer
     * needs to make changes to the Ajax components the system uses.
     *
     * @constructor
     */
    function Ajax() {

    }

    /**
     * Perform a GET request to the server
     *
     * @param url
     * @param parameters
     * @param successCallback
     * @param doneCallback
     * @param failedCallback
     * @param dataType
     */
    Ajax.prototype.get = function (url, parameters, successCallback, doneCallback, failedCallback, dataType) {
        parameters = parameters || {};
        parameters.form_key = InitConfig.form_key;
        dataType = dataType || 'json';
        jQuery.get(
            url,
            parameters,
            function (data) {
                if (typeof successCallback === 'function') {
                    successCallback(data);
                } else {
                    console.error('successCallback is not a function.');
                }
            },
            dataType
        ).done(function () {
            if (typeof doneCallback === 'function') {
                doneCallback();
            }
        }).fail(function () {
            if (typeof failedCallback === 'function') {
                failedCallback();
            }
        });
    };

    /**
     * Perform a POST request to the server
     *
     * @param url
     * @param parameters
     * @param successCallback
     * @param doneCallback
     * @param failedCallback
     * @param dataType
     */
    Ajax.prototype.post = function (url, parameters, successCallback, doneCallback, failedCallback, dataType) {
        parameters = parameters || {};
        dataType = dataType || 'json';

        // Check we have a mock request for call
        if (typeof requests[url] === 'object') {
            setTimeout(function () {
                if (requests[url].success) {
                    if (typeof successCallback === 'function') {
                        var response = requests[url].responseText;
                        if (dataType == 'json') {
                            response = JSON.parse(response);
                        }
                        successCallback(response);
                    }
                } else {
                    if (typeof failedCallback === 'function') {
                        failedCallback();
                    }
                }
                if (typeof doneCallback === 'function') {
                    doneCallback();
                }
            }, 0);
        } else {
            throw new Error('No mock request for ' + url);
        }
    };

    return Ajax;
});