import { PgPromiseAdapter } from '../../infra/database/DatabaseConnection';

export default class GetRideProjection {
    async execute(rideId: string): Promise<any> {
        const connection = new PgPromiseAdapter(5435);
        const [ride] = await connection.query('select * from ride_projection where ride_id = $1', [rideId]);
        await connection.close()
        return ride;
    }
}
