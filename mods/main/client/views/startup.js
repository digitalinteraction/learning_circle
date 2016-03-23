'use strict';

// set up active course for all website from last seen course - saved on user collection
Meteor.startup(function () {
    Tracker.autorun(function (c) {
        var user = UniUsers.getLoggedIn();
        if (user && user.lastSeenCourse) { // wait for the additional data from subscription
            Session.setDefault('activeCourseId', user.lastSeenCourse);
            c.stop();
        }
    });
});
