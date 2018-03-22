/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ko from "knockout";
import "ko-draggable";
import "ko-sortable";
import uiComponent from "uiComponent";
import $t from 'mage/translate';
import _ from "underscore";
import Config, {ConfigContentBlock} from "../config";
import EventBus from "../event-bus";
import { StageInterface } from "../stage.d";
import { PanelInterface } from "./panel.d";
import { Group } from "./panel/group";
import { Block as GroupBlock } from "./panel/group/block";
import { load as loadPreviews } from "./previews";

export default class Panel extends uiComponent implements PanelInterface {
    public componentTemplate: string = "Magento_PageBuilder/component/stage/panel.html";
    public defaults: object = {
        groups: [],
        isCollapsed: false,
        isVisible: false,
        originalScrollTop: false,
        searchResults: [],
        searchPlaceholder: $t('Find items'),
        searchNoResult: $t('Nothing found'),
        fullScreenTitle: $t('Full Screen'),
        searchTitle: $t('Clear Search'),
        searchValue: '',
        searching: false,
        stage: false,
    };
    public groups: KnockoutObservableArray<any> = ko.observableArray([]);
    // Observables
    public isCollapsed: KnockoutObservable<boolean>;
    public isVisible: KnockoutObservable<boolean>;
    // End Observables
    public stage: StageInterface;
    public searchValue: KnockoutObservable<string> = ko.observable("");
    public searching: KnockoutObservable<boolean> = ko.observable(false);
    public searchResults: KnockoutObservableArray<any> = ko.observableArray([]);
    public originalScrollTop: number = 0;

    constructor() {
        super();
        loadPreviews();
    }

    /**
     * Bind the stage to the panel
     *
     * @param stage
     */
    public bindStage(stage: StageInterface): void {
        this.stage = stage;
        EventBus.on("stage:ready", (event, params) => {
            if (this.stage.id === params.stage.id) {
                this.populateContentBlocks();
                this.isVisible(true);
            }
        });
    }

    /**
     * Return the template string
     *
     * @returns {string}
     */
    public getTemplate(): string {
        return this.componentTemplate;
    }

    /**
     * Initializes observable properties.
     *
     * @returns {Model} Chainable.
     */
    public initObservable(): this {
        super.initObservable().observe("isVisible isCollapsed groups searchValue searching searchResults");

        return this;
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
                    Config.getInitConfig("content_types"),
                    (contentBlock: ConfigContentBlock) => {
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
     * Populate the panel with the content blocks
     */
    public populateContentBlocks(): void {
        const groups = Config.getInitConfig("groups");
        const contentBlocks = Config.getInitConfig("content_types");

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
                        (contentBlock: ConfigContentBlock, identifier: string) => {
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

    /**
     * Traverse up to the WYSIWYG component and set as full screen
     */
    public fullScreen(): void {
        const isFullScreen = this.stage.parent.isFullScreen();
        if (!isFullScreen) {
            this.originalScrollTop = jQuery(window).scrollTop();
            _.defer(() => {
                jQuery(window).scrollTop(0);
            });
        }

        this.stage.parent.isFullScreen(!isFullScreen);
        if (isFullScreen) {
            jQuery(window).scrollTop(this.originalScrollTop);
        }
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
}
