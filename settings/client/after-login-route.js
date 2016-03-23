'use strict';

Router.map(function () {
    this.route('/after-login', {
        name: 'afterLogin',
        action: function () {
            var desiredRoute = Session.get('desiredRouteOnLogin');
            if (desiredRoute && desiredRoute !== '/class') {
                // redirect to specific route
                this.redirect(desiredRoute);
            } else if (Roles.userIsInRole(Meteor.user(), 'global_student', Roles.GLOBAL_GROUP)) {
                // is already a student, redirect to class
                this.redirect('/class');
            } else {
                // not yet in a course, redirect to courses
                this.redirect('/courses');
            }
        },
        waitOn: function () {
            Meteor.subscribe('currUser');
        },
        onAfterAction: function () {
            //
            // check if special LC user and request google calendar permissions (click the button)
            //
            Meteor.defer(function () {
                if (Meteor.userId() && Meteor.user().canCreateHangouts) {
                    $('body').append(Blaze.toHTML(Template.canCreateHangoutsTmpl));
                    $('#canCreateHangoutsTmpl .js-access-google-calendars').on('click', function () {
                        Meteor.loginWithGoogle({
                            requestOfflineToken: false,
                            forceApprovalPrompt: false,
                            requestPermissions: ['https://www.googleapis.com/auth/calendar']
                        });
                        $(this).off('click');
                        $('#canCreateHangoutsTmpl').remove();
                    });
                }
            });
        }
    });
});
