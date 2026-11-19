/**
 * Copyright 2026 Adobe
 * All Rights Reserved.
 */

/* eslint-disable max-nested-callbacks */
define([
    'Magento_PageBuilder/js/converter/attribute/enable-parallax'
], function (EnableParallax) {
    'use strict'; // eslint-disable-line strict

    describe('Magento_PageBuilder/js/converter/attribute/enable-parallax', function () {
        var model;

        beforeEach(function () {
            model = new EnableParallax();
        });

        describe('toDom', function () {
            it('Should return false when parallax is disabled', function () {
                expect(model.toDom('enable_parallax', {
                    enable_parallax: '0'
                })).toBe(false);
            });

            it('Should return false when the value is missing', function () {
                expect(model.toDom('enable_parallax', {})).toBe(false);
            });

            it('Should return the value when parallax is enabled', function () {
                expect(model.toDom('enable_parallax', {
                    enable_parallax: '1'
                })).toBe('1');
            });

            it('Should cast a numeric value to a string', function () {
                expect(model.toDom('enable_parallax', {
                    enable_parallax: 1
                })).toBe('1');
            });
        });

        describe('fromDom', function () {
            it('Should return the form default when the attribute is absent', function () {
                expect(model.fromDom(null)).toBe('0');
                expect(model.fromDom(undefined)).toBe('0');
            });

            it('Should return the value when the attribute is present', function () {
                expect(model.fromDom('1')).toBe('1');
            });
        });

        describe('round trip', function () {
            it('Should preserve the disabled state', function () {
                expect(model.fromDom(model.toDom('enable_parallax', {
                    enable_parallax: '0'
                }) || null)).toBe('0');
            });

            it('Should preserve the enabled state', function () {
                expect(model.fromDom(model.toDom('enable_parallax', {
                    enable_parallax: '1'
                }))).toBe('1');
            });
        });
    });
});
