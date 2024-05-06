'use strict';

import { ResponseBody } from '../helpers';
import DigitalTwinModel from '../models/DigitalTwin';

const DigitalTwinController = {
    getGroups,
    getMentorDetails,
    runScript,
    updateInterestsList,
    getInterestsList,
};

export default DigitalTwinController;

async function getGroups(request, response, next) {
    const { body } = request;
    const data = await DigitalTwinModel.getGroups(body);
    const responseBody = new ResponseBody(
        200,
        'Got the groups for the given user criteria',
        data
    );
    response.body = responseBody;
    next();
}

async function getMentorDetails(request, response, next) {
    const { body } = request;
    const data = await DigitalTwinModel.getMentorDetails(body);
    const responseBody = new ResponseBody(200, 'Got the mentor details', data);
    response.body = responseBody;
    next();
}

async function runScript(request, response, next) {
    const { body } = request;
    const data = await DigitalTwinModel.runScript(body);
    const responseBody = new ResponseBody(
        200,
        'Successfully ran the script',
        data
    );
    response.body = responseBody;
    next();
}

async function updateInterestsList(request, response, next) {
    const { body } = request;
    const data = await DigitalTwinModel.updateInterestsList(body);
    const responseBody = new ResponseBody(
        200,
        'Successfully updated the interests list',
        data
    );
    response.body = responseBody;
    next();
}

async function getInterestsList(request, response, next) {
    const { body } = request;
    const data = await DigitalTwinModel.getInterestsList(body);
    // const data = '123';
    const responseBody = new ResponseBody(
        200,
        'Successfully got the interests list',
        data
    );
    response.body = responseBody;
    next();
}
