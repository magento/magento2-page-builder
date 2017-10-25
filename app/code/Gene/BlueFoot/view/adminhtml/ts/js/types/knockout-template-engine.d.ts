declare let koTemplateEngine: {
    waitForFinishRender(): Promise<void>
};
declare module 'Magento_Ui/js/lib/knockout/template/engine' {
    export = koTemplateEngine;
}