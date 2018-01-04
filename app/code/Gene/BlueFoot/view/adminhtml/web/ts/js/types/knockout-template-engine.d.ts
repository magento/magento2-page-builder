/**
 * Copyright © 2013-2017 Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

/*eslint-disable */
declare let koTemplateEngine: {
    waitForFinishRender(): Promise<void>
};
declare module 'Magento_Ui/js/lib/knockout/template/engine' {
    export = koTemplateEngine;
}
