<?php

namespace Gene\BlueFoot\Model\Stage;

use Gene\BlueFoot\Api\EntityRepositoryInterface;

/**
 * Class Render
 *
 * @package Gene\BlueFoot\Model\Stage
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
class Render extends \Magento\Framework\Model\AbstractModel
{
    /**
     * Default rendering class for structural elements
     */
    const DEFAULT_STRUCTURAL_RENDERER = 'Gene\BlueFoot\Block\Entity\PageBuilder\Structural\AbstractStructural';

    /**
     * Form key marker used to replace and restore the correct form key
     */
    const FORM_KEY_MARKER = 'GENE_BLUEFOOT_REPLACED_FORM_KEY';

    /**
     * @var \Gene\BlueFoot\Model\Config\ConfigInterface
     */
    protected $_configInterface;

    /**
     * @var \Gene\BlueFoot\Model\ResourceModel\Attribute\ContentBlock\CollectionFactory
     */
    protected $_contentBlockCollection;

    /**
     * @var \Gene\BlueFoot\Model\ResourceModel\Attribute\ContentBlock\Collection
     */
    protected $_loadedTypes;

    /**
     * @var \Gene\BlueFoot\Model\ResourceModel\Entity\CollectionFactory
     */
    protected $_entityCollection;

    /**
     * @var \Gene\BlueFoot\Model\ResourceModel\Entity\Collection
     */
    protected $_loadedEntities;

    /**
     * @var \Magento\Framework\View\LayoutFactory
     */
    protected $_layoutFactory;

    /**
     * @var \Magento\Framework\Data\Form\FormKey
     */
    protected $_formKey;

    /**
     * @var \Gene\BlueFoot\Api\EntityRepositoryInterface
     */
    protected $_entityRepository;

    /**
     * Plugin constructor.
     *
     * @param \Magento\Framework\Model\Context                             $context
     * @param \Magento\Framework\Registry                                  $registry
     * @param \Gene\BlueFoot\Model\Config\ConfigInterface                  $configInterface
     * @param \Magento\Framework\Model\ResourceModel\AbstractResource|null $resource
     * @param \Magento\Framework\Data\Collection\AbstractDb|null           $resourceCollection
     * @param array                                                        $data
     */
    public function __construct(
        \Magento\Framework\Model\Context $context,
        \Magento\Framework\Registry $registry,
        \Gene\BlueFoot\Model\Config\ConfigInterface $configInterface,
        \Gene\BlueFoot\Model\ResourceModel\Attribute\ContentBlock\CollectionFactory $contentBlockCollection,
        \Gene\BlueFoot\Model\ResourceModel\Entity\CollectionFactory $entityCollectionFactory,
        \Magento\Framework\View\LayoutFactory $layoutFactory,
        \Magento\Framework\Data\Form\FormKey $formKey,
        EntityRepositoryInterface $entityRepositoryInterface,
        \Magento\Framework\Model\ResourceModel\AbstractResource $resource = null,
        \Magento\Framework\Data\Collection\AbstractDb $resourceCollection = null,
        array $data = []
    ) {
        $this->_configInterface = $configInterface;
        $this->_contentBlockCollection = $contentBlockCollection;
        $this->_entityCollection = $entityCollectionFactory;
        $this->_layoutFactory = $layoutFactory;
        $this->_formKey = $formKey;
        $this->_entityRepository = $entityRepositoryInterface;

        parent::__construct($context, $registry, $resource, $resourceCollection, $data);
    }

    /**
     * Return a single entity from the collection loaded earlier
     *
     * @param $entityId
     *
     * @return $this
     */
    public function getEntity($entityId)
    {
        if($loaded = $this->_loadedEntities->getItemByColumnValue('entity_id', $entityId)) {
            return $loaded;
        }

        return $this->_entityRepository->getById($entityId);
    }

    /**
     * Render HTML sections as page builder content
     *
     * @param $html
     *
     * @return mixed
     */
    public function render($html)
    {
        $pageBuilderSections = $this->_matchPageBuilder($html);

        // Verify we have sections to build
        if(!empty($pageBuilderSections)) {

            // Load an entire collection of content types
            $this->_loadedTypes = $this->_contentBlockCollection->create()
                ->addFieldToSelect('*');

            // Return the HTML built
            $renderedHtml = $this->renderSections($pageBuilderSections, $html);

            $renderedHtml = $this->_afterHtmlRender($renderedHtml);

            return $renderedHtml;
        }

        return $html;
    }

    /**
     * Render place holders in the page of page builder content
     *
     * @param            $html
     * @param bool|false $placeholderHtml
     *
     * @return mixed
     */
    public function renderPlaceholders($html, $placeholderHtml = false)
    {
        $pageBuilderSections = $this->_matchPageBuilder($html);

        // Verify we have sections to build
        if (!empty($pageBuilderSections)) {
            if ($placeholderHtml === false) {
                $placeholderHtml = '<div class="gene-bluefoot-content-placeholder">' . __('Page Builder Content') . '</div>';
            }

            foreach ($pageBuilderSections as $section) {
                $html = str_replace($section['html'], $placeholderHtml, $html);
            }
        }

        return $html;
    }

    /**
     * Match page builder HTML content
     *
     * @param $html
     *
     * @return array
     */
    protected function _matchPageBuilder($html)
    {
        preg_match_all('/<!--' . \Gene\BlueFoot\Model\Stage\Save::BLUEFOOT_STRING . '="(.*?)"-->/', $html, $sections);

        // Convert the matches to an array which makes sense
        $pageBuilderSections = array();
        foreach($sections[0] as $key => $sectionHtml) {
            $pageBuilderSections[$key]['html'] = $sectionHtml;
        }
        foreach($sections[1] as $key => $json) {

            // Attempt to decode the json
            try {
                $pageBuilderSections[$key]['json'] = json_decode($json, true);
                $pageBuilderSections[$key]['cacheTag'] = md5($json);
            } catch(\Exception $e) {
                unset($pageBuilderSections[$key]);
            }
        }

        return $pageBuilderSections;
    }

    /**
     * Render each section
     *
     * @param $sections
     * @param $html
     *
     * @return mixed
     */
    public function renderSections($sections, $html)
    {
        // Loop through each section and start building
        foreach ($sections as $section) {

            // Build the section html
            $sectionHtml = $this->buildSectionHtml($section['json']);

            // Check the section HTML was built
            if (!$sectionHtml) {
                $sectionHtml = '<!-- Gene BlueFoot Rendering Issue -->';
            }

            // Swap out the JSON for generated HTML
            $html = str_replace($section['html'], $sectionHtml, $html);
        }

        return $html;
    }

    /**
     * Build the section HTML
     *
     * @param array $json
     *
     * @return string
     */
    public function buildSectionHtml(array $json)
    {
        // Load all of the entities
        $this->_loadedEntities = $this->buildEntities($json);

        // Start our string
        $sectionHtml = '';

        // Verify we have some entities
        if(!empty($this->_loadedEntities)) {
            $this->buildElementHtmlFromArray($json, $sectionHtml);
        }

        // Replace all form keys before this gets cached/returned
        $sectionHtml = str_replace($this->_formKey->getFormKey(), self::getFormKeyMarker(), $sectionHtml);

        return $sectionHtml;
    }

    /**
     * Build up an array of entities from entity ID's
     *
     * @param $config
     *
     * @return array
     * @throws \Mage_Core_Exception
     */
    public function buildEntities($config)
    {
        // If the configuration is a string convert it
        if(is_string($config)) {
            $config = json_decode($config, true);
        }

        // Retrieve all the entity ID's
        $entityIds = array();
        $this->getEntityIds($config, $entityIds);

        return $this->retrieveEntities($entityIds);
    }

    /**
     * Get all the entity ID's from the config
     *
     * @param $config
     * @param $entityIds
     *
     * @return array
     */
    public function getEntityIds($config, &$entityIds)
    {
        foreach($config as $element) {
            if(isset($element['entityId'])) {
                $entityIds[] = $element['entityId'];

                // Retrieve the entities ID's for any children items
                if(isset($element['children']) && is_array($element['children'])) {
                    foreach($element['children'] as $name => $children) {
                        $this->getEntityIds($children, $entityIds);
                    }
                }
            } else {
                // Retrieve the entities ID's for any children items
                if(isset($element['children']) && is_array($element['children'])) {
                    $this->getEntityIds($element['children'], $entityIds);
                }
            }
        }

        return $entityIds;
    }

    /**
     * Retrieve entities by their ID
     *
     * @param $entityIds
     *
     * @return $this
     * @throws \Magento\Framework\Exception\LocalizedException
     */
    public function retrieveEntities($entityIds)
    {
        // They should be unique, but just in case
        $entityIds = array_unique($entityIds);

        // Retrieve all the entities
        $entities = $this->_entityCollection->create()
            ->addAttributeToSelect('*')
            ->addAttributeToFilter('entity_id', $entityIds);

        return $entities;
    }

    /**
     * Build elements HTML from an array
     *
     * @param array $json
     * @param       $html
     */
    public function buildElementHtmlFromArray(array $json, &$html)
    {
        // Loop through each element
        foreach($json as $index => $element) {
            $html .= $this->buildElementHtml($element);
        }
    }

    /**
     * Build up the element HTML
     *
     * @param $element
     *
     * @return string
     */
    public function buildElementHtml($element)
    {
        // Detect the type
        if(isset($element['type'])) {
            return $this->buildStructuralHtml($element);
        } else if(isset($element['contentType'])) {
            return $this->buildEntityHtml($element);
        }

        return '';
    }

    /**
     * Build a structural element
     *
     * @param $element
     *
     * @return string
     */
    public function buildStructuralHtml($element)
    {
        $elementConfig = $this->_configInterface->getStructural($element['type']);
        if($elementConfig) {

            $elementTemplate = isset($elementConfig['template']) ? $elementConfig['template'] : '';
            // If the structural type doesn't have a template we cannot render it
            if(!isset($elementConfig['template']) || isset($elementConfig['template']) && empty($elementTemplate)) {
                return '<!-- STRUCTURAL ELEMENT HAS NO TEMPLATE: '.$element['type'].' -->';
            }

            // Determine the renderer we're going to use
            $renderer = self::DEFAULT_STRUCTURAL_RENDERER;
            if(isset($elementConfig['renderer']) && !empty($elementConfig['renderer'])) {
                $renderer = $elementConfig['renderer'];
            }

            /* @var $block \Magento\Framework\View\Element\Template */
            $block = $this->_layoutFactory->create()->createBlock($renderer);
            if($block) {
                // Add the formkey block
                if (!$block->getLayout()->hasElement('formkey')) {
                    $block->getLayout()->addBlock('Magento\Framework\View\Element\FormKey', 'formkey');
                }
                $block->setTemplate($elementTemplate);
                if(isset($element['formData']) && !empty($element['formData'])) {
                    $block->setData('form_data', $element['formData']);
                }
            } else {
                return '<!-- STRUCTURAL ELEMENT CANNOT LOAD BLOCK: '.$element['type'].' -->';
            }

            // Build the child HTML
            if(isset($element['children'])) {
                $childHtml = '';
                $this->buildElementHtmlFromArray($element['children'], $childHtml);
                $block->setData('rendered_child_html', $childHtml);
            }

            return $block->toHtml();
        }

        return '';
    }

    /**
     * Basic entity rendering
     *
     * @param $element
     *
     * @return string
     * @throws \Exception
     */
    public function buildEntityHtml($element)
    {
        if(isset($element['entityId'])) {

            // Build the block
            if($block = $this->buildEntityBlock($element)) {
                $blockHtml = $block->toHtml();

                return $blockHtml;
            }
        }

        return '';
    }

    /**
     * Build the block for the entity
     *
     * @param $element
     *
     * @return bool|mixed
     */
    public function buildEntityBlock($element)
    {
        /* @var $entity \Gene\BlueFoot\Model\Entity */
        $entity = $this->getEntity($element['entityId']);
        if(!$entity->getId()){
            return false;
        }

        // Pass over any form data to the entity
        if (isset($element['formData']) && !empty($element['formData'])) {
            foreach ($element['formData'] as $key => $value) {
                $entity->setData($key, $value);
            }
        }

        /* @var $frontend \Gene\BlueFoot\Model\Entity\Frontend */
        $frontend = $entity->getFrontend();

        /* @var $block \Magento\Framework\View\Element\Template */
        if($block = $frontend->getRenderBlock()) {
            // Add the formkey block
            if (!$block->getLayout()->hasElement('formkey')) {
                $block->getLayout()->addBlock('Magento\Framework\View\Element\FormKey', 'formkey');
            }
            $block->setTemplate($frontend->getViewTemplate());
            $block->setStructure($element);

            return $block;
        }

        return false;
    }

    /**
     * Return a form key marker
     *
     * @return string
     */
    public static function getFormKeyMarker()
    {
        $marker = self::FORM_KEY_MARKER;
        $marker = '{{' . chr(1) . chr(2) . chr(3) . $marker . chr(3) . chr(2) . chr(1) . '}}';
        return $marker;
    }

    /**
     * Do any post processing to rendered html
     *
     * @param $html
     * @return mixed
     */
    protected function _afterHtmlRender($html)
    {
        self::restoreFormKey($html, $this->_formKey->getFormKey());
        return $html;
    }

    /**
     * Replace form key placeholder with actual form keys
     *
     * @param $content
     * @param $formKey
     * @return bool
     */
    public static function restoreFormKey(&$content, $formKey)
    {
        if (!$content) {
            return false;
        }
        $replacementCount = 0;
        $content = str_replace(self::getFormKeyMarker(), $formKey, $content, $replacementCount);
        return ($replacementCount > 0);
    }

}