import { TemplateOutput } from '@/types';
import { BuildHandler } from './types';

class PromptFormatter {
    #handler: BuildHandler;

    constructor(handler: BuildHandler) {
        this.#handler = handler;
    }

    format(gen: Generator<TemplateOutput> | TemplateOutput[]) {
        let roleInitialized = false;
        let textAcc = '';

        const handleText = () => {
            if (textAcc.length > 0) {
                this.#handler.text({
                    text: textAcc,
                });
                textAcc = '';
            }
        }
        const handleRole = (role: string) => {
            this.#handler.role({
                role: role,
            });
        }
        const handleImage = (o: TemplateOutput.Image) => {
            this.#handler.image?.({
                filename: o.filename,
                data: o.data,
                dataType: o.dataType,
            });
        }
        const handleFile = (o: TemplateOutput.File) => {
            this.#handler.file?.({
                filename: o.filename,
                data: o.data,
                dataType: o.dataType,
            });
        }

        for (const item of gen) {
            let role: string | null = null;
            if (item.type === 'ROLE') {
                roleInitialized = true;
                role = item.role;
            }

            // 최초 role이 명시되지 않은 경우 user로 간주
            if (roleInitialized === false) {
                roleInitialized = true;
                role = 'user';
            }
            
            if (role) {
                handleText();
                handleRole(role);
            }

            // directive문 등으로 인해 TEXT가 연이어 오는 경우
            // 다른 type이 오기 전까지 누적해서 처리
            // SPLIT type은 TEXT를 나누어 보내기 위함
            if (item.type === 'TEXT') {
                textAcc += item.text;
            }
            else {
                handleText();

                if (item.type === 'IMAGE') {
                    handleImage(item);
                }
                else if (item.type === 'FILE') {
                    handleFile(item);
                }
            }
        }

        handleText();
    }
}

export default PromptFormatter;