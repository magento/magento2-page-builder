<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
declare(strict_types=1);

namespace Magento\PageBuilder\Plugin\Filter;

use Magento\Store\Model\Store;
use Magento\Framework\Escaper;

/**
 * Plugin to the template filter to escape custom variable directives
 */
class CustomVarTemplate
{
    /**
     * @var Escaper
     */
    private $escaper;

    /**
     * @param Escaper $escaper
     */
    public function __construct(
        Escaper $escaper
    ) {
        $this->escaper = $escaper;
    }

    /**
     * Determine if custom variable directive's return value needs to be escaped and do so if true
     *
     * @param \Magento\Framework\Filter\Template $subject
     * @param string $result
     * @return string
     */
    public function afterCustomvarDirective(
        \Magento\Framework\Filter\Template $subject,
        $result
    ) {
        // Determine the need to escape the return value of observed method.
        // Admin context requires store ID of 0; in that context return value should be escaped
        $shouldEscape = $subject->getStoreId() !== null && (int) $subject->getStoreId() === Store::DEFAULT_STORE_ID;

        if ($shouldEscape) {
            return $this->escaper->escapeHtml($result);
        } else {
            return $result;
        }
    }
}
