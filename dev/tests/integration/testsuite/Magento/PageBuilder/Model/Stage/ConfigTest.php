<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Magento\PageBuilder\Model\Stage;

use Magento\TestFramework\Helper\Bootstrap;
use PHPUnit\Framework\TestCase;

/**
 * Test config for page builder
 */
class ConfigTest extends TestCase
{
    /**
     * @var Config
     */
    private $model;

    /**
     * @inheritDoc
     */
    protected function setUp()
    {
        $objectManager = Bootstrap::getObjectManager();
        $this->model = $objectManager->get(Config::class);
    }

    /**
     * Test that "media_url" should be the same as storefront media URL
     *
     * @magentoConfigFixture admin/url/use_custom 1
     * @magentoConfigFixture admin/url/custom https://backend.magento.test/
     * @magentoConfigFixture admin_store web/secure/base_url https://backend.magento.test/
     * @magentoConfigFixture admin_store web/unsecure/base_url https://backend.magento.test/
     * @magentoConfigFixture admin/url/use_custom_path 1
     * @magentoConfigFixture admin/url/custom_path secret
     * @magentoAppIsolation enabled
     * @magentoAppArea adminhtml
     */
    public function testMediaUrlShouldBeTheSameAsStorefrontMediaURL()
    {
        $this->assertEquals('http://localhost/pub/media/', $this->model->getConfig()['media_url']);
    }
}
