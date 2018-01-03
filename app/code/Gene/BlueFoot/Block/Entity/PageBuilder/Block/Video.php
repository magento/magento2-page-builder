<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Gene\BlueFoot\Block\Entity\PageBuilder\Block;

/**
 * Class Base
 */
class Video extends AbstractBlock
{
    /**
     * @var \Gene\BlueFoot\Helper\Widget\Video
     */
    protected $helper;

    /**
     * @param \Magento\Framework\View\Element\Template\Context $context
     * @param \Magento\Framework\Data\CollectionFactory        $dataCollectionFactory
     * @param \Gene\BlueFoot\Helper\Widget\Video               $helper
     * @param array                                            $data
     */
    public function __construct(
        \Magento\Framework\View\Element\Template\Context $context,
        \Magento\Framework\Data\CollectionFactory $dataCollectionFactory,
        \Gene\BlueFoot\Helper\Widget\Video $helper,
        array $data = []
    ) {
        parent::__construct($context, $dataCollectionFactory, $data);
        $this->helper = $helper;
    }

    /**
     * Return the video
     *
     * @return bool|mixed
     */
    public function getVideo()
    {
        /* @var $dataModel \Gene\BlueFoot\Model\Attribute\Data\Widget\Video */
        $dataModel = $this->getEntity()->getResource()->getAttribute('video_url')->getDataModel($this->getEntity());
        if ($dataModel instanceof \Gene\BlueFoot\Model\Attribute\Data\Widget\Video &&
            method_exists($dataModel, 'getVideo')
        ) {
            return $dataModel->getVideo();
        }

        return false;
    }

    /**
     * Get the video data
     *
     * @return bool|string
     */
    public function getVideoData()
    {
        $video = $this->getVideo();
        if ($video) {
            list($url) = explode(',', $video);
            $obj = new \Magento\Framework\DataObject();
            $obj->setUrl($this->helper->previewAction($url));

            return $obj;
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

        return null;
    }
}
