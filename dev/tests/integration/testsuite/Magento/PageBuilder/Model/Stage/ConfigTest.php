<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Magento\PageBuilder\Model\Stage;

use Magento\Framework\Session\SessionManagerInterface;
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
     * @inheritDoc
     */
    protected function setUp(): void
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
     */
    public function testMediaUrlShouldBeTheSameAsStorefrontMediaURL()
    {
        $this->assertEquals('http://localhost/media/', $this->model->getConfig()['media_url']);
    }

    /**
     * Test that page builder config should not be cached across different sessions if secret key is used in URLs
     *
     * @magentoConfigFixture admin/security/use_form_key 1
     */
    public function testConfigShouldNotBeCachedAcrossDifferentSessions()
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
    public function testConfigShouldBeCachedWithinSameSession()
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
