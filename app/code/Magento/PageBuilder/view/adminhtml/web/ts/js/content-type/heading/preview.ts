/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import $ from "jquery";
import events from "Magento_PageBuilder/js/events";
import _ from "underscore";
import ContentTypeConfigInterface from "../../content-type-config.d";
import Toolbar from "../../content-type-toolbar";
import ToolbarOptionInterface from "../../content-type-toolbar/option.d";
import ContentTypeInterface from "../../content-type.d";
import ContentTypeDroppedCreateEventParamsInterface from "../content-type-dropped-create-event-params";
import ObservableUpdater from "../observable-updater";
import BasePreview from "../preview";
/**
 * @api
 */
export default class Heading extends BasePreview {
    public toolbar: Toolbar;
    private element: Element;

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
        this.toolbar = new Toolbar(
            this,
            this.getToolbarOptions(),
        );
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
     * @returns {ToolbarOptionInterface[]}
     */
    private getToolbarOptions(): ToolbarOptionInterface[] {
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
