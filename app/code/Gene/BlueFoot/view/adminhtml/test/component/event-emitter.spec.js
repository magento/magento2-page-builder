/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
/**
 * JS Unit Test for hook.js
 */
define([
    'bluefoot/event-emitter'
], function (EventEmitter) {
    'use strict';

    /**
     * Test the hook component of BlueFoot
     */
    /*eslint-disable */
    describe('Gene_BlueFoot/js/component/event-emitter', function () {
        var eventEmitter;

        beforeEach(function () {
            eventEmitter = new EventEmitter();
        });

        it('can observe & emit an event', function (done) {
            var testData = {'test': 1};
            eventEmitter.on('testEvent', function (event, params) {
                expect(params).toEqual(testData);
                done();
            });
            eventEmitter.emit('testEvent', testData);
        });

        it('wont fire removed listener', function () {
            var testEventFn = jasmine.createSpy();

            eventEmitter.on('testEvent', testEventFn);
            eventEmitter.off('testEvent');
            eventEmitter.emit('testEvent');
            expect(testEventFn).not.toHaveBeenCalled();
        });

        it('once() will only fire event once', function () {
            var testEventFn = jasmine.createSpy();

            eventEmitter.once('testEvent', testEventFn);
            eventEmitter.emit('testEvent');
            eventEmitter.emit('testEvent');
            expect(testEventFn).toHaveBeenCalledTimes(1);
        });
    });
});