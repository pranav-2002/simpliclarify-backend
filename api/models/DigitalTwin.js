'use strict';

import fetch from 'node-fetch';
// const fetch = require("node-fetch");
import { CustomError } from '../helpers';
import fs from 'fs';
import { parse } from 'fast-csv';
import User from '../schemas/User';
import _Mentor from '../schemas/_Mentor';
import UserDTRequest from '../schemas/UserDTRequest';
import Constants from '../../config/CONSTANTS';
import Transaction from '../schemas/Transaction';
import InterestsList from '../schemas/InterestsList';
import { join } from 'path';
import Mentor from '../schemas/_Mentor';

const ML_MODEL_URL = process.env.ML_MODEL_URL || '';

const DigitalTwinModel = {
    getGroups,
    getMentorDetails,
    runScript,
    updateInterestsList,
    getInterestsList,
};

export default DigitalTwinModel;

async function addTransaction(userId, amount, purpose) {
    const transactionBody = {
        type: 'Withdraw',
        userId,
        amount,
        purpose,
    };
    const transaction = new Transaction(transactionBody);
    await transaction.save();
}

async function checkUserBalance(userId, amount) {
    const user = await User.findOne({ _id: userId });
    if (!user) {
        throw new CustomError('User does not exist');
    }
    if (user.wallet < amount) {
        throw new CustomError('User does not have enough balance', {
            statusCode: 403,
        });
    }

    return true;
}

async function reduceWalletBalance(userId, amount) {
    const user = await User.findOne({ _id: userId });
    user.wallet -= amount;
    await user.save();
    return 'Reduced the wallet balance';
}

async function getGroups(body) {
    try {
        const { userId } = body;
        body = body.data;
        await checkUserBalance(userId, Constants.usingDigitalTwinAmount);
        const columnIndex = [
            'course',
            'degree',
            'university',
            'interests',
            'GRE',
            'GMAT',
            'TOEFL',
            'IELTS',
            'CAT',
            'GATE',
            'patentsPublished',
            'papersPublished',
            '10th',
            '12th',
            'CGPA',
        ];

        // Request to be sent to ML
        let requestBody = {};

        const userDTRequest = new UserDTRequest();
        // There is a bug in DT, once that's fixed the next line can be removed
        // Setting the default interest as None
        requestBody['interests'] = 'None,0,4';

        for (let i = 0; i < columnIndex.length; i++) {
            const key = columnIndex[i] + '_weight';
            if (key in body) {
                const weight = parseInt(body[key]);

                userDTRequest[columnIndex[i]]['value'] = body[columnIndex[i]];
                userDTRequest[columnIndex[i]]['weight'] = weight;

                if (weight > 0 && weight <= 10) {
                    requestBody[columnIndex[i]] =
                        body[columnIndex[i]] + ',' + weight + ',' + (i + 1);
                }
            }
        }

        userDTRequest['userId'] = userId;
        await userDTRequest.save();

        if (ML_MODEL_URL === '') {
            throw new CustomError(
                'ML microservice is not reachable at the moment'
            );
        }
        let response = await fetch(ML_MODEL_URL + '/testingjson', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: { 'Content-Type': 'application/json' },
        });

        response = await response.json();

        const mentorIdToSimilarity = {};

        const mentorIds = [];
        for (let key in response.id) {
            mentorIdToSimilarity[response.id[key]] = parseInt(
                parseFloat(response.finalsimilarity[key]) * 100
            );
            mentorIds.push(response.id[key]);
        }

        const allMentors = await _Mentor
            .find({ _id: { $in: mentorIds }, status: 'ACCEPTED' })
            .select('personas interests _id')
            .select(
                'educationInformation.degreeType educationInformation.educationLevel'
            )
            .lean();
        const degrees = [];
        const interests = [];

        const degreeTypes = {
            Bachelors: 'Undergrad',
            Certificate: 'Postgrad',
            Diploma: 'Postgrad',
            MBA: 'Postgrad',
            MIM: 'Postgrad',
            MRes: 'Postgrad',
            MS: 'Postgrad',
            'MSc (Hons)': 'Postgrad',
            'Ph.D': 'Postgrad',
        };

        let interestsList = await InterestsList.findOne();
        if (!interestsList) {
            throw new CustomError(
                'Interest List for degree and jobs not present',
                {
                    statusCode: 403,
                }
            );
        }

        const { degreesList, jobsList } = interestsList;

        for (let i = 0; i < allMentors.length; i++) {
            const mentor = allMentors[i];
            if (mentor.interests) {
                for (let j = 0; j < mentor.interests.length; j++) {
                    if (!interests.includes(mentor.interests[j])) {
                        interests.push(mentor.interests[j]);
                    }
                }
            }
            if (mentor.educationInformation) {
                for (let j = 0; j < mentor.educationInformation.length; j++) {
                    if (
                        !degrees.includes(
                            mentor.educationInformation[j].degreeType
                        ) &&
                        degreeTypes[
                            mentor.educationInformation[j].degreeType
                        ] === 'Postgrad'
                    ) {
                        degrees.push(mentor.educationInformation[j].degreeType);
                    }
                }
            }
        }

        const finalResult = [];
        degrees.push('Job');

        for (let i = 0; i < interests.length; i++) {
            for (let j = 0; j < degrees.length; j++) {
                let tempMentors = [];
                let sumOfSimilarities = 0;
                let isJob = degrees[j] === 'Job';
                if (isJob && !jobsList.includes(interests[i])) {
                    continue;
                }
                if (!isJob && !degreesList.includes(interests[i])) {
                    continue;
                }
                for (let m = 0; m < allMentors.length; m++) {
                    let degreeOrJobExists = false;
                    const mentor = allMentors[m];

                    if (isJob) {
                        if (
                            mentor.personas &&
                            mentor.personas.includes('JOB')
                        ) {
                            degreeOrJobExists = true;
                        }
                    } else if (mentor.educationInformation) {
                        for (
                            let n = 0;
                            n < mentor.educationInformation.length;
                            n++
                        ) {
                            if (
                                mentor.educationInformation[n].degreeType ===
                                degrees[j]
                            ) {
                                degreeOrJobExists = true;
                            }
                        }
                    }

                    if (
                        degreeOrJobExists &&
                        mentor.interests &&
                        mentor.interests.includes(interests[i])
                    ) {
                        sumOfSimilarities += mentorIdToSimilarity[mentor._id];
                        tempMentors.push({
                            mentorId: mentor._id,
                            similarity: mentorIdToSimilarity[mentor._id],
                        });
                    }
                }

                if (tempMentors.length > 0) {
                    tempMentors.sort((a, b) => b.similarity - a.similarity);
                    let average = Math.round(
                        sumOfSimilarities / tempMentors.length
                    );

                    tempMentors = tempMentors.filter(
                        (mentor) => mentor.similarity >= average
                    );

                    finalResult.push({
                        degree: degrees[j],
                        interest: interests[i],
                        isJob: isJob,
                        percent: tempMentors[0].similarity,
                        groupId:
                            degrees[j].toLowerCase() +
                            '_' +
                            interests[i].toLowerCase(),
                        mentors: tempMentors,
                    });
                }
            }
        }

        let priorityArray = [];
        let normalArray = [];
        for (let i = 0; i < finalResult.length; i++) {
            if (body.persona && body.persona.includes(finalResult[i].degree)) {
                priorityArray.push(JSON.parse(JSON.stringify(finalResult[i])));
            }
            normalArray.push(JSON.parse(JSON.stringify(finalResult[i])));
        }

        priorityArray.sort((a, b) => b.percent - a.percent);
        normalArray.sort((a, b) => b.percent - a.percent);

        priorityArray = priorityArray.slice(0, 3);

        reduceWalletBalance(userId, Constants.usingDigitalTwinAmount);
        addTransaction(
            userId,
            Constants.usingDigitalTwinAmount,
            'Digital Twin'
        );
        return {
            totalMentorCount: allMentors.length,
            priorityArray,
            normalArray,
        };
    } catch (error) {
        throw new CustomError(error);
    }
}

async function getMentorDetails(body) {
    try {
        const { mentors } = body;
        const mentorIdToSimilarity = {};
        const mentorIds = mentors.map((el) => {
            mentorIdToSimilarity[el.mentorId] = el.similarity;
            return el.mentorId;
        });

        const allMentors = await _Mentor
            .find({ _id: { $in: mentorIds } })
            .select(
                'name educationInformation imageUrl workExperience masters.offerings'
            )
            .lean();

        for (let i = 0; i < allMentors.length; i++) {
            allMentors[i]['similarity'] =
                mentorIdToSimilarity[allMentors[i]._id];
        }

        allMentors.sort((a, b) => b.similarity - a.similarity);

        return allMentors;
    } catch (error) {
        throw new CustomError(error);
    }
}

function getRandom(min, max, field) {
    switch (field) {
        case 'normal':
            return min + Math.floor(Math.random() * (max - min));
        case 'cgpa':
            return min + Math.round(Math.random() * (max - min), 2);
    }
}

async function updateInterestsList(body) {
    try {
        const { jobsList, degreesList, parentToChildrenMapping } = body;
        let interestsList = await InterestsList.findOne();
        if (!interestsList) {
            const newInterestsList = new InterestsList({
                jobsList,
                degreesList,
            });

            if (parentToChildrenMapping) {
                newInterestsList.parentToChildrenMapping =
                    parentToChildrenMapping;
            }

            await newInterestsList.save();
            return 'Successfully created the new interests list';
        }
        interestsList.jobsList = jobsList;
        interestsList.degreesList = degreesList;
        if (parentToChildrenMapping) {
            interestsList.parentToChildrenMapping = parentToChildrenMapping;
        }
        await interestsList.save();
        return 'Successfully updated the interests list';
    } catch (e) {
        throw new CustomError(e);
    }
}
async function getInterestsList(body) {
    try {
        let interestsList = await InterestsList.findOne();
        return {
            jobsList: interestsList ? interestsList.jobsList : [],
            degreesList: interestsList ? interestsList.degreesList : [],
            parentToChildrenMapping: interestsList
                ? interestsList.parentToChildrenMapping
                : {},
        };
    } catch (e) {
        throw new CustomError(e);
    }
}

async function getMentorAndInterests() {
    return new Promise((resolve, reject) => {
        const result = [];
        fs.createReadStream(join(__dirname, '../../dt_data.csv'))
            .pipe(parse())
            .on('error', (error) => console.error(error))
            .on('data', async (row) => {
                const mentorId = row[0];
                let interests = row[8];
                if (interests !== '' && interests !== 'interests') {
                    interests = interests.replace(/“/g, '"');
                    interests = interests.replace(/”/g, '"');
                    interests = interests.replace(/“/g, '"');
                    interests = interests.replace(/”/g, '"');
                    interests = JSON.parse(interests);
                    result.push({ mentorId, interests });
                }
            })
            .on('end', (rowCount) => {
                console.log(`Parsed ${rowCount} rows`);
                resolve(result);
            });
    });
}

async function runScript(body) {
    try {
        const result = await getMentorAndInterests();
        let interestsList = await InterestsList.findOne().lean();
        const { degreesList, jobsList } = interestsList;
        result.forEach(async (mentor) => {
            for (let i = 0; i < mentor.interests.length; i++) {
                mentor.interests[i] = mentor.interests[i].trim();
            }
            let mentorId = mentor.mentorId.substring(
                9,
                mentor.mentorId.length - 1
            );
            let mentorDB = await Mentor.findOne({ _id: mentorId });
            if (mentorDB) {
                mentorDB.interests = mentor.interests;
                if (mentorDB.status !== 'UNLISTED') {
                    await mentorDB.save();
                }
            }
        });
    } catch (e) {
        console.log(e);
    }
}
