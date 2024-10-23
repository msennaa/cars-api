import Position from '../../domain/entity/Position';

export default interface PositionRepository {
    savePosition(position: Position): Promise<void>;
    lastPositionFromRideId(rideId: string): Promise<Position | undefined>;
}
