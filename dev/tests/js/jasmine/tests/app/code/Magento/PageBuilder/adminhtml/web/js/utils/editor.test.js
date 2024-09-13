/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

/* eslint-disable max-nested-callbacks */
define([
    'Magento_PageBuilder/js/utils/editor',
    'jquery',
    'Magento_PageBuilder/js/config'
], function (utils, $, Config) {
    'use strict';

    describe('Magento_PageBuilder/js/utils/editor.js', function () {
        describe('lockImageSize', function () {
            it('Should not change the defined image sizes', function () {
                var image = document.createElement('img'),
                    element = document.createElement('div');

                image.setAttribute('width', '100%');
                $(element).append(image);

                utils.lockImageSize(element);
                expect(image.style.width).toEqual('100%');
            });
        });

        describe('unlockImageSize', function () {
            it('Should unlock locked images sizes only', function () {
                var image = document.createElement('img'),
                    element = document.createElement('div');

                $(image).css({
                    width: '100%',
                    height: '100%'
                });
                $(image).attr('data-height-locked', 'true');
                $(element).append(image);

                utils.unlockImageSize(element);
                expect(image.style.width).toEqual('100%');
                expect(image.style.height).toEqual('');
            });
        });

        describe('removeReservedHtmlAttributes', function () {
            it('Should remove reserve html attributes from a content', function () {
                var content = '<div id="x" data-t1="1" data-t2="2"><span id="y" data-t2="2" data-t3="3"></span></div>';

                Config.setConfig({
                    stage_config: {
                        reserved_html_attributes: {
                            'data-t2': 'data-t2',
                            'data-t3': 'data-t3'
                        }
                    }
                });
                content = utils.removeReservedHtmlAttributes(content);
                expect(content).toEqual('<div id="x" data-t1="1"><span id="y"></span></div>');
            });
        });

        describe('moveToBookmark', function () {
            var originalTinymce = window.tinymce;

            beforeEach(function () {
                window.tinymce = {
                    activeEditor: {
                        selection: {
                            moveToBookmark: jasmine.createSpy('moveToBookmark')
                        },
                        nodeChanged: jasmine.createSpy('nodeChanged')
                    }
                };
            });
            afterEach(function () {
                originalTinymce && (window.tinymce = originalTinymce);
            });
            it('Should call activeEditor.selection.moveToBookmark and activeEditor.nodeChanged', function () {
                var bookmark = {id: 'test'};

                utils.moveToBookmark(bookmark);
                expect(utils.getActiveEditor().selection.moveToBookmark).toHaveBeenCalledWith(bookmark);
                expect(utils.getActiveEditor().nodeChanged).toHaveBeenCalled();
            });
        });
    });
});
