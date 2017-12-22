<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Gene\BlueFoot\Setup\DataConverter;

use Magento\Framework\Serialize\Serializer\Json;

/**
 * Convert old BlueFoot format to PageBuilder format
 */
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
        if (isset($jsonTree['type']) || isset($jsonTree['contentType'])) {
            $jsonTree = [$jsonTree];
        }
        foreach ($jsonTree as $treeItem) {
            $html .= $this->convertTreeItem($treeItem, 0);
        }
        return $html;
    }

    /**
     * Convert content type item
     *
     * @param array $itemData
     * @param int $childIndex
     * @return string
     */
    private function convertTreeItem($itemData, $childIndex)
    {
        $contentType = isset($itemData['type']) ? $itemData['type'] : $itemData['contentType'];
        $renderer = $this->rendererPool->getRender($contentType);
        $childrenExtractor = $this->childrenExtractorPool->getExtractor($contentType);
        $children = $childrenExtractor->extract($itemData);
        if (!empty($children)) {
            $childrenHtml = '';
            $childIndex = 0;
            foreach ($children as $childItem) {
                $childrenHtml .= $this->convertTreeItem($childItem, $childIndex);
                $childIndex++;
            }
            return $this->processItemRendering(
                $renderer,
                $itemData,
                ['children' => $childrenHtml]
            );
        }
        return $this->processItemRendering(
            $renderer,
            $itemData,
            ['childIndex' => $childIndex]
        );
    }

    /**
     * Process item rendering
     *
     * @param RendererInterface $renderer
     * @param array $itemData
     * @param array $additionalData
     * @return string
     */
    private function processItemRendering($renderer, array $itemData, array $additionalData)
    {
        $defaultRenderer = $this->rendererPool->getRender('default');
        try {
            $html = $renderer->render($itemData, $additionalData);
        } catch (\InvalidArgumentException $exception) {
            $html = $defaultRenderer->render($itemData, $additionalData);
        } catch (NoSuchEntityException $exception) {
            $html = $defaultRenderer->render($itemData, $additionalData);
        }

        return $html;
    }
}
