<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
declare(strict_types=1);

namespace Magento\PageBuilder\Model\Dom;

use Gt\Dom\Element as GtDomElement;
use Magento\Framework\ObjectManagerInterface;
use Magento\PageBuilder\Model\Dom\Adapter\ElementInterface;
use Magento\PageBuilder\Model\Dom\Adapter\HtmlCollectionInterface;

/**
 * PhpGt DOM Element wrapper.
 */
class Element implements ElementInterface
{
    /**
     * @var ObjectManagerInterface
     */
    private $objectManager;

    /**
     * @var GtDomElement
     */
    private $element;

    /**
     * HtmlDocument constructor.
     * @param ObjectManagerInterface $objectManager
     * @param GtDomElement $element
     */
    public function __construct(
        ObjectManagerInterface $objectManager,
        GtDomElement $element
    ) {
        $this->objectManager = $objectManager;
        $this->element = $element;
    }

    /**
     * @inheritDoc
     */
    public function matches(string $selectors): bool
    {
        return $this->element->matches($selectors);
    }

    /**
     * @inheritDoc
     */
    public function getElementsByClassName(string $names): HtmlCollectionInterface
    {
        return $this->objectManager->create(HtmlCollectionInterface::class, [ $this->element->getElementsByClassName($names) ]);
    }

    /**
     * @inheritDoc
     */
    public function closest(string $selectors): ?ElementInterface
    {
        return $this->objectManager->create(ElementInterface::class, [ $this->element->closest($selectors) ]);
    }

    /**
     * @inheritDoc
     */
    public function getAttribute($name): ?string
    {
        return $this->element->getAttribute($name);
    }
}
