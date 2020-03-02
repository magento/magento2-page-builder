<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
declare(strict_types=1);

namespace Magento\PageBuilder\Model\Dom;

use Gt\Dom\TokenList as GtDomTokenList;
use Magento\Framework\ObjectManagerInterface;
use Magento\PageBuilder\Model\Dom\Adapter\TokenListInterface;

/**
 * PhpGt DOM TokenList wrapper.
 */
class TokenList implements TokenListInterface
{
    /**
     * @var ObjectManagerInterface
     */
    private $objectManager;

    /**
     * @var GtDomTokenList
     */
    private $tokenList;

    /**
     * TokenList constructor.
     *
     * @param ObjectManagerInterface $objectManager
     * @param GtDomTokenList $tokenList
     */
    public function __construct(
        ObjectManagerInterface $objectManager,
        GtDomTokenList $tokenList
    ) {
        $this->objectManager = $objectManager;
        $this->tokenList = $tokenList;
    }

    /**
     * @inheritDoc
     */
    public function item(int $index): ?string
    {
        return $this->tokenList->item($index);
    }

    /**
     * @inheritDoc
     */
    public function contains(string $token): bool
    {
        return $this->tokenList->contains($token);
    }

    /**
     * @inheritDoc
     */
    public function add(string $token): void
    {
        $this->tokenList->add($token);
    }

    /**
     * @inheritDoc
     */
    public function remove(string $token): void
    {
        $this->tokenList->remove($token);
    }

    /**
     * @inheritDoc
     */
    public function toggle(string $token): bool
    {
        return $this->tokenList->toggle($token);
    }

    /**
     * @inheritDoc
     */
    public function __toString(): string
    {
        return $this->tokenList->__toString();
    }
}
