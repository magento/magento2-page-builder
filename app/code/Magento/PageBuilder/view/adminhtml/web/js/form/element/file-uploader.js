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
