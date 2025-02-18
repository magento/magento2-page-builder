<?php
/**
 * Copyright 2024 Adobe
 * All rights reserved.
 * See COPYING.txt for license details.
 */
declare(strict_types=1);

namespace Magento\PageBuilder\Test\Unit\Model\Session;

use Magento\Framework\Math\Random;
use Magento\Framework\Session\SessionManagerInterface;
use Magento\PageBuilder\Model\Session\RandomKey;
use PHPUnit\Framework\MockObject\MockObject;
use PHPUnit\Framework\TestCase;

/**
 * Test for session random key
 */
class RandomKeyTest extends TestCase
{
    /**
     * @var SessionManagerInterface|MockObject
     */
    private $session;

    /**
     * @var Random|MockObject
     */
    private $random;

    /**
     * @var RandomKey
     */
    private $model;

    /**
     * @inheritDoc
     */
    protected function setUp(): void
    {
        parent::setUp();
        $this->session = $this->getMockBuilder(SessionManagerInterface::class)
            ->addMethods(['getData', 'setData'])
            ->getMockForAbstractClass();
        $this->random = $this->createMock(Random::class);
    }

    /**
     * @param string $keyName
     * @param int $keyLength
     * @param string|null $value
     * @param string $expected
     * @dataProvider getValueDataProvider
     */
    public function testGetValue(string $keyName, int $keyLength, ?string $value, string $expected): void
    {
        $this->model = new RandomKey(
            $this->random,
            $this->session,
            $keyName,
            $keyLength
        );
        $this->random->method('getRandomString')
            ->willReturnCallback(
                function ($length) {
                    return str_repeat('x', $length);
                }
            );
        $this->session->expects($this->once())
            ->method('getData')
            ->with($keyName)
            ->willReturn($value);

        $this->session->expects($value === null ? $this->once() : $this->never())
            ->method('setData')
            ->with(
                $keyName,
                $expected
            );

        $this->assertEquals($expected, $this->model->getValue());
    }

    /**
     * @return array[]
     */
    public static function getValueDataProvider(): array
    {
        return [
            [
                'some_key_1',
                8,
                null,
                'xxxxxxxx'
            ],
            [
                'some_key_2',
                16,
                null,
                'xxxxxxxxxxxxxxxx'
            ],
            [
                'some_key_3',
                32,
                'some_value',
                'some_value',
            ]
        ];
    }
}
