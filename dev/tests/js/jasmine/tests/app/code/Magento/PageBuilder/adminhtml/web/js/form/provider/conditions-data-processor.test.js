/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

/* eslint-disable max-nested-callbacks */
define([
    'Magento_PageBuilder/js/form/provider/conditions-data-processor'
], function (processor) {
    'use strict';

    describe('Magento_PageBuilder/js/form/provider/conditions-data-processor', function () {
        it('Should delete and then normalize the data to the specified attribute', function () {
            var model = {
                'condition_option': 'condition',
                'parameters[myattr][foobar]': 123,
                'parameters[myattr][barfoo]': 123
            };

            processor(model, 'myattr');

            expect(model['parameters[myattr][foobar]']).toBe(undefined);
            expect(model['parameters[myattr][barfoo]']).toBe(undefined);
            expect(model.myattr).toBe('{"foobar":123,"barfoo":123}');
        });
        it('Should delete and then normalize the data to the specified deep-nested attribute', function () {
            var model = {
                'condition_option': 'condition',
                'parameters[myattr.foo.bar][foobar]': 123,
                'parameters[myattr.foo.bar][barfoo]': 123
            };

            processor(model, 'myattr.foo.bar');

            expect(model['parameters[myattr][foobar]']).toBe(undefined);
            expect(model['parameters[myattr][barfoo]']).toBe(undefined);
            expect(model.myattr.foo.bar).toBe('{"foobar":123,"barfoo":123}');
        });
    });
});
