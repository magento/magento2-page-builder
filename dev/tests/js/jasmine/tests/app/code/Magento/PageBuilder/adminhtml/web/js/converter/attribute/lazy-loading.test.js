/**
 * Copyright 2026 Adobe
 * All Rights Reserved.
 */

/* eslint-disable max-nested-callbacks */
define([
    'Magento_PageBuilder/js/converter/attribute/lazy-loading'
], function (LazyLoading) {
    'use strict'; // eslint-disable-line strict

    describe('Magento_PageBuilder/js/converter/attribute/lazy-loading', function () {
        var model;

        beforeEach(function () {
            model = new LazyLoading();
        });

        describe('fromDom', function () {
            it('Should return "1" when the attribute is set to lazy', function () {
                expect(model.fromDom('lazy')).toBe('1');
            });

            it('Should return "0" when the attribute is absent', function () {
                expect(model.fromDom(null)).toBe('0');
                expect(model.fromDom(undefined)).toBe('0');
                expect(model.fromDom('')).toBe('0');
            });

            it('Should return "0" for any other attribute value', function () {
                expect(model.fromDom('eager')).toBe('0');
                expect(model.fromDom('auto')).toBe('0');
            });
        });

        describe('toDom', function () {
            it('Should return "lazy" when the option is enabled', function () {
                expect(model.toDom('lazy_loading', {
                    lazy_loading: '1'
                })).toBe('lazy');
                expect(model.toDom('lazy_loading', {
                    lazy_loading: 1
                })).toBe('lazy');
                expect(model.toDom('lazy_loading', {
                    lazy_loading: true
                })).toBe('lazy');
            });

            it('Should return false when the option is disabled', function () {
                expect(model.toDom('lazy_loading', {
                    lazy_loading: '0'
                })).toBe(false);
                expect(model.toDom('lazy_loading', {
                    lazy_loading: 0
                })).toBe(false);
                expect(model.toDom('lazy_loading', {
                    lazy_loading: false
                })).toBe(false);
            });

            it('Should return false when the option is missing', function () {
                expect(model.toDom('lazy_loading', {})).toBe(false);
            });
        });
    });
});
