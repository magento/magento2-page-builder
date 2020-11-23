/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import $ from "jquery";
import ko from "knockout";
import $t from "mage/translate";
import events from "Magento_PageBuilder/js/events";
import { formatPath } from "Magento_Ui/js/lib/knockout/template/loader";
import alertDialog from "Magento_Ui/js/modal/alert";
import utils from "mageUtils";
import _ from "underscore";
import {isAllowed, resources} from "./acl";
import "./binding/style";
import Config from "./config";
import ConfigInterface from "./config.types";
import ContentTypeCollectionInterface from "./content-type-collection";
import createContentType from "./content-type-factory";
import PageBuilderInterface from "./page-builder.types";
import Panel from "./panel";
import Stage from "./stage";
import {StageToggleFullScreenParamsInterface} from "./stage-events.types";
import {saveAsTemplate} from "./template-manager";

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
    public isSnapshot: KnockoutObservable<boolean> = ko.observable(false);
    public isSnapshotTransition: KnockoutObservable<boolean> = ko.observable(false);
    public loading: KnockoutObservable<boolean> = ko.observable(true);
    public wrapperStyles: KnockoutObservable<{[key: string]: string}> = ko.observable({});
    public stageStyles: KnockoutObservable<{[key: string]: string}> = ko.observable({});
    public isAllowedTemplateSave: boolean;
    public isAllowedTemplateApply: boolean;
    public defaultViewport: string;
    public viewport: KnockoutObservable<string> = ko.observable("");
    public viewports: {[key: string]: object} = {};
    public viewportClasses: {[key: string]: KnockoutObservable<boolean>} = {};
    private previousStyles: {[key: string]: string} = {};
    private previousPanelHeight: number;
    private snapshot: boolean;

    constructor(config: any, initialValue: string) {
        Config.setConfig(config);
        Config.setMode("Preview");
        this.preloadTemplates(config);
        this.initialValue = initialValue;
        this.initViewports(config);
        this.isFullScreen(config.isFullScreen);
        this.isSnapshot(!!config.pagebuilder_content_snapshot);
        this.isSnapshotTransition(false);
        this.snapshot = !!config.pagebuilder_content_snapshot;
        this.config = config;

        this.isAllowedTemplateApply = isAllowed(resources.TEMPLATE_APPLY);
        this.isAllowedTemplateSave = isAllowed(resources.TEMPLATE_SAVE);

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
     * Destroy rootContainer instance.
     */
    public destroy() {
        this.stage.rootContainer.destroy();
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
    public toggleFullScreen(args: StageToggleFullScreenParamsInterface): boolean {
        if (args.animate === false) {
            this.isFullScreen(!this.isFullScreen());
            return;
        }

        const stageWrapper = $("#" + this.stage.id).parent();
        const pageBuilderWrapper = stageWrapper.parents(".pagebuilder-wysiwyg-wrapper");
        const panel = stageWrapper.find(".pagebuilder-panel");

        if (this.snapshot) {
            stageWrapper.scrollTop(0);
        }

        if (!this.isFullScreen()) {
            pageBuilderWrapper.css("height", pageBuilderWrapper.outerHeight());
            /**
             * Fix the stage in the exact place it is when it's part of the content and allow it to transition to full
             * screen.
             */
            const xPosition = parseInt(stageWrapper.offset().top.toString(), 10) -
                parseInt($(window).scrollTop().toString(), 10) - (this.snapshot ? 63 : 0);
            const yPosition = stageWrapper.offset().left - (this.snapshot ? 150 : 0);
            this.previousStyles = {
                position: this.snapshot ? "relative" : "fixed",
                top: `${xPosition}px`,
                left: `${yPosition}px`,
                zIndex: "800",
                width: stageWrapper.outerWidth().toString() + "px",
            };

            if (this.snapshot) {
                this.isSnapshot(false);
                this.stageStyles(this.previousStyles);
            } else {
                this.previousPanelHeight = panel.outerHeight();
                panel.css("height", this.previousPanelHeight + "px");
                this.wrapperStyles(this.previousStyles);
            }

            this.isFullScreen(true);
            _.defer(() => {
                // Remove all styles we applied to fix the position once we're transitioning
                panel.css("height", "");
                if (this.snapshot) {
                    this.stageStyles(Object.keys(this.previousStyles)
                        .reduce((object: object, styleName: string) => {
                            return Object.assign(object, {[styleName]: ""});
                        }, {}),
                    );
                } else {
                    this.wrapperStyles(Object.keys(this.previousStyles)
                        .reduce((object: object, styleName: string) => {
                            return Object.assign(object, {[styleName]: ""});
                        }, {}),
                    );
                }
            });
        } else {
            // When leaving full screen mode just transition back to the original state
            if (this.snapshot) {
                this.isSnapshotTransition(true);
                this.stageStyles(this.previousStyles);
            } else {
                this.wrapperStyles(this.previousStyles);
                this.isFullScreen(false);
            }

            panel.css("height", this.previousPanelHeight + "px");
            // Wait for the 350ms animation to complete before changing these properties back
            _.delay(() => {
                if (this.snapshot) {
                    this.isSnapshot(true);
                    this.isSnapshotTransition(false);
                    this.stageStyles(Object.keys(this.previousStyles)
                        .reduce((object: object, styleName: string) => {
                            return Object.assign(object, {[styleName]: ""});
                        }, {}),
                    );
                    this.isFullScreen(false);
                } else {
                    this.wrapperStyles(Object.keys(this.previousStyles)
                        .reduce((object: object, styleName: string) => {
                            return Object.assign(object, {[styleName]: ""});
                        }, {}),
                    );
                }

                panel.css("height", "");
                pageBuilderWrapper.css("height", "");
                this.previousStyles = {};
                this.previousPanelHeight = null;
            }, 350);
        }

        return true;
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

        events.trigger(`stage:${this.id}:fullScreenModeChangeAfter`, {
            fullScreen: this.isFullScreen(),
        });
        events.trigger(`stage:fullScreenModeChangeAfter`, {
            pageBuilderId: this.id,
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

    get viewportTemplate(): string {
        return "Magento_PageBuilder/viewport/switcher";
    }

    /**
     * Toggle template manager
     */
    public toggleTemplateManger() {
        if (!isAllowed(resources.TEMPLATE_APPLY)) {
            alertDialog({
                content: $t("You do not have permission to apply templates."),
                title: $t("Permission Error"),
            });
            return false;
        }

        events.trigger(`stage:templateManager:open`, {
            stage: this.stage,
        });
    }

    /**
     * Enable saving the current stage as a template
     */
    public saveAsTemplate() {
        return saveAsTemplate(this.stage);
    }

    public toggleViewport(viewport: string) {
        const previousViewport = this.viewport();

        this.viewport(viewport);
        _.each(this.viewportClasses, (viewportClass) => {
            viewportClass(false);
        });
        this.viewportClasses[`${viewport}-viewport`](true);
        Config.setConfig({
            viewport,
        } as ConfigInterface);
        events.trigger(`stage:${this.id}:viewportChangeAfter`, {
            viewport,
            previousViewport,
        });
        events.trigger(`stage:viewportChangeAfter`, {
            viewport,
            previousViewport,
        });
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

    private initViewports(config: any): void {
        this.viewports = config.viewports;
        this.defaultViewport = config.defaultViewport;
        this.viewport(this.defaultViewport);
        Config.setConfig({
            viewport: this.defaultViewport,
        } as ConfigInterface);
        _.each(this.viewports, (viewport: {[key: string]: any}, name: string) => {
            this.viewportClasses[`${name}-viewport`] = ko.observable(name === this.defaultViewport);
        });
    }
}
