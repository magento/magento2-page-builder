<?php

namespace Gene\BlueFoot\Model\Stage;

use Gene\BlueFoot\Api\EntityRepositoryInterface;

/**
 * Class Save
 *
 * @package Gene\BlueFoot\Model\Stage
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
class Save extends \Magento\Framework\Model\AbstractModel
{
    const BLUEFOOT_STRING = 'GENE_BLUEFOOT';

    /**
     * @var \Gene\BlueFoot\Model\Config\ConfigInterface
     */
    protected $_configInterface;

    /**
     * @var \Gene\BlueFoot\Model\EntityFactory
     */
    protected $_entityFactory;

    /**
     * @var \Gene\BlueFoot\Model\Attribute\ContentBlockFactory
     */
    protected $_contentBlockFactory;

    /**
     * @var \Magento\Framework\App\Request\Http
     */
    protected $_request;

    /**
     * @var \Magento\Framework\Json\Helper\Data
     */
    protected $_jsonHelper;

    /**
     * @var array|null
     */
    protected $_globalFields = null;

    /**
     * @var \Gene\BlueFoot\Api\EntityRepositoryInterface
     */
    protected $_entityRepository;

    /**
     * @var \Gene\BlueFoot\Model\ResourceModel\Entity\CollectionFactory
     */
    protected $_entityCollection;

    /**
     * Save constructor.
     *
     * @param \Magento\Framework\Model\Context                             $context
     * @param \Magento\Framework\Registry                                  $registry
     * @param \Gene\BlueFoot\Model\Config\ConfigInterface                  $configInterface
     * @param \Gene\BlueFoot\Model\EntityFactory                           $entityFactory
     * @param \Gene\BlueFoot\Model\Attribute\ContentBlockFactory           $contentBlockFactory
     * @param \Magento\Framework\App\Request\Http                          $request
     * @param \Magento\Framework\Json\Helper\Data                          $jsonHelper
     * @param \Gene\BlueFoot\Api\EntityRepositoryInterface                 $entityRepositoryInterface
     * @param \Gene\BlueFoot\Model\ResourceModel\Entity\CollectionFactory  $entityCollectionFactory
     * @param \Magento\Framework\Model\ResourceModel\AbstractResource|null $resource
     * @param \Magento\Framework\Data\Collection\AbstractDb|null           $resourceCollection
     * @param array                                                        $data
     */
    public function __construct(
        \Magento\Framework\Model\Context $context,
        \Magento\Framework\Registry $registry,
        \Gene\BlueFoot\Model\Config\ConfigInterface $configInterface,
        \Gene\BlueFoot\Model\EntityFactory $entityFactory,
        \Gene\BlueFoot\Model\Attribute\ContentBlockFactory $contentBlockFactory,
        \Magento\Framework\App\Request\Http $request,
        \Magento\Framework\Json\Helper\Data $jsonHelper,
        EntityRepositoryInterface $entityRepositoryInterface,
        \Gene\BlueFoot\Model\ResourceModel\Entity\CollectionFactory $entityCollectionFactory,
        \Magento\Framework\Model\ResourceModel\AbstractResource $resource = null,
        \Magento\Framework\Data\Collection\AbstractDb $resourceCollection = null,
        array $data = []
    ) {
        $this->_configInterface = $configInterface;
        $this->_entityFactory = $entityFactory;
        $this->_contentBlockFactory = $contentBlockFactory;
        $this->_request = $request;
        $this->_jsonHelper = $jsonHelper;
        $this->_entityRepository = $entityRepositoryInterface;
        $this->_entityCollection = $entityCollectionFactory;

        parent::__construct($context, $registry, $resource, $resourceCollection, $data);
    }

    /**
     * Save the structures from the page builder
     *
     * @param $structures
     */
    public function saveStructures($structures)
    {
        // Loop through each form
        foreach($structures as $elementName => $content) {

            // We don't want nasty errors happening here
            try {

                // Try and parse the page structure
                $pageStructure = $this->decodeStructure($content);

                // Only attempt if the json decode was a success
                if ($pageStructure) {

                    // Create the correct structure
                    $this->createStructure($pageStructure);

                    // Json encode it for storage
                    $jsonData = $this->encodeStructure($pageStructure);

                    // Change the element name
                    $this->updatePost($elementName, $jsonData);
                }

            } catch (\Exception $e) {
                echo $e->getMessage();
                exit;
                // Handle error
            }

        }
    }

    /**
     * Decode the structure
     *
     * @param $structure
     *
     * @return mixed
     */
    public function decodeStructure($structure)
    {
        return $this->_jsonHelper->jsonDecode($structure);
    }

    /**
     * Return the global fields that aren't saved within an entity
     *
     * @return array|null
     */
    public function getGlobalFields()
    {
        if (is_null($this->_globalFields)) {
            $this->_globalFields = [];
            $config = $this->_configInterface->getGlobalFields();
            foreach ($config as $field) {
                $this->_globalFields[] = (string) $field['code'];
            }
        }
        return $this->_globalFields;
    }

    /**
     * Create the entities and update the structure with pointers
     *
     * @param $elements
     */
    public function createStructure(&$elements)
    {
        // Handle the extra element
        $storeId = false;
        $extra = array_filter($elements, function ($element) { return (isset($element['type']) && $element['type'] == 'extra'); });
        if ($extra && !empty($extra)) {
            unset($elements[key($extra)]);
            $extraItem = current($extra);
            $this->_handleExtra($extraItem);

            if (isset($extraItem['storeId']) && !empty($extraItem['storeId'])) {
                $storeId = $extraItem['storeId'];
            }
        }

        // Loop through the elements
        foreach($elements as &$element) {

            // If the element has a content type we need to create a new entity
            if(isset($element['contentType'])) {
                if ($fields = $this->getGlobalFields()) {
                    $storeInJson = array();
                    foreach ($fields as $field) {
                        if (isset($element['formData'][$field])) {
                            $storeInJson[$field] = $element['formData'][$field];
                        }
                    }
                }

                $entity = $this->createEntityFromElement($element, $storeId);
                if($entity && $entity->getId()) {
                    $element['entityId'] = $entity->getId();
                    unset($element['formData']);

                    if (isset($storeInJson)) {
                        // Restore any fields that will be stored in the form data
                        $element['formData'] = $storeInJson;
                    }
                }


                // If it has any children we need to run this method again
                if(isset($element['children']) && is_array($element['children'])) {
                    foreach($element['children'] as $name => &$children) {
                        $this->createStructure($element['children'][$name]);
                    }
                }

            } else {
                // If it has any children we need to run this method again
                if(isset($element['children']) && is_array($element['children'])) {
                    $this->createStructure($element['children']);
                }
            }
        }
    }

    /**
     * Handle any extra data
     *
     * @param $element
     */
    protected function _handleExtra($element)
    {
        if (isset($element['deleted']) && is_array($element['deleted']) && !empty($element['deleted'])) {
            $entities = $this->_entityCollection->create()
                ->addFieldToFilter('entity_id', array('in' => $element['deleted']));

            if ($entities->getSize()) {
                foreach ($entities as $entity) {
                    $this->_entityRepository->delete($entity);
                }
            }
        }

        $this->_eventManager->dispatch('gene_bluefoot_handle_extra', ['element' => $element]);
    }

    /**
     * Create the entity from the element
     *
     * @param $element
     *
     * @return mixed
     * @throws \Exception
     */
    public function createEntityFromElement($element, $storeId)
    {
        // We only create an entity if we have some data
        if(isset($element['formData']) && !empty($element['formData'])) {

            $contentBlock = $this->_contentBlockFactory->create()->load($element['contentType'], 'entity_type.identifier');
            if ($contentBlock) {

                // Format the form data
                $formData = $element['formData'];
                $formData['attribute_set_id'] = $contentBlock->getId();

                // Create our entity with the correct attribute set id
                $entity = $this->_entityFactory->create();
                if (isset($element['entityId'])) {
                    $entity->load($element['entityId']);
                } else if (isset($element['formData']['entityId'])) {
                    $entity->load($element['formData']['entityId']);
                }

                // Add it into the entity
                if (!empty($formData)) {
                    $entity->setData($formData);
                }

                // Set the store ID of the entity
                if ($storeId !== false) {
                    $entity->setStoreId($storeId);
                }

                // Save the create!
                if ($this->_entityRepository->save($entity)) {
                    return $entity;
                }
            }
        }

        return false;
    }

    /**
     * Add HTML comments around the code
     *
     * @param $structure
     *
     * @return string
     */
    public function encodeStructure($structure)
    {
        if(is_array($structure)) {
            $json = $this->_jsonHelper->jsonEncode($structure);
        } else {
            $json = $structure;
        }

        return '<!--' . self::BLUEFOOT_STRING . '="' . $json . '"-->';
    }

    /**
     * Set an array item to a given value using "dot" notation.
     *
     * If no key is given to the method, the entire array will be replaced.
     *
     * @param  array   $array
     * @param  string  $key
     * @param  mixed   $value
     * @return array
     * @see http://laravel.com
     */
    public function set(&$array, $key, $value)
    {
        if (is_null($key)) return $array = $value;

        $keys = explode('.', $key);

        while (count($keys) > 1)
        {
            $key = array_shift($keys);

            // If the key doesn't exist at this depth, we will just create an empty array
            // to hold the next value, allowing us to create the arrays to hold final
            // values at the correct depth. Then we'll keep digging into the array.
            if ( ! isset($array[$key]) || ! is_array($array[$key]))
            {
                $array[$key] = array();
            }

            $array =& $array[$key];
        }

        $array[array_shift($keys)] = $value;

        return $array;
    }

    /**
     * Update the post data in the request
     *
     * @param $elementName
     * @param $data
     */
    public function updatePost($elementName, $data)
    {
        // Place back in our square brackets
        $elementName = str_replace(array('[',']'), array('.',''), $elementName);

        // Handle that the catalog prepends the fields with 'product'
        // @todo investigate making this universal
        if ($this->_request->getControllerModule() == 'Magento_Catalog' && $this->_request->getControllerName() == 'product' && $this->_request->getActionName() == 'save') {
            $elementName = 'product.' . $elementName;
        }

        // Use "borrowed" Laravel function
        $this->set($_POST, $elementName, $data);

        // Set the $_POST back into the request object
        $this->_request->setPostValue($_POST);
    }

}