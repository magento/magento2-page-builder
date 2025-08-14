/**
 * Copyright 2023 Adobe
 * All Rights Reserved.
 */

/* eslint-disable max-nested-callbacks */
define([
    'ko',
    'jquery',
    'Magento_PageBuilder/js/content-type/column-group/preview',
    'Magento_PageBuilder/js/config',
    'Magento_PageBuilder/js/events'
], function (ko,$, Preview, Config, Events) {
    'use strict'; // eslint-disable-line strict

    describe('Magento_PageBuilder/js/content-type/column-group/preview', function () {
        var model;

        beforeEach(function () {
            Config.config = {content_types: {}};
            model = new Preview(
                {
                    dataStore: {subscribe: jasmine.createSpy()},
                    getChildren: function () {
                        return ko.observableArray([]);
                    },
                    children: {subscribe: jasmine.createSpy()},
                    stageId: 'STAGEID'
                },
                {config: {content_types: {}}});
        });

        describe('Stage readyAfter event', function () {
            it('Should call methods to upgrade to column-line if needed', function () {
                spyOn(model, 'getCurrentIndexInParent');
                spyOn(model, 'hasColumnLine');
                Events.trigger('stage:' + model.contentType.stageId + ':readyAfter');
                expect(model.getCurrentIndexInParent).toHaveBeenCalled();
                expect(model.hasColumnLine).toHaveBeenCalled();
            });
        });
    });
});
