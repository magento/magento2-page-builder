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
        $result = $blockRenderer->render(['block_id' => $cmsBlock->getId()]);
        $this->assertArrayHasKey('content', $result);
        $content = $result['content'];
        $this->assertNotContains('<script>', $content);
        $this->assertContains('<p>Config value: "http://example.com/".</p>', $content);
        $this->assertContains('<p>Custom variable: "HTML Value".</p>', $content);
    }
}
