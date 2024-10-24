import Ride from '../../domain/entity/Ride';
import SuperRide from '../../domain/entity/SuperRide';

export default interface SuperRideRepository {
    saveRide(ride: Ride): Promise<void>;
    getRideById(rideId: string): Promise<SuperRide>;
}
