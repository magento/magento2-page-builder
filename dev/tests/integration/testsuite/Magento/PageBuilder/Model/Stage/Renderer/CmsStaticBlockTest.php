<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
declare(strict_types=1);

namespace Magento\PageBuilder\Model\Stage\Renderer;

class CmsStaticBlockTest extends \PHPUnit\Framework\TestCase
{
    /**
     * @magentoDataFixture Magento/PageBuilder/_files/block_with_script.php
     * @magentoDataFixture Magento/Variable/_files/variable.php
     * @magentoAppArea frontend
     */
    public function testRender()
    {
        /** @var \Magento\Cms\Model\Block $cmsBlock */
        $cmsBlock = \Magento\TestFramework\Helper\Bootstrap::getObjectManager()->create(
            \Magento\Cms\Model\Block::class
        );
        $cmsBlock->load('block_with_script', 'identifier');

        $blockRenderer = \Magento\TestFramework\Helper\Bootstrap::getObjectManager()->create(
            \Magento\PageBuilder\Model\Stage\Renderer\CmsStaticBlock::class
        );
        $result = $blockRenderer->render([
            'block_id' => $cmsBlock->getData('block_id'),
            'directive' => $cmsBlock->getContent(),
        ]);
        $this->assertArrayHasKey('content', $result);
        $content = $result['content'];
        $this->assertStringNotContainsString('<script>', $content);
        $this->assertStringContainsString('<p>Custom variable: "HTML Value".</p>', $content);
        $this->assertStringNotContainsString('<html>', $content);
        $this->assertStringNotContainsString('<!DOCTYPE', $content);
    }
}
