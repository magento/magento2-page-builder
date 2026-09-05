/**
 * Copyright 2026 Adobe
 * All Rights Reserved.
 */

/* eslint-disable max-nested-callbacks */
define([
    'Magento_PageBuilder/js/converter/attribute/parallax-speed'
], function (ParallaxSpeed) {
    'use strict'; // eslint-disable-line strict

    describe('Magento_PageBuilder/js/converter/attribute/parallax-speed', function () {
        var model;

        beforeEach(function () {
            model = new ParallaxSpeed();
        });

        describe('toDom', function () {
            it('Should return false when parallax is disabled', function () {
                expect(model.toDom('parallax_speed', {
                    enable_parallax: '0',
                    parallax_speed: '0.5'
                })).toBe(false);
            });

            it('Should return false when parallax is not set', function () {
                expect(model.toDom('parallax_speed', {
                    parallax_speed: '0.5'
                })).toBe(false);
            });

            it('Should return the speed when parallax is enabled', function () {
                expect(model.toDom('parallax_speed', {
                    enable_parallax: '1',
                    parallax_speed: '2'
                })).toBe('2');
            });

            it('Should return false when parallax is enabled without a speed', function () {
                expect(model.toDom('parallax_speed', {
                    enable_parallax: '1'
                })).toBe(false);
            });
        });

        describe('fromDom', function () {
            it('Should return the form default when the attribute is absent', function () {
                expect(model.fromDom(null)).toBe('0.5');
                expect(model.fromDom(undefined)).toBe('0.5');
            });

            it('Should return the value when the attribute is present', function () {
                expect(model.fromDom('2')).toBe('2');
            });
        });

        describe('round trip', function () {
            it('Should fall back to the default when parallax is disabled', function () {
                expect(model.fromDom(model.toDom('parallax_speed', {
                    enable_parallax: '0',
                    parallax_speed: '0.5'
                }) || null)).toBe('0.5');
            });

            it('Should preserve the speed when parallax is enabled', function () {
                expect(model.fromDom(model.toDom('parallax_speed', {
                    enable_parallax: '1',
                    parallax_speed: '2'
                }))).toBe('2');
            });
        });
    });
});
