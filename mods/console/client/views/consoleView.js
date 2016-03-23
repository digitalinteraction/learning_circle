'use strict';

Template.registerHelper('getCourseTasks', function (isStudentView) {
    var currentCourseId = Session.get('activeCourseId');
    var course = Colls.Courses.findOne(currentCourseId);
    var nowStart;
    var nowEnd;
    if (course) {
        nowStart = moment().startOf('isoweek').toDate();
        nowEnd = moment().add({days: 6, hours: 23, minutes: 59}).toDate();
    }
    var weekStart = Session.get('studentDashboardWeekStartDate') || nowStart;
    var weekEnd = Session.get('studentDashboardWeekEndDate') || nowEnd;
    var sortQuery;
    if (currentCourseId && isStudentView === 'studentView') {
        sortQuery = {deadline: 1};
    }
    if (currentCourseId && !isStudentView) {
        sortQuery = {createdAt: -1};
    }
    if (!weekStart || !weekEnd) {
        return Colls.Tasks.find({course: currentCourseId}, {sort: sortQuery});
    }
    return Colls.Tasks.find({
        course: currentCourseId,
        deadline: {
            $gte: new Date(weekStart),
            $lte: new Date(weekEnd)
        }
    }, {sort: sortQuery});
});

Template.registerHelper('getTimeZone', function () {
    var now = Date.now();
    var zone = moment(now).utcOffset();
    var timeZoneNumber = zone / (-60);
    var timeZone = (timeZoneNumber > 0) ? '+' + timeZoneNumber : '' + timeZoneNumber;
    if (Intl) {
        return Intl.DateTimeFormat().resolvedOptions().timeZone;
    }
    return 'GMT ' + timeZone;
});

var getSchedules = function (type) {
    var currentCourseId = Session.get('activeCourseId');
    var course = Colls.Courses.findOne(currentCourseId);
    var userGroupIds;
    var nowStart;
    var nowEnd;
    if (course) {
        nowStart = moment().startOf('isoweek').toDate();
        nowEnd = moment().add({days: 6, hours: 23, minutes: 59}).toDate();
    }
    var weekStart = Session.get('studentDashboardWeekStartDate') || nowStart;
    var weekEnd = Session.get('studentDashboardWeekEndDate') || nowEnd;
    if (Roles.userIsInRole(Meteor.userId(), ['global_admin', 'community_admin', 'course_mentor'], currentCourseId)) {
        userGroupIds = {$exists: true};
    } else {
        userGroupIds = {$in: Roles.getGroupsForUser(Meteor.userId(), 'group_student')};
    }
    if (type === 'lecture') {
        return Colls.Schedules.find({
            courseId: currentCourseId,
            lectureType: true,
            date: {
                $gte: new Date(weekStart),
                $lte: new Date(weekEnd)
            }
        }, {sort: {date: 1}});
    }

    return Colls.Schedules.find({
        courseId: currentCourseId,
        groupId: userGroupIds,
        date: {
            $gte: new Date(weekStart),
            $lte: new Date(weekEnd)
        }
    }, {sort: {date: 1}});
};

Template.registerHelper('getCourseSchedules', getSchedules);

Template.registerHelper('getCourseLecturesSchedules', function () {
    return getSchedules('lecture');
});

Template.registerHelper('isCourseStudentOrCourseMentorOrAdmin', function () {
    var currentCourseId = Session.get('activeCourseId');
    return currentCourseId && Roles.userIsInRole(Meteor.user(), ['global_admin', 'course_student', 'course_mentor'], currentCourseId);
});

Template.consoleView.helpers({
    isUserMembershipPending: function () {
        var currentCourseId = Session.get('activeCourseId');
        var currentUser = UniUsers.getLoggedIn();
        var isMentor = Roles.userIsInRole(currentUser, 'course_mentor', currentCourseId);
        var isStudent = Roles.userIsInRole(currentUser, 'course_student', currentCourseId);
        if (isStudent || isMentor) {
            return false;
        }
        // if student is pending:
        if (currentUser && currentCourseId && !isStudent) {
            return currentUser.courseSpecificData && currentUser.courseSpecificData.length;
        }
        // if mentorship is pending:
        if (currentUser && currentCourseId && !isMentor) {
            return currentUser.courseMentorSpecificData && currentUser.courseMentorSpecificData.length;
        }
    },
    mentorFormSuccess: function () {
        return (Session.get('mentorFormSuccess') === true);
    }
});

// filter content for students
Template.consoleView.events({
    'click .js-go-to-top': function (e) {
        e.preventDefault();
        $('body,html').stop(true, false).animate({
            scrollTop: 0
        }, 800);
    },
    'click .js-go-to-today': function (e) {
        e.preventDefault();
        $('html, body').stop(true, false).animate({
            scrollTop: $('.js-console-today-separator').offset().top - 45
        }, 800);
    }
});

Template.consoleViewNavFilters.onRendered(function () {
    var currentCourseId;
    var self = this;
    Session.set('studentDashboardWeekStartDate');
    Session.set('studentDashboardWeekEndDate');
    self.autorun(function () {
        currentCourseId = Session.get('activeCourseId');
        self.subscribe('course', currentCourseId);
    });
});

var allFiltersAreChecked = function () {
    var tasks = Session.get('isConsoleTaskHiddenForStudent');
    var schedules = Session.get('isConsoleScheduleHiddenForStudent');
    var projects = Session.get('isConsoleProjectHiddenForStudent');
    var blogs = Session.get('isConsoleBlogHiddenForStudent');
    return !tasks && !schedules && !projects && !blogs;
};
var clearAllFilters = function () {
    Session.set('isConsoleTaskHiddenForStudent', true);
    Session.set('isConsoleScheduleHiddenForStudent', true);
    Session.set('isConsoleProjectHiddenForStudent', true);
    Session.set('isConsoleBlogHiddenForStudent', true);
};
var unclearAllFilters = function () {
    Session.set('isConsoleTaskHiddenForStudent', false);
    Session.set('isConsoleScheduleHiddenForStudent', false);
    Session.set('isConsoleProjectHiddenForStudent', false);
    Session.set('isConsoleBlogHiddenForStudent', false);
};

Template.consoleViewNavFilters.events({
    'click .js-switch-week': function (e) {
        e.preventDefault();
        var startDate = $(e.target).data('start-date');
        var endDate = $(e.target).data('end-date');
        if (startDate && endDate) {
            Session.set('studentDashboardWeekStartDate', startDate);
            Session.set('studentDashboardWeekEndDate', endDate);
        }
        $('.js-switch-week.active').removeClass('active');
        $('.js-reset-week.active').removeClass('active');
        $(e.currentTarget).addClass('active');
    },
    'click .js-reset-week': function (e) {
        e.preventDefault();
        Session.set('studentDashboardWeekStartDate');
        Session.set('studentDashboardWeekEndDate');
        $('.js-switch-week.active').removeClass('active');
        $(e.currentTarget).addClass('active');
    },
    'click .js-toggle-all': function (e) {
        e.preventDefault();
        if (allFiltersAreChecked()) {
            clearAllFilters();
        } else {
            unclearAllFilters();
        }
    },
    'click .js-toggle-tasks': function (e) {
        e.preventDefault();
        var state = Session.get('isConsoleTaskHiddenForStudent');
        Session.set('isConsoleTaskHiddenForStudent', !state);
    },
    'click .js-toggle-schedules': function (e) {
        e.preventDefault();
        var state = Session.get('isConsoleScheduleHiddenForStudent');
        Session.set('isConsoleScheduleHiddenForStudent', !state);
    },
    'click .js-toggle-projects': function (e) {
        e.preventDefault();
        var state = Session.get('isConsoleProjectHiddenForStudent');
        Session.set('isConsoleProjectHiddenForStudent', !state);
    },
    'click .js-toggle-blogs': function (e) {
        e.preventDefault();
        var state = Session.get('isConsoleBlogHiddenForStudent');
        Session.set('isConsoleBlogHiddenForStudent', !state);
    },
    'click .js-search-filter-toggle': function () {
        $('.consoleViewNavFiltersWrapper').slideToggle();
    },
    'click .consoleViewNavFiltersWrapper': function (e) {
        var el = e.target;

        if (el.localName !== 'a' && el.localName !== 'i') {
            $('.consoleViewNavFiltersWrapper').slideToggle();
        }
    }
});

Template.registerHelper('courseTimes', function () {
    var currentCourseId = Session.get('activeCourseId');
    var course = Colls.Courses.findOne(currentCourseId);
    var nowStart;
    var nowEnd;
    if (course) {
        nowStart = moment(course.startDate).startOf('isoweek').toDate();
        nowEnd = moment(course.endDate).add(6, 'd').toDate();
    }
    return {
        start: nowStart,
        end: nowEnd
    };
});

Template.registerHelper('consoleViewStudentTabs', function () {
    var currentCourseId = Session.get('activeCourseId');
    var currentCourse = currentCourseId && Colls.Courses.findOne({_id: currentCourseId});
    var startDate = currentCourse && currentCourse.startDate;
    var endDate = currentCourse && currentCourse.endDate;
    var start = moment(startDate).startOf('isoweek').toDate();
    var end = moment(start).add({days: 6, hours: 23, minutes: 59}).toDate();
    var numberOfDays = moment(endDate).diff(moment(start), 'days');
    if (parseInt(moment(endDate).format('E')) === 1) {
        numberOfDays++;
    }
    var numberOfWeeks = Math.ceil(numberOfDays / 7);
    var i = 1;


    var weeks = [];
    var currentWeekStart = moment().startOf('isoweek').toDate();
    if (numberOfDays) {
        for (; i < numberOfWeeks + 1; i++) {
            weeks.push({
                weekIndex: i,
                start: start,
                end: end,
                active: currentWeekStart.toString() === start.toString()
            });
            start = moment(start).add(7, 'd').toDate();
            end = moment(end).add(7, 'd').toDate();
        }
        return weeks;
    }
});

Template.registerHelper('isConsoleTaskHidden', function () {
    return Session.get('isConsoleTaskHiddenForStudent');
});

Template.registerHelper('isConsoleBlogHidden', function () {
    return Session.get('isConsoleBlogHiddenForStudent');
});

Template.registerHelper('isConsoleProjectHidden', function () {
    return Session.get('isConsoleProjectHiddenForStudent');
});

Template.registerHelper('isConsoleScheduleHidden', function () {
    return Session.get('isConsoleScheduleHiddenForStudent');
});

Template.registerHelper('allChecked', function () {
    return allFiltersAreChecked();
});
