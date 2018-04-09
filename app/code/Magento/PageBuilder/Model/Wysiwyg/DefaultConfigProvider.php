<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

namespace Magento\PageBuilder\Model\Wysiwyg;

/**
 * Class DefaultConfigProvider returns data required to render tinymce4 editor
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
    public function getConfig($config)
    {
        $config->addData([
            'tinymce4' => [
                'toolbar' => 'undo redo | formatselect | fontsizeselect | forecolor backcolor | bold italic underline' .
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
                'content_css' => $this->assetRepo->getUrl('mage/adminhtml/wysiwyg/tiny_mce/themes/ui.css')
            ],
            'settings' => [
                'fontsize_formats' => '10px 12px 14px 16px 18px 20px 24px 26px 28px 32px 34px 36px 38px 40px 42px ' .
                    '48px 52px 56px 64px 72px',
                'block_formats' => 'Paragraph=p;Heading 1=h1;Heading 2=h2;Heading 3=h3;Heading 4=h4;Heading 5=h5;' .
                    'Heading 6=h6;Important=p.cms-content-important;Preformatted=pre'
            ]
        ]);
        return $config;
    }
}
