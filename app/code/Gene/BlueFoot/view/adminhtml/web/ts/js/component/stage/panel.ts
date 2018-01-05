/**
 * Copyright © 2013-2017 Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import uiComponent from 'uiComponent';
import _ from 'underscore';
import ko from 'knockout';
import { StageInterface } from "../stage.d";
import Config  from "../config";
import { Group } from "./panel/group";
import { Block as GroupBlock } from "./panel/group/block";
import { PanelInterface } from "./panel.d";
import { load as loadPreviews } from "./previews";

import "ko-draggable";
import "ko-sortable";
'use strict';
/*eslint-disable */
export default class Panel extends uiComponent implements PanelInterface {
    componentTemplate: string = 'Gene_BlueFoot/component/stage/panel.html';
    stage: StageInterface;
    searchValue: KnockoutObservable<string> = ko.observable('');
    searching: KnockoutObservable<boolean> = ko.observable(false);
    searchResults: KnockoutObservableArray<any> = ko.observableArray([]);
    groups: KnockoutObservableArray<any> = ko.observableArray([]);
    originalScrollTop: number = 0;
    defaults: object = {
        isVisible: false,
        isCollapsed: false,
        groups: [],
        searchValue: '',
        searching: false,
        searchResults: [],
        stage: false,
        originalScrollTop: false
    };

    // Observable's
    isVisible: KnockoutObservable<boolean>;
    isCollapsed: KnockoutObservable<boolean>;

    constructor() {
        super();

        loadPreviews();
    }

    /**
     * Bind the stage to the panel
     *
     * @param stage
     */
    bindStage(stage: StageInterface): void {
        this.stage = stage;
        stage.on('stageReady', () => {
            this.populateContentBlocks();
            this.isVisible(true);
        });
    }

    /**
     * Return the template string
     *
     * @returns {string}
     */
    getTemplate(): string {
        return this.componentTemplate;
    }

    /**
     * Initializes observable properties.
     *
     * @returns {Model} Chainable.
     */
    initObservable(): this {
        super.initObservable().observe('isVisible isCollapsed groups searchValue searching searchResults');

        return this;
    }

    /**
     * Conduct a search on the available content blocks,
     * and find matches for beginning of words.
     *
     * @param self
     * @param event
     */
    search(self: Panel, event: any): void {
        this.searchValue(event.currentTarget.value.toLowerCase());
        if (this.searchValue() === '') {
            this.searching(false);
        } else {
            this.searching(true);
            this.searchResults(_.map(
                _.filter(
                    Config.getInitConfig('contentTypes'),
                    function (contentBlock: ContentBlockConfig) {
                        const regEx = new RegExp('\\b' + self.searchValue(), 'gi');
                        const matches = contentBlock.label.toLowerCase().match(regEx) ? true : false;
                        return matches &&
                            contentBlock.is_visible === true;
                    }
                ),
                function (contentBlock, identifier: string) {
                    // Create a new instance of GroupBlock for each result
                    return new GroupBlock(identifier, contentBlock);
                })
            );
        }
    }

    /**
     * Populate the panel with the content blocks
     */
    populateContentBlocks(): void {
        let groups = Config.getInitConfig('groups'),
            contentBlocks = Config.getInitConfig('contentTypes');


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
                            is_visible: true
                        }), /* Retrieve content blocks with group id */
                        (contentBlock: ContentBlockConfig, identifier: string) => {
                            return new GroupBlock(identifier, contentBlock);
                        }
                    )
                ));
            });

            // Display the panel
            this.isVisible(true);
            // Open first group
            let hasGroups = 0 in this.groups();
            if (hasGroups) {
                this.groups()[0].active(true);
            }

        } else {
            console.warn('Configuration is not properly initialized, please check the Ajax response.');
        }
    }

    /**
     * Traverse up to the WYSIWYG component and set as full screen
     */
    fullScreen(): void {
        let isFullScreen = this.stage.parent.isFullScreen();
        if (!isFullScreen) {
            this.originalScrollTop = jQuery(window).scrollTop();
            _.defer(function () {
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
    collapse(): void {
        this.isCollapsed(!this.isCollapsed());
    }

    /**
     * Clear Search Results
     */
    clearSearch(): void {
        this.searchValue('');
        this.searching(false);
    }
}
