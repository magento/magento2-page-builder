/**
 * Copyright 2026 Adobe
 * All Rights Reserved.
 */

/* eslint-disable max-nested-callbacks */
define([
    'Magento_PageBuilder/js/converter/attribute/video-background-setting'
], function (VideoBackgroundSetting) {
    'use strict'; // eslint-disable-line strict

    describe('Magento_PageBuilder/js/converter/attribute/video-background-setting', function () {
        var model;

        beforeEach(function () {
            model = new VideoBackgroundSetting();
        });

        describe('toDom', function () {
            it('Should return false when the background is an image', function () {
                expect(model.toDom('video_loop', {
                    background_type: 'image',
                    video_loop: 'true'
                })).toBe(false);
            });

            it('Should return false when the background type is not set', function () {
                expect(model.toDom('video_loop', {
                    video_loop: 'true'
                })).toBe(false);
            });

            it('Should return the value when the background is a video', function () {
                expect(model.toDom('video_loop', {
                    background_type: 'video',
                    video_loop: 'false'
                })).toBe('false');
            });

            it('Should cast a boolean value to a string', function () {
                expect(model.toDom('video_lazy_load', {
                    background_type: 'video',
                    video_lazy_load: true
                })).toBe('true');
            });
        });

        describe('fromDom', function () {
            it('Should return the form default when the attribute is absent', function () {
                expect(model.fromDom(null)).toBe('true');
                expect(model.fromDom(undefined)).toBe('true');
            });

            it('Should return the value when the attribute is present', function () {
                expect(model.fromDom('false')).toBe('false');
            });
        });

        describe('round trip', function () {
            it('Should fall back to the default for an image background', function () {
                expect(model.fromDom(model.toDom('video_play_only_visible', {
                    background_type: 'image',
                    video_play_only_visible: 'true'
                }) || null)).toBe('true');
            });

            it('Should preserve the value for a video background', function () {
                expect(model.fromDom(model.toDom('video_play_only_visible', {
                    background_type: 'video',
                    video_play_only_visible: 'false'
                }))).toBe('false');
            });
        });
    });
});
