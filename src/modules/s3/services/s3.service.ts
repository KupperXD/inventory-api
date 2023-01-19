import { Injectable } from '@nestjs/common';
import { S3, Credentials } from 'aws-sdk';
import { ConfigService } from '@nestjs/config';
import { Logger } from '../../logger/service/logger.service';
import ApiServiceException from '../../../exceptions/api-service.exception';
import S3UploadFail from '../errors/upload-fail.error';
import { EnvironmentVariablesInterface } from '../../../interfaces/enviroment-variables.interface';
import { v4 as uuid } from 'uuid';

@Injectable()
export class S3Service {
    private readonly s3: S3;

    constructor(
        private readonly configService: ConfigService<EnvironmentVariablesInterface>,
        private readonly logger: Logger,
    ) {
        this.s3 = new S3({
            credentials: new Credentials({
                secretAccessKey: this.configService.get(
                    'AWS_SECRET_ACCESS_KEY',
                ),
                accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
            }),
            s3ForcePathStyle: true,
            endpoint: this.configService.get('AWS_ENDPOINT_URL'),
            region: this.configService.get('AWS_REGION'),
            signatureVersion: 'v4',
            sslEnabled: false,
        });
    }

    async uploadPublicFile(dataBuffer: Buffer, fileName: string) {
        try {
            return await this.s3
                .upload({
                    Bucket: this.configService.get('AWS_PUBLIC_BUCKET_NAME'),
                    Body: dataBuffer,
                    Key: `${uuid()}-${fileName}`,
                })
                .promise();
        } catch (e) {
            this.logger.error(e.toString());

            throw new ApiServiceException(new S3UploadFail());
        }
    }
}
