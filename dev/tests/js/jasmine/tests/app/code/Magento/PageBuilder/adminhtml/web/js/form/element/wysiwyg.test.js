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

    var $,
        wysiwyg,
        events = {
            trigger: jasmine.createSpy(),
            on: jasmine.createSpy()
        },
        injector = new Squire();

    function PageBuilderFactoryMock() {
        this.id = 'pagebuilder_instance_id';
    }

    PageBuilderFactoryMock.prototype.isFullScreen = jasmine.createSpy().and.returnValue(false);

    function getWysiwygFactoryMock(Wysiwyg) {
        var _proto,
            WysiwygMock = function () {};

        _proto = Object.create(Wysiwyg.prototype);
        _proto.constructor = WysiwygMock;
        WysiwygMock.prototype = _proto;

        return WysiwygMock;
    }

    beforeEach(function (done) {
        injector.mock({
            'Magento_PageBuilder/js/page-builder': PageBuilderFactoryMock,
            'Magento_PageBuilder/js/events': events
        });
        injector.require(['jquery', 'Magento_PageBuilder/js/form/element/wysiwyg'], function (jq, PageBuilderWysiwyg) {
            var WysiwygFactoryMock = getWysiwygFactoryMock(PageBuilderWysiwyg);

            $ = jq;
            $.async = jasmine.createSpy();
            wysiwyg = new WysiwygFactoryMock();
            $.extend(wysiwyg, PageBuilderWysiwyg.defaults);
            $.extend(wysiwyg, {
                source: {
                    set: function (name, value) {
                        this[name] = value;
                    },
                    get: function (name) {
                        return this[name];
                    }
                },
                pageBuilder: new PageBuilderFactoryMock(),
                isComponentInitialized: jasmine.createSpy().and.returnValue(false),
                loading: jasmine.createSpy().and.returnValue(false),
                visiblePageBuilder: jasmine.createSpy().and.returnValue(false),
                wysiwygConfigData: jasmine.createSpy().and.returnValue({isFullScreen: false}),
                ns: 'testnamespace'
            });
            $(document.body).append(
                $('<div><div contenteditable="true"><a href="/login"></a><span tabindex="0"></span></div></div>')
                    .attr('id', wysiwyg.pageBuilder.id)
            );
            done();
        });
    });

    afterEach(function () {
        $('#' + wysiwyg.pageBuilder.id).remove();
        try {
            injector.clean();
            injector.remove();
        } catch (e) {}
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
        describe('initPageBuilder', function () {
            it('Should register PageBuilder instance', function () {
                wysiwyg.initPageBuilder();
                expect(wysiwyg.source.get('pageBuilderInstances')).toContain(wysiwyg.pageBuilder);
                expect(events.trigger)
                    .toHaveBeenCalledWith(
                        'pagebuilder:register',
                        {ns: wysiwyg.ns, instance: wysiwyg.pageBuilder}
                    );
            });
        });
    });
});
