'use strict';

// common functions

var revealRow = function (e, entity) {
    var dataTable = $(e.target).closest('table').DataTable();
    var rowData = dataTable.row($(e.currentTarget).closest('tr')).data();
    var $tr = $(e.target).closest('tr');
    var rowTr = dataTable.row($tr);
    if (rowTr.child.isShown()) {
        rowTr.child.hide();
        $tr.removeClass('details');
    } else {
        if (entity === 'student') {
            rowTr.child(studentsSubRowFormat(rowData)).show();
        }
        if (entity === 'mentor') {
            rowTr.child(mentorsSubRowFormat(rowData)).show();
        }
        $tr.addClass('details');
    }
};

var applicantOperation = function (self, type, entity) {
    var targetUserId = self._id;
    var currentCourseId = Session.get('activeCourseId');
    var role;
    var globalRole;
    if (entity === 'student') {
        role = 'course_student';
        globalRole = 'global_student';
    }
    if (entity === 'mentor') {
        role = 'course_mentor';
        globalRole = 'global_mentor';
    }
    if (_.isString(targetUserId) && _.isString(currentCourseId) && type === 'approve') {
        Meteor.call('adminUpdateRoles', targetUserId, globalRole, Roles.GLOBAL_GROUP);
        Meteor.call('adminUpdateRoles', targetUserId, role, currentCourseId, function (err) {
            if (!err && entity === 'student') {
                // send approve email
                Meteor.call('sendApproveForCourseEmail', targetUserId, currentCourseId);
            }
        });
    }
    if (_.isString(targetUserId) && _.isString(currentCourseId) && type === 'unapprove') {
        Meteor.call('adminRemoveRoles', targetUserId, role, currentCourseId);
    }
};

// =======================================================================================================
// admin console students applicants list
// =======================================================================================================

// get time sessions for course context
var getTimeSessions = function (doc) {
    var currentCourseId = Session.get('activeCourseId');
    var sessions;
    if (doc && doc.groupSessions) {
        sessions = _.where(doc.groupSessions, {course: currentCourseId});
        sessions = sessions[0] && sessions[0].sessions;
    }
    if (_.compact(sessions).length) {
        return sessions;
    }
};

var genderFormat = function (gender) {
    if (gender === 'm') {
        return i18n('common.male');
    }
    if (gender === 'f') {
        return i18n('common.female');
    }
    if (gender === 'n') {
        return i18n('common.notDisclosed');
    }
};

var getTimeSessionNames = function (sessionId) {
    var currentCourseId = Session.get('activeCourseId');
    var course;
    var courseSessions;
    var session;
    var sessionDay;
    var sessionHour;
    var sessionTimezone;
    if (sessionId && currentCourseId) {
        course = Colls.Courses.findOne({_id: currentCourseId});
        courseSessions = course && course.avaibleSessionTimes;
        session = _.where(courseSessions, {sessionId: sessionId});
        sessionDay = session && session[0] && session[0].day;
        sessionHour = session && session[0] && session[0].hour;
        sessionTimezone = session && session[0] && session[0].timezone;
    }
    if (sessionDay && sessionHour && sessionTimezone) {
        return App.calcTzSessionsTime(sessionDay, sessionHour, sessionTimezone);
    }
};

// get student course specific data - only in course context
var getCourseSpecificData = function (doc) {
    var currentCourseId = Session.get('activeCourseId');
    var specData;
    if (doc.courseSpecificData) {
        doc.courseSpecificData.forEach(function (data) {
            if (data.course === currentCourseId) {
                specData = data;
            }
        });
    } else {
        specData = false;
    }
    return specData;
};

// applicants datatable subrow formater
var studentsSubRowFormat = function (d) {
    var gender;
    var birthday;
    var englishLevel;
    var data;
    var session1;
    var session2;
    var session3;
    var session = getTimeSessions(d);
    var whyThisCourse;
    var groupProjectIdea;
    var coursePaid;
    var courseSpecificData = getCourseSpecificData(d);
    var blazeString;
    var howDidYouHear;
    var email;
    var user;

    if (d) {
        user = Meteor.users.findOne(d._id);
        email = user.emails && user.emails[0].address;
        howDidYouHear = user.howDidYouHear;
        gender = d.gender;
        birthday = moment(d.birthday).format('ll');
        englishLevel = d.englishLevel;
        session1 = session && session[0];
        session2 = session && session[1];
        session3 = session && session[2];
        whyThisCourse = courseSpecificData && courseSpecificData.whyThisCourse;
        groupProjectIdea = courseSpecificData && courseSpecificData.groupProjectIdea;
        coursePaid = courseSpecificData && courseSpecificData.coursePaid;
    }

    data = {
        gender: genderFormat(gender),
        birthday: birthday,
        englishLevel: englishLevel,
        session1: getTimeSessionNames(session1),
        session2: getTimeSessionNames(session2),
        session3: getTimeSessionNames(session3),
        whyThisCourse: whyThisCourse,
        groupProjectIdea: groupProjectIdea,
        coursePaid: coursePaid,
        howDidYouHear: howDidYouHear,
        email: email
    };

    blazeString = Blaze.toHTMLWithData(Template.consoleApplicantsStudentsSubRow, data);

    return blazeString;
};

var checkUserRole = function (user, roles) {
    var currentCourseId = Session.get('activeCourseId');
    if (user && _.isArray(roles) && currentCourseId) {
        return Roles.userIsInRole(user, roles, currentCourseId);
    }
};

// for session names
Template.consoleApplicantsStudents.onCreated(function () {
    this.subscribe('course', Session.get('activeCourseId'));
});

// we want students only in the context of current course
Template.consoleApplicantsStudents.helpers({
    applicantsStudentsSelector: function () {
        var courseId = Session.get('activeCourseId');
        if (_.isString(courseId)) {
            return {'courses': courseId};
        }
    }
});

// approve button
Template.consoleApplicantsStudentsApproveBtn.events({
    'click .js-approve-applicant': function (e) {
        e.preventDefault();
        applicantOperation(this, 'approve', 'student');
    },
    'click .js-unapprove-applicant': function (e) {
        e.preventDefault();
        applicantOperation(this, 'unapprove', 'student');
    }
});

Template.consoleApplicantsStudentsApproveBtn.helpers({
    isApprovedStudent: function () {
        return checkUserRole(this, ['course_student']);
    }
});

// group dropdown
Template.consoleApplicantsStudentsGroup.onRendered(function () {
    var self = this,
        group = Colls.Groups.findOne({users: this.data._id, course: Session.get('activeCourseId')});
    this.groupId = new ReactiveVar((group && group._id) || 'none');
    this.autorun(function () {
        $('.select_' + self.data._id).attr('selected', false);
        $('.select_' + self.data._id).val(self.groupId.get());
    });
});

Template.consoleApplicantsStudentsGroup.events({
    'change .js-choose-applicant-group': function (e, t) {
        e.preventDefault();
        var groupId = $(e.target).val();
        var oldGroup = Colls.Groups.findOne({users: t.data._id, course: Session.get('activeCourseId')});
        var oldGroupId = oldGroup && oldGroup._id;
        if (oldGroupId) {
            Meteor.call('adminRemoveRoles', t.data._id, 'group_student', oldGroupId);
            Colls.Groups.update({_id: oldGroupId}, {$pull: {users: t.data._id}});
        }

        if (groupId !== 'none') {
            Meteor.call('adminUpdateRoles', t.data._id, 'group_student', groupId, function (err) {
                if (err) {
                    console.error(err);
                    return;
                }
                Meteor.call('sendEmailAboutGroupReschedule', t.data._id, groupId);
                Colls.Groups.update({_id: groupId}, {$push: {users: t.data._id}});
            });
        }

        Template.instance().groupId.set(groupId);
    }
});

Template.consoleApplicantsStudentsGroup.helpers({
    isApprovedStudent: function () {
        return checkUserRole(this, ['course_student']);
    }
});

// click on table tr to reveal more students data
Template.consoleApplicantsStudents.events({
    'click .dataTable tbody > tr > td.reveal-icon': function (e) {
        revealRow(e, 'student');
    }
});


// =======================================================================================================
// admin console mentors applicants list
// =======================================================================================================

// get mentors course specific data - only in course context
var getMentorsCourseSpecificData = function (doc) {
    var currentCourseId = Session.get('activeCourseId');
    var specData;
    if (doc.courseMentorSpecificData) {
        doc.courseMentorSpecificData.forEach(function (data) {
            if (data.course === currentCourseId) {
                specData = data;
            }
        });
    } else {
        specData = false;
    }
    return specData;
};

// applicants datatable subrow formater
var mentorsSubRowFormat = function (d) {

    var gender;
    var birthday;
    var englishLevel;
    var data;
    var session1;
    var session2;
    var session3;
    var mentorQuestion1;
    var mentorQuestion2;
    var mentorQuestion3;
    var mentorQuestion4;
    var session = getTimeSessions(d);
    var courseSpecificData = getMentorsCourseSpecificData(d);
    var blazeString;
    var howDidYouHear;
    var email;
    var user;
    var whatRole;
    var whatRoleOptions = App.applyMentorFormSchema._schema.whatRole.autoform.options;
    var whatRoleAnswer;

    if (d) {
        user = Meteor.users.findOne(d._id);
        email = user.emails && user.emails[0].address;
        howDidYouHear = user.howDidYouHear;
        gender = d.gender;
        birthday = moment(d.birthday).format('ll');
        englishLevel = d.englishLevel;
        session1 = session && session[0];
        session2 = session && session[1];
        session3 = session && session[2];
        mentorQuestion1 = courseSpecificData && courseSpecificData.mentorQuestion1;
        mentorQuestion2 = courseSpecificData && courseSpecificData.mentorQuestion2;
        mentorQuestion3 = courseSpecificData && courseSpecificData.mentorQuestion3;
        mentorQuestion4 = courseSpecificData && courseSpecificData.mentorQuestion4;
        if (mentorQuestion4 === 'other') {
            mentorQuestion4 = courseSpecificData && courseSpecificData.mentorQuestion4Other;
        }
        whatRole = courseSpecificData && courseSpecificData.whatRole;
        whatRoleAnswer = courseSpecificData && courseSpecificData.whatRoleAnswer;

    }

    data = {
        gender: genderFormat(gender),
        birthday: birthday,
        englishLevel: englishLevel,
        session1: getTimeSessionNames(session1),
        session2: getTimeSessionNames(session2),
        session3: getTimeSessionNames(session3),
        mentorQuestion1: mentorQuestion1,
        mentorQuestion2: mentorQuestion2,
        mentorQuestion3: mentorQuestion3,
        mentorQuestion4: mentorQuestion4,
        howDidYouHear: howDidYouHear,
        email: email,
        whatRole: whatRoleOptions[whatRole],
        whatRoleAnswer: whatRoleAnswer
    };

    blazeString = Blaze.toHTMLWithData(Template.consoleApplicantsMentorsSubRow, data);

    return blazeString;
};

// for session names
Template.consoleApplicantsMentors.onCreated(function () {
    this.subscribe('course', Session.get('activeCourseId'));
});

// we want mentors only in the context of current course
Template.consoleApplicantsMentors.helpers({
    applicantsMentorsSelector: function () {
        var courseId = Session.get('activeCourseId');
        if (_.isString(courseId)) {
            return {'mentorshipCourses': courseId};
        }
    }
});

// approve button
Template.consoleApplicantsMentorsApproveBtn.events({
    'click .js-approve-applicant': function (e) {
        e.preventDefault();
        applicantOperation(this, 'approve', 'mentor');
    },
    'click .js-unapprove-applicant': function (e) {
        e.preventDefault();
        applicantOperation(this, 'unapprove', 'mentor');
    }
});

Template.consoleApplicantsMentorsApproveBtn.helpers({
    isApprovedMentor: function () {
        return checkUserRole(this, ['course_mentor']);
    }
});

// group dropdown
Template.consoleApplicantsMentorsGroup.onRendered(function () {
    var self = this,
        group = Colls.Groups.findOne({users: this.data._id, course: Session.get('activeCourseId')});
    this.groupId = new ReactiveVar((group && group._id) || 'none');
    this.autorun(function () {
        $('.select_' + self.data._id).attr('selected', false);
        $('.select_' + self.data._id).val(self.groupId.get());
    });
});

Template.consoleApplicantsMentorsGroup.events({
    'change .js-choose-applicant-group': function (e, t) {
        e.preventDefault();
        var groupId = $(e.target).val();
        var oldGroup = Colls.Groups.findOne({users: t.data._id, course: Session.get('activeCourseId')});
        var oldGroupId = oldGroup && oldGroup._id;
        if (oldGroupId) {
            Meteor.call('adminRemoveRoles', t.data._id, 'group_mentor', oldGroupId);
            Colls.Groups.update({_id: oldGroupId}, {$pull: {users: t.data._id}});
        }

        if (groupId !== 'none') {
            Meteor.call('adminUpdateRoles', t.data._id, 'group_mentor', groupId);
            Colls.Groups.update({_id: groupId}, {$push: {users: t.data._id}});
        }

        Template.instance().groupId.set(groupId);
    }
});

// click on table tr to reveal more mentors data
Template.consoleApplicantsMentors.events({
    'click .dataTable tbody > tr > td.reveal-icon': function (e) {
        revealRow(e, 'mentor');
    }
});
