/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
/**
 * JS Unit Test for hook.js
 *
 */
define([
    'bluefoot/config',
    'advanced-cms-init-config'
], function (Config, initConfig) {
    'use strict';
    /*eslint-disable */
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
        };

        describe('setInitConfig & getInitConfig', function () {
            it('can set & retrieve init config', function () {
                Config.setInitConfig({
                    initConfig: true
                });
                expect(Config.getInitConfig()['initConfig']).toEqual(true);
                expect(Config.getInitConfig('initConfig')).toEqual(true);
            });
            it('will return null on missing key', function () {
                expect(Config.getInitConfig('missingKey')).toBeNull();
            });
        });

        describe('loadEntities', function () {
            beforeEach(function() {
                Config.setInitConfig(initConfig);
            });
            it('can load entities', function (done) {
                Config.loadEntities([1], 1, function () {
                    expect(Config.getEntity(1)).toBeDefined();
                    done();
                });
            });
        });

        describe('getContentTypeConfig', function () {
            it('can retrieve content type config', function () {
                var mockContentType = {
                    slug: 'test'
                };

                Config._setInitConfig('contentTypes', {
                    'testContentType': mockContentType
                });
                expect(Config.getContentTypeConfig('testContentType')).toBe(mockContentType);
            });
            it('will return false if not found', function () {
                expect(Config.getContentTypeConfig('falseContentType')).toEqual(false);
            });
        });

        describe('getConfig', function () {
            it('can retrieve config', function () {
                Config._setConfig('getConfigTest', true);
                expect(Config.getConfig().getConfigTest).toEqual(true);
            });
        });

        describe('getValue', function () {
            it('can retrieve value from _config', function () {
                Config._setConfig('getValueTest', true);
                expect(Config.getValue('getValueTest')).toEqual(true);
            });
            it('can retrieve value from InitConfig', function () {
                Config.resetConfig();
                Config._setInitConfig('getValueTest', true);
                expect(Config.getValue('getValueTest')).toEqual(true);
            });
            it('will return null if not found', function () {
                expect(Config.getValue('nullValue')).toBeNull();
            });
        });

        describe('deleteValue', function () {
            it('can remove a valid from config', function () {
                var mockData = [{test: true}];

                Config._setConfig('removeFromConfig', mockData);
                expect(Config.getValue('removeFromConfig').length).toEqual(1);
                Config.deleteValue('removeFromConfig', 'test', true);
                expect(Config.getValue('removeFromConfig').length).toEqual(0);
            });

            it('doesn\'t error when value is incorrect', function () {
                var mockData = [{test: false}];

                Config._setConfig('removeFromConfig', mockData);
                expect(function () {
                    Config.deleteValue('removeFromConfig', 'test', true)
                }).not.toThrow();
            });
        });

        describe('mergeValues', function () {
            it('can merge values into config', function () {
                var mockData = {merged: true};

                Config.resetConfig();
                Config._setConfig('testConfig', [{original: true}]);
                Config.mergeValues('testConfig', mockData);
                expect(Config.getValue('testConfig').length).toEqual(2);
            });
        });


        describe('getAllFields', function () {
            it('can build fields from contentTypes', function () {
                Config._setInitConfig('contentTypes', [
                    {
                        fields: {
                            contentTypeField: true
                        }
                    }
                ]);
                expect(Config.getAllFields().contentTypeField).toEqual(true);
            });
        });

        describe('getField', function () {
            it('returns null when field doesn\'t exist', function () {
                expect(Config.getField('nullField')).toBeNull();
            });
        });

        describe('getPluginConfig', function () {
            it('can retrieve plugin config', function () {
                Config._setInitConfig('plugins', {
                    testPlugin: {
                        config: {
                            test: true
                        }
                    }
                });
                expect(Config.getPluginConfig('testPlugin', 'test')).toEqual(true);
            });
            it('will return null on missing plugin', function () {
                expect(Config.getPluginConfig('missingPlugin', 'test')).toBeNull();
            });
        });

        describe('updateTemplateValue', function () {
            it('can update template value', function () {
                Config._setConfig('templates', [
                    {
                        id: 1
                    }
                ]);
                Config.updateTemplateValue('id', 1, 'test', true);
                expect(Config.getValue('templates')[0].test).toEqual(true);
            });
        });

        describe('getColumnDefinitionByClassName', function () {
            it('can retrieve column definition by class name', function () {
                expect(Config.getColumnDefinitionByClassName('test')).toBeDefined();
            });
        });

        describe('getColumnDefinitionByBreakpoint', function () {
            it('can retrieve column definition by breakpoint', function () {
                expect(Config.getColumnDefinitionByBreakpoint('0.5')).toBeDefined();
            });
        });

        it("can get form key", function() {
            window.FORM_KEY = 'test-form-key';
            expect(Config.getFormKey()).toEqual('test-form-key');
        });
    });

});