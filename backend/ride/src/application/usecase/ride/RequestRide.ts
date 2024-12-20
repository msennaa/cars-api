import Ride from '../../../domain/entity/Ride';
import { RabbitMQAdapter } from '../../../infra/queue/Queue';
import AccountGateway from '../../gateway/AccountGateway';
import RideRepository from '../../repository/RideRepository';
import UseCase from '../UseCase';

export default class RequestRide implements UseCase {

    constructor(readonly rideRepository: RideRepository, readonly accountGateway: AccountGateway) {
    }

    async execute(input: Input): Promise<Output> {
        const account = await this.accountGateway.getAccountById(input.passengerId);
        if (!account.isPassenger) throw new Error('This account is not from a passenger');
        const hasActiveRide = await this.rideRepository.hasActiveRideByPassengerId(input.passengerId);
        if (hasActiveRide) throw new Error('This passenger has an active ride');
        const ride = Ride.create(input.passengerId, input.fromLat, input.fromLong, input.toLat, input.toLong);
        await this.rideRepository.saveRide(ride);
        const queue = new RabbitMQAdapter();
        await queue.connect();
        await queue.setup('rideRequested', '');
        await queue.publish('rideRequested', { rideId: ride.rideId, passengerName: account.name });
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
