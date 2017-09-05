import * as uiComponent from 'uiComponent';
import * as _ from 'underscore';
import * as ko from 'knockout';
import Config from "../config";
import { Group } from "./panel/group";
import { Block as GroupBlock } from "./panel/group/block";
/**
 * Panel Component
 *
 * @author Dave Macaulay <hello@davemacalay.com>
 */
export default class Panel extends uiComponent {
    constructor() {
        super();
        this.componentTemplate = 'Gene_BlueFoot/component/stage/panel.html';
        this.searching = ko.observable(false);
        this.searchResults = ko.observableArray([]);
        this.groups = ko.observableArray([]);
        this.originalScrollTop = 0;
        this.defaults = {
            isVisible: false,
            isCollapsed: false,
            groups: [],
            searching: false,
            searchResults: [],
            stage: false,
            originalScrollTop: false
        };
        // Previews.load
    }
    /**
     * Bind the stage to the panel
     *
     * @param stage
     */
    bindStage(stage) {
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
    getTemplate() {
        return this.componentTemplate;
    }
    /**
     * Initializes observable properties.
     *
     * @returns {Model} Chainable.
     */
    initObservable() {
        super.observe('isVisible isCollapsed groups searching searchResults');
        return this;
    }
    /**
     * Conduct a search on the available content blocks
     *
     * @param self
     * @param event
     */
    search(self, event) {
        let searchValue = event.currentTarget.value.toLowerCase();
        if (searchValue === '') {
            this.searching(false);
        }
        else {
            this.searching(true);
            this.searchResults(_.map(_.filter(Config.getInitConfig('contentBlocks'), function (contentBlock) {
                return contentBlock.name.toLowerCase().indexOf(searchValue) > -1 &&
                    contentBlock.visible === true;
            }), function (contentBlock) {
                // Create a new instance of GroupBlock for each result
                return new GroupBlock(contentBlock);
            }));
        }
    }
    /**
     * Populate the panel with the content blocks
     */
    populateContentBlocks() {
        let groups = Config.getInitConfig('groups'), contentBlocks = Config.getInitConfig('contentBlocks');
        // Verify the configuration contains the required information
        if (groups && contentBlocks) {
            // Iterate through the groups creating new instances with their associated content blocks
            _.each(groups, (group, id) => {
                // Push the group instance into the observable array to update the UI
                this.groups.push(new Group(id, group, _.map(_.where(contentBlocks, {
                    group: id,
                    visible: true
                }), /* Retrieve content blocks with group id */ (contentBlock) => {
                    return new GroupBlock(contentBlock);
                })));
            });
            // Display the panel
            this.isVisible(true);
        }
        else {
            console.warn('Configuration is not properly initialized, please check the Ajax response.');
        }
    }
    /**
     * Traverse up to the WYSIWYG component and set as full screen
     */
    fullScreen() {
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
    collapse() {
        this.isCollapsed(!this.isCollapsed());
    }
}
