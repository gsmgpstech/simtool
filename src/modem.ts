import SerialPort from 'serialport';

export class Modem {
    constructor(serialOpts: SerialPort.OpenOptions & { path: string }) {
        this.#serial = new SerialPort(serialOpts.path, serialOpts);
    }

    open() {
        return new Promise<void>((resolve, reject) => {
            this.#serial.open(err => {
                err ? reject(err) : resolve();
            });
        });
    }

    close() {
        return new Promise<void>((resolve, reject) => {
            this.#serial.close(err => {
                err ? reject(err) : resolve();
            });
        });
    }

    async at(command: string, opts: Modem.ExecuteOptions = {}) {
        console.log('📞 <<< ', command.trim());
        await this.send(command);
        const result = await this.readResponse(command, opts);
        const rv = result.toString('ascii');
        console.log('📞 >>> ', rv);
        return rv;
    }

    protected readResponse(command: string, opts: Modem.ExecuteOptions) {
        const timeout = opts.timeout ?? 5000;
        const lines = opts.lines ?? 0;
        return new Promise<Buffer>((resolve, reject) => {
            const onError = (err: Error) => {
                unsubscribe();
                reject(err);
            };
            let result = Buffer.alloc(0);
            const onData = (data: Buffer) => {
                result = Buffer.concat([result, data]);
                if (lines > 0) {
                    let found = 0;
                    const gotIt = result.find(b => {
                        if (b === 13) found++;
                        return found >= lines;
                    });
                    if (gotIt) {
                        unsubscribe();
                        resolve(result);
                    }
                }
            };
            const onTimeout = setInterval(() => {
                unsubscribe();
                if (result && result.length > 0) resolve(result);
                else reject(new Error(`Command ${command.trim()} timed out`));
            }, timeout);
            const unsubscribe = () => {
                clearInterval(onTimeout);
                this.#serial.off('error', onError);
                this.#serial.off('data', onData);
            };
            // discard read buffers
            this.#serial.read(this.#serial.readableLength);
            this.#serial.once('error', onError);
            this.#serial.on('data', onData);
        });
    }

    protected send(data: string) {
        return new Promise<void>((resolve, reject) => {
            const drained = this.#serial.write(data, err => {
                if (err) {
                    reject(err);
                } else {
                    if (!drained) this.#serial.once('drain', resolve);
                    else resolve();
                }
            });
        });
    }

    #serial: SerialPort;
}

export namespace Modem {
    export type ExecuteOptions = { timeout?: number; lines?: number };
}
