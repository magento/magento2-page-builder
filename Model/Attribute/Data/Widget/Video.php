<?php

namespace Gene\BlueFoot\Model\Attribute\Data\Widget;

/**
 * Class Product
 *
 * @package Gene\BlueFoot\Model\Attribute\Data\Widget
 *
 * @author Hob Adams <hob@gene.co.uk>
 */
class Video extends \Gene\BlueFoot\Model\Attribute\Data\AbstractWidget implements \Gene\BlueFoot\Model\Attribute\Data\WidgetInterface
{

    /**
     * @param \Magento\Framework\Model\Context $context
     * @param \Magento\Framework\Registry $registry
     * @param array $data
     */
    public function __construct(
        \Magento\Framework\Model\Context $context,
        \Magento\Framework\Registry $registry,
        \Gene\BlueFoot\Helper\Widget\Video $helper,
        array $data = []
    ) {
        $this->helper = $helper;
        parent::__construct($context, $registry, $data);
    }

    /**
     * Return Video data from the given field
     *
     * @return mixed
     */
    public function getVideo()
    {
        return $this->getEntity()->getData($this->getAttribute()->getData('attribute_code'));
    }


    /**
     * Return an array of basic product data used by the page builder
     *
     * @return array
     */
    public function asJson()
    {
        $url = $this->helper->previewAction($this->getVideo());

        return array(
            'url' => $url
        );
    }

}
