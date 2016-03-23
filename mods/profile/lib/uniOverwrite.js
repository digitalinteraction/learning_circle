'use strict';

UniProfile.config({
    profileSchema: {},
    userSchema: {
        username: {
            type: String,
            label: 'User Name',
            optional: true
        },
        // user which will create hangouts on google calendar
        // he needs to be logged through google oauth here and on google
        canCreateHangouts: {
            type: Boolean,
            optional: true
        },
        courseSpecificData: {
            type: [Object],
            optional: true,
            blackbox: true // for now -> TODO: fields schema
        },
        courseMentorSpecificData: {
            type: [Object],
            optional: true,
            blackbox: true // for now -> TODO: fields schema
        },

        // moved from profile
        name: {
            type: String,
            label: i18n('apply.firstNameLabel')
        },
        surname: {
            type: String,
            label: i18n('apply.lastNameLabel')
        },
        nationality: {
            type: String,
            label: i18n('apply.nationalityLabel')
        },
        country: {
            type: String,
            label: i18n('apply.countryLabel')
        },
        city: {
            type: String,
            label: i18n('apply.cityLabel')
        },
        school: {
            type: String,
            label: i18n('apply.schoolLabel')
        },
        gender: {
            type: String,
            label: i18n('apply.genderLabel'),
            defaultValue: ''
        },
        birthday: {
            type: Date,
            label: i18n('apply.birthdayLabel')
        },
        englishLevel: {
            type: String,
            label: i18n('apply.englishLevelLabel'),
            defaultValue: ''
        },
        courses: {
            type: [String],
            optional: true
        },
        mentorshipCourses: {
            type: [String],
            optional: true
        },
        groupSessions: { // for now it is blackboxed - waiting for sessions data proper format
            type: [Object],
            optional: true,
            blackbox: true
        },
        terms: {
            type: String,
            label: 'Have you read our terms and conditions?'
        },
        privacyPolicy: {
            type: String,
            label: 'Please acknowledge that you know that anonymized information about user interaction patterns on this site will be used in academic research'
        },
        lastSeenCourse: {
            type: String,
            optional: true
        },
        participate: {
            type: Boolean,
            defaultValue: false
        },
        tasksApproved: {
            type: [String],
            optional: true
        },
        tasksRejected: {
            type: [String],
            optional: true
        },
        statisticToken: {
            type: String,
            optional: true
        },
        howDidYouHear: {
            type: String,
            label: 'How did you hear about this course?',
            autoform: {
                type: 'select',
                firstOption: 'How did you hear about this course?',
                options: {
                    'facebook': 'Facebook',
                    'twitter': 'Twitter',
                    'lerningCircle': 'I have taken a Learning Circle course before',
                    'friend': 'A friend/family member recommended it to me',
                    'other': 'Other (please specify)'
                }
            },
            defaultValue: 'I have taken a Learning Circle course before'
        }
        //newsletterSubscriptions: {
        //    type: Object,
        //    optional: true
        //}
    }
    // omitProfileFields: '',
    // omitUserFields: ''
});

if (Meteor.isClient) {
    // the same what is is basic controler
    UniProfile.getRoute('uniProfile').onBeforeAction = function () { //UniProfile overwrite
        this.next();
    };
    UniProfile.getRoute('uniProfile').onAfterAction = function () { //UniProfile overwrite
        var loggedInUser = UniUsers.getLoggedIn();
        this.render('loggedInUserDropdownMenu', {
            to: 'layoutSecondMenu',
            data: loggedInUser
        });
        Session.set('layoutSecondMenuShow', true);
        Session.set('layoutSecondMenuHideSM', true);
    };
}

if (Meteor.isServer) {

    // TODO: which profile fields user (owner) can update ?? (I think not all)
    // so maybe we should deny all updates and call methods for user fields updates?

    UniUsers.allow({
        update: function (userId, doc, fields) {
            if (_.contains(fields, 'roles') || _.contains(fields, 'canCreateHangouts')) {
                return false;
            }
            if (userId && userId === doc._id) {
                return true;
            }
        }
    });

    UniUsers.deny({
        update: function (userId, doc, fields) {
            if (Roles.userIsInRole(userId, 'global_admin')) {
                return false;
            }
            if (userId && userId !== doc._id) {
                return true;
            }
            if (_.contains(fields, 'roles') || _.contains(fields, 'canCreateHangouts')) {
                return true;
            }
        }
    });

    // TODO: check these:
    ProfileAvatar.allow({
        insert: function (userId) {
            return !!userId;
        },
        update: function (userId, entity) {
            return entity.metadata.owner === userId;
        },
        download: function () {
            return true;
        },
        remove: function (userId, entity) {
            return entity.metadata.owner === userId;
        }
    });
}

// don't know if needed but this is isAdmin function overwrite
UniUsers.UniUser.prototype.isAdmin = function () {
    return Roles.userIsInRole(this, 'global_admin');
};

UniUsers.UniUser.prototype.getName = function () {
    if (this.name && this.surname) {
        return this.name + ' ' + this.surname;
    } else if (this.name) {
        return this.name;
    }
};

UniProfile.autoSubscribeAvatars = false;
