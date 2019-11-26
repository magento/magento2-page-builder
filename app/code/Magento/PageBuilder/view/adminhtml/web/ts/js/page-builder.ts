/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import $ from "jquery";
import ko from "knockout";
import events from "Magento_PageBuilder/js/events";
import { formatPath } from "Magento_Ui/js/lib/knockout/template/loader";
import utils from "mageUtils";
import _ from "underscore";
import Config from "./config";
import ConfigInterface from "./config.types";
import ContentTypeCollectionInterface from "./content-type-collection";
import createContentType from "./content-type-factory";
import PageBuilderInterface from "./page-builder.types";
import Panel from "./panel";
import Stage from "./stage";
import {StageToggleFullScreenParamsInterface} from "./stage-events.types";

export default class PageBuilder implements PageBuilderInterface {
    public template: string = "Magento_PageBuilder/page-builder";
    public panel: Panel;
    public stage: Stage;
    public isStageReady: KnockoutObservable<boolean> = ko.observable(false);
    public config: object;
    public initialValue: string;
    public id: string = utils.uniqueid();
    public originalScrollTop: number = 0;
    public isFullScreen: KnockoutObservable<boolean> = ko.observable(false);
    public loading: KnockoutObservable<boolean> = ko.observable(true);
    public wrapperStyles: KnockoutObservable<{[key: string]: string}> = ko.observable({});
    private previousWrapperStyles: {[key: string]: string} = {};
    private previousPanelHeight: number;

    constructor(config: any, initialValue: string) {
        Config.setConfig(config);
        Config.setMode("Preview");
        this.preloadTemplates(config);
        this.initialValue = initialValue;
        this.isFullScreen(config.isFullScreen);
        this.config = config;

        // Create the required root container for the stage
        createContentType(
            Config.getContentTypeConfig(Stage.rootContainerName),
            null,
            this.id,
        ).then((rootContainer: ContentTypeCollectionInterface) => {
            this.stage = new Stage(this, rootContainer);
            this.isStageReady(true);
        });

        this.panel = new Panel(this);
        this.initListeners();
    }

    /**
     * Init listeners.
     */
    public initListeners() {
        events.on(`stage:${ this.id }:toggleFullscreen`, this.toggleFullScreen.bind(this));
        this.isFullScreen.subscribe(() => this.onFullScreenChange());
    }

    /**
     * Tells the stage wrapper to expand to fullScreen
     *
     * @param {StageToggleFullScreenParamsInterface} args
     */
    public toggleFullScreen(args: StageToggleFullScreenParamsInterface): void {
        if (args.animate === false) {
            this.isFullScreen(!this.isFullScreen());
            return;
        }

        const stageWrapper = $("#" + this.stage.id).parent();
        const pageBuilderWrapper = stageWrapper.parents(".pagebuilder-wysiwyg-wrapper");
        const panel = stageWrapper.find(".pagebuilder-panel");
        if (!this.isFullScreen()) {
            pageBuilderWrapper.css("height", pageBuilderWrapper.outerHeight());
            this.previousPanelHeight = panel.outerHeight();
            panel.css("height", this.previousPanelHeight + "px");
            /**
             * Fix the stage in the exact place it is when it's part of the content and allow it to transition to full
             * screen.
             */
            const xPosition = parseInt(stageWrapper.offset().top.toString(), 10) -
                parseInt($(window).scrollTop().toString(), 10);
            const yPosition = stageWrapper.offset().left;
            this.previousWrapperStyles = {
                position: "fixed",
                top: `${xPosition}px`,
                left: `${yPosition}px`,
                zIndex: "800",
                width: stageWrapper.outerWidth().toString() + "px",
            };
            this.wrapperStyles(this.previousWrapperStyles);
            this.isFullScreen(true);
            _.defer(() => {
                // Remove all styles we applied to fix the position once we're transitioning
                panel.css("height", "");
                this.wrapperStyles(Object.keys(this.previousWrapperStyles)
                    .reduce((object: object, styleName: string) => {
                        return Object.assign(object, {[styleName]: ""});
                    }, {}),
                );
            });
        } else {
            // When leaving full screen mode just transition back to the original state
            this.wrapperStyles(this.previousWrapperStyles);
            this.isFullScreen(false);
            panel.css("height", this.previousPanelHeight + "px");
            // Wait for the 350ms animation to complete before changing these properties back
            _.delay(() => {
                panel.css("height", "");
                pageBuilderWrapper.css("height", "");
                this.wrapperStyles(Object.keys(this.previousWrapperStyles)
                    .reduce((object: object, styleName: string) => {
                        return Object.assign(object, {[styleName]: ""});
                    }, {}),
                );
                this.previousWrapperStyles = {};
                this.previousPanelHeight = null;
            }, 350);
        }
    }

    /**
     * Change window scroll base on full screen mode.
     */
    public onFullScreenChange(): void {
        if (this.isFullScreen()) {
            $("body").css("overflow", "hidden");
        } else {
            $("body").css("overflow", "");
        }

        events.trigger(`stage:${ this.id }:fullScreenModeChangeAfter`, {
            fullScreen: this.isFullScreen(),
        });
    }

    /**
     * Get template.
     *
     * @returns {string}
     */
    public getTemplate() {
        return this.template;
    }

    /**
     * Preload all templates into the window to reduce calls later in the app
     *
     * @param config
     */
    private preloadTemplates(config: ConfigInterface): void {
        const previewTemplates = _.values(config.content_types).map((contentType) => {
            return _.values(contentType.appearances).map((appearance) => {
                return appearance.preview_template;
            });
        }).reduce((array, value) => array.concat(value), []).map((value) => formatPath(value));

        _.defer(() => {
            require(previewTemplates);
        });
    }
}
