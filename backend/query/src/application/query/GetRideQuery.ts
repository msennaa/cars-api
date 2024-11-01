import { PgPromiseAdapter } from '../../infra/database/DatabaseConnection';

export default class GetRideQuery {
    async execute(rideId: string): Promise<any> {
        const connectionRide = new PgPromiseAdapter(5433);
        const connectionAccount = new PgPromiseAdapter(5432);
        const connectionPayment = new PgPromiseAdapter(5434);
        const [ride] = await connectionRide.query('SELECT * FROM ride WHERE ride_id = $1', rideId)
        const [passenger] = await connectionAccount.query('SELECT * FROM account WHERE account_id = $1', ride.passenger_id)
        const [driver] = await connectionAccount.query('SELECT * FROM account WHERE account_id = $1', ride.driver_id)
        const [payment] = await connectionPayment.query('SELECT * FROM transactions WHERE ride_id = $1', rideId)
        await connectionRide.close()
        await connectionAccount.close()
        await connectionPayment.close()
        return {
            ride,
            passenger,
            driver,
            payment
        }
    }
}
