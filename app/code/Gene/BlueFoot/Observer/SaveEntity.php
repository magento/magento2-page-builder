<?php

namespace Gene\BlueFoot\Observer;

use Magento\Framework\Event\ObserverInterface;

/**
 * Class SaveEntity
 *
 * @package Gene\BlueFoot\Observer
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
class SaveEntity implements ObserverInterface
{
    /**
     * @var \Gene\BlueFoot\Model\Stage\SaveFactory
     */
    protected $saveFactory;

    /**
     * @var array
     */
    protected $supportedFields = [];

    /**
     * SaveEntity constructor.
     *
     * @param \Gene\BlueFoot\Model\Stage\SaveFactory $saveFactory
     * @param array                                  $supportedFields
     */
    public function __construct(
        \Gene\BlueFoot\Model\Stage\SaveFactory $saveFactory,
        $supportedFields = []
    ) {
        $this->saveFactory = $saveFactory;
        $this->supportedFields = $supportedFields;
    }

    /**
     * Pass any supported objects through to the save factory for processing
     *
     * $supportedFields defined in di.xml
     *
     * @param \Magento\Framework\Event\Observer $observer
     *
     * @return $this
     */
    public function execute(\Magento\Framework\Event\Observer $observer)
    {
        $object = $observer->getEvent()->getObject();
        foreach (array_keys($this->supportedFields) as $className) {
            if ($object instanceof $className) {
                $this->saveFactory->create()->processObject(
                    $object,
                    $this->supportedFields[$className]
                );
            }
        }

        return $this;
    }
}
