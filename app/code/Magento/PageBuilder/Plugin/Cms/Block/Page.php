<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
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
     */
    public function afterToHtml(\Magento\Cms\Block\Page $subject, $output)
    {
        return $this->filter->filter($output);
    }
}
