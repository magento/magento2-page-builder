/**
 * - Ajax.js
 * Handles all Ajax communication between the app and the server
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
define(['jquery'], function (jQuery) {

    /**
     * Define wrapping methods for the Ajax functions of your choice, this is in place if the system, or another developer
     * needs to make changes to the Ajax components the system uses.
     *
     * @constructor
     */
    function Ajax() {

    }

    /**
     * Return the form key
     *
     * @returns {*}
     */
    Ajax.prototype.getFormKey = function () {
        return window.FORM_KEY;
    };

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
        parameters.form_key = this.getFormKey();
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
        parameters.form_key = this.getFormKey();
        dataType = dataType || 'json';
        jQuery.post(
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

    return Ajax;
});