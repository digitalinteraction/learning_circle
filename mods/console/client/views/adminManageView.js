'use strict';

Template.registerHelper('isCourseMentorOrAdmin', function () {
    var currentCourseId = Session.get('activeCourseId');
    var currentUser = UniUsers.getLoggedIn();
    if (currentUser && currentCourseId) {
        return Roles.userIsInRole(currentUser, ['global_admin', 'course_mentor'], currentCourseId);
    }
});

Template.adminManageViewNavTabs.events({
    'click .js-switch-tab': function (e) {
        e.preventDefault();
        var tabName = $(e.target).data('tab-name');
        if (tabName) {
            Session.set('dashboardActiveTab', tabName);
        }
        if (window.matchMedia('(max-width: 767px)').matches) {
            $('.js-categories-menu').hide();
        }
    }
});

Template.adminManageViewNavTabs.onRendered(function () {
    Session.set('dashboardActiveTab', 'attendence');
});

Template.adminManageViewNavTabs.helpers({
    isDashboardTabActive: function (tabName) {
        return Session.equals('dashboardActiveTab', tabName);
    },
    isAttendanceTabActive: function () {
        return Session.equals('dashboardActiveTab', 'attendance');
    },
    isTasksTabActive: function () {
        return Session.equals('dashboardActiveTab', 'tasks');
    },
    isGroupTabActive: function () {
        return Session.equals('dashboardActiveTab', 'group');
    },
    isSyllabusTabActive: function () {
        return Session.equals('dashboardActiveTab', 'syllabus');
    },
    isApplicantsTabActive: function () {
        return Session.equals('dashboardActiveTab', 'applicants');
    },
    isMentorsTabActive: function () {
        return Session.equals('dashboardActiveTab', 'applicants');
    }
});

Template.adminManageView.helpers({
    isDashboardTabActive: function (tabName) {
        return Session.equals('dashboardActiveTab', tabName);
    }
});
