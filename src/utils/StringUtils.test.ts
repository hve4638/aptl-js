import { StringUtils } from './StringUtils';

describe('StringUtils.splitDetail', () => {
    it('should split string by delimiter and track positions', () => {
        const result = StringUtils.split('hello,world,test', ',');
        expect(result).toEqual([
            { value: 'hello', position: 0, left: '', right: ',world,test' },
            { value: 'world', position: 'hello,'.length, left: 'hello,', right: ',test' },
            { value: 'test', position: 'hello,world,'.length, left: 'hello,world,', right: '' }
        ]);
    });

    it('should handle empty parts', () => {
        const result = StringUtils.split('hello,,world', ',');
        expect(result).toEqual([
            { value: 'hello', position: 0, left: '', right: ',,world' },
            { value: '', position: 'hello,'.length, left: 'hello,', right: ',world' },
            { value: 'world', position: 'hello,,'.length, left: 'hello,,', right: '' }
        ]);
    });

    it('should handle delimiter at start', () => {
        const result = StringUtils.split(',hello,world', ',');
        expect(result).toEqual([
            { value: '', position: 0, left: '', right: ',hello,world' },
            { value: 'hello', position: ','.length, left: ',', right: ',world' },
            { value: 'world', position: ',hello,'.length, left: ',hello,', right: '' }
        ]);
    });

    it('should handle delimiter at end', () => {
        const result = StringUtils.split('hello,world,', ',');
        expect(result).toEqual([
            { value: 'hello', position: 0, left: '', right: ',world,' },
            { value: 'world', position: 'hello,'.length, left: 'hello,', right: ',' },
            { value: '', position: 'hello,world,'.length, left: 'hello,world,', right: '' }
        ]);
    });

    it('should handle no delimiter found', () => {
        const result = StringUtils.split('hello world', ',');
        expect(result).toEqual([
            { value: 'hello world', position: 0, left: '', right: '' }
        ]);
    });

    it('should handle empty string', () => {
        const result = StringUtils.split('', ',');
        expect(result).toEqual([
            { value: '', position: 0, left: '', right: '' }
        ]);
    });

    it('should handle multi-character delimiter', () => {
        const result = StringUtils.split('hello::world::test', '::');
        expect(result).toEqual([
            { value: 'hello', position: 0, left: '', right: '::world::test' },
            { value: 'world', position: 'hello::'.length, left: 'hello::', right: '::test' },
            { value: 'test', position: 'hello::world::'.length, left: 'hello::world::', right: '' }
        ]);
    });

    it('should handle single character string', () => {
        const result = StringUtils.split('a', ',');
        expect(result).toEqual([
            { value: 'a', position: 0, left: '', right: '' }
        ]);
    });
});

describe('StringUtils.trim', () => {
    describe('normal cases', () => {
        it('should trim whitespace from both ends', () => {
            const result = StringUtils.trim('  hello world  ');
            expect(result).toEqual({
                value: 'hello world',
                left: '  ',
                right: '  ',
                position: 2
            });
        });

        it('should handle strings with only left whitespace', () => {
            const result = StringUtils.trim('   hello');
            expect(result).toEqual({
                value: 'hello',
                left: '   ',
                right: '',
                position: 3
            });
        });

        it('should handle strings with only right whitespace', () => {
            const result = StringUtils.trim('hello   ');
            expect(result).toEqual({
                value: 'hello',
                left: '',
                right: '   ',
                position: 0
            });
        });

        it('should handle strings with no whitespace', () => {
            const result = StringUtils.trim('hello');
            expect(result).toEqual({
                value: 'hello',
                left: '',
                right: '',
                position: 0
            });
        });
    });

    describe('edge cases', () => {
        it('should handle empty string', () => {
            const result = StringUtils.trim('');
            expect(result).toEqual({
                value: '',
                left: '',
                right: '',
                position: 0
            });
        });

        it('should handle string with only whitespace', () => {
            const result = StringUtils.trim('   ');
            expect(result).toEqual({
                value: '',
                left: '   ',
                right: '',
                position: 3
            });
        });

        it('should handle various whitespace characters', () => {
            const result = StringUtils.trim('\t\n hello \r\n\t');
            expect(result).toEqual({
                value: 'hello',
                left: '\t\n ',
                right: ' \r\n\t',
                position: 3
            });
        });
    });
});

describe('StringUtils.trimLeft', () => {
    describe('normal cases', () => {
        it('should trim whitespace from left end only', () => {
            const result = StringUtils.trimLeft('  hello world  ');
            expect(result).toEqual({
                value: 'hello world  ',
                left: '  ',
                right: '',
                position: 2
            });
        });

        it('should handle strings with no left whitespace', () => {
            const result = StringUtils.trimLeft('hello   ');
            expect(result).toEqual({
                value: 'hello   ',
                left: '',
                right: '',
                position: 0
            });
        });
    });

    describe('edge cases', () => {
        it('should handle empty string', () => {
            const result = StringUtils.trimLeft('');
            expect(result).toEqual({
                value: '',
                left: '',
                right: '',
                position: 0
            });
        });

        it('should handle string with only whitespace', () => {
            const result = StringUtils.trimLeft('   ');
            expect(result).toEqual({
                value: '',
                left: '   ',
                right: '',
                position: 3
            });
        });

        it('should handle various whitespace characters', () => {
            const result = StringUtils.trimLeft('\t\n hello world');
            expect(result).toEqual({
                value: 'hello world',
                left: '\t\n ',
                right: '',
                position: 3
            });
        });
    });
});

describe('StringUtils.trimRight', () => {
    describe('normal cases', () => {
        it('should trim whitespace from right end only', () => {
            const result = StringUtils.trimRight('  hello world  ');
            expect(result).toEqual({
                value: '  hello world',
                left: '',
                right: '  ',
                position: 0
            });
        });

        it('should handle strings with no right whitespace', () => {
            const result = StringUtils.trimRight('   hello');
            expect(result).toEqual({
                value: '   hello',
                left: '',
                right: '',
                position: 0
            });
        });
    });

    describe('edge cases', () => {
        it('should handle empty string', () => {
            const result = StringUtils.trimRight('');
            expect(result).toEqual({
                value: '',
                left: '',
                right: '',
                position: 0
            });
        });

        it('should handle string with only whitespace', () => {
            const result = StringUtils.trimRight('   ');
            expect(result).toEqual({
                value: '',
                left: '',
                right: '   ',
                position: 0
            });
        });

        it('should handle various whitespace characters', () => {
            const result = StringUtils.trimRight('hello world \r\n\t');
            expect(result).toEqual({
                value: 'hello world',
                left: '',
                right: ' \r\n\t',
                position: 0
            });
        });
    });
});