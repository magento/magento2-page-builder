import $ from "jquery";
import ko from "knockout";
import engine from "Magento_Ui/js/lib/knockout/template/engine";
import filterHtml from "../master-format/filter-html";
import { TreeItem } from "../master-format/render/serialize";
import decodeAllDataUrlsInString from "../utils/directives";
import RenderContentType from "./content-type";
import RenderViewModel from "./view-model";

let port: MessagePort = null;
const portDeferred: JQueryDeferred<MessagePort> = $.Deferred();
const deferredTemplates: {[key: string]: JQueryDeferred<string>} = {};

/**
 * Listen for requests from the parent window for a render
 */
export default function listen(baseUrl: string) {
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
    window.parent.postMessage("PB_RENDER_READY", "*");
}

/**
 * Load a template from the parent window
 *
 * @param name
 */
export function loadTemplate(name: string): Promise<string> {
    return new Promise((resolve, reject) => {
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
 * @param tree
 */
function render(tree: TreeItem) {
    return new Promise((resolve, reject) => {
        const renderTree = createRenderTree(tree);
        const element = document.createElement("div");
        engine.waitForFinishRender().then(() => {
            ko.cleanNode(element);
            const filtered: JQuery = filterHtml($(element));
            const output = decodeAllDataUrlsInString(filtered.html());
            element.remove();
            resolve(output);
        });
        ko.applyBindingsToNode(
            element,
            {
                template: {
                    data: renderTree.content,
                    name: renderTree.content.template,
                },
            },
        );
    });
}

/**
 * Convert the serialised data back into a renderable tree conforming to the same interface as the previous renderer
 *
 * @param tree
 */
function createRenderTree(tree: TreeItem): RenderContentType {
    const contentType = new RenderContentType(
        new RenderViewModel(
            tree.template,
            tree.data,
        ),
    );
    if (tree.children.length > 0) {
        tree.children.forEach((child) => {
            contentType.children.push(
                createRenderTree(child),
            );
        });
    }
    return contentType;
}
