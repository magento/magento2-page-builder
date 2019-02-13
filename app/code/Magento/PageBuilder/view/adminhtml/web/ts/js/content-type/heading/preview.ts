/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import $ from "jquery";
import events from "Magento_PageBuilder/js/events";
import _ from "underscore";
import ContentTypeConfigInterface from "../../content-type-config.types";
import HideShowOption from "../../content-type-menu/hide-show-option";
import {OptionsInterface} from "../../content-type-menu/option.types";
import Toolbar, {ContentTypeToolbarPreviewInterface} from "../../content-type-toolbar";
import {OptionInterface} from "../../content-type-toolbar.types";
import ContentTypeInterface from "../../content-type.types";
import {ContentTypeDroppedCreateEventParamsInterface} from "../content-type-events.types";
import ObservableUpdater from "../observable-updater";
import BasePreview from "../preview";

/**
 * @api
 */
export default class Preview extends BasePreview implements ContentTypeToolbarPreviewInterface {
    public toolbar: Toolbar;
    private element: Element;

    /**
     * @param {ContentTypeInterface} contentType
     * @param {ContentTypeConfigInterface} config
     * @param {ObservableUpdater} observableUpdater
     */
    constructor(
        contentType: ContentTypeInterface,
        config: ContentTypeConfigInterface,
        observableUpdater: ObservableUpdater,
    ) {
        super(contentType, config, observableUpdater);
        this.toolbar = new Toolbar(
            this,
            this.getToolbarOptions(),
        );
    }

    /**
     * Return an array of options
     *
     * @returns {OptionsInterface}
     */
    public retrieveOptions(): OptionsInterface {
        const options = super.retrieveOptions();

        options.hideShow = new HideShowOption({
            preview: this,
            icon: HideShowOption.showIcon,
            title: HideShowOption.showText,
            action: this.onOptionVisibilityToggle,
            classes: ["hide-show-content-type"],
            sort: 40,
        });

        return options;
    }

    /**
     * On render init the tabs widget
     *
     * @param {Element} element
     */
    public afterRender(element: Element): void {
        this.element = element;
    }

    public bindEvents() {
        super.bindEvents();

        // When a heading is dropped for the first time show heading toolbar
        events.on("heading:dropAfter", (args: ContentTypeDroppedCreateEventParamsInterface) => {
            if (args.id === this.contentType.id) {
                _.delay(() => {
                    $(this.element).focus();
                }, 100); // 100 ms delay to allow for heading to render
            }
        });
    }

    /**
     * Build and return the tool bar options for heading
     *
     * @returns {OptionInterface[]}
     */
    private getToolbarOptions(): OptionInterface[] {
        return [
            {
                key: "heading_type",
                type: "select",
                values: [
                    {
                        value: "h1",
                        label: "H1",
                        icon: "",
                    },
                    {
                        value: "h2",
                        label: "H2",
                        icon: "",
                    },
                    {
                        value: "h3",
                        label: "H3",
                        icon: "",
                    },
                    {
                        value: "h4",
                        label: "H4",
                        icon: "",
                    },
                    {
                        value: "h5",
                        label: "H5",
                        icon: "",
                    },
                    {
                        value: "h6",
                        label: "H6",
                        icon: "",
                    },
                ],
            },
            {
                key: "text_align",
                type: "select",
                values: [
                    {
                        value: "left",
                        label: "Left",
                        icon: "icon-pagebuilder-align-left",
                    },
                    {
                        value: "center",
                        label: "Center",
                        icon: "icon-pagebuilder-align-center",
                    },
                    {
                        value: "right",
                        label: "Right",
                        icon: "icon-pagebuilder-align-right",
                    },
                ],
            },
        ];
    }
}
