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
            it('Should return false when empty on an image background', function () {
                expect(model.toDom('video_fallback_image', {
                    background_type: 'image',
                    video_fallback_image: []
                })).toBe(false);
            });

            it('Should return false when the value is missing', function () {
                expect(model.toDom('video_fallback_image', {
                    background_type: 'image'
                })).toBe(false);
            });

            it('Should return an empty string when empty on a video background', function () {
                expect(model.toDom('video_fallback_image', {
                    background_type: 'video',
                    video_fallback_image: []
                })).toBe('');
            });

            it('Should return a media directive on a video background', function () {
                expect(model.toDom('video_fallback_image', {
                    background_type: 'video',
                    video_fallback_image: [
                        {
                            url: 'http://example.com/media/fallback.jpg'
                        }
                    ]
                })).toBe('{{media url=fallback.jpg}}');
            });

            it('Should return a media directive on an image background', function () {
                expect(model.toDom('video_fallback_image', {
                    background_type: 'image',
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

            it('Should decode a media directive into an image object', function () {
                expect(model.fromDom('{{media url=fallback.jpg}}')[0].url)
                    .toBe('http://example.com/media/fallback.jpg');
            });
        });

        describe('round trip', function () {
            it('Should recover an empty value when the attribute was omitted', function () {
                expect(model.fromDom(model.toDom('video_fallback_image', {
                    background_type: 'image',
                    video_fallback_image: []
                }) || null)).toBe('');
            });

            it('Should preserve a fallback image saved with an image background', function () {
                expect(model.fromDom(model.toDom('video_fallback_image', {
                    background_type: 'image',
                    video_fallback_image: [
                        {
                            url: 'http://example.com/media/fallback.jpg'
                        }
                    ]
                }))[0].url).toBe('http://example.com/media/fallback.jpg');
            });
        });
    });
});
