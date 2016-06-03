'use strict';

Router.map(function () {
    this.route('/class', {
        name: 'consoleView',
        subscriptions: function () {
            var courseId = Session.get('activeCourseId');
            if (courseId) {
                return [
                    Meteor.subscribe('courseGroups', courseId)
                ];
            }
        },
        onAfterAction: function () {
            var currentCourseId = Session.get('activeCourseId');
            var hasPrivilages = Roles.userIsInRole(Meteor.user(), ['global_admin', 'course_student', 'course_mentor'], currentCourseId);
            if (currentCourseId && hasPrivilages) {
                this.render('consoleViewStudentNavTabs', {
                    to: 'layoutSecondMenu'
                });
                Session.set('layoutSecondMenuShow', true);
            }
        }
    });
    this.route('/schedule', {
        name: 'schedulesView',
        subscriptions: function () {
            var courseId = Session.get('activeCourseId');
            if (courseId) {
                return [
                    Meteor.subscribe('courseGroups', courseId),
                    Meteor.subscribe('tasksListWithBlogsAndProjects', courseId),
                    Meteor.subscribe('courseSchedules', courseId)
                ];
            }
        },
        onAfterAction: function () {
            var currentCourseId = Session.get('activeCourseId');
            var hasPrivilages = Roles.userIsInRole(Meteor.user(), ['global_admin', 'course_student', 'course_mentor'], currentCourseId);
            if (currentCourseId && hasPrivilages) {
                this.render('consoleViewStudentNavTabs', {
                    to: 'layoutSecondMenu'
                });
                Session.set('layoutSecondMenuShow', true);
            }
        }
    });
    this.route('/group', {
        name: 'groupsView',
        subscriptions: function () {
            var courseId = Session.get('activeCourseId');
            if (courseId) {
                return [
                    Meteor.subscribe('courseGroups', courseId),
                    Meteor.subscribe('courseMembers', courseId)
                ];
            }
        },
        onAfterAction: function () {
            var currentCourseId = Session.get('activeCourseId');
            var hasPrivilages = Roles.userIsInRole(Meteor.user(), ['global_admin', 'course_student', 'course_mentor'], currentCourseId);
            if (currentCourseId && hasPrivilages) {
                this.render('consoleViewStudentNavTabs', {
                    to: 'layoutSecondMenu'
                });
                Session.set('layoutSecondMenuShow', true);
            }
        }
    });
    this.route('/manage', {
        name: 'adminManageView',
        subscriptions: function () {
            var courseId = Session.get('activeCourseId');
            if (courseId) {
                return [
                    Meteor.subscribe('courseGroups', courseId),
                    Meteor.subscribe('tasksListWithBlogsAndProjects', courseId),
                    Meteor.subscribe('course', courseId),
                    Meteor.subscribe('courseSchedules', courseId),
                    Meteor.subscribe('courseMembers', courseId)
                ];
            }
        },
        onAfterAction: function () {
            var currentCourseId = Session.get('activeCourseId');
            var currentUser = UniUsers.getLoggedIn();
            var userId = Meteor.userId();
            var communities = Colls.Communities.find({}, {fields: {_id: 1}});
            var hasAccess = false;

            if (currentUser && currentCourseId) {
                hasAccess = Roles.userIsInRole(currentUser, ['global_admin', 'course_mentor'], currentCourseId);
            }

            if (Roles.userIsInRole(userId, ['global_admin'])) {
                hasAccess = true;
            }

            communities.forEach(function (community) {
                if (Roles.userIsInRole(userId, 'community_admin', community._id)) {
                    hasAccess = true;
                }
            });

            if (hasAccess) {
                this.render('adminManageViewNavTabs', {
                    to: 'layoutSecondMenu'
                });
                Session.set('layoutSecondMenuShow', true);
            }
        }
    });
});
