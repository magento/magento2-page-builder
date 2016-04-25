<?php

namespace Gene\BlueFoot\Block;

/**
 * Class Assets
 *
 * @package Gene\BlueFoot\Block
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
class Assets extends \Magento\Backend\Block\AbstractBlock
{
    /**
     * @var \Magento\Framework\View\Page\Config
     */
    protected $_pageConfig;

    /**
     * @var \Gene\BlueFoot\Model\Config\ConfigInterface
     */
    protected $_configInterface;

    /**
     * Assets constructor.
     *
     * @param \Magento\Backend\Block\Context              $context
     * @param \Magento\Framework\View\Page\Config         $pageConfig
     * @param \Gene\BlueFoot\Model\Config\ConfigInterface $configInterface
     */
    public function __construct(
        \Magento\Backend\Block\Context $context,
        \Magento\Framework\View\Page\Config $pageConfig,
        \Gene\BlueFoot\Model\Config\ConfigInterface $configInterface,
        array $data = []
    ) {
        $this->_pageConfig = $pageConfig;
        $this->_configInterface = $configInterface;
        parent::__construct($context, $data);
    }

    /**
     * Include our assets in the head
     */
    protected function _construct()
    {
        $templates = $this->_configInterface->getTemplates();
        $assets = [];
        foreach ($templates as $template) {
            if (isset($template['assets'])) {
                $assets = array_merge($assets, array_values($template['assets']));
            }
        }

        // Do we have any assets to load
        if (!empty($assets)) {
            $assets = array_unique($assets);
            foreach ($assets as $asset) {
                $this->_pageConfig->addPageAsset($asset);
            }
        }

        return $this;
    }

}