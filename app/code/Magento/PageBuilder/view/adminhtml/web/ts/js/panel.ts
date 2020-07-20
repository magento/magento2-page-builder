/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import consoleLogger from "consoleLogger";
import $ from "jquery";
import ko from "knockout";
import $t from "mage/translate";
import events from "Magento_PageBuilder/js/events";
import _ from "underscore";
import "./binding/draggable";
import Config from "./config";
import ContentTypeConfigInterface from "./content-type-config.types";
import {hideDropIndicators, showDropIndicators} from "./drag-drop/drop-indicators";
import {setDraggedContentTypeConfig} from "./drag-drop/registry";
import PageBuilder from "./page-builder";
import {Menu} from "./panel/menu";
import {ContentType as GroupContentType} from "./panel/menu/content-type";
import {supportsPositionSticky} from "./utils/position-sticky";

/**
 * @api
 */
export default class Panel {
    public menuSections: KnockoutObservableArray<any> = ko.observableArray([]);
    public searchResults: KnockoutObservableArray<any> = ko.observableArray([]);
    public isVisible: KnockoutObservable<boolean> = ko.observable(false);
    public isStickyBottom: KnockoutObservable<boolean> = ko.observable(false);
    public isStickyTop: KnockoutObservable<boolean> = ko.observable(false);
    public searching: KnockoutObservable<boolean> = ko.observable(false);
    public searchValue: KnockoutObservable<string> = ko.observable("");
    public searchPlaceholder: string = $t("Find items");
    public searchNoResult: string = $t("Nothing found");
    public searchTitle: string = $t("Clear Search");
    public pageBuilder: PageBuilder;
    public id: string;
    private element: Element;
    private template: string = "Magento_PageBuilder/panel";

    constructor(pageBuilder: PageBuilder) {
        this.pageBuilder = pageBuilder;
        this.id = this.pageBuilder.id;
        this.initListeners();
    }

    /**
     * On render init the panel
     *
     * @param {Element} element
     */
    public afterRender(element: Element): void {
        this.element = element;
    }

    /**
     * Init listeners
     */
    public initListeners(): void {
        events.on("stage:" + this.id + ":readyAfter", () => {
            this.populateContentTypes();
            if (!supportsPositionSticky()) {
                this.onScroll();
            }
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
                        if (contentType.is_system !== true) {
                            return false;
                        }

                        const escapedSearchValue = self.searchValue().replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
                        const regEx = new RegExp("\\b" + escapedSearchValue, "gi");

                        return regEx.test(contentType.label.toLowerCase());
                    },
                ),
                (contentType, identifier: string) => {
                    // Create a new instance of GroupContentType for each result
                    return new GroupContentType(identifier, contentType, this.pageBuilder.stage.id);
                }),
            );
        }
    }

    /**
     * Clear Search Results
     */
    public clearSearch(): void {
        this.searchValue("");
        this.searching(false);
    }

    /**
     * Toggle stickiness of panel based on browser scroll position and height of panel
     * Enable panel stickiness if panel and stage are available
     * Only stick when panel height is smaller than stage height
     * Stick panel to top when scroll reaches top position of stage
     * Stick panel to bottom when scroll reaches bottom position of stage
     */
    public onScroll(): void {
        const self = this;
        const pageActions = $(".page-actions");
        const panel = $(this.element);
        panel.addClass("no-position-sticky");
        const stage = panel.siblings(".pagebuilder-stage");
        $(window).scroll(function() {
            if (panel && panel.offset()) {
                const panelOffsetTop = panel.offset().top;
                const stageOffsetTop = stage.offset().top;
                const panelHeight = panel.outerHeight();
                const stageHeight = stage.outerHeight();
                const currentPanelBottom = Math.round(panelOffsetTop + panel.outerHeight(true) - $(this).scrollTop());
                const currentStageBottom = Math.round(stageOffsetTop + stage.outerHeight(true) - $(this).scrollTop());
                const currentPanelTop = Math.round(panelOffsetTop - $(this).scrollTop());
                const currentStageTop = Math.round(stageOffsetTop - $(this).scrollTop());
                // When panel height is less than stage, begin stickiness
                if (panelHeight <= stageHeight && pageActions.hasClass("_fixed")) {
                    const pageActionsHeight = pageActions.outerHeight() + 15;
                    // When scroll reaches top of stage, stick panel to top
                    if (currentStageTop <= pageActionsHeight) {
                        // When panel reaches bottom of stage, stick panel to bottom of stage
                        if (currentPanelBottom >= currentStageBottom && currentPanelTop <= pageActionsHeight) {
                            self.isStickyBottom(true);
                            self.isStickyTop(false);
                        } else {
                            self.isStickyBottom(false);
                            self.isStickyTop(true);
                        }
                    } else {
                        self.isStickyBottom(false);
                        self.isStickyTop(false);
                    }
                } else {
                    self.isStickyBottom(false);
                    self.isStickyTop(false);
                }
            }
        });
    }

    /**
     * Retrieve the draggable options for the panel items
     *
     * @returns {JQueryUI.DraggableOptions}
     */
    public getDraggableOptions(element: HTMLElement): JQueryUI.DraggableOptions {
        // If we're within a modal make the containment be the current modal
        let containment: JQuery;
        if ($(element).parents(".modal-inner-wrap").length > 0) {
            containment = $(element).parents(".modal-inner-wrap");
        }

        const self = this;
        return {
            appendTo: "body",
            cursor: "-webkit-grabbing",
            connectToSortable: ".content-type-drop",
            containment: containment || "document",
            scroll: true,
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
                    // Blur any focused element
                    if (document.querySelector(":focus")) {
                        document.querySelector<HTMLElement>(":focus").blur();
                    }

                    /**
                     * Swap all sortable instances to use intersect, as the item from the left panel is a predictable
                     * size this yields better results when dragging
                     */
                    $(".content-type-container.ui-sortable").each(function() {
                        if ($(this).data("sortable")) {
                            $(this).sortable("option", "tolerance", "intersect");
                        }
                    });
                    showDropIndicators(block.config.name, self.pageBuilder.stage.id);
                    setDraggedContentTypeConfig(block.config);
                    events.trigger("stage:interactionStart", {stage: self.pageBuilder.stage});
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
                events.trigger("stage:interactionStop", {stage: self.pageBuilder.stage});
            },
        };
    }

    /**
     * Populate the panel with the content types
     */
    private populateContentTypes(): void {
        const menuSections = Config.getConfig("menu_sections");
        const contentTypes = Config.getConfig("content_types");

        // Verify the configuration contains the required information
        if (menuSections && contentTypes) {
            // Iterate through the menu sections creating new instances with their associated content types
            _.each(menuSections, (menuSection, id) => {
                // Push the menu section instance into the observable array to update the UI
                this.menuSections.push(new Menu(
                    id,
                    menuSection,
                    _.map(
                        _.where(contentTypes, {
                            menu_section: id,
                            is_system: true,
                        }), /* Retrieve content types with menu section id */
                        (contentType: ContentTypeConfigInterface, identifier: string) => {
                            return new GroupContentType(
                                identifier,
                                contentType,
                                this.pageBuilder.stage.id,
                            );
                        },
                    ),
                    this.pageBuilder.stage.id,
                ));
            });

            // Display the panel
            this.isVisible(true);
            // Open first menu section
            const hasGroups = 0 in this.menuSections();
            if (hasGroups) {
                this.menuSections()[0].active(true);
            }

        } else {
            consoleLogger.error("Unable to retrieve content types from server, please inspect network requests " +
                "response.");
        }
    }
}
