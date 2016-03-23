'use strict';

Meteor.methods({
    createGoogleCalendarEvents: function (courseId, calendarId) {
        check(courseId, String);

        var gCalendarId = Meteor.settings.schedulesGoogleCalendarId;

        if (Roles.userIsInRole(this.userId, 'global_admin')) {
            calendarId = calendarId || gCalendarId;
            Colls.Schedules.find({courseId: courseId}).forEach(function (schedule) {
                Meteor.call('googleCalendarApiCall', schedule, calendarId);
            });
        }
    },
    googleCalendarApiCall: function (schedule, calendarId) {
        GoogleApi.post('calendar/v3/calendars/' + calendarId + '/events', {
            data: {
                'summary': '[' + schedule.courseId + '] ' + schedule.title + ': ' + moment(schedule.date).format('ll'),
                'description': schedule._id,
                'visibility': 'public',
                'reminders': {
                    'overrides': {
                        'method': 'popup',
                        'minutes': 0
                    }
                },
                'start': {
                    'dateTime': moment(schedule.date).format(),
                    'timeZone': schedule.sessionTimezone || 'Europe/London'
                },
                'end': {
                    'dateTime': moment(schedule.date).format(),
                    'timeZone': schedule.sessionTimezone || 'Europe/London'
                },
                'recurrence': [
                    'RRULE:FREQ=WEEKLY;COUNT=4'
                ]
            }
        }, function (err, result) {
            console.log('Hangout:', result && result.hangoutLink);
            if (!err) {
                Colls.Schedules.update({_id: schedule._id}, {$set: {
                    hangoutLink: result.hangoutLink //+ '?authuser=0'
                }});
            } else {
                console.log('Error: ', err);
            }
        });
    }
});
