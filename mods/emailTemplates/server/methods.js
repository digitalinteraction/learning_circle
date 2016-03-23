'use strict';

Meteor.methods({
    createEmailTemplate: function (triggerId, courseId) {
        //@todo check if admin or community admin
        check([triggerId, courseId], [String]);

        if (EmailTemplates.findOne({triggerId: triggerId, courseId: courseId})) {
            throw new Meteor.Error('template-exists', 'This template already exists');
        }

        var newTemplate;
        var globalTemplate = EmailTemplates.findOne({
            triggerId: triggerId,
            courseId: EmailTemplates.GLOBAL
        });

        if (globalTemplate) {
            newTemplate = _(globalTemplate).pick('triggerId', 'subject', 'template');
            newTemplate.courseId = courseId;

            return EmailTemplates.insert(newTemplate);
        }

        // no global template or possible creation of global template itself
        return EmailTemplates.insert({
            triggerId: triggerId,
            subject: i18n('emails.triggers.' + triggerId),
            template: '',
            courseId: courseId
        });
    },
    sendCourseMassEmail: function (data) {
        check(data, {
            subject: String,
            content: String,
            courseId: String,
            isTestEmail: Boolean,
            target: [String]
        });

        var courseId = data.courseId;

        if (!_canSendEmailsForThisCourse(this.userId, courseId)) {
            throw new Meteor.Error('403', 'You cannot send mass email!');
        }

        var emails;
        if (data.isTestEmail) {
            // test email, send only to logged in user
            emails = [UniUsers.getLoggedIn().getFirstEmailAddress()];

        } else {
            // real email, send to all targets

            // allow only this values
            var target = _(data.target).intersection(['course_student', 'course_student-chair', 'course_mentor']);

            var queryKey = 'roles.' + courseId;
            var query = {};
            query[queryKey] = {$in: target};

            emails = Meteor.users.find(query, {
                fields: {
                    emails: 1
                }
            }).map(function (user) {
                return UniUtils.get(user, 'emails.0.address');
            });
        }

        App.triggerEmail('mail_all_students', {
            to: _.compact(emails),
            courseId: courseId,
            data: data
        });

        return true;
    },
    sendApproveForCourseEmail: function (userId, courseId) {
        check(userId, String);
        check(courseId, String);

        if (!_canSendEmailsForThisCourse(this.userId, courseId)) {
            throw new Meteor.Error('403', 'You cannot this email!');
        }

        var user = UniUsers.findOne(userId);
        if (!user || !user.getFirstEmailAddress()) {
            return;
        }

        App.triggerEmail('approve_for_course', {
            courseId: courseId,
            to: user.getFirstEmailAddress(),
            data: {
                user_name: user.name,
                user_surname: user.surname
            }
        });
    },
    sendEmailAboutGroupReschedule: function (userId, groupId) {
        check(userId, String);
        check(groupId, String);

        if (!Roles.userIsInRole(this.userId, ['global_admin'])) {
            throw new Meteor.Error('403', 'Not an Admin');
        }

        var user = UniUsers.findOne(userId);
        if (!user) {
            throw new Meteor.Error('404', 'Cannot find user');
        }

        var to = user.getFirstEmailAddress();
        check(to, String);

        var group = Colls.Groups.findOne(groupId);
        if (!group) {
            throw new Meteor.Error('404', 'Cannot find group');
        }

        App.triggerEmail('group_reschedule', {
            to: to,
            courseId: group.course,
            data: {
                user_name: user.name,
                user_surname: user.surname,
                group_title: group.title
            }
        });
    },
    getAllNotParticipatingUserEmails: function () {
        if (!Roles.userIsInRole(this.userId, ['global_admin'])) {
            return 'Not an admin';
        }

        var emails = Meteor.users.find({
            participate: {
                $ne: true
            }
        }, {
            fields: {
                emails: 1
            }
        }).map(function (user) {
            return UniUtils.get(user, 'emails.0.address');
        });
        return _.compact(emails).join(', ');
    }
//'subscribeToNewsletter': function (scheduler, courseId) {
//    check(scheduler, String);
//    check(courseId, String);
//
//    var user = UniUsers.getLoggedIn();
//    if (!user) {
//        throw new Meteor.Error(403, 'Authentication required');
//    }
//    Meteor.call('UniMail.subscribeOnce', user._id, 'course_' + courseId, scheduler, {
//        email: user.email(),
//        username: user.getName()
//    });
//    var newsletterSubscriptions = {};
//    newsletterSubscriptions[courseId] = scheduler || null;
//
//    UniUsers.update(user._id, {$set: {
//        newsletterSubscriptions: newsletterSubscriptions
//    }});
//}
});

function _canSendEmailsForThisCourse (userId, courseId) {
    if (!userId || !courseId) {
        return false;
    }
    if (Roles.userIsInRole(userId, 'global_admin')) {
        return true;
    }
    if (courseId === EmailTemplates.GLOBAL) {
        // only admin can send global emails, and admin should already return true
        return false;
    }
    var course = Colls.Courses.findOne(courseId);
    if (!course) {
        return false;
    }
    return Roles.userIsInRole(userId, ['community_admin'], course.community_id);
}
