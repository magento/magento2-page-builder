<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Magento\PageBuilder\Model\Stage;

use Magento\Framework\Session\SessionManagerInterface;
use Magento\Store\Api\Data\StoreInterface;
use Magento\Store\Model\StoreManagerInterface;
use Magento\TestFramework\Helper\Bootstrap;
use PHPUnit\Framework\TestCase;

/**
 * Test config for page builder
 *
 * @magentoAppIsolation enabled
 * @magentoAppArea adminhtml
 */
class ConfigTest extends TestCase
{
    /**
     * @var Config
     */
    private $model;

    /**
     * @var StoreManagerInterface
     */
    private $storeManager;

    /**
     * @var int
     */
    private $currentStoreId;

    /**
     * @inheritDoc
     */
    protected function setUp(): void
    {
        $objectManager = Bootstrap::getObjectManager();
        $this->model = $objectManager->get(Config::class);
        $this->storeManager = $objectManager->get(StoreManagerInterface::class);
        $this->currentStoreId = $this->storeManager->getStore()->getId();
    }

    /**
     * @inheritdoc
     */
    protected function tearDown(): void
    {
        $this->storeManager->setCurrentStore($this->currentStoreId);

        parent::tearDown();
    }

    /**
     * Test that "media_url" should be the same as backend media URL
     *
     * @magentoDataFixture Magento/Store/_files/second_website_with_store_group_and_store.php
     * @magentoConfigFixture admin/url/use_custom_path 1
     * @magentoConfigFixture admin/url/custom_path secret
     * @magentoConfigFixture admin/url/use_custom 1
     * @magentoConfigFixture admin/url/custom https://backend.magento.test/
     * @magentoConfigFixture admin_store web/secure/base_url https://backend.magento.test/
     * @magentoConfigFixture admin_store web/unsecure/base_url http://backend.magento.test/
     * @magentoConfigFixture fixture_second_store_store web/unsecure/base_url http://website2.magento.test/
     * @magentoConfigFixture fixture_second_store_store web/secure/base_url https://website2.magento.test/
     * @param string $store
     * @param string $mediaUrl
     * @dataProvider storeDataProvider
     */
    public function testMediaUrlShouldBeTheSameAsBackendMediaURL(string $store, string $mediaUrl): void
    {
        $this->storeManager->setCurrentStore($store);
        $this->assertEquals($mediaUrl, $this->model->getConfig()['media_url']);
    }

    /**
     * @return array
     */
    public static function storeDataProvider(): array
    {
        return [
            [
                'admin',
                'http://backend.magento.test/media/'
            ],
            [
                'default',
                'http://backend.magento.test/media/'
            ],
            [
                'fixture_second_store',
                'http://backend.magento.test/media/'
            ],
        ];
    }

    /**
     * Test that page builder config should not be cached across different sessions if secret key is used in URLs
     *
     * @magentoConfigFixture admin/security/use_form_key 1
     */
    public function testConfigShouldNotBeCachedAcrossDifferentSessions(): void
    {
        $config = $this->model->getConfig();
        $this->startNewSession();
        $this->assertNotEquals($config, $this->model->getConfig());
    }

    /**
     * Test that page builder config should be cached within same session
     *
     * @magentoConfigFixture admin/security/use_form_key 1
     */
    public function testConfigShouldBeCachedWithinSameSession(): void
    {
        $config = $this->model->getConfig();
        $this->assertEquals($config, $this->model->getConfig());
    }

    /**
     * @param string|null $sessionId
     */
    private function startNewSession(string $sessionId = null): void
    {
        /** @var SessionManagerInterface $session */
        $session = Bootstrap::getObjectManager()->get(SessionManagerInterface::class);
        // close current session and cleanup session variable
        if ($session->isSessionExists()) {
            $session->writeClose();
            $session->clearStorage();
        }
        // open new session
        $session->setSessionId($sessionId ?? uniqid('session-' . time() . '-'));
        $session->start();
    }
}
