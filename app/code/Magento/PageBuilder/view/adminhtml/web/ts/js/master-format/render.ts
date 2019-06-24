/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import $ from "jquery";
import ContentTypeCollectionInterface from "../content-type-collection.types";
import { getSerializedTree } from "./render/serialize";

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
            console.error("No render frame present for Page Builder instance.");
            return;
        }

        return new Promise((resolve, reject) => {
            if (this.ready) {
                this.channel.port1.postMessage({
                    type: "render",
                    message: getSerializedTree(rootContainer),
                });
                this.channel.port1.onmessage = (event) => {
                    if (event.isTrusted) {
                        if (event.data.type === "render") {
                            console.log(event.data.message);
                            resolve(event.data.message);
                        }
                        if (event.data.type === "template") {
                            this.loadTemplate(event.data.message);
                        }
                    } else {
                        reject();
                    }
                };
            } else {
                this.readyDeferred.then(() => {
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
        this.channel = new MessageChannel();
        const frame = this.getRenderFrame();
        frame.onload = () => {
            window.addEventListener("message", (event) => {
                if (event.data === "PB_RENDER_READY") {
                    frame.contentWindow.postMessage("PB_RENDER_PORT", "*", [this.channel.port2]);
                    this.ready = true;
                    this.readyDeferred.resolve();
                }
            });
        };
    }

    /**
     * Use the text! RequireJS plugin to load a template and send it back to the child render iframe
     *
     * @param name
     */
    private loadTemplate(name: string): void {
        require(["text!" + name], (template: string) => {
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
