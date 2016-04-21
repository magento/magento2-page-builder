<?php

namespace Gene\BlueFoot\Setup;

use Magento\Framework\Setup\InstallDataInterface;
use Magento\Framework\Setup\ModuleContextInterface;
use Magento\Framework\Setup\ModuleDataSetupInterface;

/**
 * Class InstallData
 *
 * @package Gene\BlueFoot\Setup
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
class InstallData implements InstallDataInterface
{
    /**
     * Entity setup factory
     *
     * @var EntitySetupFactory
     */
    private $_entitySetupFactory;

    /**
     * Group interface
     *
     * @var \Gene\BlueFoot\Model\Attribute\ContentBlock\GroupFactory
     */
    private $_groupFactory;

    /**
     * InstallData constructor.
     *
     * @param \Gene\BlueFoot\Setup\EntitySetupFactory                  $entitySetupFactory
     * @param \Gene\BlueFoot\Model\Attribute\ContentBlock\GroupFactory $groupFactory
     */
    public function __construct(
        EntitySetupFactory $entitySetupFactory,
        \Gene\BlueFoot\Model\Attribute\ContentBlock\GroupFactory $groupFactory
    )
    {
        $this->_entitySetupFactory = $entitySetupFactory;
        $this->_groupFactory = $groupFactory;
    }

    /**
     * {@inheritdoc}
     * @SuppressWarnings(PHPMD.ExcessiveMethodLength)
     */
    public function install(ModuleDataSetupInterface $setup, ModuleContextInterface $context)
    {
        /** @var \Gene\BlueFoot\Setup\EntitySetup $entitySetup */
        $entitySetup = $this->_entitySetupFactory->create(['setup' => $setup]);

        $setup->startSetup();

        // Install the default entities required for the system
        $entitySetup->installEntities();

        // Create the default groups
        $this->_installGroups();

        $setup->endSetup();
    }

    /**
     * Install the default page builder groups
     *
     * @return $this
     */
    protected function _installGroups()
    {
        $groups = [
            'general' => [
                'icon' => '<i class="fa fa-chevron-down"></i>',
                'name' => 'General'
            ],
            'media' => [
                'icon' => '<i class="fa fa-chevron-down"></i>',
                'name' => 'Media'
            ],
            'commerce' => [
                'icon' => '<i class="fa fa-chevron-down"></i>',
                'name' => 'Commerce'
            ],
            'other' => [
                'icon' => '<i class="fa fa-chevron-down"></i>',
                'name' => 'Other'
            ]
        ];

        // Iterate through creating the base groups
        foreach ($groups as $code => $data) {
            $group = $this->_groupFactory->create();
            $group->setData('code', $code);
            $group->addData($data);
            $group->save();
        }

        return $this;
    }

}
