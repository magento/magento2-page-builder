/**
 *
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

/* eslint-disable max-nested-callbacks */
define([
    'squire'
], function (Squire) {
    'use strict';

    var injector = new Squire(),
        mocks = {
            'Magento_PageBuilder/js/events': jasmine.createSpyObj('events',['on', 'trigger']),
            'Magento_PageBuilder/js/page-builder': function () {}
        },
        wysiwyg,
        $;

    beforeEach(function (done) {
        injector.mock(mocks);
        injector.require(['Magento_PageBuilder/js/form/element/wysiwyg', 'jquery'], function (UiWysiwyg, jq) {
            var MockWysiwyg = function () {};

            MockWysiwyg.prototype = Object.create(UiWysiwyg.prototype);
            MockWysiwyg.prototype.constructor = MockWysiwyg;
            wysiwyg = new MockWysiwyg();
            $ = jq;
            $.extend(wysiwyg, UiWysiwyg.defaults, {pageBuilder: {id: 'pb-wysiwyg-test'}});
            $(document.body).append(
                $('<div><div contenteditable="true"><a href="/login"></a><span tabindex="0"></span></div></div>')
                    .attr('id', wysiwyg.pageBuilder.id)
            );
            done();
        });
    });

    afterEach(function () {
        try {
            injector.clean();
            injector.remove();
        } catch (e) {}
        $('#' + wysiwyg.pageBuilder.id).remove();
    });

    describe('Magento_PageBuilder/js/form/element/wysiwyg', function () {
        describe('toggleFocusableElements', function () {
            it('Should restore tabindex and contenteditable in fullscreen mode', function () {
                var $div = $('#' + wysiwyg.pageBuilder.id);

                wysiwyg.pageBuilder.isFullScreen = jasmine.createSpy().and.returnValue(false);
                wysiwyg.toggleFocusableElements();
                expect($div.find('a').attr('tabindex')).toBe('-1');
                expect($div.find('a').data('original-tabindex')).toBe('');
                expect($div.find('span').attr('tabindex')).toBe('-1');
                expect($div.find('span').data('original-tabindex')).toBe('0');
                expect($div.find('[contenteditable]').attr('contenteditable')).toBe('false');

                // check full screen mode
                wysiwyg.pageBuilder.isFullScreen = jasmine.createSpy().and.returnValue(true);
                wysiwyg.toggleFocusableElements();
                // check that taindex is removed from "a"
                expect($div.find('a').attr('tabindex')).toBe(undefined);
                expect($div.find('a').data('original-tabindex')).toBe(undefined);
                // check that taindex is restored for "span"
                expect($div.find('span').attr('tabindex')).toBe('0');
                expect($div.find('span').data('original-tabindex')).toBe(undefined);
                expect($div.find('[contenteditable]').attr('contenteditable')).toBe('true');
            });
        });
    });
});
