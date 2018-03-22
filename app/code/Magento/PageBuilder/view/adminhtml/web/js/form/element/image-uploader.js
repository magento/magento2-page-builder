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
            classes: {
                dragging: 'dragging',
                draggingInside: 'dragging-inside',
                draggingOutside: 'dragging-outside'
            },
            translations: {
                allowedFileTypes: 'Allowed file types',
                dropHere: 'Drop here',
                maximumFileSize: 'Maximum file size',
                selectFromGallery: 'Select from Gallery',
                upload: 'Upload',
                uploadNewImage: 'Upload New Image'
            }
        },

        /**
         * Bind drag events to highlight/unhighlight dropzones
         * {@inheritDoc}
         */
        initialize: function () {
            var $document = $(document);

            this._super();

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
        onBeforeFileUpload: function () {
            this.removeDraggableClassesFromDropzones();
            this._super();
        },

        /**
         * Add/remove CSS classes to $dropzone element to provide UI feedback
         *
         * @param {jQuery.event} e
         */
        highlightDropzone: function (e) {
            var $dropzone = $(e.target).closest(this.dropZone),
                $otherDropzones = $(this.dropZone).not($dropzone),
                isInsideDropzone = !!$dropzone.length;

            if (isInsideDropzone) {
                $dropzone
                    .removeClass(this.draggingOutsideClass)
                    .addClass([this.classes.dragging, this.classes.draggingInside].join(' '));
            }

            $otherDropzones
                .removeClass(this.draggingInsideClass)
                .addClass([this.classes.dragging, this.classes.draggingOutside].join(' '));
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
            var $dropzones = $(this.dropZone);

            $dropzones
                .removeClass([
                    this.classes.dragging,
                    this.classes.draggingInside,
                    this.classes.draggingOutside
                ].join(' '));
        },

        /**
         * Trigger image:uploaded event to be handled by PageBuilder image component
         * {@inheritDoc}
         */
        addFile: function (file) {
            this._super();

            events.trigger('image:uploaded:' + this.id, [file]);

            return this;
        }
    });
});
