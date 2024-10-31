import { PgPromiseAdapter } from '../../infra/database/DatabaseConnection';
import axios from 'axios';
import HttpClient from '../../infra/http/HttpClient';

export default class GetRideApiComposition {
    constructor(readonly httpClient: HttpClient) {

    }

    async execute(rideId: string): Promise<any> {
        const ride = await this.httpClient.get(`http://localhost:3000/rides/${rideId}`)
        const passenger = await this.httpClient.get(`http://localhost:3001/accounts/${ride.passengerId}`);
        const driver = await this.httpClient.get(`http://localhost:3001/accounts/${ride.driverId}`);
        const payment = await this.httpClient.get(`http://localhost:3002/transactions/${ride.ride_id}`);


        return {
            ride,
            passenger,
            driver,
            payment
        }
    }
}
