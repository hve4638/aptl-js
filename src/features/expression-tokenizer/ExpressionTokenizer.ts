import { BuildError, FragmentError } from '@/errors';
import { APTLErrorType } from '@/errors';
import {
    RawToken,
    RawTokenType
} from '@/types/raw-token';
import {
    TOKEN_PATTERNS,
    INVALID_TOKEN_PATTERNS,
} from './types';

class ExpressionTokenizer {
    /**
     * 표현식 토크나이저
     * 표현식 문자열을 최소 단위로 쪼개어 토큰화
     * @param expressionText 토큰화할 표현식 문자열
     * @returns 토큰 배열
     */
    static tokenizeRaw(expressionText: string): RawToken[] {
        const tokens: RawToken[] = [];
        let position = 0;

        while (position < expressionText.length) {
            let match: RegExpMatchArray | null = null;

            const part = expressionText.slice(position);

            // 유효하지 않은 토큰 패턴 검사
            for (const [tokenType, pattern] of Object.entries(INVALID_TOKEN_PATTERNS)) {
                const regex = new RegExp(`^${pattern.source}`);
                match = part.match(regex);

                if (match) {
                    const text = match[0];

                    throw new BuildError(
                        'Invalid token',
                        {
                            error_type: APTLErrorType.INVALID_TOKEN,
                            position: {
                                begin: position,
                                end: position + text.length,
                            },
                            text,
                        }
                    );
                }
            }

            // 유효한 토큰 패턴 매칭
            for (const [tokenType, pattern] of Object.entries(TOKEN_PATTERNS)) {
                const regex = new RegExp(`^${pattern.source}`);
                match = part.match(regex);

                if (match) {
                    // 해석에 불필요한 SPACE 패턴도 포함됨
                    // 이후 에러 발생 시 위치를 찾기 위함
                    tokens.push({
                        type: tokenType as RawTokenType,
                        value: match[0]
                    });

                    position += match[0].length;
                    break;
                }
            }

            // 매칭되는 패턴이 없는 경우
            if (!match) {
                const text = expressionText[position];

                throw new BuildError(
                    'Invalid token',
                    {
                        error_type: APTLErrorType.INVALID_TOKEN,
                        text,
                        position: {
                            begin: position,
                            end: position + text.length,
                        },
                    }
                );
            }
        }

        return tokens;
    }
}

export default ExpressionTokenizer;