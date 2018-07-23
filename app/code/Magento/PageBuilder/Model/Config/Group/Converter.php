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
        return $this->convertGroups($source);
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
        /** @var \DOMNode $group */
        foreach ($source->getElementsByTagName('group') as $group) {
            if ($group->nodeType == XML_ELEMENT_NODE && $group->tagName == 'group') {
                $name = $group->attributes->getNamedItem('name')->nodeValue;
                /** @var \DOMElement $attributeValue */
                foreach ($group->attributes as $attributeName => $attributeValue) {
                    $groupsData[$name][$attributeName] = $attributeValue->nodeValue;
                }
            }
        }
        uasort($groupsData, function ($firstElement, $secondElement) {
            return (int)$firstElement['sortOrder'] <=> (int)$secondElement['sortOrder'];
        });

        return $groupsData;
    }
}
