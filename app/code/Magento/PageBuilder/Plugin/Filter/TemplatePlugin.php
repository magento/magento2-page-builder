<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
declare(strict_types=1);

namespace Magento\PageBuilder\Plugin\Filter;

use Magento\PageBuilder\Model\Filter\Template as TemplateFilter;
use Magento\Framework\Filter\Template as FrameworkTemplateFilter;

/**
 * Plugin to the template filter to process any background images added by Page Builder
 */
class TemplatePlugin
{
    const BACKGROUND_IMAGE_PATTERN = '/data-background-images=(?:\'|"){.+}(?:\'|")/si';

    const HTML_CONTENT_TYPE_PATTERN = '/data-content-type="html"/si';

    /**
     * @var TemplateFilter
     */
    private $templateFilter;

    /**
     * @param TemplateFilter $templateFilter
     */
    public function __construct(
        TemplateFilter $templateFilter
    ) {
        $this->templateFilter = $templateFilter;
    }

    /**
     * After filter of template data apply transformations
     *
     * @param FrameworkTemplateFilter $subject
     * @param string $result
     *
     * @return string
     * @SuppressWarnings(PHPMD.UnusedFormalParameter)
     */
    public function afterFilter(FrameworkTemplateFilter $subject, $result)
    {
        return $this->templateFilter->filter((string) $result);
    }
}
