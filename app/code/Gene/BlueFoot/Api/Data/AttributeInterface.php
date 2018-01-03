<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Gene\BlueFoot\Api\Data;

interface AttributeInterface extends \Magento\Eav\Api\Data\AttributeInterface
{
    const IS_VISIBLE = 'is_visible';

    const SCOPE_STORE_TEXT = 'store';

    const SCOPE_GLOBAL_TEXT = 'global';

    const SCOPE_WEBSITE_TEXT = 'website';
}
