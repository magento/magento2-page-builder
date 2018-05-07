<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Magento\PageBuilder\Model\Source\VisualSelect;

/**
 * Interface for Visual Select options
 */
interface OptionsSourceInterface
{
    /**
     * Returns options for Visual Select based on di configuration
     *
     * @return array
     */
    public function getOptions(): array;
}
