<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Gene\BlueFoot\Model\Stage;

use Magento\Framework\Api\SearchCriteriaBuilder;
use Gene\BlueFoot\Api\ContentBlockGroupRepositoryInterface;

class Config extends \Magento\Framework\Model\AbstractModel
{
    const BLUEFOOT_CONFIG_CACHE_KEY = 'bluefoot_config_cache';
    const DEFAULT_COMPONENT = 'Gene_BlueFoot/js/component/block/block';
    const DEFAULT_PREVIEW_COMPONENT = 'Gene_BlueFoot/js/component/block/preview/block';

    /**
     * @var \Gene\BlueFoot\Model\Config\ConfigInterface
     */
    protected $configInterface;

    /**
     * @var \Magento\Framework\View\LayoutFactory
     */
    protected $layoutFactory;

    /**
     * @var \Gene\BlueFoot\Model\ResourceModel\Stage\Template\CollectionFactory
     */
    protected $templateCollection;

    /**
     * @var \Gene\BlueFoot\Model\ResourceModel\Entity
     */
    protected $entity;

    /**
     * @var \Magento\Framework\App\CacheInterface
     */
    protected $cacheManager;

    /**
     * @var \Magento\Framework\App\Cache\StateInterface
     */
    protected $cacheState;

    /**
     * @var Config\UiComponentConfig
     */
    protected $uiComponentConfig;

    /**
     * Config constructor.
     *
     * @param \Magento\Framework\Model\Context                                    $context
     * @param \Magento\Framework\Registry                                         $registry
     * @param \Gene\BlueFoot\Model\Config\ConfigInterface                         $configInterface
     * @param \Magento\Framework\View\LayoutFactory                               $layoutFactory
     * @param \Gene\BlueFoot\Model\ResourceModel\Stage\Template\CollectionFactory $templateCollectionFactory
     * @param \Gene\BlueFoot\Model\ResourceModel\Entity                           $entity
     * @param \Magento\Framework\App\Cache\StateInterface                         $cacheState
     * @param Config\UiComponentConfig                                            $uiComponentConfig
     * @param \Magento\Framework\Model\ResourceModel\AbstractResource|null        $resource
     * @param \Magento\Framework\Data\Collection\AbstractDb|null                  $resourceCollection
     * @param array                                                               $data
     */
    public function __construct(
        \Magento\Framework\Model\Context $context,
        \Magento\Framework\Registry $registry,
        \Gene\BlueFoot\Model\Config\ConfigInterface $configInterface,
        \Magento\Framework\View\LayoutFactory $layoutFactory,
        \Gene\BlueFoot\Model\ResourceModel\Stage\Template\CollectionFactory $templateCollectionFactory,
        \Gene\BlueFoot\Model\ResourceModel\Entity $entity,
        \Magento\Framework\App\Cache\StateInterface $cacheState,
        Config\UiComponentConfig $uiComponentConfig,
        \Magento\Framework\Model\ResourceModel\AbstractResource $resource = null,
        \Magento\Framework\Data\Collection\AbstractDb $resourceCollection = null,
        array $data = []
    ) {
        $this->cacheManager = $context->getCacheManager();
        $this->cacheState = $cacheState;
        $this->configInterface = $configInterface;
        $this->layoutFactory = $layoutFactory;
        $this->templateCollection = $templateCollectionFactory;
        $this->entity = $entity;
        $this->uiComponentConfig = $uiComponentConfig;

        parent::__construct(
            $context, $registry, $resource, $resourceCollection, $data
        );
    }

    /**
     * Return the config for the page builder instance
     *
     * @return array
     */
    public function getConfig()
    {
        // Use the cache to load and save the data
//        if ($this->cacheState->isEnabled(
//                \Gene\BlueFoot\Model\Cache\Config::TYPE_IDENTIFIER
//            )
//            && ($config = $this->cacheManager->load(
//                self::BLUEFOOT_CONFIG_CACHE_KEY
//            ))
//        ) {
//            return json_decode($config, true);
//        } else {
        $config = [
            'groups'       => $this->getGroups(),
            'contentTypes' => $this->getContentTypes(),
            'templates'    => $this->getTemplateData()
        ];

        // If the cache is enabled, store the config in the cache
        if ($this->cacheState->isEnabled(
            \Gene\BlueFoot\Model\Cache\Config::TYPE_IDENTIFIER
        )
        ) {
            // Store the configuration in the cache for 7 days
            $this->cacheManager->save(
                json_encode($config),
                self::BLUEFOOT_CONFIG_CACHE_KEY,
                [\Gene\BlueFoot\Model\Cache\Config::CACHE_TAG],
                (60 * 60 * 24 * 7) // Store in cache for 7 days
            );
        }

        return $config;
//        }
    }

    /**
     * Retrieve the content block groups
     *
     * @return array
     */
    public function getGroups()
    {
        return $this->configInterface->getGroups();
    }

    /**
     * Build up template data
     *
     * @return array
     */
    public function getTemplateData()
    {
        $templates = $this->templateCollection->create();
        $templates->setOrder(
            'pinned', \Magento\Framework\Data\Collection::SORT_ORDER_DESC
        );

        if ($templates->getSize()) {
            $templateData = array();
            foreach ($templates as $template) {
                $templateData[] = array(
                    'id'        => $template->getId(),
                    'name'      => $template->getData('name'),
                    'preview'   => $template->getData('preview'),
                    'structure' => $template->getData('structure'),
                    'pinned'    => (bool)$template->getData('pinned')
                );
            }
            return $templateData;
        }

        return [];
    }

    /**
     * Build up the content block data
     *
     * @return array
     */
    public function getContentTypes()
    {
        $contentTypes = $this->configInterface->getContentTypes();

        $contentBlockData = [];
        foreach ($contentTypes as $name => $contentType) {
            $contentBlockData[$name] = $this->flattenContentTypeData(
                $name,
                $contentType
            );
        }

        return $contentBlockData;
    }

    /**
     * Flatten the content block data
     *
     * @param $name
     * @param $contentType
     *
     * @return array
     */
    public function flattenContentTypeData($name, $contentType)
    {
        return [
            'name'              => $name,
            'label'             => __($contentType['label']),
            'icon'              => $contentType['icon'],
            'form'              => $contentType['form'],
            'contentType'       => '',
            'group'             => (isset($contentType['group'])
                ? $contentType['group'] : 'general'),
            'fields'            => $this->uiComponentConfig->getFields($contentType['form']),
            'visible'           => true,
            'preview_template'  => (isset($contentType['preview_template'])
                ? $contentType['preview_template'] : ''),
            'render_template'   => (isset($contentType['render_template'])
                ? $contentType['render_template'] : ''),
            'preview_component' => (isset($contentType['preview_component'])
                ? $contentType['preview_component']
                : self::DEFAULT_PREVIEW_COMPONENT),
            'component'         => (isset($contentBlock['component'])
                ? $contentType['component'] : self::DEFAULT_COMPONENT),
            'allowed_children'         => isset($contentType['allowed_children'])
                ? explode(',', $contentType['allowed_children']) : [],
            'readers'           => isset($contentType['readers']) ? $contentType['readers'] : [],
            'appearances' => isset($contentType['appearances']) ? $contentType['appearances'] : []
        ];
    }
}
