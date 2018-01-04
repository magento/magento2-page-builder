/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
/**
 * JS Unit Test for hook.js
 *
 */
define([
   'web/js/component/hook'
], function (Hook) {
    'use strict';

    /**
     * Test the hook component of BlueFoot
     */
    /*eslint-disable */
    describe('Gene_BlueFoot/js/component/core/hook', function () {

        it('attach fn exists', function () {
            expect(typeof Hook.attach).toEqual('function');
        });

        it('trigger fn exists', function () {
            expect(typeof Hook.trigger).toEqual('function');
        });

        it('hasHooks fn exists', function () {
            expect(typeof Hook.hasHooks).toEqual('function');
        });

        it('triggerNextEvent fn exists', function () {
            expect(typeof Hook.triggerNextEvent).toEqual('function');
        });

        it('enable and disable fns exist', function () {
            expect(typeof Hook.enable).toEqual('function');
            expect(typeof Hook.disable).toEqual('function');
        });

        describe('can attach hooks', function () {

            it('to the internal default context object', function () {
                Hook.attach('testing-attach-hook', function () {
                    // Empty anonymous function
                });
                expect(Hook.hasHooks('testing-attach-hook')).toBeTruthy();
            });

            it('to a supplied empty context object', function () {
                var context = {};

                Hook.attach('testing-attach-hook', function () {
                    // Empty anonymous function
                }, context);
                expect(Hook.hasHooks('testing-attach-hook', context)).toBeTruthy();
                expect(typeof context.hooks['testing-attach-hook']).toEqual('object');
            });

            it('to a context object with hooks already', function () {
                var context = {
                    hooks: {}
                };

                Hook.attach('testing-attach-hook', function () {
                    // Empty anonymous function
                }, context);
                expect(Hook.hasHooks('testing-attach-hook', context)).toBeTruthy();
                expect(typeof context.hooks['testing-attach-hook']).toEqual('object');
            });

            it('to a context object with a registered hook already', function () {
                var context = {
                    hooks: {
                        'testing-attach-hook': []
                    }
                };

                Hook.attach('testing-attach-hook', function () {
                    // Empty anonymous function
                }, context);
                expect(Hook.hasHooks('testing-attach-hook', context)).toBeTruthy();
                expect(typeof context.hooks['testing-attach-hook']).toEqual('object');
            });

        });

        describe('can trigger attached hooks', function () {

            it('with empty arguments', function (done) {
                Hook.attach('testing-no-argument-hook', function ($hook) {
                    expect($hook.params).toEqual({});
                    $hook.done();
                    done();
                });
                Hook.trigger('testing-no-argument-hook');
            });

            it('and pass parameters', function (done) {
                var context = {
                    hooks: {}
                };

                Hook.attach('testing-run-hook', function ($hook) {
                    expect($hook.params.test).toBeDefined();
                    expect($hook.params.test).toEqual('testHook');
                    $hook.done();
                }, context);

                Hook.trigger('testing-run-hook', {test: 'testHook'}, function () {
                    done();
                }, context);
            });

            it('cannot trigger hooks when disabled', function (done) {
                Hook.attach('testing-run-hook', function () {
                    fail('triggered hook while disabled');
                });
                Hook.disable();
                Hook.trigger('testing-run-hook');
                // run done async to support a future async API for Hook
                setTimeout(done, 100);
            });

            it('still runs complete function when disabled', function (done) {
                Hook.attach('testing-run-hook', function () {
                    fail('triggered hook while disabled');
                });
                Hook.disable();
                Hook.trigger('testing-run-hook', null, function complete (args) {
                    expect(args).toBeNull();
                    done();
                });
            });

            it('can trigger hooks after being disabled and reenabled', function (done) {
                var disabled = false;
                var context = {};

                Hook.attach('testing-run-hook', function ($hook) {
                    if (disabled) {
                        fail('triggered hook while disabled');
                    } else {
                        $hook.done();
                        done();
                    }
                }, context);

                function trigger() {
                    var params = {};
                    Hook.trigger('testing-run-hook', params, function complete (args) {
                        expect(args).toBe(params);
                    }, context);
                }
                Hook.disable();
                disabled = true;
                trigger();
                Hook.enable();
                disabled = false;
                trigger();
            });

            it('still runs complete function with no hooks', function (done) {
                var params = {};

                Hook.trigger('nonexistent-hook', params, function complete (args) {
                    expect(args).toBe(params);
                    done();
                });
            });
            it('fails silently with no hooks', function () {
                expect(function() {
                    Hook.trigger('nonexistent-hook');
                }).not.toThrow();
            });
            it('still runs whitelisted hooks when disabled', function (done) {
                Hook.attach('testing-run-hook', function () {
                    fail('triggered hook while disabled');
                });
                Hook.attach('whitelisted-hook', function ($hook) {
                    $hook.done();
                    Hook.trigger('whitelisted-hook-2');
                });
                Hook.attach('whitelisted-hook-2', function ($hook) {
                    $hook.done();
                    Hook.enable();
                    done();
                });
                Hook.disable();
                Hook.trigger('testing-run-hook');
                Hook.addWhitelist('whitelisted-hook');
                Hook.addWhitelist(['whitelisted-hook-2']);
                Hook.trigger('whitelisted-hook');
            });
        });
    });
});
