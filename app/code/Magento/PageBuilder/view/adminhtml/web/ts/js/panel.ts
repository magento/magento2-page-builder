/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import $ from "jquery";
import ko from "knockout";
import $t from "mage/translate";
import events from "Magento_PageBuilder/js/events";
import _ from "underscore";
import "./binding/draggable";
import Config from "./config";
import ContentTypeConfigInterface from "./content-type-config.d";
import {hideDropIndicators, showDropIndicators} from "./drag-drop/drop-indicators";
import {setDraggedContentTypeConfig} from "./drag-drop/registry";
import PageBuilder from "./page-builder";
import PanelInterface from "./panel.d";
import {Group} from "./panel/group";
import {ContentType as GroupContentType} from "./panel/group/content-type";

export default class Panel implements PanelInterface {
    public groups: KnockoutObservableArray<any> = ko.observableArray([]);
    public searchResults: KnockoutObservableArray<any> = ko.observableArray([]);
    public isCollapsed: KnockoutObservable<boolean> = ko.observable(false);
    public isVisible: KnockoutObservable<boolean> = ko.observable(false);
    public searching: KnockoutObservable<boolean> = ko.observable(false);
    public searchValue: KnockoutObservable<string> = ko.observable("");
    public searchPlaceholder: string = $t("Find items");
    public searchNoResult: string = $t("Nothing found");
    public fullScreenTitle: string = $t("Full Screen");
    public searchTitle: string = $t("Clear Search");
    public parent: PageBuilder;
    public id: string;
    private template: string = "Magento_PageBuilder/panel";

    constructor(parent: PageBuilder) {
        this.parent = parent;
        this.id = this.parent.id;
        this.initListeners();
    }

    /**
     * Init listeners
     */
    public initListeners(): void {
        events.on("stage:" + this.id + ":readyAfter", () => {
            this.populateContentTypes();
            this.isVisible(true);
        });
    }

    /**
     * Return the template string
     *
     * @returns {string}
     */
    public getTemplate(): string {
        return this.template;
    }

    /**
     * Conduct a search on the available content types,
     * and find matches for beginning of words.
     *
     * @param self
     * @param event
     */
    public search(self: Panel, event: any): void {
        this.searchValue(event.currentTarget.value.toLowerCase());
        if (this.searchValue() === "") {
            this.searching(false);
        } else {
            this.searching(true);
            this.searchResults(_.map(
                _.filter(
                    Config.getConfig("content_types"),
                    (contentType: ContentTypeConfigInterface) => {
                        const regEx = new RegExp("\\b" + self.searchValue(), "gi");
                        const matches = !!contentType.label.toLowerCase().match(regEx);
                        return matches &&
                            contentType.is_visible === true;
                    },
                ),
                (contentType, identifier: string) => {
                    // Create a new instance of GroupContentType for each result
                    return new GroupContentType(identifier, contentType);
                }),
            );
        }
    }

    /**
     * Traverse up to the WYSIWYG component and set as full screen
     */
    public fullScreen(): void {
        events.trigger(`stage:${ this.parent.id }:toggleFullscreen`);
    }

    /**
     * Collapse the panel into the side of the UI
     */
    public collapse(): void {
        this.isCollapsed(!this.isCollapsed());
    }

    /**
     * Clear Search Results
     */
    public clearSearch(): void {
        this.searchValue("");
        this.searching(false);
    }

    /**
     * Retrieve the draggable options for the panel items
     *
     * @returns {JQueryUI.DraggableOptions}
     */
    public getDraggableOptions(): JQueryUI.DraggableOptions {
        const self = this;
        return {
            appendTo: "body",
            cursor: "-webkit-grabbing",
            connectToSortable: ".content-type-drop",
            containment: "document",
            helper() {
                return $(this).clone().css({
                    width: $(this).width(),
                    height: $(this).height(),
                    zIndex: 10001,
                    pointerEvents: "none",
                });
            },
            start() {
                const block = ko.dataFor(this);
                if (block && block.config) {
                    /**
                     * Swap all sortable instances to use intersect, as the item from the left panel is a predictable
                     * size this yields better results when dragging
                     */
                    $(".content-type-container.ui-sortable").each(function() {
                        if ($(this).data("sortable")) {
                            $(this).sortable("option", "tolerance", "intersect");
                        }
                    });
                    showDropIndicators(block.config.name);
                    setDraggedContentTypeConfig(block.config);
                    events.trigger("stage:interactionStart", {stage: self.parent.stage});
                }
            },
            stop() {
                $(".content-type-container.ui-sortable").each(function() {
                    if ($(this).data("sortable")) {
                        $(this).sortable("option", "tolerance", "pointer");
                    }
                });
                hideDropIndicators();
                setDraggedContentTypeConfig(null);
                events.trigger("stage:interactionStop", {stage: self.parent.stage});
            },
        };
    }

    /**
     * Populate the panel with the content types
     */
    private populateContentTypes(): void {
        const groups = Config.getConfig("groups");
        const contentTypes = Config.getConfig("content_types");

        // Verify the configuration contains the required information
        if (groups && contentTypes) {
            // Iterate through the groups creating new instances with their associated content types
            _.each(groups, (group, id) => {
                // Push the group instance into the observable array to update the UI
                this.groups.push(new Group(
                    id,
                    group,
                    _.map(
                        _.where(contentTypes, {
                            group: id,
                            is_visible: true,
                        }), /* Retrieve content types with group id */
                        (contentType: ContentTypeConfigInterface, identifier: string) => {
                            const groupContentType = new GroupContentType(identifier, contentType);
                            return groupContentType;
                        },
                    ),
                ));
            });

            // Display the panel
            this.isVisible(true);
            // Open first group
            const hasGroups = 0 in this.groups();
            if (hasGroups) {
                this.groups()[0].active(true);
            }

        } else {
            console.warn( "Configuration is not properly initialized, please check the Ajax response." );
        }
    }
}
