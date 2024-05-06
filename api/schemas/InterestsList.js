'use strict';
import mongoose from 'mongoose';

const interestsListSchema = mongoose.Schema({
    jobsList: {
        type: [String],
    },
    degreesList: {
        type: [String],
    },
    parentToChildrenMapping: {
        type: Object,
    },
});

const InterestsList = mongoose.model('InterestsList', interestsListSchema);

export default InterestsList;
