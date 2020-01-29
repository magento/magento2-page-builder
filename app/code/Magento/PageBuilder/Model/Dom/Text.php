<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
declare(strict_types=1);

namespace Magento\PageBuilder\Model\Dom;

use Gt\Dom\Text as GtDomText;
use Magento\Framework\ObjectManagerInterface;
use Magento\PageBuilder\Model\Dom\Adapter\TextInterface;

/**
 * PhpGt DOM Text wrapper.
 */
class Text implements TextInterface
{
    /**
     * @var ObjectManagerInterface
     */
    private $objectManager;

    /**
     * @var GtDomText
     */
    private $text;

    /**
     * Text constructor.
     *
     * @param ObjectManagerInterface $objectManager
     * @param GtDomText $text
     */
    public function __construct(
        ObjectManagerInterface $objectManager,
        GtDomText $text
    ) {
        $this->objectManager = $objectManager;
        $this->text = $text;
    }

    /**
     * @inheritDoc
     */
    public function isElementContentWhitespace(): bool
    {
        return $this->text->isElementContentWhitespace();
    }
}
