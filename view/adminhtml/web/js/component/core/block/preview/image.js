/**
 * - Image.js
 * Image class for preview areas of a block
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
define([
    'ko',
    'bluefoot/block/preview/abstract',
    'bluefoot/config',
    'mage/translate',
    'bluefoot/ko-dropzone'
], function (ko, AbstractPreview, Config, $t) {

    /**
     *
     * @param parent
     * @param config
     * @constructor
     */
    function Image(parent, config) {
        AbstractPreview.call(this, parent, config);

        this.loading = ko.observable(false);
    }

    Image.prototype = Object.create(AbstractPreview.prototype);
    var $super = AbstractPreview.prototype;

    /**
     * URL for uploading files to
     *
     * @returns {*}
     */
    Image.prototype.uploadUrl = function() {
        return Config.getPluginConfig('gene_widget_upload', 'upload_url');
    };

    /**
     * Upload success. Return function with binding to this scope
     *
     * @returns {function(this:Image)}
     */
    Image.prototype.attachmentSuccess = function() {
        return function(file, response, bindKey) {
            if (response.file) {
                this.parent.data()[bindKey] = response.file;
                this.parent.data.valueHasMutated();
                setTimeout(function () {
                    this.loading(false);
                }.bind(this), 50);
            } else {
                alert($t("Your image could not be uploaded"));
            }
        }.bind(this);
    };

    /**
     * Event when an attachment is dropped onto the dropzone
     */
    Image.prototype.attachmentDrop = function () {
        return function (event) {
            jQuery(event.target).parents('.dz-drag-hover').removeClass('dz-drag-hover');
            this.loading(true);
        }.bind(this);
    };

    /**
     * Upload error
     *
     * @param data
     * @param errorMessage
     */
    Image.prototype.attachmentError = function(data, errorMessage) {
        this.loading(false);
        alert($t("Your image could not be uploaded"));
    };

    return Image;
});