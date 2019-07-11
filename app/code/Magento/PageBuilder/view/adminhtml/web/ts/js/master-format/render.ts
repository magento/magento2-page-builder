/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import $ from "jquery";
import _ from "underscore";
import Config from "../config";
import ContentTypeCollectionInterface from "../content-type-collection.types";
import { getSerializedTree } from "./render/serialize";

function debugLog(message: any) {
    if (_.isObject(message) || _.isArray(message)) {
        message = JSON.stringify(message);
    }
    $("[name=debug]").append(message + "\n");
}

export default class MasterFormatRenderer {
    public stageId: string;
    public channel: MessageChannel;
    public ready: boolean = false;
    private readyDeferred: JQueryDeferred<void> = $.Deferred();

    /**
     * @param stageId
     */
    constructor(stageId: string) {
        this.stageId = stageId;
    }

    /**
     * Render the root container into a string
     *
     * @param {ContentTypeCollection} rootContainer
     * @returns {Promise<string>}
     */
    public applyBindings(rootContainer: ContentTypeCollectionInterface): Promise<string> {
        if (!this.getRenderFrame()) {
            debugLog("No render frame");
            console.error("No render frame present for Page Builder instance.");
            return;
        }

        return new Promise((resolve, reject) => {
            if (this.ready) {
                debugLog("Frame is ready, posting data");
                try {
                    this.channel.port1.postMessage({
                        type: "render",
                        message: {
                            stageId: this.stageId,
                            tree: getSerializedTree(rootContainer),
                        },
                    });
                } catch (e) {
                    debugLog("Error in postMessage");
                    debugLog(e);
                }
                this.channel.port1.onmessage = (event) => {
                    if (event.isTrusted) {
                        if (event.data.type === "render") {
                            console.log(event.data.message);
                            debugLog("Render complete, resolving event");
                            resolve(event.data.message);
                        }
                        if (event.data.type === "template") {
                            debugLog("Requested template " + event.data.message);
                            this.loadTemplate(event.data.message);
                        }
                    } else {
                        reject();
                    }
                };
            } else {
                debugLog("Frame not ready, waiting for ready...");
                this.readyDeferred.then(() => {
                    debugLog("Frame became ready");
                    this.applyBindings(rootContainer).then((rendered: string) => {
                        resolve(rendered);
                    }).catch(() => {
                        reject();
                    });
                });
            }
        });
    }

    /**
     * Create a channel to communicate with our sandboxed iframe
     */
    public setupChannel() {
        debugLog("Setting up channel");
        this.channel = new MessageChannel();
        const frame = this.getRenderFrame();
        window.addEventListener("message", (event) => {
            debugLog("onLoad message called");
            debugLog(event);
            if (event.data === "PB_RENDER_READY") {
                frame.contentWindow.postMessage("PB_RENDER_PORT", "*", [this.channel.port2]);
                this.ready = true;
                this.readyDeferred.resolve();
                debugLog("channel is ready");
            }
        });
        frame.src = Config.getConfig("render_url");
    }

    /**
     * Use the text! RequireJS plugin to load a template and send it back to the child render iframe
     *
     * @param name
     */
    private loadTemplate(name: string): void {
        require(["text!" + name], (template: string) => {
            debugLog("Loaded template " + name);
            this.channel.port1.postMessage({
                type: "template",
                message: {
                    name,
                    template,
                },
            });
        });
    }

    /**
     * Retrieve the render frame
     *
     * @returns {HTMLIFrameElement}
     */
    private getRenderFrame(): HTMLIFrameElement {
        return document.getElementById("render_frame_" + this.stageId) as HTMLIFrameElement;
    }
}
