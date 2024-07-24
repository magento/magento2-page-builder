/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

/* eslint-disable max-nested-callbacks */
define([
    'jquery',
    'underscore',
    'Magento_PageBuilder/js/content-type/text/preview'
], function ($, _, Preview) {
    'use strict';

    describe('Magento_PageBuilder/js/content-type/text/preview', function () {
        var model,
            config;

        beforeEach(function () {
            config = {};
            model = new Preview({dataStore: {subscribe: jasmine.createSpy()}}, config);
            model.element = $('<div id="pb-text-content" contenteditable="true">This text can be edited.</div>')[0];
            $('body').append($(model.element));
        });
        afterEach(function () {
            $(model.element).remove();
            delete model.element;
        });
        describe('handleMouseDown()', function () {
            it('Should call activateEditor() if mouseup occurred outside the element', function () {
                model.activateEditor = jasmine.createSpy();
                $(model.element).on('mousedown', function (event) {
                    model.element.focus();
                    return model.handleMouseDown(model, event);
                });
                model.element.dispatchEvent(new MouseEvent('mousedown', {
                    view: window,
                    bubbles: true,
                    cancelable: true
                }));
                document.dispatchEvent(new MouseEvent('mouseup', {
                    view: window,
                    bubbles: true,
                    cancelable: true
                }));
                expect(model.activateEditor).toHaveBeenCalled();
            });
            it('Should not call activateEditor() if mouseup occurred inside the element', function () {
                model.activateEditor = jasmine.createSpy();
                $(model.element).on('mousedown', function (event) {
                    model.element.focus();
                    return model.handleMouseDown(model, event);
                });
                model.element.dispatchEvent(new MouseEvent('mousedown', {
                    view: window,
                    bubbles: true,
                    cancelable: true
                }));
                model.element.dispatchEvent(new MouseEvent('mouseup', {
                    view: window,
                    bubbles: true,
                    cancelable: true
                }));
                expect(model.activateEditor).not.toHaveBeenCalled();
            });
            it('Should not call activateEditor() if the editor is already activated', function () {
                model.activateEditor = jasmine.createSpy();
                model.wysiwyg = jasmine.createSpyObj(['getAdapter']);
                $(model.element).on('mousedown', function (event) {
                    model.element.focus();
                    return model.handleMouseDown(model, event);
                });
                model.element.dispatchEvent(new MouseEvent('mousedown', {
                    view: window,
                    bubbles: true,
                    cancelable: true
                }));
                document.dispatchEvent(new MouseEvent('mouseup', {
                    view: window,
                    bubbles: true,
                    cancelable: true
                }));
                expect(model.activateEditor).not.toHaveBeenCalled();
            });
            it('Should not call activateEditor() if the element has no focus', function () {
                model.activateEditor = jasmine.createSpy();
                $(model.element).on('mousedown', function (event) {
                    return model.handleMouseDown(model, event);
                });
                model.element.dispatchEvent(new MouseEvent('mousedown', {
                    view: window,
                    bubbles: true,
                    cancelable: true
                }));
                document.dispatchEvent(new MouseEvent('mouseup', {
                    view: window,
                    bubbles: true,
                    cancelable: true
                }));
                expect(model.activateEditor).not.toHaveBeenCalled();
            });
        });

        describe('initWysiwygFromClick()', function () {
            var originalDeferFn = _.defer,
                editor;

            beforeEach(function () {
                config.additional_data = {
                    wysiwygConfig: {
                        wysiwygConfigData: {
                            adapter: {
                                settings: {

                                }
                            }
                        }
                    }
                };
                editor = {
                    on: function (event, callback) {
                        $(model.element).on(event, callback);
                    },
                    dom: {
                        getRoot: jasmine.createSpy('getRoot').and.returnValue(model.element)
                    },
                    selection: {
                        select: jasmine.createSpy('select')
                    },
                    nodeChanged: jasmine.createSpy('nodeChanged')
                };
                _.defer = jasmine.createSpy('_.defer');
            });
            afterEach(function () {
                _.defer = originalDeferFn;
            });
            it('Should select image on mousedown', function () {
                var editorSettings = config.additional_data.wysiwygConfig.wysiwygConfigData.adapter.settings,
                    img = document.createElement('img');

                $(model.element).append(img);
                model.initWysiwygFromClick(true);
                expect(editorSettings.auto_focus).toEqual(model.element.id);
                expect(editorSettings.init_instance_callback).toBeInstanceOf(Function);
                editorSettings.init_instance_callback(editor);
                $(img).trigger('mousedown');
                expect(editor.selection.select).toHaveBeenCalledWith(img);
                expect(editor.nodeChanged).toHaveBeenCalled();
            });
            it('Should not select image if right button of the mouse is clicked', function () {
                var editorSettings = config.additional_data.wysiwygConfig.wysiwygConfigData.adapter.settings,
                    img = document.createElement('img');

                $(model.element).append(img);
                model.initWysiwygFromClick(true);
                expect(editorSettings.auto_focus).toEqual(model.element.id);
                expect(editorSettings.init_instance_callback).toBeInstanceOf(Function);
                editorSettings.init_instance_callback(editor);
                $(img).trigger($.Event('mousedown', {button: 2}));
                expect(editor.selection.select).not.toHaveBeenCalled();
                expect(editor.nodeChanged).not.toHaveBeenCalled();
            });
        });
    });
});
