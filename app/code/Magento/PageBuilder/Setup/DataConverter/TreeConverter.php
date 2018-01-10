<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Gene\BlueFoot\Setup\DataConverter;

use Magento\Framework\Serialize\Serializer\Json;
use Magento\Framework\Exception\NoSuchEntityException as NoSuchEntityExceptionLocalized;
use Gene\BlueFoot\Setup\DataConverter\UnableMigrateWithOutParentException;

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
     * @var array
     */
    private $unseparatableContentTypes;

    /**
     * Constructor
     *
     * @param RendererPool $rendererPool
     * @param ChildrenExtractorPool $childrenExtractorPool
     * @param Json $serializer
     * @param array $unseparatableContentTypes
     */
    public function __construct(
        RendererPool $rendererPool,
        ChildrenExtractorPool $childrenExtractorPool,
        Json $serializer,
        array $unseparatableContentTypes = []
    ) {
        $this->rendererPool = $rendererPool;
        $this->childrenExtractorPool = $childrenExtractorPool;
        $this->serializer = $serializer;
        $this->unseparatableContentTypes = $unseparatableContentTypes;
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
            try {
                foreach ($children as $childItem) {
                    $childrenHtml .= $this->convertTreeItem($childItem, $childIndex);
                    $childIndex++;
                }
                return $this->processItemRendering(
                    $renderer,
                    $itemData,
                    ['children' => $childrenHtml]
                );
            } catch (UnableMigrateWithOutParentException $exception) {
                $defaultRenderer = $this->rendererPool->getRender('default');
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
        $defaultRenderer = $this->rendererPool->getRender('default');

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
        } catch (\InvalidArgumentException $exception) {
            if ($this->isUnseparatableContentType($itemData)) {
                $this->throwUnableMigrateWithOutParentException($exception);
            }
            $html = $defaultRenderer->render($itemData, $itemAdditionalData);
        } catch (NoSuchEntityException $exception) {
            if ($this->isUnseparatableContentType($itemData)) {
                $this->throwUnableMigrateWithOutParentException($exception);
            }
            $html = $defaultRenderer->render($itemData, $itemAdditionalData);
        } catch (NoSuchEntityExceptionLocalized $exception) {
            if ($this->isUnseparatableContentType($itemData)) {
                $this->throwUnableMigrateWithOutParentException($exception);
            }
            $html = $defaultRenderer->render($itemData, $itemAdditionalData);
        }

        return $html;
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

    /**
     * Throw UnableMigrateWithOutParentException
     *
     * @param $exception
     * @throws UnableMigrateWithOutParentException
     */
    private function throwUnableMigrateWithOutParentException($exception)
    {
        throw new UnableMigrateWithOutParentException(
            __('Content type can not be migrated with out parent.'),
            null,
            $exception
        );
    }
}
