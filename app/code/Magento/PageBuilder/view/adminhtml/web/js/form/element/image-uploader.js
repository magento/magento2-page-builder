/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

/* global document */
define([
    'jquery',
    'underscore',
    'uiRegistry',
    'Magento_Ui/js/form/element/image-uploader',
    'uiEvents'
], function ($, _, uiRegistry, Uploader, events) {
    'use strict';

    var initializedOnce = false;

    return Uploader.extend({
        defaults: {
            dropzoneSelector: null
        },

        /**
         * Bind drag events to highlight/unhighlight dropzones
         * {@inheritDoc}
         */
        initialize: function () {
            var $document = $(document);

            this._super();

            this.dropzoneSelector = this.dropZone;

            // bind dropzone highlighting using event delegation only once
            if (!initializedOnce) {
                // dropzone highlighting
                $document.on('dragover', this.highlightDropzone.bind(this));

                // dropzone unhighlighting
                $document.on('dragend dragleave mouseup', this.unhighlightDropzone.bind(this));

                initializedOnce = true;
            }
        },

        /**
         * Remove draggable classes from dropzones
         * {@inheritDoc}
         */
        onBeforeFileUpload: function (e, data) {
            this.removeDraggableClassesFromDropzones();
            this._super(e, data);
        },

        /**
         * Add/remove CSS classes to $dropzone element to provide UI feedback
         *
         * @param {jQuery.event} e
         */
        highlightDropzone: function (e) {
            var $dropzone = $(e.target).closest(this.dropzoneSelector),
                $dropzones = $(this.dropzoneSelector),
                isInsideDropzone = !!$dropzone.length;

            if (isInsideDropzone) {
                $dropzone.removeClass('dragging-outside').addClass('dragging dragging-inside');
            }

            $dropzones.not($dropzone).removeClass('dragging-inside').addClass('dragging dragging-outside');
        },

        /**
         * Remove all UI styling from dropzone
         *
         * @param {jQuery.event} e
         */
        unhighlightDropzone: function (e) {
            var isMouseReleased = e.type === 'mouseup' || e.type === 'dragend',
                isActuallyLeavingThePage = e.type === 'dragleave' && (e.clientX === 0 || e.clientY === 0);

            if (!isMouseReleased && !isActuallyLeavingThePage) {
                return;
            }

            this.removeDraggableClassesFromDropzones();
        },

        /**
         * Remove draggable CSS classes from dropzone elements
         */
        removeDraggableClassesFromDropzones: function () {
            var $dropzones = $(this.dropzoneSelector);

            $dropzones.removeClass('dragging dragging-inside dragging-outside');
        },

        /**
         * Trigger image:uploaded event to be handled by PageBuilder image component
         * {@inheritDoc}
         */
        addFile: function (file) {
            this._super(file);

            events.trigger('image:uploaded:' + this.id, [file]);

            return this;
        }
    });
});
