import GetRideApiComposition from '../src/application/query/GetRideAPIComposition';
import GetRideQuery from '../src/application/query/GetRideQuery';
import HttpClient, { AxiosAdapter } from '../src/infra/http/HttpClient';

let httpClient: HttpClient;

beforeEach(() => {
    httpClient = new AxiosAdapter();
})

test('Should get a finished ride with query', async function () {
    const rideId = 'd54700ef-07f1-43b5-b097-1245dacce2c0';
    const getRideQuery = new GetRideQuery();
    const output = await getRideQuery.execute(rideId);
    console.log(output);
})

test('Should get a finished ride with API composition', async function () {
    const rideId = 'd54700ef-07f1-43b5-b097-1245dacce2c0';
    const getRideQuery = new GetRideApiComposition(httpClient);
    const output = await getRideQuery.execute(rideId);
    console.log(output);
})
