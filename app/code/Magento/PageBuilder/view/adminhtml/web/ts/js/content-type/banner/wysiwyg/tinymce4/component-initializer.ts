/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import $ from "jquery";
import WysiwygEvents from "mage/adminhtml/wysiwyg/events";
import {AdditionalDataConfigInterface} from "../../../../content-type-config.types";
import WysiwygComponentInitializerInterface from "../../../../wysiwyg/component-initializer-interface";
import WysiwygInterface from "../../../../wysiwyg/wysiwyg-interface";

export default class ComponentInitializer implements WysiwygComponentInitializerInterface {
    /**
     * The editor element
     */
    private $element: JQuery;

    /**
     * The configuration of the wysiwyg content type
     */
    private config: AdditionalDataConfigInterface;

    /**
     * Initialize the instance
     *
     * @param {Wysiwyg} wysiwyg
     */
    public initialize(wysiwyg: WysiwygInterface): void {
        this.$element = $("#" + wysiwyg.elementId);
        this.config = wysiwyg.config;
        const tinymce = wysiwyg.getAdapter();

        tinymce.eventBus.attachEventHandler(WysiwygEvents.afterFocus, this.onFocus.bind(this));
        tinymce.eventBus.attachEventHandler(WysiwygEvents.afterBlur, this.onBlur.bind(this));
    }

    /**
     * Called when tinymce is focused
     */
    private onFocus() {
        // If there isn't enough room for a left-aligned toolbar, right align it
        if ($(window).width() <
            this.$element.offset().left + parseInt(this.config.adapter_config.minToolbarWidth, 10)
        ) {
            this.$element.addClass("_right-aligned-toolbar");
        }
        else {
            this.$element.removeClass("_right-aligned-toolbar");
        }

        $.each(this.config.adapter_config.parentSelectorsToUnderlay, (i, selector) => {
            this.$element.closest(selector as string).css("z-index", 100);
        });
    }

    /**
     * Called when tinymce is blurred
     */
    private onBlur() {
        $.each(this.config.adapter_config.parentSelectorsToUnderlay, (i, selector) => {
            this.$element.closest(selector as string).css("z-index", "");
        });
    }
}
