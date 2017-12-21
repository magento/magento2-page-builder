<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Gene\BlueFoot\Setup\DataConverter\Renderer;

use Gene\BlueFoot\Setup\DataConverter\RendererInterface;
use Gene\BlueFoot\Setup\DataConverter\EavAttributeLoaderInterface;
use Gene\BlueFoot\Setup\DataConverter\StyleExtractorInterface;
use Magento\Cms\Api\BlockRepositoryInterface;
use Magento\Framework\Exception\NoSuchEntityException;

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
     * @var BlockRepositoryInterface
     */
    private $blockRepository;

    public function __construct(
        StyleExtractorInterface $styleExtractor,
        EavAttributeLoaderInterface $eavAttributeLoader,
        BlockRepositoryInterface $blockRepository
    ) {
        $this->styleExtractor = $styleExtractor;
        $this->eavAttributeLoader = $eavAttributeLoader;
        $this->blockRepository = $blockRepository;
    }

    /**
     * {@inheritdoc}
     * @throws NoSuchEntityException
     */
    public function render(array $itemData, array $additionalData = [])
    {
        $eavData = $this->eavAttributeLoader->load($itemData);

        $block = $this->blockRepository->getById($eavData['block_id']);

        $rootElementAttributes = [
            'data-role' => 'block',
            'class' => $itemData['formData']['css_classes'] ?? '',
            'data-identifier' => $block->getIdentifier()
        ];

        $style = $this->styleExtractor->extractStyle($itemData['formData']);
        if ($style) {
            $rootElementAttributes['style'] = $style;
        }

        $rootElementHtml = '<div';
        foreach ($rootElementAttributes as $attributeName => $attributeValue) {
            $rootElementHtml .= $attributeValue ? " $attributeName=\"$attributeValue\"" : '';
        }

        $rootElementHtml .= '></div>';

        return $rootElementHtml;
    }
}
