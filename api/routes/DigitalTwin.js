'use strict';

import Express from 'express';
import { expressUtils } from '../helpers';
import { DigitalTwinController } from '../controllers';

const DigitalTwinRouter = new Express.Router();
const {
    getMentorDetails,
    getGroups,
    runScript,
    updateInterestsList,
    getInterestsList,
} = DigitalTwinController;
const { reqHandler, resHandler } = expressUtils;
const { extractHeaders, routeSanity, asyncWrapper } = reqHandler;
const { setHeaders } = resHandler;

DigitalTwinRouter.use(extractHeaders);
DigitalTwinRouter.post(
    '/get-mentor-details',
    routeSanity,
    asyncWrapper(getMentorDetails)
);
DigitalTwinRouter.post('/get-groups', routeSanity, asyncWrapper(getGroups));
DigitalTwinRouter.post(
    '/misc/run-script',
    routeSanity,
    asyncWrapper(runScript)
);
DigitalTwinRouter.post(
    '/update-interests-list',
    routeSanity,
    asyncWrapper(updateInterestsList)
);
DigitalTwinRouter.post(
    '/get-interests-list',
    routeSanity,
    asyncWrapper(getInterestsList)
);
DigitalTwinRouter.use(setHeaders);

export default DigitalTwinRouter;
