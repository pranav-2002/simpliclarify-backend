async function addSomething() {
    try {
        const allMentors = await _Mentor.find({});

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

        const courseToInterests = {
            Accounting: ['Management', 'Accounting & HR', 'Entrepreneurship'],
            'Aerospace Engineering': ['Mechanical', 'Automotive'],
            Astronomy: ['Mechanical', 'Automotive'],
            'Biological Sciences': ['Bio Medical', 'Biotechnology'],
            Biology: ['Bio Medical', 'Biotechnology'],
            'Biomedical Sciences': ['Bio Medical', 'Biotechnology'],
            Biotechnology: ['Bio Medical', 'Biotechnology'],
            'Business Studies': ['Economics', 'Business Analytics', 'Finance'],
            'Chemical and Materials Engineering': ['Civil'],
            'Civil Engineering': ['Civil'],
            'Computer Science': ['Computer Science', 'Data Science'],
            Computing: ['Computer Science', 'Data Science'],
            'Data Science': ['Computer Science', 'Data Science'],
            Economics: ['Economics', 'Business Analytics', 'Finance'],
            'Electrical Engineering': ['Electrical & Electronics', 'Robotics'],
            'Electronic Engineering': ['Electrical & Electronics', 'Robotics'],
            Entrepreneurship: [
                'Management',
                'Accounting & HR',
                'Entrepreneurship',
            ],
            'Environmental Engineering': ['Bio Medical', 'Biotechnology'],
            'Environmental Sciences': ['Bio Medical', 'Biotechnology'],
            Finance: ['Economics', 'Business Analytics', 'Finance'],
            'Financial Mathematics': [
                'Economics',
                'Business Analytics',
                'Finance',
            ],
            'General Sciences': ['Bio Medical', 'Biotechnology'],
            'Genetic Engineering': ['Bio Medical', 'Biotechnology'],
            'Global Career Counseling': [
                'Management',
                'Accounting & HR',
                'Entrepreneurship',
            ],
            'Global Career Counselling': [
                'Management',
                'Accounting & HR',
                'Entrepreneurship',
            ],
            IT: ['Computer Science', 'Data Science'],
            'Industrial Design': ['Civil'],
            'Life Sciences': ['Bio Medical', 'Biotechnology'],
            Management: ['Management', 'Accounting & HR', 'Entrepreneurship'],
            'Materials Sciences': ['Bio Medical', 'Biotechnology'],
            'Mechanical Engineering': ['Mechanical', 'Automotive'],
            'Molecular Biosciences': ['Bio Medical', 'Biotechnology'],
            Oncology: ['Bio Medical', 'Biotechnology'],
            Physics: ['Mechanical', 'Automotive'],
            'Power and Energy Engineering': ['Civil'],
            Robotics: ['Electrical & Electronics', 'Robotics'],
            Software: ['Computer Science', 'Data Science'],
            Telecommunications: ['Mechanical', 'Automotive'],
            'Vehicle Engineering': ['Electrical & Electronics', 'Robotics'],
        };

        for (let i = 0; i < allMentors.length; i++) {
            let mentor = allMentors[i];
            mentor.tenthPercentage = getRandom(85, 97, 'normal');
            mentor.twelfthPercentage = getRandom(85, 97, 'normal');
            mentor.interests = [];
            for (let j = 0; j < mentor.educationInformation.length; j++) {
                mentor.educationInformation[j].cgpa = getRandom(
                    6.5,
                    9.5,
                    'cgpa'
                );
                mentor.educationInformation[j].educationLevel =
                    degreeTypes[mentor.educationInformation[j].degreeType];
                const tempInterests =
                    courseToInterests[mentor.educationInformation[j].course];
                // for (let k = 0; k < tempInterests.length; k++) {
                //     if (!mentor.interests.contains(tempInterests[k])) {
                //         mentor.interests.push(tempInterests[k]);
                //     }
                // }
                mentor.interests = [
                    ...new Set([...mentor.interests, ...tempInterests]),
                ];
            }

            if (i % 2 === 0 && mentor.masters.introduction) {
                mentor.masters.certifications = {
                    GRE: getRandom(300, 330, 'normal'),
                    GMAT: getRandom(600, 740, 'normal'),
                };
            } else if (mentor.masters.introduction) {
                mentor.masters.certifications = {
                    TOEFL: getRandom(500, 650, 'normal'),
                    IELTS: getRandom(5, 9, 'normal'),
                };
            }

            if (i % 4 === 0 && mentor.masters.introduction) {
                mentor.masters.certifications['CAT'] = getRandom(
                    190,
                    204,
                    'normal'
                );
            }

            await allMentors[i].save();
        }
        return 'Successfully ran the script';
    } catch (error) {
        throw new CustomError(error);
    }
}
