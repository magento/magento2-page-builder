/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

/* eslint-disable max-nested-callbacks */
define([
    'jquery',
    'Magento_PageBuilder/js/content-type/video/converter/attribute/videosrc'
], function ($, VideoSrc) {
    'use strict';

    describe('Magento_PageBuilder/js/content-type/video/converter/attribute/videosrc', function () {
        var model;

        beforeEach(function () {
            model = new VideoSrc();
        });

        describe('toDom', function () {
            it('Should remove non-youtube and preserve youtube tags in URL', function () {
                var data = {
                        video_source: 'https://www.youtube.com/embed/ishbTyLs6ps?rel=1&non-youtube-tag=value',
                        autoplay: 'false'
                    },
                    result = model.toDom('video_source', data);

                expect(result).toBe('https://www.youtube.com/embed/ishbTyLs6ps?rel=1');
            });
        });

        describe('toDom', function () {
            it('Should add autoplay and mute to URL if Autoplay enabled in UI', function () {
                var data = {
                        video_source: 'https://www.youtube.com/embed/ishbTyLs6ps?rel=1&controls=0',
                        autoplay: 'true'
                    },
                    result = model.toDom('video_source', data);

                expect(result).toBe('https://www.youtube.com/embed/ishbTyLs6ps?rel=1&controls=0&autoplay=1&mute=1');
            });
        });

        describe('toDom', function () {
            it('Should remove autoplay and mute from URL if Autoplay disabled in UI', function () {
                var data = {
                        video_source: 'https://www.youtube.com/embed/ishbTyLs6ps?rel=1&controls=0&autoplay=1&mute=1',
                        autoplay: 'false'
                    },
                    result = model.toDom('video_source', data);

                expect(result).toBe('https://www.youtube.com/embed/ishbTyLs6ps?rel=1&controls=0');
            });
        });

        describe('fromDom', function () {
            it('Should remove autoplay and mute from the URL as it is controlled via UI', function () {
                var result;

                result = model.fromDom('https://www.youtube.com/embed/ishbTyLs6ps?rel=1&controls=0&autoplay=1&mute=1');
                expect(result).toBe('https://www.youtube.com/embed/ishbTyLs6ps?rel=1&controls=0');

                result = model.fromDom('https://www.youtube.com/embed/ishbTyLs6ps?autoplay=1&mute=1');
                expect(result).toBe('https://www.youtube.com/embed/ishbTyLs6ps');
            });
        });
    });
});
