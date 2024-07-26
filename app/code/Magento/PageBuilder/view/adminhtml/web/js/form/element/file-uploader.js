/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

define([
    'jquery'
], function ($) {
    'use strict';

    return function (Element) {
        return Element.extend({

            /**
             * {@inheritDoc}
             */
            initUploader: function (fileInput) {
                _.extend(this.uploaderConfig, {
                    dropZone: $(fileInput).closest(this.dropZone),
                    change: this.onFilesChoosed.bind(this),
                    drop: this.onFilesChoosed.bind(this),
                    add: this.onBeforeFileUpload.bind(this),
                    fail: this.onFail.bind(this),
                    done: this.onFileUploaded.bind(this),
                    start: this.onLoadingStart.bind(this),
                    stop: this.onLoadingStop.bind(this)
                });

                // uppy implementation
                if (fileInput !== undefined) {
                    let targetElement = $(fileInput).closest('.file-uploader-area')[0],
                        dropTargetElement = $(fileInput).closest(this.dropZone)[0],
                        formKey = window.FORM_KEY !== undefined ? window.FORM_KEY : $.cookie('form_key'),
                        fileInputName = this.fileInputName,
                        arrayFromObj = Array.from,
                        options = {
                            proudlyDisplayPoweredByUppy: false,
                            target: targetElement,
                            hideUploadButton: true,
                            hideRetryButton: true,
                            hideCancelButton: true,
                            inline: true,
                            showRemoveButtonAfterComplete: true,
                            showProgressDetails: false,
                            showSelectedFiles: false,
                            allowMultipleUploads: false,
                            hideProgressAfterFinish: true
                        };

                    if (fileInputName === undefined) {
                        fileInputName = $(fileInput).attr('name');
                    }
                    // handle input type file
                    this.replaceInputTypeFile(fileInput);

                    const uppy = new Uppy.Uppy({
                        autoProceed: true,

                        onBeforeFileAdded: (currentFile) => {
                            let file = currentFile,
                                allowed = this.isFileAllowed(file);

                            if (this.disabled()) {
                                this.notifyError($t('The file upload field is disabled.'));
                                return false;
                            }

                            if (!allowed.passed)  {
                                this.aggregateError(file.name, allowed.message);
                                this.uploaderConfig.stop();
                                return false;
                            }

                            // code to allow duplicate files from same folder
                            const modifiedFile = {
                                ...currentFile,
                                id:  currentFile.id + '-' + Date.now()
                            };

                            this.onLoadingStart();
                            return modifiedFile;
                        },

                        meta: {
                            'form_key': formKey,
                            'param_name': fileInputName,
                            isAjax : true
                        }
                    });

                    // initialize Uppy upload
                    uppy.use(Uppy.Dashboard, options);

                    // drop area for file upload
                    uppy.use(Uppy.DropTarget, {
                        target: dropTargetElement,
                        onDragOver: () => {
                            // override Array.from method of legacy-build.min.js file
                            Array.from = null;
                        },
                        onDragLeave: () => {
                            Array.from = arrayFromObj;
                        }
                    });

                    // upload files on server
                    uppy.use(Uppy.XHRUpload, {
                        endpoint: this.uploaderConfig.url,
                        fieldName: fileInputName
                    });

                    uppy.on('upload-success', (file, response) => {
                        let data = {
                            files : [response.body],
                            result : response.body
                        };

                        this.onFileUploaded('', data);
                    });

                    uppy.on('upload-error', (file, error) => {
                        console.error(error.message);
                        console.error(error.status);
                    });

                    uppy.on('complete', () => {
                        this.onLoadingStop();
                        Array.from = arrayFromObj;
                    });
                }
                return this;
            },

            /**
             * {@inheritDoc}
             */
            replaceInputTypeFile: function (fileInput) {
                let fileId = fileInput.id, fileName = fileInput.name,
                    spanElement = '<span id=\'' + fileId + '\'></span>';

                $('#' + fileId).closest('.file-uploader-area').attr('upload-area-id', fileName);
                $(fileInput).replaceWith(spanElement);
                $('#' + fileId).closest('.file-uploader-area').find('.file-uploader-button:first').on('click', function () {
                    $('#' + fileId).closest('.file-uploader-area').find('.uppy-Dashboard-browse').trigger('click');
                });
                $('#' + fileId).closest('.pagebuilder-image-uploader-container').find('.action-upload-image').on('click', function () {
                    $('#' + fileId).closest('.file-uploader-area').find('.uppy-Dashboard-browse').trigger('click');
                });
            },
        });
    };
});
