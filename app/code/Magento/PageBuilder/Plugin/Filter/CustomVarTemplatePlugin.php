<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
declare(strict_types=1);

namespace Magento\PageBuilder\Plugin\Filter;

use Magento\Store\Model\Store;

/**
 * Plugin to the template filter to escape custom variable directives
 */
class CustomVarTemplatePlugin
{
    /**
     * @var \Magento\Framework\Escaper
     */
    private $escaper;

    /**
     * @param \Magento\Framework\Escaper $escaper
     */
    public function __construct(
        \Magento\Framework\Escaper $escaper
    ) {
        $this->escaper = $escaper;
    }

    /**
     * Determine if custom variable directive's return value needs to be escaped and do so if true
     *
     * @param \Magento\Framework\Filter\Template $subject
     * @param \Closure $proceed
     * @param string[] $construction
     * @return string
     */
    public function aroundCustomvarDirective(
        \Magento\Framework\Filter\Template $subject,
        \Closure $proceed,
        $construction
    ) {
        // Determine the need to escape the return value of observed method.
        // Admin context requires store ID of 0; in that context return value should be escaped
        $shouldEscape = $subject->getStoreId() !== null && (int) $subject->getStoreId() === Store::DEFAULT_STORE_ID;

        if (!$shouldEscape) {
            return $proceed($construction);
        }

        $result = $proceed($construction);
        return $this->escaper->escapeHtml($result);
    }
}
