<?php

namespace Gene\BlueFoot\Observer\Widget;

use Magento\Framework\Event\ObserverInterface;

/**
 * Class SavePageBuilder
 *
 * @package Gene\BlueFoot\Observer
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
class AddProductPriceBlock implements ObserverInterface
{
    /**
     * @var \Magento\Framework\UrlInterface
     */
    protected $_urlBuilder;

    /**
     * @var \Gene\BlueFoot\Helper\Config
     */
    protected $_configHelper;

    /**
     * BuildInitConfig constructor.
     *
     * @param \Magento\Framework\UrlInterface $urlInterface
     */
    public function __construct(
        \Magento\Framework\UrlInterface $urlInterface,
        \Gene\BlueFoot\Helper\Config $configHelper
    ) {
        $this->_urlBuilder = $urlInterface;
        $this->_configHelper = $configHelper;
    }

    /**
     * Add in extra blocks during rendering
     *
     * @param \Magento\Framework\Event\Observer $observer
     *
     * @return $this
     */
    public function execute(\Magento\Framework\Event\Observer $observer)
    {
        /* @var $layout \Magento\Framework\View\Layout */
        $layout = $observer->getEvent()->getLayout();

        if (!$layout->hasElement('product.price.render.default')) {
            /* @var $priceRenderer \Magento\Framework\Pricing\Render */
            $priceRenderer = $layout->addBlock('\Magento\Framework\Pricing\Render', 'product.price.render.default');
            $priceRenderer->setData('price_render_handle', 'catalog_product_prices');
            $priceRenderer->setData('use_link_for_as_low_as', true);
        }

        // Add in our form key block
        if (!$layout->hasElement('formkey')) {
            $layout->addBlock('Magento\Framework\View\Element\FormKey', 'formkey');
        }

        return $this;
    }
}
