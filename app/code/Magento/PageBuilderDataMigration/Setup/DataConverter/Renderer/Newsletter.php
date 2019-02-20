<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
declare(strict_types=1);

namespace Magento\PageBuilderDataMigration\Setup\DataConverter\Renderer;

use Magento\PageBuilderDataMigration\Setup\DataConverter\RendererInterface;
use Magento\PageBuilderDataMigration\Setup\DataConverter\EavAttributeLoaderInterface;
use Magento\PageBuilderDataMigration\Setup\DataConverter\StyleExtractorInterface;

/**
 * Render newsletter to PageBuilder format
 */
class Newsletter implements RendererInterface
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
     * @param StyleExtractorInterface $styleExtractor
     * @param EavAttributeLoaderInterface $eavAttributeLoader
     */
    public function __construct(
        StyleExtractorInterface $styleExtractor,
        EavAttributeLoaderInterface $eavAttributeLoader
    ) {
        $this->styleExtractor = $styleExtractor;
        $this->eavAttributeLoader = $eavAttributeLoader;
    }

    /**
     * @inheritdoc
     *
     * @throws \Magento\Framework\Exception\NoSuchEntityException
     */
    public function render(array $itemData, array $additionalData = []) : string
    {
        if (!isset($itemData['entityId'])) {
            throw new \InvalidArgumentException('entityId is missing.');
        }
        $eavData = $this->eavAttributeLoader->load($itemData['entityId']);

        $rootElementHtml = '<div data-element="main" data-content-type="html" data-appearance="default">';
        $rootElementHtml .= $this->getNewsletterHtml($itemData, $eavData) . '</div>';

        return $rootElementHtml;
    }

    /**
     * Get the html for the newsletter
     *
     * @param array $itemData
     * @param array $eavData
     * @return string
     */
    private function getNewsletterHtml(array $itemData, array $eavData): string
    {
        $newsletterButtonText = $eavData['button_text'] ?? __('Subscribe');
        $newsletterLabel = $eavData['label'] ?? __('Sign Up for Our Newsletter:');
        $newsletterTitle = $eavData['title'] ?? __('Newsletter');
        $newsletterPlaceHolder = $eavData['placeholder'] ?? __('Enter your email address');
        $newsletterClasses = $eavData['css_classes'] ?? '';
        $newsletterStyles = '';
        if (isset($itemData['formData'])) {
            $justifyContent = '';
            if (isset($itemData['formData']['align'])) {
                $convertAlignContent = [
                    'left' => 'flex-start',
                    'right' => 'flex-end',
                    'center' => 'center'
                ];
                $itemData['formData']['display'] = 'flex';
                $justifyContent = ' justify-content: ' . $convertAlignContent[$itemData['formData']['align']] . ';';
                unset($itemData['formData']['align']);
            }
            $style = $this->styleExtractor->extractStyle($itemData['formData']);
            if ($style) {
                $newsletterStyles = $style . $justifyContent;
            }
        }

        $newsletterHtml = '<div class="' . $newsletterClasses . '" style="' . $newsletterStyles . '">' .
            '<div class="block newsletter"><div class="title"><strong>' . $newsletterTitle . '</strong></div>' .
            '<div class="content">' .
            '<form class="form subscribe" novalidate method="post" ' .
                   'action="{{store direct_url=\'newsletter/subscriber/new\' _secure=1}}" ' .
                   'data-mage-init=\'{"validation": {"errorClass": "mage-error"}}\'>' .
            '<div class="field newsletter">' .
            '<label class="label" for="newsletter-' . $itemData['entityId'] . '">' .
            '<span>' . $newsletterLabel . '</span>'.
            '</label>' .
            '<div class="control">' .
            '<input name="email" type="email" id="newsletter-' . $itemData['entityId'] . '" '.
                    'placeholder="' . $newsletterPlaceHolder . '" ' .
                    'data-mage-init=\'{"mage/trim-input":{}}\' ' .
                    'data-validate="{required:true, \'validate-email\':true}"/>' .
            '</div></div>' .
            '<div class="actions">' .
            '<button class="action subscribe primary" title="' . $newsletterButtonText . '" type="submit">' .
            '<span>' . $newsletterButtonText . '</span>' .
            '</button>' .
            '</div></form></div></div></div>';

        return $newsletterHtml;
    }
}
