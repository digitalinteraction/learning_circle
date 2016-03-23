'use strict';

Meteor.methods({
    createSchedulesForGroupsInCourse: function (courseId) {
        check(courseId, String);
        var course = Colls.Courses.findOne({_id: courseId});
        var startDate = course && course.startDate;
        var endDate = course && course.endDate;
        var start = moment(startDate).startOf('isoweek').toDate();
        var end = moment(start).add({days: 6, hours: 23, minutes: 59}).toDate();
        var numberOfDays = moment(endDate).diff(moment(start), 'days');
        if (parseInt(moment(endDate).format('E')) === 1) {
            numberOfDays++;
        }
        endDate = moment(endDate).add({hours: 23, minutes: 59}).toDate();
        var numberOfWeeks = Math.ceil(numberOfDays / 7);
        var i = 1;

        var schedules = [];
        var scheduleWeekDate;
        if (numberOfDays && Roles.userIsInRole(this.userId, 'global_admin')) {
            for (; i < numberOfWeeks + 1; i++) {
                Colls.Groups.find({course: courseId}).forEach(function (group) { // eslint-disable-line
                    scheduleWeekDate = moment(moment(start).format('YYYY-MM-DD') + ' ' + group.sessionHour + ':00').weekday(group.sessionDay).toDate();
                    if (moment(scheduleWeekDate).isAfter(start) && moment(scheduleWeekDate).isBefore(endDate)) {
                        schedules.push({
                            title: group.title + ' - weekly discussion',
                            date: scheduleWeekDate,
                            groupId: group._id,
                            courseId: courseId,
                            sessionDay: group.sessionDay,
                            sessionHour: group.sessionHour,
                            sessionTimezone: group.sessionTimezone
                        });
                    }
                });
                start = moment(start).add(7, 'd').toDate();
                end = moment(end).add(7, 'd').toDate();
            }
        }
        Colls.Schedules.remove({courseId: courseId, lectureType: {$ne: true}});
        schedules.forEach(function (schedule) {
            Colls.Schedules.insert(schedule);
        });
    },
    attendencesUpdate: function (dataId, type) {
        check(dataId, String);
        check(type, String);
        var userId = this.userId;
        var obj = {
            userId: userId,
            state: type
        };
        var attendences;
        var newAttendences = [];
        var schedule = Colls.Schedules.findOne({_id: dataId});
        if ((userId && schedule.lectureType) || (userId && Roles.userIsInRole(userId, 'group_student', schedule.groupId))) {
            attendences = schedule && schedule.attendences;
            newAttendences = _.reject(attendences, function (a) {
                return a.userId === userId;
            });
            newAttendences.push(obj);
            newAttendences = _.uniq(newAttendences);
            Colls.Schedules.update({_id: dataId}, {$set: {attendences: newAttendences}});
        }
    }
});
