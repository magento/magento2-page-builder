/************************************************************************
 *
 * Copyright 2024 Adobe
 * All Rights Reserved.
 *
 * NOTICE: All information contained herein is, and remains
 * the property of Adobe and its suppliers, if any. The intellectual
 * and technical concepts contained herein are proprietary to Adobe
 * and its suppliers and are protected by all applicable intellectual
 * property laws, including trade secret and copyright laws.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Adobe.
 * ************************************************************************
 */

/* eslint-disable max-nested-callbacks */
define([
    'Magento_PageBuilder/js/form/element/html',
], function (HtmlUiElement) {
    'use strict';

    describe('Magento_PageBuilder/js/form/element/html', function () {
        var model,
            htmlContainer,
            formId = 'form-' + Date.now();

        function addNewElement(name, value) {
            var newElement = document.createElement('li'),
                inputElement = document.createElement('input');

            inputElement.setAttribute('name', name);
            inputElement.setAttribute('type', 'hidden');
            inputElement.setAttribute('data-form-part', formId);
            inputElement.value = value;
            newElement.appendChild(inputElement);
            htmlContainer.appendChild(newElement);
            model.elements.push(inputElement);
            return inputElement;
        }

        beforeEach(function () {
            model = new HtmlUiElement({inputSelector: '[data-form-part=' + formId + ']'});
            htmlContainer = document.createElement('ul');
            document.body.appendChild(htmlContainer);
        });

        afterEach(function () {
            document.body.removeChild(htmlContainer);
            model = null;
            htmlContainer = null;
        });

        describe('"updateValue" method', function () {
            it('Should collect all inputs values', function () {
                var param1, param2;

                model.updateValue();
                expect(model.value()).toEqual({});
                param1 = addNewElement('param1', 'value1');
                model.updateValue();
                expect(model.value()).toEqual({param1: 'value1'});
                param2 = addNewElement('param2', 'value2');
                model.updateValue();
                expect(model.value()).toEqual({param1: 'value1', param2: 'value2'});
                param2.value = 'value22';
                model.updateValue();
                expect(model.value()).toEqual({param1: 'value1', param2: 'value22'});
                param1.remove();
                model.updateValue();
                expect(model.value()).toEqual({param2: 'value22'});
            });
        });
    });
});
