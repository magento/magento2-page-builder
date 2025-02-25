<?php
/**
 * Copyright 2024 Adobe
 * All rights reserved.
 * See COPYING.txt for license details.
 */
declare(strict_types=1);

namespace Magento\PageBuilder\Test\Unit\Plugin;

use Magento\Backend\Model\Auth;
use Magento\Backend\Model\UrlInterface;
use Magento\PageBuilder\Model\EditorConfigCacheCleaner;
use Magento\PageBuilder\Plugin\ClearEditorConfigCache;
use PHPUnit\Framework\MockObject\MockObject;
use PHPUnit\Framework\TestCase;

/**
 * Test for page builder cache config cleaner plugin
 */
class ClearEditorConfigCacheTest extends TestCase
{
    /**
     * @var EditorConfigCacheCleaner|MockObject
     */
    private $cacheCleaner;

    /**
     * @var Auth|MockObject
     */
    private $auth;

    /**
     * @var ClearEditorConfigCache
     */
    private $model;

    /**
     * @var UrlInterface|MockObject
     */
    private $backendUrl;

    /**
     * @inheritDoc
     */
    protected function setUp(): void
    {
        parent::setUp();
        $this->cacheCleaner = $this->createMock(EditorConfigCacheCleaner::class);
        $this->backendUrl = $this->createMock(UrlInterface::class);
        $this->auth = $this->createMock(Auth::class);
        $this->model = new ClearEditorConfigCache(
            $this->backendUrl,
            $this->cacheCleaner
        );
    }

    /**
     * Test that page builder cache config cleaner is executed if secret key is included in backend URLs
     *
     * @dataProvider afterLoginDataProvider
     * @param bool $isUseSecretKey
     */
    public function testAfterLogin(bool $isUseSecretKey): void
    {
        $this->backendUrl->expects($this->once())
            ->method('useSecretKey')
            ->willReturn($isUseSecretKey);
        $this->cacheCleaner->expects($isUseSecretKey ? $this->once() : $this->never())
            ->method('execute');
        $this->model->afterLogin($this->auth);
    }

    /**
     * @return array
     */
    public static function afterLoginDataProvider(): array
    {
        return [
            [false],
            [true]
        ];
    }
}
