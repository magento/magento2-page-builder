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
        BackgroundImages,
        config = {
            attribute_name: 'background_images',
            desktop_image_variable: 'background_image',
            mobile_image_variable: 'mobile_image'
        };

    describe('Magento_PageBuilder/js/mass-converter/background-images', function () {
        var model;

        beforeEach(function (done) {
            injector.mock(mocks);
            injector.require([
                'Magento_PageBuilder/js/mass-converter/background-images'
            ], function (module) {
                BackgroundImages = module;
                model = new BackgroundImages();
                done();
            });
        });

        describe('toDom', function () {
            it('Should not set the attribute when no images are selected', function () {
                var data = model.toDom({
                    background_image: [],
                    mobile_image: []
                }, config);

                expect(data.background_images).toBeUndefined();
            });

            it('Should set the attribute when a desktop image is selected', function () {
                var data = model.toDom({
                    background_image: [
                        {
                            url: 'http://example.com/media/desktop.jpg'
                        }
                    ],
                    mobile_image: []
                }, config);

                expect(data.background_images).toBe('{\\"desktop_image\\":\\"{{media url=desktop.jpg}}\\"}');
            });
        });

        describe('fromDom', function () {
            it('Should remove the attribute key when the attribute is absent', function () {
                var data = model.fromDom({
                    background_images: null
                }, config);

                expect('background_images' in data).toBe(false);
            });

            it('Should remove the attribute key when the attribute is an empty object', function () {
                var data = model.fromDom({
                    background_images: '{}'
                }, config);

                expect('background_images' in data).toBe(false);
            });

            it('Should read the desktop image and remove the attribute key', function () {
                var data = model.fromDom({
                    background_images: '{\\"desktop_image\\":\\"{{media url=desktop.jpg}}\\"}'
                }, config);

                expect('background_images' in data).toBe(false);
                expect(data.background_image[0].url).toBe('http://example.com/media/desktop.jpg');
            });
        });

        describe('round trip', function () {
            it('Should produce no images when nothing is selected', function () {
                var data = model.fromDom(model.toDom({
                    background_image: [],
                    mobile_image: []
                }, config), config);

                expect('background_images' in data).toBe(false);
            });
        });
    });
});
