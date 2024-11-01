import GetRideApiComposition from '../src/application/query/GetRideAPIComposition';
import GetRideProjection from '../src/application/query/GetRideProjection';
import GetRideQuery from '../src/application/query/GetRideQuery';
import HttpClient, { AxiosAdapter } from '../src/infra/http/HttpClient';

let httpClient: HttpClient;

beforeEach(() => {
    httpClient = new AxiosAdapter();
})

test('Should get a finished ride with query', async function () {
    const rideId = 'e6404b26-1567-4369-973c-8c5903dfaac3';
    const getRideQuery = new GetRideQuery();
    const output = await getRideQuery.execute(rideId);
    expect(output).toBeDefined()
})

test('Should get a finished ride with API composition', async function () {
    const rideId = 'e6404b26-1567-4369-973c-8c5903dfaac3';
    const getRideQuery = new GetRideProjection();
    const output = await getRideQuery.execute(rideId);
    expect(output).toBeDefined()
})

test('Should get a finished ride with API composition', async function () {
    const rideId = 'e6404b26-1567-4369-973c-8c5903dfaac3';
    const getRideQuery = new GetRideApiComposition(httpClient);
    const output = await getRideQuery.execute(rideId);
    expect(output).toBeDefined()
})

