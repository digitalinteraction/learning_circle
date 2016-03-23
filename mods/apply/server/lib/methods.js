'use strict';

Meteor.methods({
    courseApply: function (doc) {

        // check mentor and student schema - TODO: maybe we should merge them later..
        // the same with courseid there are 2 types of courseId right now
        // this is work for later code refactor, no time for it now..

        if (_.isString(doc.courseId)) {
            check(doc, App.applyFormSchema);
        } else {
            check(doc, App.applyMentorFormSchema);
        }

        var currentUserId = this.userId;
        var user = UniUsers.findOne(this.userId);
        var courses = UniUtils.get(user, 'courses') || [];
        var mentorshipCourses = UniUtils.get(user, 'mentorshipCourses') || [];
        var groupSessions = UniUtils.get(user, 'groupSessions') || [];
        var courseSpecificData = UniUtils.get(user, 'courseSpecificData') || [];
        var courseMentorSpecificData = UniUtils.get(user, 'courseMentorSpecificData') || [];
        var lastSeenCourse;
        var data;
        var userEmail;

        if (currentUserId) {

            // only for standard student
            if (doc.courseId) {

                // courses array
                courses.push(doc.courseId);

                // group sessions array of objects
                groupSessions.push({
                    course: doc.courseId,
                    sessions: [
                        doc.groupSessionTime1, // TODO: dynamic amount of sessions
                        doc.groupSessionTime2,
                        doc.groupSessionTime3
                    ]
                });

                // courses specific data
                courseSpecificData.push({
                    course: doc.courseId,
                    courseAspects: doc.courseAspects,
                    whyThisCourse: doc.whyThisCourse,
                    groupProjectIdea: doc.groupProjectIdea,
                    coursePaid: doc.coursePaid
                });

                // the last seen users course
                lastSeenCourse = doc.courseId;
            }

            // only for mentorship course apply
            if (doc.mentorshipCourseId) {

                // mentor courses array
                mentorshipCourses.push(doc.mentorshipCourseId);

                // mentor courses specific data
                courseMentorSpecificData.push({
                    course: doc.mentorshipCourseId,
                    mentorQuestion1: doc.mentorQuestion1,
                    mentorQuestion2: doc.mentorQuestion2,
                    mentorQuestion3: doc.mentorQuestion3,
                    mentorQuestion4: doc.mentorQuestion4,
                    mentorQuestion4Other: doc.mentorQuestion4Other,
                    whatRole: doc.whatRole,
                    whatRoleAnswer: doc.whatRoleAnswer
                });

                // group sessions array of objects
                groupSessions.push({
                    course: doc.mentorshipCourseId,
                    sessions: [
                        doc.groupSessionTime1, // TODO: dynamic amount of sessions
                        doc.groupSessionTime2,
                        doc.groupSessionTime3
                    ]
                });

                // the last seen users course
                lastSeenCourse = doc.mentorshipCourseId;
            }

            // TODO: move data into some other field than 'profile'
            data = {
                'name': doc.name,
                'surname': doc.surname,
                'nationality': doc.nationality,
                'country': doc.country,
                'city': doc.city,
                'school': doc.school,
                'participate': true,
                'courses': courses,
                'mentorshipCourses': mentorshipCourses,
                'gender': doc.gender,
                'birthday': doc.birthday,
                'englishLevel': doc.englishLevel,
                'groupSessions': groupSessions,
                'terms': doc.terms,
                'privacyPolicy': doc.privacyPolicy,
                'lastSeenCourse': lastSeenCourse,
                courseSpecificData: courseSpecificData,
                courseMentorSpecificData: courseMentorSpecificData,
                howDidYouHear: doc.howDidYouHear
            };

            UniUsers.update({_id: currentUserId}, {$set: data});

            // send email

            try {
                userEmail = UniUtils.get(user, 'emails.0.address');
                if (_.isString(doc.courseId) && userEmail) {
                    this.unblock();
                    App.triggerEmail('sign_up_for_course', {
                        courseId: doc.courseId,
                        to: userEmail,
                        data: {
                            user_name: doc.name,
                            user_surname: doc.surname
                        }
                    });
                }
            } catch (e) {
                console.error('Error while sending course apply email:', e);
            }

        }
    }
});
