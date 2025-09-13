import { StringUtils } from './StringUtils';

describe('StringUtils with StringResult input', () => {
    describe('split with StringResult input', () => {
        test('should split StringResult by delimiter and maintain context', () => {
            const initialResult = {
                value: 'hello_world_test',
                left: 'prefix_',
                right: '_suffix',
                position: 7
            };

            const result = StringUtils.split(initialResult, '_');
            expect(result).toEqual([
                {
                    value: 'hello', 
                    position: 7, 
                    left: 'prefix_', 
                    right: '_world_test_suffix' 
                },
                { 
                    value: 'world', 
                    position: 7 + 'hello_'.length, 
                    left: 'prefix_hello_', 
                    right: '_test_suffix' 
                },
                { 
                    value: 'test', 
                    position: 7 + 'hello_world_'.length, 
                    left: 'prefix_hello_world_', 
                    right: '_suffix' 
                }
            ]);
        });

        test('should handle empty StringResult value', () => {
            const initialResult = {
                value: '',
                left: 'prefix_',
                right: '_suffix',
                position: 7
            };

            const result = StringUtils.split(initialResult, ',');
            expect(result).toEqual([
                { 
                    value: '', 
                    position: 7, 
                    left: 'prefix_', 
                    right: '_suffix' 
                }
            ]);
        });

        test('should handle StringResult with delimiter at edges', () => {
            const initialResult = {
                value: '_hello_',
                left: 'prefix',
                right: 'suffix',
                position: 6
            };

            const result = StringUtils.split(initialResult, '_');
            expect(result).toEqual([
                { 
                    value: '', 
                    position: 6, 
                    left: 'prefix', 
                    right: '_hello_suffix' 
                },
                { 
                    value: 'hello', 
                    position: 7, 
                    left: 'prefix_', 
                    right: '_suffix'
                },
                { 
                    value: '', 
                    position: 13, 
                    left: 'prefix_hello_', 
                    right: 'suffix' 
                }
            ]);
        });
    });

    describe.skip('trim with StringResult input', () => {
        test('should trim StringResult and combine contexts', () => {
            const initialResult = {
                value: '  hello world  ',
                left: 'prefix_',
                right: '_suffix',
                position: 10
            };

            const result = StringUtils.trim(initialResult);
            expect(result).toEqual({
                value: 'hello world',
                left: 'prefix_  ',
                right: '  _suffix',
                position: 12
            });
        });

        test('should handle StringResult with no whitespace', () => {
            const initialResult = {
                value: 'hello',
                left: 'prefix_',
                right: '_suffix',
                position: 5
            };

            const result = StringUtils.trim(initialResult);
            expect(result).toEqual({
                value: 'hello',
                left: 'prefix_',
                right: '_suffix',
                position: 5
            });
        });

        test('should handle StringResult with only whitespace', () => {
            const initialResult = {
                value: '   ',
                left: 'prefix_',
                right: '_suffix',
                position: 8
            };

            const result = StringUtils.trim(initialResult);
            expect(result).toEqual({
                value: '',
                left: 'prefix_   ',
                right: '_suffix',
                position: 11
            });
        });

        test('should handle StringResult with various whitespace types', () => {
            const initialResult = {
                value: '\t\n hello \r\n',
                left: 'start_',
                right: '_end',
                position: 3
            };

            const result = StringUtils.trim(initialResult);
            expect(result).toEqual({
                value: 'hello',
                left: 'start_\t\n ',
                right: ' \r\n_end',
                position: 6
            });
        });
    });

    describe.skip('trimLeft with StringResult input', () => {
        test('should trim left whitespace from StringResult', () => {
            const initialResult = {
                value: '  hello world  ',
                left: 'prefix_',
                right: '_suffix',
                position: 10
            };

            const result = StringUtils.trimLeft(initialResult);
            expect(result).toEqual({
                value: 'hello world  ',
                left: 'prefix_  ',
                right: '_suffix',
                position: 12
            });
        });

        test('should handle StringResult with no left whitespace', () => {
            const initialResult = {
                value: 'hello  ',
                left: 'prefix_',
                right: '_suffix',
                position: 5
            };

            const result = StringUtils.trimLeft(initialResult);
            expect(result).toEqual({
                value: 'hello  ',
                left: 'prefix_',
                right: '_suffix',
                position: 5
            });
        });

        test('should handle StringResult with only whitespace', () => {
            const initialResult = {
                value: '   ',
                left: 'prefix_',
                right: '_suffix',
                position: 7
            };

            const result = StringUtils.trimLeft(initialResult);
            expect(result).toEqual({
                value: '',
                left: 'prefix_   ',
                right: '_suffix',
                position: 10
            });
        });
    });

    describe.skip('trimRight with StringResult input', () => {
        test('should trim right whitespace from StringResult', () => {
            const initialResult = {
                value: '  hello world  ',
                left: 'prefix_',
                right: '_suffix',
                position: 10
            };

            const result = StringUtils.trimRight(initialResult);
            expect(result).toEqual({
                value: '  hello world',
                left: 'prefix_',
                right: '  _suffix',
                position: 10
            });
        });

        test('should handle StringResult with no right whitespace', () => {
            const initialResult = {
                value: '  hello',
                left: 'prefix_',
                right: '_suffix',
                position: 5
            };

            const result = StringUtils.trimRight(initialResult);
            expect(result).toEqual({
                value: '  hello',
                left: 'prefix_',
                right: '_suffix',
                position: 5
            });
        });

        test('should handle StringResult with only whitespace', () => {
            const initialResult = {
                value: '   ',
                left: 'prefix_',
                right: '_suffix',
                position: 7
            };

            const result = StringUtils.trimRight(initialResult);
            expect(result).toEqual({
                value: '',
                left: 'prefix_',
                right: '   _suffix',
                position: 7
            });
        });
    });

    describe.skip('chaining operations with StringResult', () => {
        test('should chain multiple operations preserving context', () => {
            const initialResult = {
                value: ' hello,world ',
                left: 'start_',
                right: '_end',
                position: 5
            };

            // First trim, then split
            const trimmed = StringUtils.trim(initialResult);
            const split = StringUtils.split(trimmed, ',');

            expect(split).toEqual([
                {
                    value: 'hello',
                    position: 6,
                    left: 'start_ ',
                    right: ',world _end'
                },
                {
                    value: 'world',
                    position: 12,
                    left: 'start_ hello,',
                    right: ' _end'
                }
            ]);
        });

        test('should handle complex chaining scenario', () => {
            const initialResult = {
                value: '  item1::item2  ',
                left: 'prefix_',
                right: '_suffix',
                position: 8
            };

            // Trim left, then split by ::, then trim right on first item
            const leftTrimmed = StringUtils.trimLeft(initialResult);
            const split = StringUtils.split(leftTrimmed, '::');
            const firstItemRightTrimmed = StringUtils.trimRight(split[0]);

            expect(firstItemRightTrimmed).toEqual({
                value: 'item1',
                left: 'prefix_  ',
                right: '::item2  _suffix',
                position: 10
            });
        });
    });
});