/**
 * Copyright © 2013-2017 Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import requireJs from 'require';

export default function load(dependencies: string[], factory: Function, onError?: Function) {
    requireJs(dependencies, factory, onError);
}
