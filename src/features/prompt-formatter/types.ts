import { TemplateOutput } from '@/types';

export interface BuildHandler {
    role: (output: Omit<TemplateOutput.Role, 'type'>) => void;
    text: (output: Omit<TemplateOutput.Text, 'type'>) => void;
    image?: (output: Omit<TemplateOutput.Image, 'type'>) => void;
    file?: (output: Omit<TemplateOutput.File, 'type'>) => void;
}