<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
declare(strict_types=1);

namespace Magento\PageBuilder\Plugin\Cms\Block;

class Page
{
    /**
     * @var \Magento\PageBuilder\Model\Template\Filter
     */
    private $filter;

    /**
     * Constructor
     *
     * @param \Magento\PageBuilder\Model\Template\Filter $filter
     */
    public function __construct(
        \Magento\PageBuilder\Model\Template\Filter $filter
    ) {
        $this->filter = $filter;
    }

    /**
     * Apply dynamic blocks filter
     *
     * @param \Magento\Cms\Block\Page $subject
     * @param string $output
     * @return string
     *
     * @SuppressWarnings(PHPMD.UnusedFormalParameter)
     */
    public function afterToHtml(\Magento\Cms\Block\Page $subject, $output) : string
    {
        return $this->filter->filter($output);
    }
}
