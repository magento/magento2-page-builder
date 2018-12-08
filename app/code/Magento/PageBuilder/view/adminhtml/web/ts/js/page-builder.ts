/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import _ from "underscore";
import $ from "jquery";
import ko from "knockout";
import events from "Magento_PageBuilder/js/events";
import utils from "mageUtils";
import Config from "./config";
import PageBuilderInterface from "./page-builder.d";
import Panel from "./panel";
import Stage from "./stage";
import StageToggleFullScreenParamsInterface from "./stage-toggle-full-screen-params";

export default class PageBuilder implements PageBuilderInterface {
    public template: string = "Magento_PageBuilder/page-builder";
    public panel: Panel;
    public stage: Stage;
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
        this.initialValue = initialValue;
        this.isFullScreen(config.isFullScreen);
        this.config = config;
        this.stage = new Stage(this);
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
        if (typeof args.animate !== "undefined" && args.animate === false) {
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
            this.previousWrapperStyles = {
                'position': 'fixed',
                'top': parseInt(stageWrapper.offset().top.toString(), 10) -
                parseInt($(window).scrollTop().toString(), 10) + 'px',
                'left': stageWrapper.offset().left + 'px',
                'zIndex': '800',
                'width': stageWrapper.outerWidth().toString() + 'px'
            };
            this.wrapperStyles(this.previousWrapperStyles);
            this.isFullScreen(true);
            _.defer(() => {
                // Remove all styles we applied to fix the position once we're transitioning
                panel.css("height", "");
                this.wrapperStyles(Object.keys(this.previousWrapperStyles)
                    .reduce((object: object, styleName: string) => {
                        return Object.assign(object, {[styleName]: ""});
                    }, {})
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
                    }, {})
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
}
