/*
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

/* eslint-disable max-nested-callbacks */
/* eslint-disable max-depth */
/* jscs:disable jsDoc*/
define([
    'Magento_PageBuilder/js/content-type/text/preview',
    'Magento_PageBuilder/js/content-type',
    'Magento_PageBuilder/js/resource/babel/polyfill'
], function (Preview, ContentType) {
    'use strict';

    describe('Magento_PageBuilder/js/content-type/text/preview', function () {
        var preview;

        function ObservableUpdater() {}
        ObservableUpdater.prototype.update = function () {};

        beforeEach(function () {
            var contentType,
                config,
                observableUpdater;

            observableUpdater = new ObservableUpdater();
            config = {
                name: 'text',
                label: 'Text'
            };
            contentType = new ContentType(null, config);
            preview = new Preview(contentType, config, observableUpdater);
        });

        describe('Text component content change', function () {
            it('Should replace double quote with single quote if the directive is not in html attr', function () {
                var actual = '<p>' +
                    '<a title="Contact Us" href="{{config path="web/secure/base_url"}}contact">Contact Us</a>' +
                    '</p>',
                    expected = '<p>' +
                        '<a title="Contact Us" href="{{config path=\'web/secure/base_url\'}}contact">Contact Us</a>' +
                        '</p>';

                preview.contentType.dataStore.setState({
                    content: actual
                });
                expect(preview.contentType.dataStore.get('content')).toBe(expected);
            });
            it('Should not replace double quote with single quote if the directive is not in html attr', function () {
                var actual = '<p>Our website:</p><p>{{config path="web/secure/base_url"}}</p>',
                    expected = actual;

                preview.contentType.dataStore.setState({
                    content: actual
                });
                expect(preview.contentType.dataStore.get('content')).toBe(expected);
            });
        });
    });

    if (typeof Object.assign !== 'function') {
        // Must be writable: true, enumerable: false, configurable: true
        Object.defineProperty(Object, 'assign', {
            value: function assign(target) { // .length of function is 2
                var to,
                    index,
                    nextKey,
                    nextSource;

                if (target === null || target === undefined) {
                    throw new TypeError('Cannot convert undefined or null to object');
                }
                to = Object(target);

                for (index = 1; index < arguments.length; index++) {
                    nextSource = arguments[index];

                    if (nextSource !== null && nextSource !== undefined) {
                        for (nextKey in nextSource) {
                            // Avoid bugs when hasOwnProperty is shadowed
                            if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                                to[nextKey] = nextSource[nextKey];
                            }
                        }
                    }
                }

                return to;
            },
            writable: true,
            configurable: true
        });
    }
});
