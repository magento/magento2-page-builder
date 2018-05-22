/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import $ from "jquery";
import events from "uiEvents";
import _ from "underscore";
import ContentTypeConfigInterface from "../../content-type-config.d";
import ToolbarOption from "../../content-type-toolbar/option";
import OptionInterface from "../../content-type-toolbar/option.d";
import ContentTypeInterface from "../../content-type.d";
import Toolbar from "../../toolbar";
import ContentTypeReadyEventParamsInterface from "../content-type-ready-event-params.d";
import ObservableUpdater from "../observable-updater";
import BasePreview from "../preview";

export default class Heading extends BasePreview {
    private element: Element;
    private onToolbarFocusIn;
    private onToolbarFocusOut;

    /**
     * @param {ContentTypeInterface} parent
     * @param {ContentTypeConfigInterface} config
     * @param {ObservableUpdater} observableUpdater
     */
    constructor(
        parent: ContentTypeInterface,
        config: ContentTypeConfigInterface,
        observableUpdater: ObservableUpdater,
    ) {
        super(parent, config, observableUpdater);

        this.onToolbarFocusIn = Toolbar.onToolbarFocusIn;
        this.onToolbarFocusOut = Toolbar.onToolbarFocusOut;
    }

    /**
     * On render init the tabs widget
     *
     * @param {Element} element
     */
    public onHeadingRender(element: Element) {
        this.element = element;
    }

    public bindEvents() {
        super.bindEvents();

        // When a heading is dropped for the first time show heading toolbar
        events.on("heading:block:dropped:create", (args: ContentTypeReadyEventParamsInterface) => {
            if (args.id === this.parent.id) {
                _.delay(() => {
                    $(this.element).focus();
                }, 100); // 100 ms delay to allow for heading to render
            }
        });
    }

    /**
     * Build and return the tool bar options for heading
     *
     * @returns {ToolbarOption}
     */
    public getHeadingToolbar(): ToolbarOption {
        const options: OptionInterface[] = [
            {
                key: "heading_type",
                type: "select",
                options: [
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
                options: [
                    {
                        value: "left",
                        label: "Left",
                        icon: "icon-pagebuilder-text-left",
                    },
                    {
                        value: "center",
                        label: "Center",
                        icon: "icon-pagebuilder-text-center",
                    },
                    {
                        value: "right",
                        label: "Right",
                        icon: "icon-pagebuilder-text-right",
                    },
                ],
            },
        ];

        return new ToolbarOption(this, options);
    }
}
