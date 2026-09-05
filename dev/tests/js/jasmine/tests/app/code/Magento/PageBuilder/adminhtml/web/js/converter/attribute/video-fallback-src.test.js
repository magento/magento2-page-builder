/**
 * Copyright 2026 Adobe
 * All Rights Reserved.
 */

/* eslint-disable max-nested-callbacks */
define([
    'squire'
], function (Squire) {
    'use strict'; // eslint-disable-line strict

    var injector = new Squire(),
        mocks = {
            'Magento_PageBuilder/js/config': {
                getConfig: function () {
                    return 'http://example.com/media/';
                }
            }
        },
        VideoFallbackSrc;

    describe('Magento_PageBuilder/js/converter/attribute/video-fallback-src', function () {
        var model;

        beforeEach(function (done) {
            injector.mock(mocks);
            injector.require([
                'Magento_PageBuilder/js/converter/attribute/video-fallback-src'
            ], function (module) {
                VideoFallbackSrc = module;
                model = new VideoFallbackSrc();
                done();
            });
        });

        describe('toDom', function () {
            it('Should return false when the background is an image', function () {
                expect(model.toDom('video_fallback_image', {
                    background_type: 'image',
                    video_fallback_image: []
                })).toBe(false);
            });

            it('Should return false when the background type is not set', function () {
                expect(model.toDom('video_fallback_image', {
                    video_fallback_image: []
                })).toBe(false);
            });

            it('Should return an empty string for a video background without a fallback image', function () {
                expect(model.toDom('video_fallback_image', {
                    background_type: 'video',
                    video_fallback_image: []
                })).toBe('');
            });

            it('Should return a media directive for a video background with a fallback image', function () {
                expect(model.toDom('video_fallback_image', {
                    background_type: 'video',
                    video_fallback_image: [
                        {
                            url: 'http://example.com/media/fallback.jpg'
                        }
                    ]
                })).toBe('{{media url=fallback.jpg}}');
            });
        });

        describe('fromDom', function () {
            it('Should return an empty string when the attribute is absent', function () {
                expect(model.fromDom(null)).toBe('');
                expect(model.fromDom(undefined)).toBe('');
                expect(model.fromDom('')).toBe('');
            });
        });

        describe('round trip', function () {
            it('Should read the same value for an image background as an emitted empty attribute', function () {
                expect(model.fromDom(model.toDom('video_fallback_image', {
                    background_type: 'image',
                    video_fallback_image: []
                }) || null)).toBe('');
            });
        });
    });
});
