'use strict';

Template.layoutTopBar.rendered = function () {
    this.$('ul.sf-menu').superfish({
        animation: {opacity: 'visible'},
        animationOut: {opacity: 'visible'}
    });
//    $(window).on('scroll.mainHeader', function () {
//        var $header = $('.js-main-header');
//        if ($(window).scrollTop() > 0) {
//            $header.addClass('fixed');
//        } else {
//            $header.removeClass('fixed');
//        }
//    });
};

Template.layoutTopBar.onDestroyed(function () {
    $(window).off('scroll.mainHeader');
});


Template.layout.helpers({
    getContainerClass: function () {
        var router = Router.current();
        var routeName = router && router.route && router.route.getName();
        if (_.isString(routeName)) {
            routeName = routeName.replace('.', '');
            return routeName;
        }
    }
});

Template.layoutMainMenu.helpers({
    mainMenuState: function (state) {
        var router = Router.current();
        var currentRouteName = router && router.route && router.route.getName();
        var slug = router && router.params && router.params.slug;
        var currentState;
        if (typeof currentRouteName === 'string') {
            if (currentRouteName.substr(0, 7) === 'console') {
                currentState = 'console';
            } else if (currentRouteName.substr(0, 5) === 'admin') {
                currentState = 'admin';
            } else if (currentRouteName.substr(0, 7) === 'project') {
                currentState = 'content';
            } else if (currentRouteName.substr(0, 4) === 'blog') {
                currentState = 'content';
            } else if (currentRouteName.substr(0, 6) === 'course') {
                currentState = 'course';
            } else if (currentRouteName.substr(0, 9) === 'community') {
                currentState = 'community';
            } else if (currentRouteName.substr(0, 6) === 'manage') {
                currentState = 'manage';
            } else if (slug === 'about') {
                currentState = 'about';
            } else if (slug === 'faq') {
                currentState = 'faq';
            }
        }
        return currentState === state;
    }
});

Template.coursesDropdownMenu.created = function () {
    var self = this;
    var coursesIdsArr;
    var coursesMentorIdsArr;
    self.autorun(function () {
        if (UniUsers.getLoggedIn()) {
            coursesIdsArr = UniUtils.get(UniUsers.getLoggedIn(), 'courses');
            coursesMentorIdsArr = UniUtils.get(UniUsers.getLoggedIn(), 'mentorshipCourses');
            if (_.isArray(coursesIdsArr) && _.isArray(coursesMentorIdsArr)) {
                coursesIdsArr = coursesIdsArr.concat(coursesMentorIdsArr);
            }
            self.userCoursesSubs = Meteor.subscribe('userCoursesTitles', coursesIdsArr);

            if (Roles.userIsInRole(Meteor.userId(), ['global_community_admin'])) {
                Meteor.subscribe('communityAdminCoursesTitles');
            }
        }
    });
};

Template.coursesDropdownMenu.helpers({
    getCommunityCourses: function () {
        return Colls.Courses.find({}, {fields: {title: 1}});
    },
    getActiveCourseTitle: function () {
        var course = Colls.Courses.findOne({_id: Session.get('activeCourseId')}, {fields: {title: 1}});
        if (course) {
            return course.title;
        }
        return 'Select course';
    }
});

Template.coursesDropdownMenu.events({
    'click .js-switch-course': function (e) {
        e.preventDefault();
        var courseId = this._id;
        if (courseId) {
            UniUsers.update({_id: UniUsers.getLoggedInId()}, {$set: {'lastSeenCourse': courseId}});
            Session.set('activeCourseId', courseId);
        }
    }
});

Template.coursesDropdownMenu.destroyed = function () {
    if (this.userCoursesSubs) {
        this.userCoursesSubs.stop();
    }
};

Template.loggedInUserDropdownMenu.events({
    'click .js-scroll-apply': function (e) {
        e.preventDefault();
        Router.go('/courses');
        var $coursesContainer = $('.coursesListing').find('.container'),
            containerTop;
        if ($coursesContainer && $coursesContainer.offset()) {
            containerTop = $coursesContainer && $coursesContainer.offset().top;
            $('html, body').stop(true, false).animate({
                scrollTop: containerTop
            }, 'fast', 'linear');
        }
    },
    'click .js-logout-user': function (e) {
        e.preventDefault();
        Meteor.logout(function () {
            Router.go('/');
        });
    },
    'click .js-start-chat-admin': function (e) {
        e.preventDefault();
        var user = UniUsers.find({'emails.0.address': 'learningcircle2015@gmail.com'}).fetch();
        var chatroom;
        if (user && _.isObject(user[0].status) && user[0].status.online) {
            chatroom = UniChat.Chatrooms.createChatroomWithUsers([user[0]._id]);
            chatroom.showChatToMe();
        } else {
            chatroom = UniChat.Chatrooms.createChatroomWithUsers([user[0]._id]);
            Router.go('/inbox/' + chatroom._id);
        }
    }
});

Template.loggedInUserDropdownMenu.helpers({
    isCoursesListingRoute: function () {
        var router = Router.current();
        var routeName = router && router.route.getName();
        return routeName && routeName === 'coursesListing';
    }
});

Template.layoutFooter.rendered = function () {
    if (typeof FB !== 'undefined') {
        FB.XFBML.parse(this.firstNode);
    }
    $('.quote-revolver').quovolver({
        autoPlay: true,
        autoPlaySpeed: 6000,
        transitionSpeed: 200
    });
};

Template.layoutFooter.helpers({
    getSiteURL: function () {
        return window.location.origin;
    }
});
