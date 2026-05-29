<?php
/**
 * Copyright 2018 Adobe
 * All Rights Reserved.
 */

declare(strict_types=1);

namespace Magento\PageBuilder\Test\Integration\Model\Stage;

use Magento\TestFramework\Helper\Bootstrap;

class RendererPoolTest extends \PHPUnit\Framework\TestCase
{
    /**
     * @var \Magento\Framework\ObjectManagerInterface
     */
    private $objectManager;

    /**
     * @var \Magento\PageBuilder\Model\Stage\RendererPool
     */
    private $model;

    protected function setUp(): void
    {
        $this->objectManager = Bootstrap::getObjectManager();

        $this->model = $this->objectManager->create(
            \Magento\PageBuilder\Model\Stage\RendererPool::class
        );
    }

    public function testGetRenderer()
    {
        $renderer = $this->model->getRenderer('test');
        $this->assertEquals(['content' => 'Test Content'], $renderer->render([]));
    }
}
