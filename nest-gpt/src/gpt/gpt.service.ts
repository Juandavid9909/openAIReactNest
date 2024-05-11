import * as fs from "fs";
import * as path from "path";
import { Injectable, NotFoundException } from '@nestjs/common';
import OpenAI from 'openai';

import { orthographyCheckUseCase, prosConsDiscusserUseCase, prosConsDiscusserStreamUseCase, textToAudioUseCase, audioToTextUseCase } from './use-cases';
import { AudioToTextDto, OrthographyDto, ProsConsDiscusserDto, TextToAudioDto, TranslateDto } from './dtos';
import { translateUseCase } from './use-cases/translate.use-case';

@Injectable()
export class GptService {

    private openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
    });

    async orthographyCheck(orthographyDto: OrthographyDto) {
        return await orthographyCheckUseCase(this.openai, {
            prompt: orthographyDto.prompt
        });
    }

    async prosConsDiscusser({ prompt }: ProsConsDiscusserDto) {
        return await prosConsDiscusserUseCase(this.openai, { prompt });
    }

    async prosConsDiscusserStream({ prompt }: ProsConsDiscusserDto) {
        return await prosConsDiscusserStreamUseCase(this.openai, { prompt });
    }

    async translateText({ prompt, lang }: TranslateDto) {
        return await translateUseCase(this.openai, { prompt, lang });
    }

    async textToAudio({ prompt, voice }: TextToAudioDto) {
        return await textToAudioUseCase(this.openai, { prompt, voice });
    }

    async textToAudioGetter(fileId: string) {
        const filePath = path.resolve(__dirname, "../../generated/audios/", `${ fileId }.mp3`);

        const wasFound = fs.existsSync(filePath);

        if(!wasFound) throw new NotFoundException(`File ${ fileId } not found`);

        return filePath;
    }

    async audioToText(audioFile: Express.Multer.File, audioToTextDto?: AudioToTextDto) {
        const { prompt } = audioToTextDto;

        return await audioToTextUseCase(this.openai, { audioFile, prompt });
    }
}
