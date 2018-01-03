<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Gene\BlueFoot\Setup;

use Magento\Framework\Setup\UpgradeDataInterface;
use Magento\Framework\Setup\ModuleDataSetupInterface;
use Magento\Framework\Setup\ModuleContextInterface;
use Magento\Framework\Exception\NoSuchEntityException;

/**
 * Class UpgradeData
 *
 */
class UpgradeData implements UpgradeDataInterface
{
    /**
     * @var \Gene\BlueFoot\Model\Attribute\ContentBlock\GroupRepository
     */
    protected $groupRepository;

    /**
     * UpgradeData constructor.
     *
     * @param \Gene\BlueFoot\Model\Attribute\ContentBlock\GroupRepository $groupRepository
     */
    public function __construct(
        \Gene\BlueFoot\Model\Attribute\ContentBlock\GroupRepository $groupRepository
    ) {
        $this->groupRepository = $groupRepository;
    }

    /**
     * Update data for 1.1
     *
     * @param \Magento\Framework\Setup\ModuleDataSetupInterface $setup
     * @param \Magento\Framework\Setup\ModuleContextInterface   $context
     */
    public function upgrade(ModuleDataSetupInterface $setup, ModuleContextInterface $context)
    {
        $setup->startSetup();

        // Run further changes when upgraded to 1.1.0
        if (version_compare($context->getVersion(), '1.1.0') < 0) {
            $this->migrateGroups();
        }

        $setup->endSetup();
    }

    /**
     * Migrate the group data to use new icons
     *
     * @return $this
     */
    protected function migrateGroups()
    {
        // Declare the updates we're making to the groups
        $updates = [
            'general' => [
                'icon' => '<i class="fa fa-pencil" aria-hidden="true"></i>'
            ],
            'media' => [
                'icon' => '<i class="fa fa-picture-o" aria-hidden="true"></i>'
            ],
            'commerce' => [
                'icon' => '<i class="fa fa-shopping-bag" aria-hidden="true"></i>'
            ],
            'other' => [
                'name' => 'Magento',
                'code' => 'magento',
                'icon' => '<i class="fa fa-codepen" aria-hidden="true"></i>'
            ],
            'structural' => [
                'icon' => '<i class="fa fa-bars" aria-hidden="true"></i>'
            ]
        ];

        // Iterate through the updates and save groups
        foreach ($updates as $key => $update) {
            try {
                $group = $this->groupRepository->getByCode($key);
                $group->addData($update);
                $group->save();
            } catch (NoSuchEntityException $e) {
                // Group no longer exists
            }
        }

        return $this;
    }

}
