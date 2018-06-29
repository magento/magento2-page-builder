/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

define([
    'Magento_Ui/js/dynamic-rows/dynamic-rows',
    'Magento_PageBuilder/js/events',
    'underscore',
    'jquery'
], function (dynamicRows, Events, _, $) {
    'use strict';

    /**
     * Returns sortable values
     *
     * @param {String | Number | Object | Array} value
     * @return {String | Number}
     */
    var sortValueValidator = function (value) {
        if (typeof value === 'string') {
            return value.toLowerCase();
        }

        if (typeof value === 'number') {
            return value;
        }

        return '';
    };

    return dynamicRows.extend({
        defaults: {
            modules: {
                insertForm: '${ $.insertFormProvider }',
                modal: '${$.modalProvider}'
            }
        },

        /** @inheritdoc */
        initLinks: function () {
            this._super();
            Events.on('mapLocation:saveAfter', function (data) {
                this.modal().closeModal();
                this.reInitData(data);
            }.bind(this), this.name);

            return this;
        },

        /**
         * Open the location modal and insert form with the data from selected record
         *
         * @param {Object} record
         */
        edit: function (record) {
            this.modal().openModal();
            this.insertForm().edit(record.data());
        },

        /**
         * Reinitializing of dynamic row records.
         *
         * @param {Object} data
         */
        reInitData: function (data) {
            var recordData = this.recordData().slice(),
                prop = this.identificationProperty,
                isExists = false;

            _.each(recordData, function (elem, index) {
                if (elem[prop] === data[prop]) {
                    recordData[index] = data;
                    isExists = true;
                }
            }, this);

            if (!isExists) {
                recordData.push(data);
            }

            this.recordData(recordData);

            _.each(this.labels(), function (label) {
                if (label.columnsHeaderClasses) {
                    this.sortRecord(label.name, label.columnsHeaderClasses === '_ascend');
                }
            }.bind(this));

            this.reload();
        },

        /**
         * Logic to toggle ascend and descend sorting for headers
         *
         * @param {KnockoutObservableArray} property
         */
        sortByHeader: function (property) {
            var ascend,
                activeLabel,
                allLabels,
                placeholder;

            if (property().name === 'actions') {
                return;
            }

            if (property().columnsHeaderClasses) {
                activeLabel = $.extend({}, property());
                activeLabel.columnsHeaderClasses =
                    property().columnsHeaderClasses === '_ascend' ? '_descend' : '_ascend';
                ascend = activeLabel.columnsHeaderClasses === '_ascend';
                property(activeLabel);
            } else {
                allLabels = this.labels().slice();
                allLabels.forEach(function (label) {

                    if (label.name === property().name) {
                        label.columnsHeaderClasses = '_ascend';
                    } else {
                        label.columnsHeaderClasses = '';
                    }
                });
                ascend = true;
                this.labels(allLabels);
            }

            if (this.recordData().length) {
                placeholder = this.emptyContentPlaceholder;

                this.emptyContentPlaceholder = false;
                this.sortRecord(property().name, ascend);
                this.reload();
                this.emptyContentPlaceholder = placeholder;
            }
        },

        /**
         * Sorting of dynamic row records.
         *
         * @param {String} sortBy
         * @param {Boolean} ascend
         */
        sortRecord: function (sortBy, ascend) {
            this.recordData.sort(function (left, right) {
                var record1 = ascend ? left : right,
                    record2 = ascend ? right : left;

                record1 = sortValueValidator(record1[sortBy]);
                record2 = sortValueValidator(record2[sortBy]);

                return record1 === record2 ? 0 : record1 < record2 ? -1 : 1;
            });
        },

        /** @inheritdoc */
        destroy: function () {
            this._super();
            Events.off(this.name);
        }
    });
});
