import { APTLErrorType } from '@/errors';

export type CompileFailReason = {
    error_type: APTLErrorType;
    position: {
        begin: number;
        end: number;
    };
    text: string;
}