/**
 *
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

/* eslint-disable max-nested-callbacks */
define([
    'jquery',
    'Magento_PageBuilder/js/events',
    'squire'
], function ($, events, Squire) {
    'use strict';

    var form,
        PageBuilderFactoryMock,
        injector = new Squire();

    function getPageBuilderFactoryMock() {
        var _proto,
            PageBuilderMock = function () {
                this.id = 'pagebuilder_instance_id';
            };

        _proto = PageBuilderMock.prototype;
        _proto.isFullScreen = jasmine.createSpy().and.returnValue(false);

        return PageBuilderMock;
    }

    beforeEach(function (done) {
        PageBuilderFactoryMock = getPageBuilderFactoryMock();
        injector.mock({
            'jquery': $,
            'Magento_PageBuilder/js/events': events
        });
        injector.require(['Magento_PageBuilder/js/form/form-mixin'], function (mixin) {
            form = mixin({
                _super: jasmine.createSpy(),
                source: {
                    set: function (name, value) {
                        this[name] = value;
                    },
                    get: function (name) {
                        return this[name];
                    }
                },
                extend: function (child) {
                    return $.extend(this, child);
                },
                ns: 'test_form_namespace'
            });
            done();
        });
    });

    afterEach(function () {
        try {
            injector.clean();
            injector.remove();
        } catch (e) {
        }
    });

    describe('Magento_PageBuilder/js/form/form-mixin', function () {
        describe('initialize', function () {
            beforeEach(function () {
                form.initialize();
                expect(form._super).toHaveBeenCalled();
            });
            it('Should not register pagebuilder instances from different namespace', function () {
                var pageBuilderInstance = new PageBuilderFactoryMock();

                events.trigger('pagebuilder:register', {instance: pageBuilderInstance, ns: 'different_namespace'});
                expect(form.source.get('pageBuilderInstances')).toEqual([]);
            });
            it('Should not register already registered pagebuilder instance', function () {
                var pageBuilderInstance = new PageBuilderFactoryMock();

                form.source.set('pageBuilderInstances', [pageBuilderInstance]);
                events.trigger('pagebuilder:register', {instance: pageBuilderInstance, ns: 'test_form_namespace'});
                expect(form.source.get('pageBuilderInstances')).toEqual([pageBuilderInstance]);
            });
            it('Should register pagebuilder instances within the form namespace', function () {
                var pageBuilderInstance = new PageBuilderFactoryMock();

                expect(form.source.get('pageBuilderInstances')).toEqual([]);
                events.trigger('pagebuilder:register', {instance: pageBuilderInstance, ns: 'test_form_namespace'});
                expect(form.source.get('pageBuilderInstances')).toEqual([pageBuilderInstance]);
            });
        });
        describe('save', function () {
            it('Should save immediately if no pagebuilder instances are registered', function () {
                form.save();
                expect(form._super).toHaveBeenCalled();
            });
            it('Should wait until pagebuilder instances locks are released before save', function () {
                var pageBuilderInstance = new PageBuilderFactoryMock(),
                    lock = $.Deferred();

                pageBuilderInstance.stage = {renderingLocks: [lock]};
                form.source.set('pageBuilderInstances', [pageBuilderInstance]);
                form.save();

                expect(form._super).not.toHaveBeenCalled();
            });
            it('Should save when all pagebuilder instances locks are released', function (done) {
                var pageBuilderInstance = new PageBuilderFactoryMock(),
                    lock = $.Deferred();

                pageBuilderInstance.stage = {renderingLocks: [lock]};
                form.source.set('pageBuilderInstances', [pageBuilderInstance]);
                form.save();
                lock.resolve();
                setTimeout(function () {
                    expect(form._super).toHaveBeenCalled();
                    done();
                }, 100);
            });
        });
    });
});
