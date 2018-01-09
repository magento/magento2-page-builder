<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Gene\BlueFoot\Plugin\Cms\Block;

class Block
{
    /**
     * @var \Gene\BlueFoot\Model\Template\Filter
     */
    private $filter;

    /**
     * Constructor
     *
     * @param \Gene\BlueFoot\Model\Template\Filter $filter
     */
    public function __construct(
        \Gene\BlueFoot\Model\Template\Filter $filter
    ) {
        $this->filter = $filter;
    }

    /**
     * Apply dynamic blocks filter
     *
     * @param \Magento\Cms\Block\Block $subject
     * @param string $output
     * @return string
     *
     * @SuppressWarnings(PHPMD.UnusedFormalParameter)
     */
    public function afterToHtml(\Magento\Cms\Block\Block $subject, $output)
    {
        return $this->filter->filter($output);
    }
}
