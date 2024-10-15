export default class MailerGateway {
    send(recipient: string, subject: string, message: string) {
        console.log(recipient, subject, message);
    }
}
