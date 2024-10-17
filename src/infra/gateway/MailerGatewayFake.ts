export default class MailerGatewayFake {
    async send(recipient: string, subject: string, message: string): Promise<void> {
        console.log(recipient, subject, message);
    }
}
