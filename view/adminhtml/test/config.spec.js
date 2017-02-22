/**
 * JS Unit Test for hook.js
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
define([
    'web/js/component/config'
], function (Config) {

    describe("Gene_BlueFoot/js/component/core/config", function () {

        it('initConfig fn exists', function () {
            expect(typeof Config.initConfig).toEqual('function');
        });

        it('getContentTypeConfig fn exists', function () {
            expect(typeof Config.getContentTypeConfig).toEqual('function');
        });

        it('getConfig fn exists', function () {
            expect(typeof Config.getConfig).toEqual('function');
        });

        it('getValue fn exists', function () {
            expect(typeof Config.getValue).toEqual('function');
        });

        it('deleteValue fn exists', function () {
            expect(typeof Config.deleteValue).toEqual('function');
        });

        it('mergeValues fn exists', function () {
            expect(typeof Config.mergeValues).toEqual('function');
        });

        it('updateTemplateValue fn exists', function () {
            expect(typeof Config.updateTemplateValue).toEqual('function');
        });

        it('getPluginConfig fn exists', function () {
            expect(typeof Config.getPluginConfig).toEqual('function');
        });

        it('getAllFields fn exists', function () {
            expect(typeof Config.getAllFields).toEqual('function');
        });

        it('getField fn exists', function () {
            expect(typeof Config.getField).toEqual('function');
        });

        it('getFormKey fn exists', function () {
            expect(typeof Config.getFormKey).toEqual('function');
        });

        it('resetConfig fn exists', function () {
            expect(typeof Config.resetConfig).toEqual('function');
        });

        describe("initConfig", function () {
            it('can make ajax request', function (done) {
                Config.initConfig(function () {
                    done();
                });
            });
        });

        it("can get form key", function() {
            expect(Config.getFormKey()).toEqual('test-form-key');
        });
    });

});