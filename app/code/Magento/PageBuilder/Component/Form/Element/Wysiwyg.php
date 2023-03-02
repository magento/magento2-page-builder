<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
declare(strict_types=1);

namespace Magento\PageBuilder\Component\Form\Element;

use Magento\Catalog\Setup\CategorySetup;
use Magento\Framework\App\ObjectManager;
use Magento\Framework\Data\FormFactory;
use Magento\Framework\View\Asset\Repository;
use Magento\Framework\View\Element\UiComponent\ContextInterface;
use Magento\Ui\Component\Wysiwyg\ConfigInterface;
use Magento\Catalog\Api\CategoryAttributeRepositoryInterface;
use Magento\Framework\Exception\NoSuchEntityException;
use Magento\PageBuilder\Model\Config as PageBuilderConfig;
use Magento\PageBuilder\Model\State as PageBuilderState;
use Magento\PageBuilder\Model\Stage\Config as Config;
use Magento\Framework\AuthorizationInterface;

/**
 * Updates wysiwyg element with Page Builder specific config
 *
 * @api
 */
class Wysiwyg extends \Magento\Ui\Component\Form\Element\Wysiwyg
{

    private const ADMIN_RESOURCE = 'Magento_Backend::content';

    /**
     * @var Repository
     */
    private $assetRepo;

    /**
     * @var AuthorizationInterface
     */
    private $authorization;

    /**
     * WYSIWYG Constructor
     *
     * @param ContextInterface $context
     * @param FormFactory $formFactory
     * @param ConfigInterface $wysiwygConfig
     * @param CategoryAttributeRepositoryInterface $attrRepository
     * @param PageBuilderState $pageBuilderState
     * @param Config $stageConfig
     * @param array $components
     * @param array $data
     * @param array $config
     * @param PageBuilderConfig|null $pageBuilderConfig
     * @param bool $overrideSnapshot
     * @param Repository|null $assetRepo
     * @param AuthorizationInterface|null $authorization
     * @SuppressWarnings(PHPMD.CyclomaticComplexity)
     * @SuppressWarnings(PHPMD.ExcessiveParameterList)
     * @SuppressWarnings(PHPMD.NPathComplexity)
     */
    public function __construct(
        ContextInterface $context,
        FormFactory $formFactory,
        ConfigInterface $wysiwygConfig,
        CategoryAttributeRepositoryInterface $attrRepository,
        PageBuilderState $pageBuilderState,
        Config $stageConfig,
        array $components = [],
        array $data = [],
        array $config = [],
        PageBuilderConfig $pageBuilderConfig = null,
        bool $overrideSnapshot = false,
        Repository $assetRepo = null,
        AuthorizationInterface $authorization = null
    ) {
        $this->assetRepo = $assetRepo ?: ObjectManager::getInstance()->get(Repository::class);
        $this->authorization = $authorization ?: ObjectManager::getInstance()->get(AuthorizationInterface::class);
        $wysiwygConfigData = $config['wysiwygConfigData'] ?? [];

        // If a dataType is present we're dealing with an attribute
        if (isset($config['dataType'])) {
            try {
                $attribute = $attrRepository->get($data['name']);

                if ($attribute && $attribute->getEntityTypeId() === CategorySetup::CATEGORY_ENTITY_TYPE_ID) {
                    $config['wysiwyg'] = (bool)$attribute->getIsWysiwygEnabled();
                }
            } catch (NoSuchEntityException $e) {
                $config['wysiwyg'] = true;
            }
        }
        $isAllowed = $this->authorization->isAllowed(self::ADMIN_RESOURCE);
        $isEnablePageBuilder = isset($wysiwygConfigData['is_pagebuilder_enabled'])
            && !$wysiwygConfigData['is_pagebuilder_enabled']
            || false;
        if (!$pageBuilderState->isPageBuilderInUse($isEnablePageBuilder) && $isAllowed) {
            // This is not done using definition.xml due to https://github.com/magento/magento2/issues/5647
            $data['config']['component'] = 'Magento_PageBuilder/js/form/element/wysiwyg';

            // Override the templates to include our KnockoutJS code
            $data['config']['template'] = 'ui/form/field';
            $data['config']['elementTmpl'] = 'Magento_PageBuilder/form/element/wysiwyg';
            $wysiwygConfigData = $stageConfig->getConfig();
            $wysiwygConfigData['pagebuilder_button'] = true;
            $wysiwygConfigData['pagebuilder_content_snapshot'] = true;
            $wysiwygConfigData = $this->processBreakpointsIcons($wysiwygConfigData);

            if ($overrideSnapshot) {
                $pageBuilderConfig = $pageBuilderConfig ?: ObjectManager::getInstance()->get(PageBuilderConfig::class);
                $wysiwygConfigData['pagebuilder_content_snapshot'] = $pageBuilderConfig->isContentPreviewEnabled();
            }

            // Add Classes for Page Builder Stage
            if (isset($wysiwygConfigData['pagebuilder_content_snapshot'])
                && $wysiwygConfigData['pagebuilder_content_snapshot']) {
                $data['config']['additionalClasses'] = [
                    'admin__field-wide admin__field-page-builder' => true
                ];
            }

            $data['config']['wysiwygConfigData'] = isset($config['wysiwygConfigData']) ?
                array_replace_recursive($config['wysiwygConfigData'], $wysiwygConfigData) :
                $wysiwygConfigData;
            $wysiwygConfigData['activeEditorPath'] = 'Magento_PageBuilder/pageBuilderAdapter';

            $config['wysiwygConfigData'] = $wysiwygConfigData;
        }

        parent::__construct($context, $formFactory, $wysiwygConfig, $components, $data, $config);
    }

    /**
     * Process viewport icon paths
     *
     * @param array $wysiwygConfigData
     * @return array
     */
    private function processBreakpointsIcons(array $wysiwygConfigData): array
    {
        if ($wysiwygConfigData && isset($wysiwygConfigData['viewports'])) {
            foreach ($wysiwygConfigData['viewports'] as $breakpoint => $attributes) {
                if (isset($attributes['icon'])) {
                    $wysiwygConfigData['viewports'][$breakpoint]['icon'] = $this->assetRepo->getUrl(
                        $attributes['icon']
                    );
                }
            }
        }
        return $wysiwygConfigData;
    }
}
