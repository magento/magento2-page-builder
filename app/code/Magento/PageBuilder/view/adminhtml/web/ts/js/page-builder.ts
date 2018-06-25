/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ko from "knockout";
import utils from "mageUtils";
import events from "uiEvents";
import _ from "underscore";
import Config from "./config";
import PageBuilderInterface from "./page-builder.d";
import Panel from "./panel";
import Stage from "./stage";

/**
 * @api
 */
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
        events.on(`pagebuilder:toggleFullScreen:${ this.id }`, () => this.toggleFullScreen());
        this.isFullScreen.subscribe(() => this.onFullScreenChange());
    }

    /**
     * Tells the stage wrapper to expand to fullScreen
     */
    public toggleFullScreen(): void {
        this.isFullScreen(!this.isFullScreen());
    }

    /**
     * Change window scroll base on full screen mode.
     */
    public onFullScreenChange(): void {
        if (this.isFullScreen()) {
            this.originalScrollTop = window.scrollY;
            _.defer(() => {
                window.scroll(0, 0);
            });
        } else {
            _.defer(() => {
                window.scroll(0, this.originalScrollTop);
            });
        }

        events.trigger(`pagebuilder:fullScreen:${ this.id }`, {
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
