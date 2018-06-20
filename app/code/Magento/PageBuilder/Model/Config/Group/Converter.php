<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Magento\PageBuilder\Model\Config\Group;

class Converter implements \Magento\Framework\Config\ConverterInterface
{
    /**
     * Convert XML structure into output array
     *
     * @param \DOMDocument $source
     * @return array
     * @throws \InvalidArgumentException
     */
    public function convert($source): array
    {
        return [
            'groups' => $this->convertGroups($source)
        ];
    }

    /**
     * Convert data for groups
     *
     * @param \DOMDocument $source
     * @return array
     */
    private function convertGroups(\DOMDocument $source): array
    {
        $groupsData = [];
        /** @var \DOMNode $source */
        $groups = $source->getElementsByTagName('groups');
        /** @var \DOMNode $group */
        foreach ($groups->item(0)->childNodes as $group) {
            if ($group->nodeType == XML_ELEMENT_NODE && $group->tagName == 'group') {
                $name = $group->attributes->getNamedItem('name')->nodeValue;
                /** @var \DOMElement $childNode */
                foreach ($group->attributes as $key => $value) {
                    $groupsData[$name][$key] = $group->hasAttribute($key)
                        ? $group->attributes->getNamedItem($key)->nodeValue
                        : null;
                }
            }
        }
        uasort($groupsData, function ($firstElement, $secondElement) {
            return (int)$firstElement['sortOrder'] <=> (int)$secondElement['sortOrder'];
        });

        return $groupsData;
    }

    /**
     * Check if node is configuration node
     *
     * @param \DOMNode $node
     * @return bool
     */
    private function isConfigNode(\DOMNode $node): bool
    {
        return $node->nodeType === XML_ELEMENT_NODE
            || ($node->nodeType === XML_CDATA_SECTION_NODE
                || $node->nodeType === XML_TEXT_NODE
                && trim($node->nodeValue) !== '');
    }
}
