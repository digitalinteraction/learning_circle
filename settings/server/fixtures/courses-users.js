'use strict';

// fixtures populating courses and students

Meteor.startup(function () {
    // vars
    var chance = new Chance(); // https://atmospherejs.com/risul/chance
    var courseIterator;
    var courseDate = new Date();
    var userIterator;
    var justAddedUserId;
    var actualCourses;
    var actualCourseId;
    var randomCourseIndex;
    var actualCoursesLength;
    var placesStaticData;
    var randomPlacesStaticDataIndex;
    var actualPlace;
    var actualCountry;
    var actualNationality;
    var actualCity;
    var randomActualCitiesIndex;
    var userRandomMail;
    var sessionIds;
    var avaibleSessionTimes;

    // meteor settings.json check
    // if there is Meteor.settings obj and 'withFixtures' setting is set to true
    if (typeof Meteor.settings !== 'undefined' && !_.isEmpty(Meteor.settings) && Meteor.settings.runFixtures) {

        // courses collection empty
        Colls.Courses.remove({});
        console.log('Courses collection emptied!');
        Colls.Groups.remove({});
        console.log('Groups collection emptied!');

        // create default community

        var community_id = Colls.Communities.insert({title: 'Default Community'});

        // courses generated custom data
        for (courseIterator = 0; courseIterator < (Meteor.settings.fixturesCoursesNumber || 4); courseIterator++) {
            avaibleSessionTimes = [{
                sessionId: Random.hexString(16),
                day: '4',
                hour: '17',
                timezone: 'America/New_York'
            }, {
                sessionId: Random.hexString(16),
                day: '4',
                hour: '18',
                timezone: 'America/New_York'
            }, {
                sessionId: Random.hexString(16),
                day: '4',
                hour: '19',
                timezone: 'America/New_York'
            }, {
                sessionId: Random.hexString(16),
                day: '4',
                hour: '17',
                timezone: 'Europe/Warsaw'
            }, {
                sessionId: Random.hexString(16),
                day: '4',
                hour: '18',
                timezone: 'Europe/Warsaw'
            }, {
                sessionId: Random.hexString(16),
                day: '4',
                hour: '19',
                timezone: 'Europe/Warsaw'
            }, {
                sessionId: Random.hexString(16),
                day: '4',
                hour: '17',
                timezone: 'Asia/Hong_Kong'
            }, {
                sessionId: Random.hexString(16),
                day: '4',
                hour: '18',
                timezone: 'Asia/Hong_Kong'
            }, {
                sessionId: Random.hexString(16),
                day: '4',
                hour: '19',
                timezone: 'Asia/Hong_Kong'
            }];

            Colls.Courses.insert({
                title: chance.sentence({words: 4}),
                community_id: community_id,
                topic: chance.sentence({words: 5}),
                description: chance.paragraph({sentences: 5}),
                startDate: courseDate,
                endDate: new Date(courseDate.getMonth() + 2 + '/' + courseDate.getDate() + '/' + courseDate.getFullYear()),
                age: {
                    min: chance.age({type: 'teen'}),
                    max: chance.age({type: 'senior'})
                },
                price: chance.natural({min: 500, max: 5000}),
                certification: chance.word({syllables: 1}),
                avaibleSessionTimes: avaibleSessionTimes
            });
        }

        console.log('Courses collection populated!');

        // users collection empty
        Meteor.users.remove({});
        // user roles collection empty
        Meteor.roles.remove({});
        console.log('Users and Roles collections emptied!');

        // Prepaing data for users collection:
        // inserted courses ids - needed later for users collection
        actualCourses = Colls.Courses.find({}, {fields: {_id: 1}}).map(function (course) {
            return course._id;
        });
        actualCoursesLength = actualCourses.length;
        // countries and cities static data
        placesStaticData = [{
            country: 'USA',
            nationality: 'American',
            cities: ['Los Angeles', 'Denver', 'New York']
        }, {
            country: 'Poland',
            nationality: 'Pole',
            cities: ['Warsaw']
        }, {
            country: 'England',
            nationality: 'Englishman',
            cities: ['London']
        }, {
            country: 'Australia',
            nationality: 'Australian',
            cities: ['Melbourne', 'Brisbane']
        }];

        // users generated custom data
        for (userIterator = 0; userIterator < (Meteor.settings.fixturesUsersNumber || 200); userIterator++) {

            // users collection - create user
            userRandomMail = 'test' + userIterator + '@test.com'; // or chance.email({domain: 'test.com'})

            // console.log(userRandomMail);

            justAddedUserId = Accounts.createUser({
                email: userRandomMail,
                password: 'test123456' // the same pass for all - it is simpler to use
            });


            // users random data generate

            // random courseId from existing ones
            randomCourseIndex = _.random(1, actualCoursesLength);
            actualCourseId = actualCourses[randomCourseIndex - 1];

            // random country and city
            randomPlacesStaticDataIndex = _.random(1, placesStaticData.length);
            actualPlace = placesStaticData[randomPlacesStaticDataIndex - 1];
            actualCountry = actualPlace && actualPlace.country;
            actualNationality = actualPlace && actualPlace.nationality;
            randomActualCitiesIndex = _.random(1, actualPlace.cities.length);
            actualCity = actualPlace.cities[randomActualCitiesIndex - 1];

            // sessions time avaible
            sessionIds = Colls.Courses.findOne({_id: actualCourseId}).avaibleSessionTimes.map(function (s) {
                return s.sessionId;
            });

            // users collection update with random data
            Meteor.users.update({_id: justAddedUserId}, {$set: {
                name: chance.first(),
                surname: chance.last(),
                nationality: actualNationality, // not so important for now
                country: actualCountry, // IMPORTANT!
                city: actualCity, // IMPORTANT!
                school: '' + chance.sentence({words: 2}) + ' ' + actualCity, // not so important for now
                participate: true,
                courses: [actualCourseId], // IMPORTANT! random id from existing ones
                mentorshipCourses: [], // not needed now
                gender: chance.character({pool: 'mf'}), // could be important?? (m, f, n)
                birthday: chance.birthday(), // IMPORTANT!
                englishLevel: chance.character({pool: '12345'}), // 1, 2, 3, 4, 5 // IMPORTANT!
                groupSessions: [{
                    course: actualCourseId, // id from existing ones // IMPORTANT!
                    // for now we asume that someone could want to place all 3 the same
                    // only full hours for now
                    // format [day, hour] maybe it should be object??
                    sessions: [
                        sessionIds[_.random(1, sessionIds.length) - 1],
                        sessionIds[_.random(1, sessionIds.length) - 1],
                        sessionIds[_.random(1, sessionIds.length) - 1]
                    ]
                }],
                terms: 'true',
                privacyPolicy: 'true',
                lastSeenCourse: actualCourseId, // from existing ones, // IMPORTANT!
                courseSpecificData: [{
                    course: actualCourseId, // id from existing ones // IMPORTANT!
                    courseAspects: chance.paragraph({sentences: 20}), // not important for now
                    whyThisCourse: chance.paragraph({sentences: 20}), // not important for now
                    groupProjectIdea: chance.paragraph({sentences: 20}), // not important for now
                    coursePaid: 'true'
                }],
                courseMentorSpecificData: [] // not needed now
            }});

            // add user to role course-student with course id group
            Roles.addUsersToRoles(justAddedUserId, 'course_student', actualCourseId);
            // add user to global 'is student' group
            Roles.addUsersToRoles(justAddedUserId, 'global_student', Roles.GLOBAL_GROUP);

            console.log('User - ' + userRandomMail + ' created!');

        }
        console.log('Users collection populated!');

        if (Meteor.settings.runGroupsCreation) {
            var groupMin;
            var groupMax;
            Colls.Courses.find({}).forEach(function (c) {
                if (c._id) {
                    groupMin = Meteor.settings.fixturesGroupMin || 7;
                    groupMax = Meteor.settings.fixturesGroupMax || 13;
                    App.runGroupsCreation(c._id, groupMin, groupMax);
                }
            });
        }

        if (Meteor.settings.runSectionsCreation) {
            var sectionMax;
            Colls.Courses.find({}).forEach(function (c) {
                if (c._id) {
                    sectionMax = Meteor.settings.fixturesSectionMax || 20; // max groups in one section
                    App.runSectionsCreation(c._id, sectionMax);
                }
            });
        }
    }
});
