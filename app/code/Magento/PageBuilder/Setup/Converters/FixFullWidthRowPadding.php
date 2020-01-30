<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Magento\PageBuilder\Setup\Converters;

use Magento\Framework\App\ObjectManager;
use Magento\Framework\DB\DataConverter\DataConverterInterface;
use Magento\PageBuilder\Model\Dom\Adapter\ElementInterface;
use Magento\PageBuilder\Model\Dom\Adapter\HtmlDocumentInterface;
use Magento\PageBuilder\Model\Dom\HtmlDocument;

/**
 * Converter to move padding in full width columns from the main row element to the inner element
 */
class FixFullWidthRowPadding implements DataConverterInterface
{
    /**
     * @inheritDoc
     */
    public function convert($value)
    {
        /** @var HtmlDocument $document */
        $document = ObjectManager::getInstance()->create(
            HtmlDocumentInterface::class,
            [ 'document' => $value ]
        );
        // remove padding from main row element
        $fullWidthRows = $document->querySelectorAll("div[data-content-type='row'][data-appearance='full-width']");
        /** @var ElementInterface $row */
        foreach ($fullWidthRows as $row) {
            $style = $row->getAttribute("style");
            preg_match("/padding:(.*?);/", $style, $results);
            $padding = isset($results[0]) ? $results[0] : '';
            // remove padding from main row element
            $row->setAttribute("style", preg_replace("/padding:(.*?);/", "", $style));
            // add padding to inner row element
            /** @var ElementInterface $innerDiv */
            $innerDiv = $row->querySelector(".row-full-width-inner");
            $innerDiv->setAttribute("style", $padding . $innerDiv->getAttribute("style") ?: '');
        }
        //strip the added html content
        preg_match('/<body>(.*)<\/body>/', $document->getContents(), $matches);
        return isset($matches[1]) ? $matches[1] : '';
    }
}
