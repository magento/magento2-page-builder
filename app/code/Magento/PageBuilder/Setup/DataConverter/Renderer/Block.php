<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
declare(strict_types=1);

namespace Magento\PageBuilder\Setup\DataConverter\Renderer;

use Magento\PageBuilder\Setup\DataConverter\RendererInterface;
use Magento\PageBuilder\Setup\DataConverter\EavAttributeLoaderInterface;
use Magento\PageBuilder\Setup\DataConverter\StyleExtractorInterface;
use Magento\Framework\App\ResourceConnection;
use Magento\Cms\Api\Data\BlockInterface;
use Magento\Framework\EntityManager\MetadataPool;
use Magento\PageBuilder\Setup\DataConverter\NoSuchEntityException;

/**
 * Render block to PageBuilder format
 */
class Block implements RendererInterface
{
    /**
     * @var StyleExtractorInterface
     */
    private $styleExtractor;

    /**
     * @var EavAttributeLoaderInterface
     */
    private $eavAttributeLoader;

    /**
     * @var ResourceConnection
     */
    private $resourceConnection;

    /**
     * @var MetadataPool
     */
    private $metadataPool;

    public function __construct(
        StyleExtractorInterface $styleExtractor,
        EavAttributeLoaderInterface $eavAttributeLoader,
        ResourceConnection $resourceConnection,
        MetadataPool $metadataPool
    ) {
        $this->styleExtractor = $styleExtractor;
        $this->eavAttributeLoader = $eavAttributeLoader;
        $this->resourceConnection = $resourceConnection;
        $this->metadataPool = $metadataPool;
    }

    /**
     * {@inheritdoc}
     */
    public function render(array $itemData, array $additionalData = []) : string
    {
        if (!isset($itemData['entityId'])) {
            throw new \InvalidArgumentException('entityId is missing.');
        }
        $eavData = $this->eavAttributeLoader->load($itemData['entityId']);

        if (!isset($eavData['block_id'])) {
            throw new NoSuchEntityException(__('block_id is missing.'));
        }
        $connection = $this->resourceConnection->getConnection();
        $blockMetadata = $this->metadataPool->getMetadata(BlockInterface::class);
        $select = $connection->select()
            ->from($this->resourceConnection->getTableName('cms_block'), ['identifier'])
            ->where($blockMetadata->getIdentifierField() . ' = ?', (int) $eavData['block_id']);
        $blockIdentifier = $connection->fetchOne($select);
        if (!$blockIdentifier) {
            throw new NoSuchEntityException(__('Block with id %1 does not exist.', $eavData['block_id']));
        }

        $rootElementAttributes = [
            'data-role' => 'block',
            'data-appearance' => 'default',
            'class' => $itemData['formData']['css_classes'] ?? '',
            'data-identifier' => $blockIdentifier
        ];

        if (isset($itemData['formData'])) {
            $style = $this->styleExtractor->extractStyle($itemData['formData']);
            if ($style) {
                $rootElementAttributes['style'] = $style;
            }
        }

        $rootElementHtml = '<div';
        foreach ($rootElementAttributes as $attributeName => $attributeValue) {
            $rootElementHtml .= $attributeValue ? " $attributeName=\"$attributeValue\"" : '';
        }

        $rootElementHtml .= '></div>';

        return $rootElementHtml;
    }
}
