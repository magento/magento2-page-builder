/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import $ from "jquery";
import ko from "knockout";
import engine from "Magento_Ui/js/lib/knockout/template/engine";
import Config from "../../config";
import ConfigInterface from "../../config.types";
import ContentTypeCollectionInterface from "../../content-type-collection.types";
import createContentType from "../../content-type-factory";
import ContentTypeInterface from "../../content-type.types";
import decodeAllDataUrlsInString from "../../utils/directives";
import filterHtml from "../filter-html";
import { TreeItem } from "./serialize";

let port: MessagePort = null;
const portDeferred: JQueryDeferred<MessagePort> = $.Deferred();
const deferredTemplates: {[key: string]: JQueryDeferred<string>} = {};

/**
 * Listen for requests from the parent window for a render
 */
export default function listen(config: ConfigInterface) {
    Config.setConfig(config);
    Config.setMode("Master");

    /**
     * Create a listener within our iframe so we can observe messages from the parent, once we receive a port on the
     * MessageChannel we utilise that for all communication.
     */
    window.addEventListener(
        "message",
        (event) => {
            if (event.ports && event.ports.length) {
                port = event.ports[0];
                portDeferred.resolve(port);
                port.onmessage = (messageEvent) => {
                    if (messageEvent.data.type === "render") {
                        render(messageEvent.data.message).then((output) => {
                            port.postMessage({
                                type: "render",
                                message: output,
                            });
                        });
                    }
                    if (messageEvent.data.type === "template") {
                        const message = messageEvent.data.message;
                        if (message.name in deferredTemplates) {
                            deferredTemplates[message.name].resolve(message.template);
                            delete deferredTemplates[message.name];
                        }
                    }
                };
            }
        },
        false,
    );

    // Inform the parent iframe that we're ready to receive the port
    window.parent.postMessage("PB_RENDER_READY", "*");
}

/**
 * Use our MessageChannel to load a template from the parent window, this is required as the iframe isn't allowed to
 * make same origin XHR requests.
 *
 * @param name
 */
export function loadTemplate(name: string): Promise<string> {
    return new Promise((resolve) => {
        if (!(name in deferredTemplates)) {
            deferredTemplates[name] = $.Deferred();
        }
        deferredTemplates[name].then((template: string) => {
            resolve(template);
        });

        if (port) {
            port.postMessage({
                type: "template",
                message: name,
            });
        } else {
            portDeferred.then((messagePort) => {
                messagePort.postMessage({
                    type: "template",
                    message: name,
                });
            });
        }
    });
}

/**
 * Perform a render of the provided data
 *
 * @param message
 */
function render(message: {stageId: string, tree: TreeItem}) {
    return new Promise((resolve, reject) => {
        createRenderTree(message.stageId, message.tree).then((rootContainer: ContentTypeCollectionInterface) => {
            const element = document.createElement("div");
            engine.waitForFinishRender().then(() => {
                ko.cleanNode(element);
                const filtered: JQuery = filterHtml($(element));
                const output = decodeAllDataUrlsInString(filtered.html());
                resolve(output);
            });
            ko.applyBindingsToNode(
                element,
                {
                    template: {
                        data: rootContainer.content,
                        name: rootContainer.content.template,
                    },
                },
            );
        }).catch((error) => {
            reject(error);
        });
    });
}

/**
 * Rebuild the content type tree using their original data and configuration
 *
 * @param stageId
 * @param tree
 * @param parent
 */
function createRenderTree(
    stageId: string,
    tree: TreeItem,
    parent: ContentTypeCollectionInterface = null,
): Promise<ContentTypeCollectionInterface> {
    return new Promise((resolve, reject) => {
        createContentType(
            Config.getContentTypeConfig(tree.name),
            parent,
            stageId,
            tree.data,
            parent !== null ? tree.children.length : null,
        ).then((contentType: ContentTypeCollectionInterface) => {
            // Ensure  we retain the original tree ID's
            contentType.id = tree.id;
            if (tree.children.length > 0) {
                const childPromises: Array<Promise<ContentTypeInterface | ContentTypeCollectionInterface>> = [];
                tree.children.forEach((child) => {
                    childPromises.push(createRenderTree(stageId, child, contentType));
                });
                Promise.all(childPromises).then((children) => {
                    children.forEach((child) => {
                        contentType.addChild(child);
                    });
                    resolve(contentType);
                });
            } else {
                resolve(contentType);
            }
        }).catch((error) => {
            reject(error);
        });
    });
}
