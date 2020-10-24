<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
declare(strict_types=1);

namespace Magento\PageBuilder\Test\Unit\Model;

use Magento\Framework\App\Config\ScopeConfigInterface;
use Magento\Framework\App\State;
use Magento\Framework\View\Design\Theme\ThemeProviderInterface;
use Magento\Framework\View\DesignInterface;
use Magento\PageBuilder\Model\Stage\Preview;
use Magento\Store\Model\App\Emulation;
use Magento\Store\Model\Store;
use Magento\Store\Model\StoreManagerInterface;
use PHPUnit\Framework\MockObject\MockObject;
use PHPUnit\Framework\TestCase;

/**
 * Test for Page Builder Stage Preview Model.
 */
class PreviewTest extends TestCase
{
    /**
     * @var Preview
     */
    private $model;

    /**
     * @var Emulation|MockObject
     */
    private $emulation;

    /**
     * @var StoreManagerInterface|MockObject
     */
    private $storeManagerInterface;

    /**
     * @inheritdoc
     */
    protected function setUp(): void
    {
        parent::setUp();

        $this->storeManagerInterface = $this->createMock(StoreManagerInterface::class);
        $this->emulation = $this->createMock(Emulation::class);
        $this->model = new Preview(
            $this->emulation,
            $this->createMock(State::class),
            $this->createMock(DesignInterface::class),
            $this->createMock(ThemeProviderInterface::class),
            $this->storeManagerInterface,
            $this->createMock(ScopeConfigInterface::class)
        );
    }

    /**
     * Checks that method works properly even if the getDefaultStoreView returns null
     *
     * @return void
     * @throws \Exception
     */
    public function testStartPreviewModeWithEmptyDefaultStoreView(): void
    {
        $callback = function () {
        };
        $storeId = 2;
        $store = $this->createMock(Store::class);
        $store->method('getId')
            ->willReturn($storeId);
        $this->storeManagerInterface->method('getDefaultStoreView')
            ->willReturn(null);
        $this->storeManagerInterface->expects($this->once())
            ->method('getStores')
            ->willReturn([$store]);
        $this->emulation->expects($this->once())
            ->method('startEnvironmentEmulation')
            ->with($storeId);
        $this->model->startPreviewMode($callback);
    }
}
