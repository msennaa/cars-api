import AccountGateway from '../../gateway/AccountGateway';
import PositionRepository from '../../repository/PositionRepository';
import RideRepository from '../../repository/RideRepository';
import UseCase from '../UseCase';

export default class GetRide implements UseCase {

    constructor(readonly rideRepository: RideRepository, readonly positionRepository: PositionRepository, readonly accountGateway: AccountGateway) {
    }

    async execute(rideId: string): Promise<Output> {
        const ride = await this.rideRepository.getRideById(rideId);
        const passenger = await this.accountGateway.getAccountById(ride.passengerId)
        const lastPosition = await this.positionRepository.lastPositionFromRideId(rideId);
        return {
            rideId: ride.rideId,
            passengerId: ride.passengerId,
            driverId: ride.driverId,
            fromLat: ride.getFrom().getLat(),
            passengerName: passenger.name,
            fromLong: ride.getFrom().getLong(),
            toLat: ride.getTo().getLat(),
            toLong: ride.getTo().getLong(),
            status: ride.status,
            date: ride.date,
            currentLat: lastPosition?.lat,
            currentLong: lastPosition?.long,
            distance: ride.distance,
            fare: ride.fare,
        };
    }
}

type Output = {
    rideId: string;
    passengerId: string;
    driverId: string,
    fromLat: number,
    fromLong: number,
    toLat: number,
    toLong: number,
    status: string,
    date: Date,
    currentLat?: number,
    currentLong?: number
    distance: number,
    fare: number
    passengerName: string,
}
