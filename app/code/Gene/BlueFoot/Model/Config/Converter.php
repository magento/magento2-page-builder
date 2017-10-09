<?php

namespace Gene\BlueFoot\Model\Config;

/**
 * Class Converter
 *
 * @package Gene\BlueFoot\Model\Config
 *
 * @author  Dave Macaulay <dave@gene.co.uk>
 */
class Converter implements \Magento\Framework\Config\ConverterInterface
{
    /**
     * Convert XML structure into output array
     *
     * @param \DOMDocument $source
     *
     * @return array
     */
    public function convert($source)
    {
        $output = [
            'content_blocks' => []
        ];

        /** @var \DOMNodeList $contentBlocks */
        $contentBlocks = $source->getElementsByTagName('content_block');
        /** @var \DOMNode $contentBlock */
        foreach ($contentBlocks as $contentBlock) {
            $identifier = $contentBlock->attributes->getNamedItem('identifier')->nodeValue;
            $contentBlockConfig = [];
            if (!$identifier) {
                throw new \InvalidArgumentException('Identifier is missing from content_block node');
            }
            /** @var \DOMElement $childNode */
            foreach ($contentBlock->childNodes as $childNode) {
                if ($childNode->nodeName == 'frontend' || $childNode->nodeName == 'adminhtml') {
                    $contentBlockConfig[$childNode->nodeName] = $this->convertArea($childNode);
                }
            }
            $output['content_blocks'][$identifier] = $contentBlockConfig;
        }

        return $output;
    }

    /**
     * Convert an area children into the output array
     *
     * @param \DOMElement $node
     *
     * @return array
     */
    protected function convertArea(\DOMElement $node)
    {
        $area = [];
        /** @var \DOMElement $childNode */
        foreach ($node->childNodes as $childNode) {
            if ($childNode->nodeType == XML_ELEMENT_NODE ||
                ($childNode->nodeType == XML_CDATA_SECTION_NODE ||
                    $childNode->nodeType == XML_TEXT_NODE && trim(
                        $childNode->nodeValue
                    ) != '')
            ) {
                // Convert any assets associated with the front-end
                $nodeValue = $childNode->nodeValue;
                if ($childNode->nodeName == 'assets') {
                    $nodeValue = $this->convertAreaAssets($childNode);
                }

                $area[$childNode->nodeName] = $nodeValue;
            }
        }

        return $area;
    }

    /**
     * Convert assets within an area to an array
     *
     * @param \DOMElement $node
     *
     * @return array
     */
    protected function convertAreaAssets(\DOMElement $node)
    {
        $assets = [];
        /** @var \DOMElement $assetNode */
        foreach ($node->childNodes as $assetNode) {
            if ($assetNode->nodeType == XML_ELEMENT_NODE ||
                ($assetNode->nodeType == XML_CDATA_SECTION_NODE ||
                    $assetNode->nodeType == XML_TEXT_NODE && trim(
                        $assetNode->nodeValue
                    ) != '')
            ) {
                $assets[$assetNode->attributes->getNamedItem('name')->nodeValue] = $assetNode->nodeValue;
            }
        }

        return $assets;
    }
}
