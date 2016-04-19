/**
 * - Upload.js
 * Upload widget for the CMS
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
define(['bluefoot/cms-config', 'bluefoot/config', 'bluefoot/jquery', 'bluefoot/dropzone', 'bluefoot/hook', 'bluefoot/modal'], function (InitConfig, Config, jQuery, Dropzone, Hook, Modal) {

    /**
     * Our Field class
     *
     * @constructor
     */
    function UploadField(field, value, edit) {
        this.field = field;
        this.value = value;
        this.edit = edit;
        this.uploadElement = false;
        this.hiddenInput = false;
        this.viewElement = false;
        this.dropzone = false;

        this.attachHooks();
    }

    /**
     * Attach hooks for the upload widget
     */
    UploadField.prototype.attachHooks = function () {
        Hook.attach('gene-bluefoot-after-render-field-' + this.field.fieldType, this.onRenderField.bind(this), this.edit.stage);
    };

    /**
     * Event to call after the field has been placed onto the screen
     * @param $hook
     */
    UploadField.prototype.onRenderField = function ($hook) {
        if (this.value) {
            this.setValue(this.value);
        } else {
            this.uploadElement.show();
            this.viewElement.hide();
            this.initDropzone();
        }

        $hook.done();
    };

    /**
     * Init the dropzone instance
     *
     * @returns {*}
     */
    UploadField.prototype.initDropzone = function () {
        var element = this.uploadElement;

        // Destroy and rebuild
        var dropZoneElement = jQuery(element).get(0).dropzone;
        if (dropZoneElement) {
            dropZoneElement.destroy();
        }

        // Initialize our Dropzone element
        jQuery(element).dropzone({
            url: Config.getPluginConfig('gene_widget_upload', 'upload_url'),
            uploadMultiple: false,
            maxFiles: 1,
            createImageThumbnails: false,
            addRemoveLinks: false,
            success: this.uploadSuccess.bind(this),
            error: this.uploadFailed.bind(this),
            init: function () {
                var _this = this;
                // Include all child elements as the clickable elements
                jQuery.each(jQuery(element).find('*'), function (index, element) {
                    jQuery(element).on('click', function (event) {
                        _this.hiddenFileInput.click();
                    });
                }.bind(this));

                // Let the user know something went wrong with their file upload
                this.on('error', function (file, errorMessage) {
                    Modal.alert('There was an error whilst trying to upload your file:<br />' + errorMessage);
                });

                // Add the current formKey into the request
                this.on('sending', function (file, xhr, formData) {
                    formData.append('form_key', Config.getFormKey());
                });

                // Add classes to dropzone on hover
                this.on('dragenter', function () {
                    jQuery(element).addClass('gene-bluefoot-hovered');
                });
                this.on('dragleave', function () {
                    jQuery(element).removeClass('gene-bluefoot-hovered');
                });
                this.on('drop', function () {
                    jQuery(element).removeClass('gene-bluefoot-hovered');
                });
            }
        });

        return this.dropzone;
    };

    /**
     * Process the file on an upload success
     *
     * @param file
     * @param response
     */
    UploadField.prototype.uploadSuccess = function (file, response) {
        if (response.success == true && response.file) {

            // Update the hidden input value
            this.setValue(response.file);

            // Alert to the user
            Modal.alert('File has been uploaded successfully.');

        } else {
            if (response.error) {
                return this.uploadFailed(false, response.error);
            }
        }
    };

    /**
     * Alert to the user if an upload fails
     *
     * @param file
     * @param errorMessage
     * @param xhr
     */
    UploadField.prototype.uploadFailed = function (file, errorMessage, xhr) {
        Modal.alert(errorMessage);
    };

    /**
     * Build the HTML
     *
     * @returns {boolean}
     */
    UploadField.prototype.buildHtml = function () {
        var id = this.getId();
        this.uploadElement = jQuery('<div />').addClass('gene-bluefoot-upload-field').attr('id', id).append(
            jQuery('<i />').addClass('fa fa-cloud-upload'),
            jQuery('<h4 />').text('Upload File')
        );

        this.buildViewHtml();

        this.hiddenInput = jQuery('<input />').attr('type', 'hidden').attr('name', this.field.code).val(this.value);

        return jQuery('<div />').addClass('gene-bluefoot-input-field').append(
            jQuery('<label />').attr('for', id).html(this.getLabel()),
            this.uploadElement,
            this.viewElement,
            this.hiddenInput
        );
    };

    /**
     * Build the view HTML
     *
     * @returns {boolean|*|void}
     */
    UploadField.prototype.buildViewHtml = function () {

        this.imageElement = jQuery('<img />');
        if (this.value) {
            this.imageElement.attr('src', Config.getPluginConfig('gene_widget_upload', 'media_url') + this.value);
        }
        this.viewElement = jQuery('<div />').addClass('gene-bluefoot-upload-previous').append(
            this.imageElement,
            jQuery('<button />').attr('type', 'button').addClass('gene-bluefoot-button gene-bluefoot-configure-cancel gene-bluefoot-button-skinny gene-bluefoot-button-red').text('Remove').on('click', this.removeImage.bind(this))
        );

        return this.viewElement;
    };

    /**
     * What happens when removing an image
     */
    UploadField.prototype.removeImage = function () {
        return this.setValue(false);
    };

    /**
     * Return the label for this field
     *
     * @returns {*}
     */
    UploadField.prototype.getLabel = function () {
        var label = this.field.label;
        if (typeof this.field.required !== 'undefined' && this.field.required == true) {
            label += '<em>*</em>';
        }
        return label;
    };

    /**
     * Return the elements ID
     *
     * @returns {string}
     */
    UploadField.prototype.getId = function () {
        return 'gene-bluefoot-' + this.field.code;
    };

    /**
     * Set the value of the field
     *
     * @param value
     */
    UploadField.prototype.setValue = function (value) {
        if (value !== '' && value != false) {
            this.value = value;
            this.hiddenInput.val(value);
            this.imageElement.attr('src', Config.getPluginConfig('gene_widget_upload', 'media_url') + value);
            this.uploadElement.hide();
            this.viewElement.show();
        } else {
            this.value = '';
            this.hiddenInput.val('');
            this.viewElement.hide();
            this.uploadElement.show();
            this.initDropzone();
        }
    };

    return UploadField;
});