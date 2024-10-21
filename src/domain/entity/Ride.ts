import crypto from 'crypto';
import Coord from '../vo/Coord';
import Account from './Account';
import Position from './Position';
import Segment from '../vo/Segment';

export default class Ride {
    private from: Coord;
    private to: Coord;

    constructor(readonly rideId: string, readonly passengerId: string, public driverId: string, fromLat: number, fromLong: number, toLat: number, toLong: number, public status: string, readonly date: Date, public distance: number, public fare: number) {
        this.from = new Coord(fromLat, fromLong);
        this.to = new Coord(toLat, toLong);
    }

    static create(passengerId: string, fromLat: number, fromLong: number, toLat: number, toLong: number) {
        const rideId = crypto.randomUUID();
        const status = 'requested';
        const date = new Date();
        const distance = 0;
        const fare = 0;
        return new Ride(rideId, passengerId, '', fromLat, fromLong, toLat, toLong, status, date, distance, fare)
    }

    getFrom() {
        return this.from;
    }

    getTo() {
        return this.to;
    }

    accept(account: Account) {
        if (!account.isDriver) throw new Error('Account is not from a driver');
        if (this.status !== 'requested') throw new Error('Invalid status');
        this.driverId = account.accountId;
        this.status = 'accepted';
    }

    start() {
        if (this.status !== 'accepted') throw new Error('Invalid status')
        this.status = 'in_progress'
    }

    updatePosition(lastPosition: Position, currentPosition: Position) {
        if (this.status !== 'in_progress') throw new Error('Invalid status')
        const segment = new Segment(lastPosition.coord, currentPosition.coord);
        this.distance += segment.getDistance();
        if (currentPosition.date.getDay() === 0) {
            this.fare += this.distance * 5;
            return;
        }
        if (currentPosition.date.getHours() > 18 || currentPosition.date.getHours() < 8) {
            this.fare += this.distance * 3.9;
            return;
        }
        if (currentPosition.date.getHours() <= 18 && currentPosition.date.getHours() >= 8) {
            this.fare += this.distance * 2.1;
            return;
        }
    }
} 
