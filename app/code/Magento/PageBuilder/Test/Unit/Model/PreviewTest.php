<?php
/**
 * Copyright 2020 Adobe
 * All Rights Reserved.
 */
declare(strict_types=1);

namespace Magento\PageBuilder\Test\Unit\Model;

use Magento\Framework\App\Area;
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
     * @var State|MockObject
     */
    private $appState;

    /**
     * @var StoreManagerInterface|MockObject
     */
    private $storeManagerInterface;

    /**
     * Tracks whether area code emulation is active, mirroring State::emulateAreaCode().
     *
     * @var bool
     */
    private $areaCodeEmulated = false;

    /**
     * @inheritdoc
     */
    protected function setUp(): void
    {
        parent::setUp();

        $this->storeManagerInterface = $this->createMock(StoreManagerInterface::class);
        $this->emulation = $this->createMock(Emulation::class);
        $this->appState = $this->createMock(State::class);
        $this->model = new Preview(
            $this->emulation,
            $this->appState,
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

    /**
     * Environment emulation must be stopped only after leaving the emulated area code, otherwise
     * restoring the admin design resolves the admin theme against the emulated frontend area and fails.
     *
     * @return void
     * @throws \Exception
     * @see ACP2E-5118
     */
    public function testStopEnvironmentEmulationRunsAfterLeavingEmulatedArea(): void
    {
        $this->configureEmulatedAreaCode();

        $this->emulation->expects($this->once())
            ->method('stopEnvironmentEmulation')
            ->willReturnCallback(function () {
                $this->assertFalse(
                    $this->areaCodeEmulated,
                    'stopEnvironmentEmulation() must be called after leaving the emulated area code.'
                );
            });

        $callbackRan = false;
        $this->model->startPreviewMode(function () use (&$callbackRan) {
            $this->assertTrue($this->areaCodeEmulated, 'Callback must run inside the emulated area code.');
            $callbackRan = true;
        }, 1);

        $this->assertTrue($callbackRan, 'Preview callback was expected to run.');
    }

    /**
     * When the preview callback fails, the exception must propagate, preview mode must be reset and
     * environment emulation must still be stopped after leaving the emulated area code.
     *
     * @return void
     * @throws \Exception
     * @see ACP2E-5118
     */
    public function testStopEnvironmentEmulationRunsWhenCallbackThrows(): void
    {
        $this->configureEmulatedAreaCode();

        $this->emulation->expects($this->once())
            ->method('stopEnvironmentEmulation')
            ->willReturnCallback(function () {
                $this->assertFalse(
                    $this->areaCodeEmulated,
                    'stopEnvironmentEmulation() must be called after leaving the emulated area code.'
                );
                $this->assertFalse(
                    $this->model->isPreviewMode(),
                    'Preview mode must be reset before emulation is stopped when the callback fails.'
                );
            });

        $this->expectException(\RuntimeException::class);
        $this->expectExceptionMessage('Preview rendering failed');

        $this->model->startPreviewMode($this->createFailingCallback(), 1);
    }

    /**
     * Builds a preview callback that fails, kept in a separate method so the throw is not caught here.
     *
     * @return callable
     */
    private function createFailingCallback(): callable
    {
        return static function (): void {
            throw new \RuntimeException('Preview rendering failed');
        };
    }

    /**
     * Make the State mock invoke the callback within an emulated area code, mirroring the real
     * State::emulateAreaCode() contract so ordering of the teardown can be asserted.
     *
     * @return void
     */
    private function configureEmulatedAreaCode(): void
    {
        $this->appState->method('isAreaCodeEmulated')
            ->willReturnCallback(fn () => $this->areaCodeEmulated);
        $this->appState->method('emulateAreaCode')
            ->willReturnCallback(function ($areaCode, $callback) {
                $this->assertSame(
                    Area::AREA_FRONTEND,
                    $areaCode,
                    'Preview must be rendered while emulating the frontend area.'
                );
                $this->areaCodeEmulated = true;
                try {
                    return $callback();
                } finally {
                    $this->areaCodeEmulated = false;
                }
            });
    }
}
