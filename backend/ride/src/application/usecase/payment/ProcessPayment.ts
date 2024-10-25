export default class ProcessPayment {
    constructor() {

    }

    async execute(input: Input): Promise<void> {
        console.log('process payment', input);
    }
}

type Input = {
    rideId: string,
    amount: number,
}
