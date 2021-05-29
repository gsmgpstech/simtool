import { config } from './config';
import { Modem } from './modem';

async function main() {
    try {
        const path = process.argv[2];
        if (!path) {
            console.error(`Usage: ${process.argv[0]} TTY_PORT (i.e. /dev/ttyUSB0 for example)`);
            return;
        }
        console.log(`Starting with port ${path}@${config.SERIAL_SPEED}bps`);
        const modem = new Modem({
            path,
            baudRate: config.SERIAL_SPEED,
        });
        await modem.at('AT\r\n', { timeout: 500 });
        await modem.at('ATC\r\n', { timeout: 500 });

        await modem.close();
    } catch (err) {
        console.error(err);
    }
}

main().catch(console.error);
