/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

/* eslint-disable max-nested-callbacks */
define([
    'jquery',
    'Magento_PageBuilder/js/content-type/text/preview'
], function ($, Preview) {
    'use strict';

    describe('Magento_PageBuilder/js/content-type/text/preview', function () {
        var model;

        beforeEach(function () {
            model = new Preview({dataStore: {subscribe: jasmine.createSpy()}}, {});
            model.element = $('<div contenteditable="true">This text can be edited.</div>')[0];
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
    });
});
