<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Gene\BlueFoot\Setup;

use Magento\Framework\Serialize\Serializer\Json;

class TreeConverter
{
    /**
     * @var RendererPool
     */
    private $rendererPool;

    /**
     * @var ChildrenExtractorPool
     */
    private $childrenExtractorPool;

    /**
     * @var Json
     */
    private $serializer;

    /**
     * Constructor
     *
     * @param RendererPool $rendererPool
     * @param ChildrenExtractorPool $childrenExtractorPool
     * @param Json $serializer
     */
    public function __construct(
        RendererPool $rendererPool,
        ChildrenExtractorPool $childrenExtractorPool,
        Json $serializer
    ) {
        $this->rendererPool = $rendererPool;
        $this->childrenExtractorPool = $childrenExtractorPool;
        $this->serializer = $serializer;
    }

    /**
     * Render JSON format to new master format
     *
     * @param $string
     * @return string
     */
    public function convert($string)
    {
        $jsonTree = $this->serializer->unserialize($string);
        $html = '';
        foreach ($jsonTree as $treeItem) {
            $html .= $this->convertTreeItem($treeItem);
        }
        return $html;
    }

    /**
     * Render content type item
     *
     * @param array $item
     * @return string
     */
    private function convertTreeItem($item)
    {
        $contentType = isset($item['type']) ? $item['type'] : $item['contentType'];
        $renderer = $this->rendererPool->getRender($contentType);
        $childrenExtractor = $this->childrenExtractorPool->getExtractor($contentType);
        $children = $childrenExtractor->extract($item);
        if (!empty($children)) {
            $childrenHtml = '';
            foreach ($children as $childItem) {
                $childrenHtml .= $this->convertTreeItem($childItem);
            }
            return $renderer->render($item, ['children' => $childrenHtml]);
        }
        return $renderer->render($item, []);
    }
}
