/**
 * Copyright 2024 Adobe
 * All Rights Reserved.
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
            replaceInputTypeFile: function (fileInput) {
                let fileId = fileInput.id, fileName = fileInput.name, fileClass = fileInput.className,
                    spanElement =  '<span id=\'' + fileId + fileClass + '\' ></span>';

                $('#' + fileId).closest('.file-uploader-area').attr('upload-area-id', fileName);
                $('#' + fileId + fileClass).closest('.file-uploader-area').attr('upload-area-id', fileName);

                $(fileInput).replaceWith(spanElement);

                $('#' + fileId).closest('.file-uploader-area').find('.file-uploader-button:first').on('click', function () {
                    $(this).closest('.file-uploader-area').find('.uppy-Dashboard-browse').trigger('click');
                });

                $('#' + fileId + fileClass).closest('.file-uploader-area').find('.action-upload-image').on('click', function () {
                    $(this).closest('.file-uploader-area').find('.uppy-Dashboard-browse').trigger('click');
                });
            },
        });
    };
});
