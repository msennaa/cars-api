import RideRepository from '../../repository/RideRepository';
import UseCase from '../UseCase';

export default class GetRide implements UseCase {

    constructor(readonly rideRepository: RideRepository) {
    }

    async execute(rideId: string): Promise<Output> {
        const ride = await this.rideRepository.getRideById(rideId);
        return ride;
    }
}

type Output = {
    rideId: string;
    passengerId: string;
    fromLat: number,
    fromLong: number,
    toLat: number,
    toLong: number,
    status: string,
    date: Date,
}
