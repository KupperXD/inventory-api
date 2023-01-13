import * as winston from 'winston';
import { createLogger, LoggerOptions, format } from 'winston';
import { Injectable, LogLevel, ConsoleLogger } from '@nestjs/common';

@Injectable()
export class Logger extends ConsoleLogger {
    private readonly logger: winston.Logger;

    private level = 'info';

    private static LOGS_PATH = 'logs';

    constructor() {
        super();
        this.logger = createLogger(this.getLoggerOptions(this.level));

        this.setContext('Main');
    }

    public setContext(context: string): this {
        this.context = context;

        return this;
    }

    public getLoggerOptions(level: string): LoggerOptions {
        return {
            format: format.combine(
                format.timestamp({
                    format: 'YYYY-MM-DD HH:mm:ss',
                }),
                winston.format.json(),
            ),
            defaultMeta: {},
            level: level,
            transports: [
                new winston.transports.File({
                    filename: `${Logger.LOGS_PATH}/${level}.log`,
                }),
                new winston.transports.File({
                    filename: `${Logger.LOGS_PATH}/combined.log`,
                }),
            ],
        };
    }

    public setLevel(level: string): this {
        this.level = level;

        const loggerOptions = this.getLoggerOptions(level);
        this.overrideOptions(loggerOptions);

        return this;
    }

    private overrideOptions(options: LoggerOptions): void {
        this.logger.configure(options);
    }

    log(message: string) {
        this.setLevel('info');
        this.logger.info(message);
        this.logToConsole('log', message);
    }

    error(message: string, trace?: string) {
        this.setLevel('error');
        this.logger.error(`${message} -> (${trace || 'trace not provided !'})`);
        this.logToConsole('error', `${message} -> (${trace || 'trace not provided !'})`);
    }

    warn(message: string) {
        this.setLevel('warn');
        this.logger.warn(message);
        this.logToConsole('warn', message);
    }

    debug(message: string) {
        this.setLevel('debug');
        this.logger.info(message);
        this.logToConsole('debug', message);
    }

    private logToConsole(level: string, message: string): void {
        this.printMessages([message], this.context, level as LogLevel);

        this.logger.close();
    }
}
