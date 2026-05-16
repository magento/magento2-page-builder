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
                    spanElement = '<span id=\'' + fileId + fileClass + '\' ></span>',
                    self = this,
                    clickHandler = function (e) {
                        let $clickArea = $(this).closest('.file-uploader-area');

                        e.preventDefault();
                        if (self.triggerFileBrowser) {
                            self.triggerFileBrowser($clickArea);
                        } else {
                            $clickArea.find('.uppy-Dashboard-browse').trigger('click');
                        }
                    },
                    $area,
                    areaEl,
                    clickTarget;

                $('#' + fileId).closest('.file-uploader-area').attr('upload-area-id', fileName);
                $('#' + fileId + fileClass).closest('.file-uploader-area').attr('upload-area-id', fileName);

                $(fileInput).replaceWith(spanElement);

                $area = $('#' + fileId + fileClass).closest('.file-uploader-area');
                areaEl = $area[0];

                if (areaEl) {
                    clickTarget = areaEl.querySelector('.action-upload-image') ||
                        areaEl.querySelector('.file-uploader-button');

                    if (clickTarget) {
                        $(clickTarget).on('click', clickHandler);
                    }
                }
            }
        });
    };
});
