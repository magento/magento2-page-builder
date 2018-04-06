<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Magento\PageBuilder\Model\Config;

use \Magento\Framework\Config\ReaderInterface;

/**
 * Composite reader for consumer config.
 */
class CompositeReader implements ReaderInterface
{
    /**
     * @var ReaderInterface[]
     */
    private $readers;

    /**
     * Initialize dependencies.
     *
     * @param ReaderInterface[] $readers
     */
    public function __construct(array $readers)
    {
        $this->readers = $readers;
    }

    /**
     * Read config.
     *
     * @param string|null $scope
     * @return array
     */
    public function read($scope = null): array
    {
        $result = [];
        foreach ($this->readers as $reader) {
            $result = array_replace_recursive($result, $reader->read($scope));
        }
        return $result;
    }
}
