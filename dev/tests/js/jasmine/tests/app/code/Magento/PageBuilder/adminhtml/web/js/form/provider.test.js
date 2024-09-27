/**
 * Copyright 2024 Adobe
 * All Rights Reserved.
 */

define([
    'Magento_PageBuilder/js/form/provider',
    'Magento_PageBuilder/js/events',
    'jquery'
], function (Provider, events, $) {
    'use strict';

    describe('Magento_PageBuilder/js/form/provider', function () {
        let instance;

        beforeEach(function () {
            instance = new Provider();
            spyOn(instance, 'get').and.returnValue({key: 'value'});
            spyOn(events, 'trigger');
        });

        it('should initialize the client properly', function () {
            let result = instance.initClient();
            expect(result).toBe(instance);
        });

        it('should trigger the saveAfter event with correct data', function () {
            instance.id = 'testId';
            instance.save();

            expect(events.trigger).toHaveBeenCalledWith('form:testId:saveAfter', {key: 'value'});
        });

        it('should trigger form saveAfter event and refresh slick if infinite is true', function () {
            const data = { key: 'value' };
            instance.set('data', data);

            let slickMock = {
                options: { infinite: true, rows: 1},
                getSlick: function () {
                    return { options: this.options };
                }
            };

            let slickListMock = {
                length: 1,
                parent: jasmine.createSpy('parent').and.returnValue({
                    slick: jasmine.createSpy('slick').and.returnValue(slickMock)
                })
            };

            spyOn($.fn, 'find').and.returnValue(slickListMock);

            const result = instance.save();

            expect(events.trigger).toHaveBeenCalledWith('form:' + instance.id + ':saveAfter', data);
            expect($.fn.find).toHaveBeenCalledWith('.slick-list.draggable');
            expect($.fn.find().parent).toHaveBeenCalled();
            expect($.fn.find().parent().slick).toHaveBeenCalledWith('refresh');
            expect(result).toBe(instance);
        });

        it('should not refresh slick if infinite is false', function () {
            const data = { key: 'value' };
            instance.set('data', data);

            let slickMockFalse = {
                options: { infinite: false },
                getSlick: function () {
                    return { options: this.options };
                }
            };

            spyOn($.fn, 'find').and.returnValue(slickMockFalse);
            $.fn.find.and.returnValue({
                length: 1,
                parent: jasmine.createSpy('parent').and.returnValue({
                    slick: jasmine.createSpy('slick').and.returnValue(slickMockFalse)
                })
            });

            const result = instance.save();

            expect(events.trigger).toHaveBeenCalledWith('form:' + instance.id + ':saveAfter', data);
            expect($('.slick-list.draggable').parent().slick.calls.count()).toBe(1);
            expect($.fn.find).toHaveBeenCalledWith('.slick-list.draggable');
            expect($.fn.find().parent).toHaveBeenCalled();
            expect($.fn.find().parent().slick).toHaveBeenCalled();
            expect($.fn.find().parent().slick).not.toHaveBeenCalledWith('refresh');
            expect(result).toBe(instance);
        });
    });
});
