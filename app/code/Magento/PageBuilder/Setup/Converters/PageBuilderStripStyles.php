<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

declare(strict_types = 1);

namespace Magento\PageBuilder\Setup\Converters;

use Magento\Framework\DB\DataConverter\DataConverterInterface;
use Magento\PageBuilder\Model\Dom\Adapter\ElementInterface;
use Magento\PageBuilder\Model\Dom\HtmlDocumentFactory;

/**
 * ...
 */
class PageBuilderStripStyles implements DataConverterInterface
{
    /**
     * @var HtmlDocumentFactory
     */
    private $htmlDocumentFactory;

    /**
     * @param HtmlDocumentFactory $htmlDocumentFactory
     */
    public function __construct(HtmlDocumentFactory $htmlDocumentFactory)
    {
        $this->htmlDocumentFactory = $htmlDocumentFactory;
    }

    /**
     * @inheritDoc
     */
    public function convert($value)
    {
        $document = $this->htmlDocumentFactory->create(['document' => $value]);
        $queryPageBuilderElements = $document->querySelectorAll('[style]'); // @todo: Match Types

        /** @var ElementInterface $element */
        foreach ($queryPageBuilderElements as $element) {
            $style = $element->getAttribute('style');

            if ($style) {
                // @todo: Convert to Inline

                $element->removeAttribute('style');
            }
        }

        return $queryPageBuilderElements->count() > 0 ? $document->stripHtmlWrapperTags() : $value;
    }
}
