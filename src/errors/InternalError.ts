import { APTLErrorType } from '@/errors';
import APTLFail from "./APTLFail";

const UNKNOWN_HINT = {} as any;

/** 
 * 내부적으로 throw 되는 에러
 * throw 되는 시점에 hint를 확인할 수 없는 경우 사용
 * 내부에서 catch하여 hint를 추가해 다시 throw 되어야 한다
*/
export class InternalError extends APTLFail {
    constructor(message:string, type:APTLErrorType) {
        super(message, type, UNKNOWN_HINT);
        this.name = 'InternalError';
    }
}