import AccountRepository from '../../repository/AccountRepository';
import RideRepository from '../../repository/RideRepository';
import UseCase from '../UseCase';

export default class AcceptRide implements UseCase {

    constructor(readonly rideRepository: RideRepository, readonly accountRepository: AccountRepository) {
    }

    async execute(input: Input): Promise<void> {
        const account = await this.accountRepository.getAccountById(input.driverId);
        if (!account.isDriver) throw new Error();
        const ride = await this.rideRepository.getRideById(input.rideId);
        ride.accept(input.driverId);
        await this.rideRepository.saveRide(ride);

    }
}

type Input = {
    driverId: string,
    rideId: string,
}
