/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ko from "knockout";
import "ko-draggable";
import "ko-sortable";
import $t from "mage/translate";
import events from "uiEvents";
import _ from "underscore";
import ContentTypeConfigInterface from "../../content-type-config.d";
import Config from "../config";
import PageBuilder from "../page-builder";
import { PanelInterface } from "./panel.d";
import { Group } from "./panel/group";
import { Block as GroupBlock } from "./panel/group/block";

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
    private template: string = "Magento_PageBuilder/component/stage/panel.html";

    constructor(parent: PageBuilder) {
        this.parent = parent;
        this.id = this.parent.id;
        this.initListeners();
    }

    /**
     * Init listeners
     */
    public initListeners(): void {
        events.on("stage:ready:" + this.id, () => {
            this.populateContentBlocks();
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
     * Conduct a search on the available content blocks,
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
                    (contentBlock: ContentTypeConfigInterface) => {
                        const regEx = new RegExp("\\b" + self.searchValue(), "gi");
                        const matches = !!contentBlock.label.toLowerCase().match(regEx);
                        return matches &&
                            contentBlock.is_visible === true;
                    },
                ),
                (contentBlock, identifier: string) => {
                    // Create a new instance of GroupBlock for each result
                    return new GroupBlock(identifier, contentBlock);
                }),
            );
        }
    }

    /**
     * Traverse up to the WYSIWYG component and set as full screen
     */
    public fullScreen(): void {
        events.trigger(`pagebuilder:toggleFullScreen:${ this.parent.id }`);
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
     * Populate the panel with the content blocks
     */
    private populateContentBlocks(): void {
        const groups = Config.getConfig("groups");
        const contentBlocks = Config.getConfig("content_types");

        // Verify the configuration contains the required information
        if (groups && contentBlocks) {
            // Iterate through the groups creating new instances with their associated content blocks
            _.each(groups, (group, id) => {
                // Push the group instance into the observable array to update the UI
                this.groups.push(new Group(
                    id,
                    group,
                    _.map(
                        _.where(contentBlocks, {
                            group: id,
                            is_visible: true,
                        }), /* Retrieve content blocks with group id */
                        (contentBlock: ContentTypeConfigInterface, identifier: string) => {
                            const groupBlock = new GroupBlock(identifier, contentBlock);
                            return groupBlock;
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
