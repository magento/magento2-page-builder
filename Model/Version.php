<?php

namespace Gene\BlueFoot\Model;

/**
 * Class Version
 *
 * @package Gene\BlueFoot\Model\Stage
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
class Version extends \Magento\Framework\Model\AbstractModel
{
    /**
     * The cache key used to log how long ago we checked the version
     */
    const UPDATE_TIME_CACHE_KEY = 'bluefoot_version_lastcheck';

    /**
     * @var \Magento\Framework\UrlInterface
     */
    protected $urlBuilder;

    /**
     * @var \Magento\Framework\HTTP\ZendClient
     */
    protected $zendHttpClient;

    /**
     * @var \Magento\Framework\Module\ResourceInterface
     */
    protected $moduleResource;

    /**
     * @var \Magento\AdminNotification\Model\InboxFactory
     */
    protected $inboxFactory;

    /**
     * Version constructor.
     *
     * @param \Magento\Framework\Model\Context                             $context
     * @param \Magento\Framework\Registry                                  $registry
     * @param \Magento\Framework\HTTP\ZendClient                           $zendHttpClient
     * @param \Magento\Framework\UrlInterface                              $urlBuilder
     * @param \Magento\Framework\Module\ResourceInterface                  $moduleResource
     * @param \Magento\AdminNotification\Model\InboxFactory                $inboxFactory
     * @param \Magento\Framework\Model\ResourceModel\AbstractResource|null $resource
     * @param \Magento\Framework\Data\Collection\AbstractDb|null           $resourceCollection
     * @param array                                                        $data
     */
    public function __construct(
        \Magento\Framework\Model\Context $context,
        \Magento\Framework\Registry $registry,
        \Magento\Framework\HTTP\ZendClient $zendHttpClient,
        \Magento\Framework\UrlInterface $urlBuilder,
        \Magento\Framework\Module\ResourceInterface $moduleResource,
        \Magento\AdminNotification\Model\InboxFactory $inboxFactory,
        \Magento\Framework\Model\ResourceModel\AbstractResource $resource = null,
        \Magento\Framework\Data\Collection\AbstractDb $resourceCollection = null,
        array $data = []
    ) {
        parent::__construct($context, $registry, $resource, $resourceCollection, $data);

        $this->urlBuilder = $urlBuilder;
        $this->zendHttpClient = $zendHttpClient;
        $this->moduleResource = $moduleResource;
        $this->inboxFactory = $inboxFactory;
    }

    /**
     * Check the current version against the latest version on BlueFootCms.com
     *
     * @throws \Zend_Http_Client_Exception
     */
    public function checkVersion()
    {
        if ($this->getFrequency() + $this->getLastUpdate() > time()) {
            return $this;
        }

        // Setup the request to check the version from the BlueFoot site
        $request = $this->zendHttpClient->setUri('https://www.bluefootcms.com/version/index/magento2/');
        $request->setParameterGet('version', (string) $this->moduleResource->getDbVersion('Gene_BlueFoot'));

        // Send domain to validate licence
        $request->setParameterGet('domain', $this->urlBuilder->getBaseUrl());

        try {
            // Request the latest version available for the domain
            $response = $request->request(\Magento\Framework\HTTP\ZendClient::GET);
            if ($response->getStatus() == 200) {
                $body = json_decode($response->getBody(), true);
                if (isset($body['success'])) {
                    if ((!isset($body['latest']) || isset($body['latest']) && $body['latest'] != true)) {
                        // Retrieve the latest notice so we don't spam the users notification inbox
                        $inbox = $this->inboxFactory->create();
                        $latest = $inbox->loadLatestNotice();

                        // Compare the title to check if the last was a BlueFoot update notification
                        $updateTitle = __('BlueFoot Update Available');
                        if ($latest->getTitle() != $updateTitle) {
                            // Create message letting the user know an update is available
                            $inbox->addNotice($updateTitle, $body['message'], 'https://www.bluefootcms.com/');
                        }
                    }
                }
            }
        } catch (\Zend_Http_Client_Exception $e) {
            // Ignore client exceptions
        } catch (\Exception $e) {
            // Ignore general exceptions
        }

        $this->setLastUpdate();

        return $this;
    }

    /**
     * Check for updates once a week
     *
     * @return int
     */
    public function getFrequency()
    {
        return 604800;
    }

    /**
     * Retrieve Last update time
     *
     * @return int
     */
    public function getLastUpdate()
    {
        return $this->_cacheManager->load(self::UPDATE_TIME_CACHE_KEY);
    }

    /**
     * Set last update time (now)
     *
     * @return $this
     */
    public function setLastUpdate()
    {
        $this->_cacheManager->save(time(), self::UPDATE_TIME_CACHE_KEY);
        return $this;
    }
}
