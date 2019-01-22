<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
declare(strict_types=1);

namespace Magento\PageBuilderDataMigration\Setup\DataConverter;

use Magento\Framework\DB\DataConverter\DataConverterInterface;

/**
 * Class BlueFootToPageBuilder
 *
 * Convert existing BlueFoot 1.0.* structures into Magento PageBuilder compatible HTML structures. This is ran on first
 * install of the new Page Builder module. It will leave any unsupported content in the tree allowing the
 * MixedToPageBuilder process this later on.
 */
class BlueFootToPageBuilder implements DataConverterInterface
{
    /**
     * @var TreeConverter
     */
    private $converter;

    /**
     * @var Validator
     */
    private $validator;

    /**
     * Constructor
     *
     * @param TreeConverter $converter
     * @param Validator $validator
     */
    public function __construct(
        TreeConverter $converter,
        Validator $validator
    ) {
        $this->converter = $converter;
        $this->validator = $validator;
    }

    /**
     * Convert from legacy PageBuilder format into new storage format
     *
     * @param string $value
     * @return string
     */
    public function convert($value)
    {
        if (preg_match('/<!--' . Format::BLUEFOOT_KEY . '="(.*)"-->/', $value, $matches)) {
            if ($this->validator->validate($matches[1])) {
                $value = $this->converter->convert($matches[1]);
            }
        }
        return $value;
    }
}
