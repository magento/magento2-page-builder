<?php
/**
 * Application config file resolver
 *
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Magento\PageBuilder\Model\Config\ContentTypes;

use Magento\Framework\Component\DirSearch;
use Magento\Framework\Component\ComponentRegistrar;

class FileResolver implements \Magento\Framework\Config\FileResolverInterface
{
    /**
     * @var \Magento\Framework\Config\FileIteratorFactory
     */
    private $iteratorFactory;

    /**
     * @var DirSearch
     */
    private $componentDirSearch;

    /**
     * @param \Magento\Framework\Config\FileIteratorFactory $iteratorFactory
     * @param DirSearch $componentDirSearch
     */
    public function __construct(
        \Magento\Framework\Config\FileIteratorFactory $iteratorFactory,
        DirSearch $componentDirSearch
    ) {
        $this->iteratorFactory = $iteratorFactory;
        $this->componentDirSearch = $componentDirSearch;
    }

    /**
     * {@inheritdoc}
     */
    public function get($filename, $scope)
    {
        $paths = $this->componentDirSearch->collectFiles(
            ComponentRegistrar::MODULE,
            'etc/' . $scope . '/' . $filename
        );

        return $this->iteratorFactory->create($paths);
    }
}
