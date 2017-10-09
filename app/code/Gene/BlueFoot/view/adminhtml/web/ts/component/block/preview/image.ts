import PreviewBlock from "./block";
import ko from "knockout";
import Config from "../../config";

/**
 * PreviewImageBlock Class
 * 
 * @author Dave Macaulay <dmacaulay@magento.com>
 */
export default class PreviewImageBlock extends PreviewBlock {
    image: KnockoutObservable<string>;
    loading: KnockoutObservable<boolean> = ko.observable(false);
    imageUrl: KnockoutComputed<string> = ko.computed(() => {
        if (this.image()) {
            return Config.getInitConfig('media_url') + this.image().replace('/media/', '');;
        }
        return '';
    });

    /**
     * Retrieve the upload URL from the configuration
     */
    uploadUrl() {
        return Config.getPluginConfig('gene_widget_upload', 'upload_url');
    }

    /**
     * Update data when an attachment is successful
     */
    attachmentSuccess() {
        return (file: any, response: any, bindKey: any) => {
            if (response.file) {
                this.parent.stage.store.updateKey(
                    this.parent.id, 
                    bindKey,
                    response.file
                );
                setTimeout(() => {
                    this.loading(false);
                }, 50);
            } else {
                alert($t("Your image could not be uploaded"));
            }
        };
    }

    /**
     * Handle an attachment being dropped
     */
    attachmentDrop() {
        return (event: Event) => {
            jQuery(event.target).parents('.dz-drag-hover').removeClass('dz-drag-hover');
            this.loading(true);
        };
    }

    /**
     * Handle an attachment error
     */
    attachmentError() {
        this.loading(false);
        alert($t("Your image could not be uploaded"));
    }
}