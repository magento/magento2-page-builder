<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
declare(strict_types=1);

namespace Magento\PageBuilder\Model\Dom;

use Gt\Dom\Attr as GtDomAttr;
use Magento\Framework\ObjectManagerInterface;
use Magento\PageBuilder\Model\Dom\Adapter\AttrInterface;

/**
 * PhpGt DOM Attr wrapper.
 */
class Attr implements AttrInterface
{
    /**
     * @var ObjectManagerInterface
     */
    private $objectManager;

    /**
     * @var GtDomAttr
     */
    private $attr;

    /**
     * HtmlDocument constructor.
     * @param ObjectManagerInterface $objectManager
     * @param GtDomAttr $attr
     */
    public function __construct(
        ObjectManagerInterface $objectManager,
        GtDomAttr $attr
    ) {
        $this->objectManager = $objectManager;
        $this->attr = $attr;
    }

    /**
     * @inheritDoc
     */
    public function remove(): AttrInterface
    {
        return $this->objectManager->create(AttrInterface::class, [ 'attr' => $this->attr->remove() ]);
    }
}
