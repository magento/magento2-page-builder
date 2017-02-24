/**
 * JS Unit Test for hook.js
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
define([
    'web/js/component/config'
], function (Config) {

    describe("Gene_BlueFoot/js/component/core/config", function () {

        // Functions that should exist in the class
        var shouldExistFn = [
            'setInitConfig',
            'getInitConfig',
            'loadEntities',
            'getEntity',
            'getContentTypeConfig',
            'getConfig',
            'getValue',
            'deleteValue',
            'mergeValues',
            'updateTemplateValue',
            'getPluginConfig',
            'getAllFields',
            'getField',
            'getFormKey',
            'resetConfig',
            'getStoreId',
            'addForm',
            'loadForm',
            'invalidateLocalStorage',
            'getColumnDefinitionByClassName',
            'getColumnDefinitionByBreakpoint'
        ];

        for (var i = 0; i < shouldExistFn.length; i++) {
            var fn = shouldExistFn[i];
            it(fn + ' fn exists', function () {
                expect(typeof Config[fn]).toEqual('function');
            });
        }

        it("can get form key", function() {
            window.FORM_KEY = 'test-form-key';
            expect(Config.getFormKey()).toEqual('test-form-key');
        });
    });

});