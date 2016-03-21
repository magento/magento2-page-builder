<?php

namespace Gene\BlueFoot\Model\Stage;

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
     * @var \Magento\Framework\ObjectManagerInterface
     */
    protected $_objectManager;

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
     * Plugin constructor.
     *
     * @param \Magento\Framework\Model\Context                             $context
     * @param \Magento\Framework\Registry                                  $registry
     * @param \Magento\Framework\ObjectManagerInterface                    $objectManager
     * @param \Gene\BlueFoot\Model\Config\ConfigInterface                  $configInterface
     * @param \Magento\Framework\Model\ResourceModel\AbstractResource|null $resource
     * @param \Magento\Framework\Data\Collection\AbstractDb|null           $resourceCollection
     * @param array                                                        $data
     */
    public function __construct(
        \Magento\Framework\Model\Context $context,
        \Magento\Framework\Registry $registry,
        \Magento\Framework\ObjectManagerInterface $objectManager,
        \Gene\BlueFoot\Model\Config\ConfigInterface $configInterface,
        \Gene\BlueFoot\Model\EntityFactory $entityFactory,
        \Gene\BlueFoot\Model\Attribute\ContentBlockFactory $contentBlockFactory,
        \Magento\Framework\App\Request\Http $request,
        \Magento\Framework\Model\ResourceModel\AbstractResource $resource = null,
        \Magento\Framework\Data\Collection\AbstractDb $resourceCollection = null,
        array $data = []
    ) {
        $this->_objectManager = $objectManager;
        $this->_configInterface = $configInterface;
        $this->_entityFactory = $entityFactory;
        $this->_contentBlockFactory = $contentBlockFactory;
        $this->_request = $request;

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
        return $this->_objectManager->get('Magento\Framework\Json\Helper\Data')
            ->jsonDecode($structure);
    }

    /**
     * Create the entities and update the structure with pointers
     *
     * @param $elements
     */
    public function createStructure(&$elements)
    {
        // Loop through the elements
        foreach($elements as &$element) {

            // If the element has a content type we need to create a new entity
            if(isset($element['contentType'])) {
                $entity = $this->createEntityFromElement($element);
                if($entity && $entity->getId()) {
                    $element['entityId'] = $entity->getId();
                    unset($element['formData']);
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
     * Create the entity from the element
     *
     * @param $element
     *
     * @return mixed
     * @throws \Exception
     */
    public function createEntityFromElement($element)
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

                // Save the create!
                if ($entity->save()) {
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
            $json = $this->_objectManager->get('Magento\Framework\Json\Helper\Data')->jsonEncode($structure);
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

        // Use "borrowed" Laravel function
        $this->set($_POST, $elementName, $data);

        // Set the $_POST back into the request object
        $this->_request->setPostValue($_POST);
    }

}