'use strict';
/****************************
 * Configuration
 ****************************/

Router.configure({
    layoutTemplate: 'layout',
    loadingTemplate: 'loading',
    notFoundTemplate: '404',
    templateNameConverter: 'camelCase'
});

Router.setControllerNameConverter(function (str) {
    //console.log('using ' + 'RouteCtrls.' + Iron.utils.classCase(str));
    return 'RouteCtrls.' + Iron.utils.classCase(str);
});

/********************************
 * Default pages
 ********************************/

Router.map(function () {
    this.route('/', {
        name: 'home',
        layoutTemplate: 'layoutHome',
        controller: 'RouteCtrls.Basic'
    });
});

// only logged in users
// TODO gatekeepers/access somewhere, somehow later...
Router.onBeforeAction(function () {
    if (!Meteor.userId()) {
        Session.set('desiredRouteOnLogin', this.url);
        this.layout('layout');
        this.render('entrySignIn');
    } else {
        this.next();
    }
}, {only: [
    'coursesAdd',
    'applyView',
    'applyMentorView',
    'consoleView'
]});

Router.onBeforeAction(function () {
    if (!Meteor.userId()) {
        Session.set('desiredRouteOnLogin', this.url);
    }
    this.next();
}, {only: [
    'blogView',
    'projectView'
]});

Router.onBeforeAction(function () {
    if (Meteor.userId()) {
        this.redirect('consoleView');
    } else {
        Session.set('isHomepageMenuOpen', false);
        this.next();
    }
}, {only: [
    'home'
]});


// only admin
Router.onBeforeAction(function () {
    if (this.ready() &&
        Meteor.userId() &&
        !(
            Roles.userIsInRole(Meteor.userId(), ['global_admin']) ||
            Roles.userIsInRole(Meteor.userId(), ['community_admin'], this.params.communityId)
        )
    ) {
        this.redirect('coursesListing');
    } else {
        this.next();
    }
}, {only: [
    'coursesAdd',
    'courseEdit',
    'tasksAdd',
    'tasksEdit'
]});

// only admin or mentor in course
Router.onBeforeAction(function () {
    if (!Meteor.userId() || !Roles.userIsInRole(Meteor.userId(), ['global_admin', 'global_mentor', 'global_community_admin'])) {
        this.redirect('consoleView');
    } else {
        this.next();
    }
}, {only: [
    'adminManageView'
]});

Router.onAfterAction(function () {
    if (this.url !== window.location.href) {
        Session.set('layoutSecondMenuShow', false);
        Session.set('layoutSecondMenuHideSM', false);
        $(window).scrollTop(0);
    }
});

Meteor.startup(function () {
    return SEO.config({
        title: 'Learning Circle',
        ignore: {
            meta: ['fragment', 'viewport'],
            link: ['stylesheet', 'icon', 'shortcut icon']
        }
    });
});
