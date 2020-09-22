<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
declare(strict_types=1);

namespace Magento\PageBuilder\Model\Dom;

use Gt\Dom\Element as GtDomElement;
use Magento\Framework\ObjectManagerInterface;
use Magento\PageBuilder\Model\Dom\Adapter\AttrInterface;
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
    public function getOriginalElement(): GtDomElement
    {
        return $this->element;
    }

    /**
     * @inheritDoc
     */
    public function appendChild(ElementInterface $element): ElementInterface
    {
        return $this->objectManager->create(
            ElementInterface::class,
            [ 'element' => $this->element->appendChild($element->getOriginalElement()) ]
        );
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
        return $this->objectManager->create(
            HtmlCollectionInterface::class,
            [ 'collection' => $this->element->getElementsByClassName($names) ]
        );
    }

    /**
     * @inheritDoc
     */
    public function closest(string $selectors): ?ElementInterface
    {
        return $this->objectManager->create(
            ElementInterface::class,
            [ 'element' => $this->element->closest($selectors) ]
        );
    }

    /**
     * @inheritDoc
     */
    public function getAttribute($name): ?string
    {
        return $this->element->getAttribute($name);
    }

    /**
     * @inheritDoc
     */
    public function removeAttribute($name): ?bool
    {
        return $this->element->removeAttribute($name);
    }

    /**
     * @inheritDoc
     */
    public function setAttribute($name, $value): AttrInterface
    {
        return $this->objectManager->create(
            AttrInterface::class,
            [ 'attr' => $this->element->setAttribute($name, $value) ]
        );
    }

    /**
     * @inheritDoc
     */
    public function querySelector(string $selector): ElementInterface
    {
        return $this->objectManager->create(
            ElementInterface::class,
            [ 'element' => $this->element->querySelector($selector) ]
        );
    }

    /**
     * @inheritDoc
     */
    public function querySelectorAll(string $selector): HtmlCollectionInterface
    {
        return $this->objectManager->create(
            HtmlCollectionInterface::class,
            [ 'collection' => $this->element->querySelectorAll($selector) ]
        );
    }

    /**
     * @inheritDoc
     */
    public function removeStyle(string $styleProperty): string
    {
        $style = $this->getAttribute('style');
        $this->setAttribute('style', preg_replace("/${styleProperty}:(.*?);/", '', $style ?? ''));
        return $this->getAttribute('style') ?? '';
    }

    /**
     * @inheritDoc
     */
    public function addStyle(string $styleProperty, string $value): string
    {
        $this->removeStyle($styleProperty);
        $this->setAttribute('style', "${styleProperty}: $value; " . $this->getAttribute('style') ?? '');
        return $this->getAttribute('style') ?? '';
    }
}
