/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

define([
    'jquery',
    'underscore',
    'uiRegistry',
    'Magento_Ui/js/form/element/image-uploader',
    'Magento_PageBuilder/js/resource/resize-observer/ResizeObserver.min',
    'Magento_PageBuilder/js/events',
    'mage/translate'
], function ($, _, uiRegistry, Uploader, ResizeObserver, events, $t) {
    'use strict';

    var initializedOnce = false;

    return Uploader.extend({
        defaults: {
            $uploadArea: null,
            isShowImageUploadInstructions: true,
            isShowImageUploadOptions: false,
            classes: {
                dragging: 'dragging',
                draggingInside: 'dragging-inside',
                draggingOutside: 'dragging-outside'
            },
            translations: {
                allowedFileTypes: $t('Allowed file types'),
                dragImageHere: $t('Drag image here'),
                dropHere: $t('Drop here'),
                maximumFileSize: $t('Maximum file size'),
                selectFromGallery: $t('Select from Gallery'),
                or: $t('or'),
                uploadImage: $t('Upload Image'),
                uploadNewImage: $t('Upload New Image')
            }
        },

        /**
         * Bind drag events to highlight/unhighlight dropzones
         * {@inheritDoc}
         */
        initialize: function () {
            var $document = $(document);

            this._super();

            events.on('image:' + this.id +':assignAfter', this.onAssignedFile.bind(this));

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
         * {@inheritDoc}
         */
        initUploader: function (fileInput) {
            this._super(fileInput);
            this.$uploadArea = this.$fileInput.closest('.pagebuilder-image-empty-preview');
            new ResizeObserver(this.updateResponsiveClasses.bind(this)).observe(this.$uploadArea);
            this.$uploadArea = $(this.$uploadArea);
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
                    .removeClass(this.classes.draggingOutside)
                    .addClass([this.classes.dragging, this.classes.draggingInside].join(' '));
            }

            $otherDropzones
                .removeClass(this.classes.draggingInside)
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
         * Trigger image:uploadAfter event to be handled by PageBuilder image component
         * {@inheritDoc}
         */
        addFile: function (file) {
            this._super();

            events.trigger('image:' + this.id + ':uploadAfter', [file]);

            return this;
        },

        /**
         * Propagate file changes through all image uploaders sharing the same id
         *
         * @param {Object} file
         */
        onAssignedFile: function (file) {
            this.value([file]);
        },

        /**
         * Adds the appropriate ui state class to the upload control area based on the current rendered size
         */
        updateResponsiveClasses: function () {
            if (!this.$uploadArea.is(':visible')) {
                return;
            }

            this.$uploadArea.removeClass('_micro-ui _compact-ui');

            if (this.$uploadArea.width() < 130) {
                this.$uploadArea.addClass('_micro-ui');
            } else if (this.$uploadArea.width() < 440) {
                this.$uploadArea.addClass('_compact-ui');
            }
        }
    });
});
