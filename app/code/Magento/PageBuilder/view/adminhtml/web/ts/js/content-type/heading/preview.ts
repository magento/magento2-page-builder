/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import $ from "jquery";
import ko from "knockout";
import events from "uiEvents";
import _ from "underscore";
import {ToolbarOptions, ToolbarOptionsInterface} from "../../toolbar-options";
import ContentTypeReadyEventParamsInterface from "../content-type-ready-event-params.d";
import BasePreview from "../preview";

export default class Heading extends BasePreview {
    public hasFocus: KnockoutObservable<boolean> = ko.observable(false);
    private element: Element;

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
            this.hasFocus(true);
        });
    }

    /**
     * Build and return the tool bar options for heading
     *
     * @returns {ToolbarOptions}
     */
    public getHeadingToolbar(): ToolbarOptions {
        const options: ToolbarOptionsInterface[] = [
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

        return new ToolbarOptions(this, options);
    }
}
