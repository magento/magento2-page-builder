/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ko from "knockout";
import utils from "mageUtils";
import _ from "underscore";
import Config from "./config";
import EventBus from "./event-bus";
import { PageBuilderInterface } from "./page-builder.d";
import Stage from "./stage";
import Panel from "./stage/panel";

export default class PageBuilder implements PageBuilderInterface {
    public template: string = "Magento_PageBuilder/component/page-builder.html";
    public panel: Panel;
    public stage: Stage;
    public config: object;
    public initialValue: string;
    public id: string = utils.uniqueid();
    public stageId: string = utils.uniqueid();
    public panelId: string = utils.uniqueid();
    public originalScrollTop: number = 0;
    public isFullScreen: KnockoutObservable<boolean> = ko.observable(false);
    public loading: KnockoutObservable<boolean> = ko.observable(true);

    constructor(config: any, initialValue: string) {
        Config.setInitConfig(config);
        this.initialValue = initialValue;
        this.isFullScreen(config.isFullScreen);
        this.config = config;
        this.stage = new Stage(this);
        this.panel = new Panel(this);
        this.initListeners();
    }

    public initListeners() {
        EventBus.on(`pagebuilder:toggleFullScreen:${ this.id }`, () => this.toggleFullScreen());
        this.isFullScreen.subscribe(() => this.onFullScreenChange());
    }

    /**
     * Tells the stage wrapper to expand to fullScreen
     */
    public toggleFullScreen(): void {
        this.isFullScreen(!this.isFullScreen());
    }

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

        EventBus.trigger(`pagebuilder:fullScreen:${ this.id }`, {
            fullScreen: this.isFullScreen(),
        });
    }

    public getTemplate() {
        return this.template;
    }
}
