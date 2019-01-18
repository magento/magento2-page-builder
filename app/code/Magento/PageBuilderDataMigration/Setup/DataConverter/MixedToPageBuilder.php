<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
declare(strict_types=1);

namespace Magento\PageBuilderDataMigration\Setup\DataConverter;

use Magento\Framework\DB\DataConverter\DataConverterInterface;

/**
 * Class MixedToPageBuilder
 *
 * Convert mixed PageBuilder & PageBuilder content to Magento PageBuilder compatible HTML structures, this should be
 * utilised for 3rd party extensions outside of core that previously extended PageBuilder's functionality.
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
     * Convert from one format to another
     *
     * @param string $value
     * @return string
     */
    public function convert(string $value)
    {
        if (strstr($value, Format::UNMIGRATED_KEY) !== false) {
            return $this->convertMixed($value);
        }

        return $value;
    }

    /**
     * Convert any instances of un-migrated content to the new format
     *
     * @param string $value
     * @return string
     */
    private function convertMixed(string $value)
    {
        /**
         * Match all instances of any un-migrated content within the value argument. This will automatically retrieve
         * any instance of a HTML content type (of the new format) with legacy encoded data stored inside it.
         */
        preg_match_all(
            '/<div.*data-role="html".*>[\n\r\s]*<!--' . Format::UNMIGRATED_KEY . '="(.*)"-->[\n\r\s]*<\/div>/',
            $value,
            $matches,
            PREG_SET_ORDER
        );
        $response = $value;
        foreach ($matches as $match) {
            /**
             * $contentType matches the ensure HTML content types declaration
             * $structure matches the internal JSON structure of the HTML comment
             */
            list ($contentType, $structure) = $match;
            if ($this->validator->validate($structure)) {
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
