"use strict";

import { CustomError } from "../helpers";
import _Mentor from "../schemas/_Mentor";

const MentorModel = {
  getPersonaBasedMentor,
  getIndividualMentor,
  getLimitedMentors,
  getAllMentorsAdmin,
  getIndividualMentorAdmin,
};

export default MentorModel;

async function getPersonaBasedMentor(body) {
  try {
    const { personaType } = body;
    const _personaType = personaType.toLowerCase();
    const response = await _Mentor
      .find({
        personas: { $in: [personaType] },
        status: "ACCEPTED",
      })
      .sort({ [`${_personaType}.ranking`]: 1 })
      .select(
        "dateOfBirth educationInformation imageUrl linkedInUrl languages name workExperience job.modeOfPlacement job.mentorPrice job.gitHubLink job.introduction job.offerings masters.offerings masters.introduction masters.mentorPrice entrepreneurship.offerings entrepreneurship.entrepreneurType entrepreneurship.introduction entrepreneurship.mentorPrice k12.offerings k12.majors k12.introduction k12.mentorPrice k12.achievements schoolEducationInformation"
      );
    return response;
  } catch (error) {
    throw new CustomError(error);
  }
}

async function getIndividualMentor(body) {
  try {
    const { mentorId } = body;
    const response = await _Mentor
      .find({ _id: mentorId })
      .select(
        "dateOfBirth educationInformation imageUrl linkedInUrl languages name workExperience job.modeOfPlacement job.mentorPrice job.gitHubLink job.introduction job.offerings masters.offerings masters.introduction masters.mentorPrice entrepreneurship.offerings entrepreneurship.entrepreneurType entrepreneurship.introduction entrepreneurship.mentorPrice k12.offerings k12.majors k12.introduction k12.mentorPrice k12.achievements schoolEducationInformation"
      );
    return response;
  } catch (error) {
    throw new CustomError(error);
  }
}

async function getLimitedMentors(body) {
  try {
    const jobProfiles = await _Mentor
      .find({
        personas: "JOB",
        status: "ACCEPTED",
      })
      .select(
        "dateOfBirth educationInformation imageUrl linkedInUrl languages name workExperience job.modeOfPlacement job.offerings job.mentorPrice job.gitHubLink job.introduction"
      )
      .sort({ "job.ranking": 1 })
      .limit(3)
      .lean();

    const mastersProfiles = await _Mentor
      .find({
        personas: "MASTERS",
        status: "ACCEPTED",
      })
      .select(
        "dateOfBirth educationInformation imageUrl linkedInUrl languages name workExperience masters.offerings masters.introduction masters.mentorPrice"
      )
      .sort({ "masters.ranking": 1 })
      .limit(3)
      .lean();

    const entrepreneurshipProfiles = await _Mentor
      .find({
        personas: "ENTREPRENEURSHIP",
        status: "ACCEPTED",
      })
      .select(
        "dateOfBirth educationInformation imageUrl linkedInUrl languages name workExperience entrepreneurship.offerings entrepreneurship.entrepreneurType entrepreneurship.introduction entrepreneurship.mentorPrice"
      )
      .sort({ "entrepreneurship.ranking": 1 })
      .limit(3)
      .lean();

    return {
      jobProfiles,
      mastersProfiles,
      entrepreneurshipProfiles
    };
  }
  catch (error) {
    throw new CustomError(error);
  }
}

async function getAllMentorsAdmin() {
  try {
    const response = await _Mentor.find({}).select();
    return response;
  } catch (error) {
    throw new CustomError(error);
  }
}

async function getIndividualMentorAdmin(body) {
  try {
    const { mentorId } = body;
    const response = await _Mentor.find({ _id: mentorId }).select();
    return response;
  } catch (error) {
    throw new CustomError(error);
  }
}
