<?php

namespace Gene\BlueFoot\Block\Entity\PageBuilder\Block;

/**
 * Class Base
 *
 * @package Gene\BlueFoot\Block\Entity\PageBuilder\Block
 *
 * @author Hob Adams <hob@gene.co.uk>
 */
class Video extends AbstractBlock
{

    protected $_helper;

    /**
     * @param \Magento\Framework\View\Element\Template\Context $context
     * @param \Gene\BlueFoot\Model\Stage\Render $render
     * @param \Magento\Framework\Data\CollectionFactory $dataCollectionFactory
     * @param \Gene\BlueFoot\Helper\Widget\Video $helper
     * @param array $data
     */
    public function __construct(
        \Magento\Framework\View\Element\Template\Context $context,
        \Gene\BlueFoot\Model\Stage\Render $render,
        \Magento\Framework\Data\CollectionFactory $dataCollectionFactory,
        \Gene\BlueFoot\Helper\Widget\Video $helper,
        array $data = []
    ) {
        parent::__construct($context, $render, $dataCollectionFactory, $data);
        $this->_helper = $helper;
    }


    public function getVideo()
    {

        $dataModel = $this->getEntity()->_getResource()->getAttribute('video_url')->getDataModel($this->getEntity());
        var_dump($this->getEntity()->getVideoUrl());
        if ($dataModel instanceof Video && method_exists($dataModel, 'getVideo')) {
            return $dataModel->getVideo();
        }
        return false;
    }


    public function getVideoData()
    {
        $video = $this->getVideo();
        if ($video) {

            list($url) = explode(',', $video);

            return $this->_helper->previewAction($url);
//            return new Varien_Object(array(
//                'url' => Mage::helper('gene_bluefoot/video')->previewAction($url)
//            ));
        }
        return false;
    }

    /**
     * Get the style information for the video block
     *
     * @return string
     */
    public function getIframeStyle()
    {
        $entity = $this->getEntity();
        $styles = array();
        if ($height = $entity->getVideoHeight()) {
            $styles[] = 'height: ' . $height;
        }
        if ($width = $entity->getVideoWidth()) {
            $styles[] = 'width: ' . $width;
        }

        if (!empty($style)) {
            return implode(';', $styles);
        }
    }
}