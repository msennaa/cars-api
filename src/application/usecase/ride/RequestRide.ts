import Ride from '../../../domain/Ride';
import RideRepository from '../../repository/RideRepository';
import UseCase from '../UseCase';

export default class RequestRide implements UseCase {

    constructor(readonly rideRepository: RideRepository) {
    }

    async execute(input: Input): Promise<Output> {
        const ride = Ride.create(input.passengerId, input.fromLat, input.fromLong, input.toLat, input.toLong);
        await this.rideRepository.saveRide(ride);
        return {
            rideId: ride.rideId,
        }
    }
}

type Input = {
    passengerId: string,
    fromLat: number,
    fromLong: number,
    toLat: number,
    toLong: number
}

type Output = {
    rideId: string;
}
