<?php

namespace Gene\BlueFoot\Observer\Widget;

use Magento\Framework\Event\ObserverInterface;

/**
 * Class AddProductPriceBlock
 *
 * @package Gene\BlueFoot\Observer
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
class AddProductPriceBlock implements ObserverInterface
{
    /**
     * @var \Magento\Framework\Pricing\Render\Layout
     */
    protected $_pricingRenderLayout;

    /**
     * AddProductPriceBlock constructor.
     *
     * @param \Magento\Framework\Pricing\Render\Layout $pricingRenderLayout
     */
    public function __construct(
       \Magento\Framework\Pricing\Render\Layout $pricingRenderLayout
    ) {
        $this->_pricingRenderLayout = $pricingRenderLayout;
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
            $layout->createBlock(
                'Magento\Framework\Pricing\Render',
                'product.price.render.default',
                [
                    'data' => [
                        'price_render_handle' => 'catalog_product_prices',
                    ],
                ]
            );
        }

        // Add in our form key block
        if (!$layout->hasElement('formkey')) {
            $layout->addBlock('Magento\Framework\View\Element\FormKey', 'formkey');
        }

        return $this;
    }
}
