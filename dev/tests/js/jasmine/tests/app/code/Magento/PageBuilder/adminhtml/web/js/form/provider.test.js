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
            instance = new Provider({
                id: 'test-form'
            });
            spyOn(events, 'trigger');

            instance.set('data', { key: 'value' });
        });

        it('should trigger save event after save is called', function () {
            instance.save();
            expect(events.trigger).toHaveBeenCalledWith('form:' + instance.id + ':saveAfter', instance.get('data'));
        });

        it('should trigger form saveAfter event and refresh slick if infinite is true', function () {
            const slickMock = {
                options: { infinite: true, rows: 1},
                getSlick: function () {
                    return { options: this.options };
                }
            };

            const slickListMock = {
                length: 1,
                parent: jasmine.createSpy('parent').and.returnValue({
                    slick: jasmine.createSpy('slick').and.returnValue(slickMock)
                })
            };

            spyOn($.fn, 'find').and.returnValue(slickListMock);

            const result = instance.save();

            expect(events.trigger).toHaveBeenCalledWith('form:' + instance.id + ':saveAfter', instance.get('data'));
            expect($.fn.find).toHaveBeenCalledWith('.slick-list.draggable');
            expect($.fn.find().parent).toHaveBeenCalled();
            expect($.fn.find().parent().slick).toHaveBeenCalledWith('refresh');
            expect(result).toBe(instance);
        });

        it('should not refresh slick if infinite is false', function () {
            const slickMockFalse = {
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

            expect(events.trigger).toHaveBeenCalledWith('form:' + instance.id + ':saveAfter', instance.get('data'));
            expect($('.slick-list.draggable').parent().slick.calls.count()).toBe(1);
            expect($.fn.find).toHaveBeenCalledWith('.slick-list.draggable');
            expect($.fn.find().parent).toHaveBeenCalled();
            expect($.fn.find().parent().slick).toHaveBeenCalled();
            expect($.fn.find().parent().slick).not.toHaveBeenCalledWith('refresh');
            expect(result).toBe(instance);
        });
    });
});
