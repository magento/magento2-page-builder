<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
declare(strict_types=1);

namespace Magento\PageBuilder\Test\Unit\Model;

use Magento\Framework\Cache\FrontendInterface;
use Magento\PageBuilder\Model\EditorConfigCacheCleaner;
use PHPUnit\Framework\MockObject\MockObject;
use PHPUnit\Framework\TestCase;

/***
 * Test for page builder cache config cleaner
 */
class EditorConfigCacheCleanerTest extends TestCase
{
    /**
     * @var EditorConfigCacheCleaner
     */
    private $model;

    /**
     * @var FrontendInterface|MockObject
     */
    private $cache;

    /**
     * @inheritDoc
     */
    protected function setUp(): void
    {
        parent::setUp();
        $this->cache = $this->createMock(FrontendInterface::class);
        $this->model = new EditorConfigCacheCleaner(
            $this->cache
        );
    }

    /**
     * Test that the supplied cache is clean up
     */
    public function testExecute(): void
    {
        $this->cache->expects($this->once())
            ->method('clean');
        $this->model->execute();
    }
}
