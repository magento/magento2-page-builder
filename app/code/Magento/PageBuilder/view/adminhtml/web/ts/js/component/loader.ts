/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import requireJs from "require";

export default function load(dependencies: string[], factory: () => void, onError?: () => void) {
    requireJs(dependencies, factory, onError);
}
