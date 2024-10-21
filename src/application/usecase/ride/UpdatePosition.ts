import RideRepository from '../../repository/RideRepository';
import UseCase from '../UseCase';
import Position from '../../../domain/entity/Position';
import PositionRepository from '../../repository/PositionRepository';
import DistanceCalculator from '../../../domain/service/DistanceCalculator';
import Segment from '../../../domain/vo/Segment';

export default class UpdatePosition implements UseCase {

    constructor(readonly rideRepository: RideRepository, readonly positionRepository: PositionRepository) {
    }

    async execute(input: Input): Promise<void> {
        const ride = await this.rideRepository.getRideById(input.rideId);
        const position = Position.create(input.rideId, input.lat, input.long, input.date);
        const lastPosition = await this.positionRepository.lastPositionFromRideId(input.rideId);
        if (lastPosition) ride.updatePosition(lastPosition, position);
        await this.positionRepository.savePosition(position);
        await this.rideRepository.updateRide(ride);
    }
}

type Input = {
    rideId: string,
    lat: number,
    long: number,
    date: Date
}
