import net from 'net';

export class EmailService {
  async sendEmail(to: string, subject: string, text: string): Promise<boolean> {
    const host = process.env.SMTP_HOST;
    const port = Number(process.env.SMTP_PORT) || 587;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const from = process.env.SMTP_FROM || 'no-reply@example.com';

    if (!host || !user || !pass) {
      // SMTP credentials not fully configured, skip sending
      return false;
    }

    return new Promise((resolve) => {
      const socket = net.createConnection(port, host);
      let step = 0;

      const send = (data: string) => {
        socket.write(data + '\r\n');
      };

      socket.setTimeout(5000); // 5s timeout

      socket.on('connect', () => {
        // Wait for greeting from server
      });

      socket.on('data', () => {
        try {
          if (step === 0) {
            send(`EHLO localhost`);
            step = 1;
          } else if (step === 1) {
            send(`AUTH LOGIN`);
            step = 2;
          } else if (step === 2) {
            send(Buffer.from(user).toString('base64'));
            step = 3;
          } else if (step === 3) {
            send(Buffer.from(pass).toString('base64'));
            step = 4;
          } else if (step === 4) {
            send(`MAIL FROM:<${from}>`);
            step = 5;
          } else if (step === 5) {
            send(`RCPT TO:<${to}>`);
            step = 6;
          } else if (step === 6) {
            send(`DATA`);
            step = 7;
          } else if (step === 7) {
            send(`From: ${from}`);
            send(`To: ${to}`);
            send(`Subject: ${subject}`);
            send(``); // Empty line
            send(text);
            send(`.`);
            step = 8;
          } else if (step === 8) {
            send(`QUIT`);
            step = 9;
          } else if (step === 9) {
            socket.end();
            resolve(true);
          }
        } catch (err) {
          console.error('[SMTP Error] Failed during sending steps:', err);
          socket.end();
          resolve(false);
        }
      });

      socket.on('timeout', () => {
        console.error('[SMTP Timeout] Connection timed out');
        socket.end();
        resolve(false);
      });

      socket.on('error', (err) => {
        console.error('[SMTP Error] Connection error:', err);
        socket.end();
        resolve(false);
      });
    });
  }
}
export default EmailService;
