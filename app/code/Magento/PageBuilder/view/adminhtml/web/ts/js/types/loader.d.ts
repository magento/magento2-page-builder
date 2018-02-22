declare function load(dependencies: string[], factory: (...results: any[]) => void, onError?: () => void): void;

declare module "Magento_PageBuilder/js/component/loader" {
    export = load;
}
