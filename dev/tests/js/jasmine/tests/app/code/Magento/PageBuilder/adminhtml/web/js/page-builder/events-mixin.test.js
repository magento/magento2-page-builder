/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

/* eslint-disable max-nested-callbacks */
define([
    'squire'
], function (Squire) {
    'use strict';

    var injector = new Squire(),
        eventObject = {
            field: 'value'
        },
        mocks = {
            'Magento_PageBuilderAdminAnalytics/js/page-builder/event-builder': {
                build: jasmine.createSpy().and.returnValue(eventObject)
            }
        },
        mixin,
        uiEvents,
        empty = {},
        origSatellite = window._satellite;

    beforeEach(function (done) {
        injector.mock(mocks);
        injector.require([
            'Magento_PageBuilderAdminAnalytics/js/page-builder/events-mixin',
            'uiEvents'
        ], function (Mixin, UiEvents) {
            mixin = Mixin;
            uiEvents = UiEvents;
            done();
        });
        window.digitalData = {
            event: empty
        };
        window._satellite = {
            track: jasmine.createSpy()
        };
    });

    afterEach(function () {
        try {
            injector.clean();
            injector.remove();
            window._satellite = origSatellite;
        } catch (e) {
        }
    });

    describe('Magento_PageBuilderAdminAnalytics/js/page-builder/events-mixin', function () {
        it('Check event is pushed to array', function (done) {
            mixin(uiEvents).trigger('name', 'arg');
            expect(window.digitalData.event).toBe(empty);
            window.digitalData.event = [];
            setTimeout(function () {
                expect(window.digitalData.event).toEqual([eventObject]);
                done();
            }, 1000);
        });
    });
});
