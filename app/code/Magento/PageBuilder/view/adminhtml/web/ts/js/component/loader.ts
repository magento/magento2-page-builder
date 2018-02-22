/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

export default function load(dependencies: string[], factory: (...results: any[]) => void, onError?: () => void) {
    require(dependencies, factory, onError);
}
