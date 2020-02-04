<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
declare(strict_types=1);

namespace Magento\PageBuilder\Model\Dom\Adapter;

/**
 * Interface for Text wrappers
 */
interface TextInterface
{
    /**
     * Determines if the element contains only whitespace
     *
     * @see http://php.net/manual/en/domtext.iswhitespaceinelementcontent.php
     * @see https://developer.mozilla.org/en-US/docs/Web/API/Text/isElementContentWhitespace
     * @return bool
     */
    public function isElementContentWhitespace(): bool;
}
