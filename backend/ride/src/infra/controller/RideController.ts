import GetRide from '../../application/usecase/ride/GetRide';
import RequestRide from '../../application/usecase/ride/RequestRide';
import HttpServer from '../http/HttpServer';
import Queue from '../queue/Queue';

export default class RideController {
    constructor(readonly httpServer: HttpServer, readonly requestRide: RequestRide, readonly getRide: GetRide, readonly queue: Queue) {
        httpServer.register('post', '/request_ride', async (params: any, body: any) => {
            const response = await requestRide.execute(body);
            return response;
        })

        httpServer.register('get', '/rides/:{rideId}', async (params: any, body: any) => {
            const response = await getRide.execute(params.rideId);
            return response;
        })
    }
}
