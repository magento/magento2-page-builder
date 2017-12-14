<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Gene\BlueFoot\Setup\DataConverter;

use Magento\Framework\DB\DataConverter\DataConverterInterface;

/**
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
     * BlueFootToPageBuilder constructor.
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
     * Convert from one format to another
     *
     * @param string $value
     * @return string
     */
    public function convert($value)
    {
        if ($this->validator->isBlueFoot($value)) {
            return $this->converter->convert($this->validator->getJson());
        }

        return $value;
    }
}
