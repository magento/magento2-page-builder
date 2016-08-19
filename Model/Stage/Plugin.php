<?php

namespace Gene\BlueFoot\Model\Stage;

/**
 * Class Plugin
 *
 * @package Gene\BlueFoot\Model\Stage
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
class Plugin extends \Magento\Framework\Model\AbstractModel
{
    /**
     * @var \Gene\BlueFoot\Model\Config\ConfigInterface
     */
    protected $configInterface;

    /**
     * Plugin constructor.
     *
     * @param \Magento\Framework\Model\Context                             $context
     * @param \Magento\Framework\Registry                                  $registry
     * @param \Gene\BlueFoot\Model\Config\ConfigInterface                  $configInterface
     * @param \Magento\Framework\Model\ResourceModel\AbstractResource|null $resource
     * @param \Magento\Framework\Data\Collection\AbstractDb|null           $resourceCollection
     * @param array                                                        $data
     */
    public function __construct(
        \Magento\Framework\Model\Context $context,
        \Magento\Framework\Registry $registry,
        \Gene\BlueFoot\Model\Config\ConfigInterface $configInterface,
        \Magento\Framework\Model\ResourceModel\AbstractResource $resource = null,
        \Magento\Framework\Data\Collection\AbstractDb $resourceCollection = null,
        array $data = []
    ) {
        $this->configInterface = $configInterface;

        parent::__construct($context, $registry, $resource, $resourceCollection, $data);
    }

    /**
     * Return the JS plugins needed for the page builder
     *
     * @return array
     */
    public function getJsPlugins()
    {
        return $this->configInterface->getJsPluginConfig();
    }
}
