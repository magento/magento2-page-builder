<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
declare(strict_types=1);

namespace Magento\PageBuilder\Plugin\Filter;

/**
 * Plugin to the template filter to process any background images added by Page Builder
 */
class TemplatePlugin
{
    const BACKGROUND_IMAGE_PATTERN = '/data-background-images=(?:\'|"){.+}(?:\'|")/si';

    const HTML_CONTENT_TYPE_PATTERN = '/data-content-type="html"/si';

    /**
     * @var \Magento\PageBuilder\Model\Filter\Template
     */
    private $templateFilter;

    /**
     * @param \Magento\PageBuilder\Model\Filter\Template $templateFilter
     */
    public function __construct(
        \Magento\PageBuilder\Model\Filter\Template $templateFilter
    ) {
        $this->templateFilter = $templateFilter;
    }

    /**
     * After filter of template data apply transformations
     *
     * @param \Magento\Framework\Filter\Template $subject
     * @param string $result
     *
     * @return string
     * @SuppressWarnings(PHPMD.UnusedFormalParameter)
     */
    public function afterFilter(\Magento\Framework\Filter\Template $subject, string $result) : string
    {
        return $this->templateFilter->filter($result);
    }
}
