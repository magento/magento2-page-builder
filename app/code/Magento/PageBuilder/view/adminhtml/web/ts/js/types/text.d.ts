declare let text: {
    load(name: string, req: () => {}, onLoad: () => {}): void;
    get(url: string, callback: () => {}, fail: () => {}, headers: {}): void;
};

declare module "mage/requirejs/text" {
    export = text;
}
