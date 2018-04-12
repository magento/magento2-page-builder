<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Magento\PageBuilder\Model\Wysiwyg;

/**
 * This DefaultConfigProvider overrides existing configuration provided from the cms module
 */
class DefaultConfigProvider implements \Magento\Framework\Data\Wysiwyg\ConfigProviderInterface
{
    /**
     * @var \Magento\Framework\View\Asset\Repository
     */
    private $assetRepo;

    /**
     * @param \Magento\Framework\View\Asset\Repository $assetRepo
     */
    public function __construct(\Magento\Framework\View\Asset\Repository $assetRepo)
    {
        $this->assetRepo = $assetRepo;
    }

    /**
     * {@inheritdoc}
     */
    public function getConfig($config): \Magento\Framework\DataObject
    {
        $config->addData([
            'tinymce4' => [
                'toolbar' => 'undo redo | styleselect | fontsizeselect | forecolor backcolor | bold italic underline' .
                ' | alignleft aligncenter alignright | numlist bullist | link image table charmap | widgets variables',
                'plugins' => implode(
                    ' ',
                    [
                        'advlist',
                        'autolink',
                        'lists',
                        'link',
                        'charmap',
                        'media',
                        'noneditable',
                        'table',
                        'contextmenu',
                        'paste',
                        'code',
                        'help',
                        'table',
                        'textcolor',
                        'image'
                    ]
                ),
                'content_css' => [
                    $this->assetRepo->getUrl('mage/adminhtml/wysiwyg/tiny_mce/themes/ui.css'),
                    $this->assetRepo->getUrl('Magento_PageBuilder/css/source/wysiwyg/tinymce.css')
                ]
            ],
            'settings' => [
                'fontsize_formats' => '10px 12px 14px 16px 18px 20px 24px 26px 28px 32px 34px 36px 38px 40px 42px ' .
                    '48px 52px 56px 64px 72px',
                'style_formats' => [
                    [
                        'title' => 'Paragraph',
                        'block' => 'p'
                    ],
                    [
                        'title' => 'Heading 1',
                        'block' => 'h1'
                    ],
                    [
                        'title' => 'Heading 2',
                        'block' => 'h2'
                    ],
                    [
                        'title' => 'Heading 3',
                        'block' => 'h3'
                    ],
                    [
                        'title' => 'Heading 4',
                        'block' => 'h4'
                    ],
                    [
                        'title' => 'Heading 5',
                        'block' => 'h5'
                    ],
                    [
                        'title' => 'Heading 6',
                        'block' => 'h6'
                    ],
                    [
                        'title' => 'Important',
                        'block' => 'p',
                        'classes' => 'cms-content-important'
                    ],
                    [
                        'title' => 'Preformatted',
                        'block' => 'pre'
                    ]
                ]
            ]
        ]);
        return $config;
    }
}
