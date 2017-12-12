<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Gene\BlueFoot\Setup;

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
     * Constructor
     *
     * @param RendererPool $rendererPool
     * @param ChildrenExtractorPool $childrenExtractorPool
     */
    public function __construct(
        RendererPool $rendererPool,
        ChildrenExtractorPool $childrenExtractorPool
    ) {
        $this->rendererPool = $rendererPool;
        $this->childrenExtractorPool = $childrenExtractorPool;
    }

    /**
     * Render JSON format to new master format
     *
     * @param $string
     * @return string
     */
    public function convert($string)
    {
        $jsonTree = json_decode($string, true);
        $result = '';
        foreach ($jsonTree as $treeItem) {
            $result .= $this->convertTreeItem($treeItem);
        }
        return $result;
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
