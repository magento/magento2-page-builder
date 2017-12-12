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
     * Constructor
     *
     * @param RendererPool $rendererPool
     */
    public function __construct(
        RendererPool $rendererPool
    ) {
        $this->rendererPool = $rendererPool;
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
        if (isset($item['children'])) {
            $children = '';
            foreach ($item['children'] as $childItem) {
                $children .= $this->convertTreeItem($childItem);
            }
            return $renderer->render($item, ['children' => $children]);
        }
        return $renderer->render($item, []);
    }
}
