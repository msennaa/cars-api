import GetTransactionByRideId from '../../application/usecase/payment/GetTransactionByRideId';
import ProcessPayment from '../../application/usecase/payment/ProcessPayment';
import HttpServer from '../http/HttpServer';

export default class PaymentController {

    constructor(readonly httpServer: HttpServer, readonly processPayment: ProcessPayment, readonly getTransactionByRideId: GetTransactionByRideId) {
        this.httpServer?.register('post', "/process_payment", async (params: any, body: any) => {
            const response = await this.processPayment.execute(body);
            return response;
        })

        this.httpServer?.register('get', "/transactions/:{rideId}", async (params: any, body: any) => {
            console.log('oi');

            const response = await this.getTransactionByRideId.execute(params.rideId);
            return response;
        })
    }
}
