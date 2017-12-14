<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Gene\BlueFoot\Setup\DataConverter;

use Magento\Framework\DB\DataConverter\DataConverterInterface;

/**
 * Convert mixed BlueFoot & PageBuilder content to Magento PageBuilder compatible HTML structures, this should be
 * utilised for 3rd party extensions outside of core that previously extended BlueFoot's functionality.
 */
class MixedToPageBuilder implements DataConverterInterface
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
        if ($this->validator->isMixed($value)) {
            return $this->convertMixed($value);
        }

        return $value;
    }

    /**
     * Extract any valid instances of un-migrated content, convert their internal structure and replace them in the
     * original structure
     *
     * @param $value
     *
     * @return mixed
     */
    private function convertMixed($value)
    {
        // Match all HTML content types containing un-migrated content
        preg_match_all(
            '/<div.*data-role="html".*>[\n\r\s]*<!--' . Validator::UNMIGRATED_KEY . '="(.*)"-->[\n\r\s]*<\/div>/',
            $value,
            $matches,
            PREG_SET_ORDER
        );

        $response = $value;
        foreach ($matches as $match) {
            list ($contentType, $structure) = $match;
            if ($this->validator->isValidBlueFootJson($structure, false)) {
                $response = str_replace(
                    $contentType,
                    $this->converter->convert($structure),
                    $response
                );
            }
        }

        return $response;
    }
}
