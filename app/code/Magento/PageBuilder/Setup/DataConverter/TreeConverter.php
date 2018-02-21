<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Magento\PageBuilder\Setup\DataConverter;

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
     * @var ChildrenRendererPool
     */
    private $childrenRendererPool;

    /**
     * @var Json
     */
    private $serializer;

    /**
     * @var array
     */
    private $unseparatableContentTypes;

    /**
     * TreeConverter constructor.
     *
     * @param RendererPool $rendererPool
     * @param ChildrenExtractorPool $childrenExtractorPool
     * @param ChildrenRendererPool $childrenRendererPool
     * @param Json $serializer
     * @param array $unseparatableContentTypes
     */
    public function __construct(
        RendererPool $rendererPool,
        ChildrenExtractorPool $childrenExtractorPool,
        ChildrenRendererPool $childrenRendererPool,
        Json $serializer,
        array $unseparatableContentTypes = []
    ) {
        $this->rendererPool = $rendererPool;
        $this->childrenExtractorPool = $childrenExtractorPool;
        $this->childrenRendererPool = $childrenRendererPool;
        $this->serializer = $serializer;
        $this->unseparatableContentTypes = $unseparatableContentTypes;
    }

    /**
     * Render JSON format to new master format
     *
     * @param $string
     *
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
     * @param array $children
     *
     * @return string
     */
    private function convertTreeItem($itemData, $childIndex, $children = [])
    {
        $contentType = isset($itemData['type']) ? $itemData['type'] : $itemData['contentType'];
        $renderer = $this->rendererPool->getRenderer($contentType);
        if (empty($children)) {
            $childrenExtractor = $this->childrenExtractorPool->getExtractor($contentType);
            $itemChildren = $childrenExtractor->extract($itemData);
        } else {
            $itemChildren = $children;
        }
        if (!empty($itemChildren)) {
            try {
                $childRenderer = $this->childrenRendererPool->getChildrenRenderer($contentType);
                $childrenHtml = $childRenderer->render(
                    $itemChildren,
                    function ($childItem, $childIndex, $children = []) {
                        return $this->convertTreeItem($childItem, $childIndex, $children);
                    }
                );
                return $this->processItemRendering(
                    $renderer,
                    $itemData,
                    ['children' => $childrenHtml]
                );
            } catch (UnableMigrateWithOutParentException $exception) {
                $defaultRenderer = $this->rendererPool->getRenderer('default');
                // If the children have been explicitly provided to the function we need to set them into the item
                if (!empty($children)) {
                    $itemData['children'] = $children;
                }
                return $this->processItemRendering(
                    $defaultRenderer,
                    $itemData
                );
            }
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
     * @param array $itemAdditionalData
     * @return string
     * @throws UnableMigrateWithOutParentException
     */
    private function processItemRendering($renderer, array $itemData, array $itemAdditionalData = [])
    {
        $defaultRenderer = $this->rendererPool->getRenderer('default');

        try {
            // Do not migrate content type if entity is missing required attributes
            set_error_handler(
                function () use ($itemData) {
                    restore_error_handler();
                    throw new \UnexpectedValueException(
                        'Entity data is invalid: "'
                        . $this->serializer->serialize($itemData)
                        . '".'
                    );
                },
                E_NOTICE
            );
            $html = $renderer->render($itemData, $itemAdditionalData);
            restore_error_handler();
        } catch (\Exception $exception) {
            $html = $this->handleRenderException(
                $exception,
                $defaultRenderer,
                $itemData,
                $itemAdditionalData
            );
        }

        return $html;
    }

    /**
     * Handle render exception. Migrate as html if content type can be migrated without parent,
     * otherwise throw UnableMigrateWithOutParentException
     *
     * @param \Exception $exception
     * @param RendererInterface $defaultRenderer
     * @param array $itemData
     * @param array $itemAdditionalData
     * @return string
     * @throws UnableMigrateWithOutParentException
     */
    private function handleRenderException($exception, $defaultRenderer, $itemData, $itemAdditionalData)
    {
        if ($this->isUnseparatableContentType($itemData)) {
            throw new UnableMigrateWithOutParentException(
                __('Content type can not be migrated with out parent.'),
                $exception
            );
        }
        return $defaultRenderer->render($itemData, $itemAdditionalData);
    }

    /**
     * Check whether content type is unseparatable, can not be part of another content type and parent content type
     * can not contain content types of different type
     *
     * @param array $itemData
     * @return bool
     */
    private function isUnseparatableContentType(array $itemData)
    {
        return in_array(
            isset($itemData['type']) ? $itemData['type'] : $itemData['contentType'],
            $this->unseparatableContentTypes
        );
    }
}
