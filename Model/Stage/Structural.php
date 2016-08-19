<?php

namespace Gene\BlueFoot\Model\Stage;

/**
 * Class Structural
 *
 * @package Gene\BlueFoot\Model\Stage
 *
 * @author  Dave Macaulay <dave@gene.co.uk>
 */
class Structural extends \Magento\Framework\Model\AbstractModel
{
    /**
     * @var \Magento\Framework\ObjectManagerInterface
     */
    protected $objectManager;

    /**
     * @var \Gene\BlueFoot\Model\Config\ConfigInterface
     */
    protected $configInterface;

    /**
     * Structural constructor.
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
        \Magento\Framework\Model\ResourceModel\AbstractResource $resource = null,
        \Magento\Framework\Data\Collection\AbstractDb $resourceCollection = null,
        array $data = []
    )
    {
        $this->objectManager = $objectManager; /* Used for dynamic module loading below */
        $this->configInterface = $configInterface;

        parent::__construct($context, $registry, $resource, $resourceCollection, $data);
    }

    /**
     * Parse the structural configuration
     *
     * @return mixed
     */
    public function getStructuralConfig()
    {
        $config = $this->configInterface->getStructurals();

        foreach ($config as &$structural) {
            // The page builder doesn't care about these values
            unset($structural['renderer'], $structural['template']);
            if (isset($structural['name'])) {
                $structural['name'] = __($structural['name']);
            }
            foreach ($structural['fields'] as &$field) {
                if (isset($field['label'])) {
                    $field['label'] = __($field['label']);
                }
                if (isset($field['source_model'])) {
                    $sourceModel = $field['source_model'];
                    try {
                        $model = $this->objectManager->get($sourceModel);
                        if (method_exists($model, 'toOptionArray')) {
                            $field['options'] = $model->toOptionArray();
                        }
                    } catch (\Exception $e) {
                        $field['error'] = __('Unable to load source model: ' . $e->getMessage());
                    }
                    unset($field['source_model']);
                }
            }
        }

        return $config;
    }
}