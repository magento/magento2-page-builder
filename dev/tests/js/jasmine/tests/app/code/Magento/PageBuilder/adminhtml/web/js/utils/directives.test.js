/**
 * Copyright 2025 Adobe
 * All Rights Reserved.
 */

/* eslint-disable max-nested-callbacks */
define([
    'Magento_PageBuilder/js/config',
    'Magento_PageBuilder/js/utils/directives'
], function (config, directives) {
    'use strict';

    describe('Magento_PageBuilder/js/utils/directives convertMediaUrlsToDirectives', function () {
        var mediaBase;

        beforeEach(function () {
            mediaBase = 'http://m.example.com/pub/media/';
            spyOn(config, 'getConfig').and.callFake(function (key) {
                if (key === 'media_url') {
                    return mediaBase;
                }

                return null;
            });
        });

        it('Replaces img src under media_url with media directive including renditions path', function () {
            var html = '<p><img src="http://m.example.com/pub/media/.renditions/wysiwyg/neko.png" alt="n"/></p>',
                out = directives.convertMediaUrlsToDirectives(html);

            expect(out).toContain('{{media url=.renditions/wysiwyg/neko.png}}');
            expect(out).not.toContain('http://m.example.com');
        });

        it('Does not change external image URLs', function () {
            var html = '<img src="https://cdn.example.com/img.png"/>',
                out = directives.convertMediaUrlsToDirectives(html);

            expect(out).toContain('https://cdn.example.com/img.png');
        });

        it('Returns empty string for empty input', function () {
            expect(directives.convertMediaUrlsToDirectives('')).toBe('');
        });

        it('Leaves img src that is already a directive unchanged', function () {
            var html = '<img src="{{media url=wysiwyg/a.png}}"/>',
                out = directives.convertMediaUrlsToDirectives(html);

            expect(out).toContain('{{media url=wysiwyg/a.png}}');
        });

        it('Leaves data URI src unchanged', function () {
            var html = '<img src="data:image/png;base64,abc"/>',
                out = directives.convertMediaUrlsToDirectives(html);

            expect(out).toContain('data:image/png;base64,abc');
        });

        it('Returns original html when media_url is not configured', function () {
            config.getConfig.and.callFake(function () {
                return null;
            });
            var html = '<img src="http://m.example.com/pub/media/x.png"/>',
                out = directives.convertMediaUrlsToDirectives(html);

            expect(out).toContain('http://m.example.com/pub/media/x.png');
        });

        it('Matches path-only media_url against full URL path', function () {
            mediaBase = '/pub/media/';
            var html = '<img src="http://m.example.com/pub/media/wysiwyg/b.png"/>',
                out = directives.convertMediaUrlsToDirectives(html);

            expect(out).toContain('{{media url=wysiwyg/b.png}}');
        });
    });
});
