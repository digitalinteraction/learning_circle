'use strict';

// TODO - very very very big refactor and code reuse..
// simple grouping - it is quite productive with min 30 students per course

var iterationRun = function (usersWithSessions, min, iter) {
    var us = [];
    var groups = [];
    var usersWithSessionsGrouped;
    usersWithSessionsGrouped = _.groupBy(usersWithSessions, function (u) {
        return u.userSessions[iter];
    });
    Object.keys(usersWithSessionsGrouped).forEach(function (key) {
        us.push({
            sessionId: key,
            users: _.pluck(usersWithSessionsGrouped[key], 'userId'),
            length: _.pluck(usersWithSessionsGrouped[key], 'userId').length
        });
    });
    us.forEach(function (s) {
        if (s.length >= min) {
            groups.push({
                session: s.sessionId,
                users: s.users,
                ready: true
            });
        } else {
            groups.push({
                session: s.sessionId,
                users: s.users,
                ready: false
            });
        }
    });
    return groups;
};

// we need separation because of fixtures creation and maybe other part of server code
App.runGroupsCreation = function (courseId, min, max) {
    // @todo fix me
    /*eslint-disable */
    var usersSessions = [];
    var usersWithSessions = [];
    var courseSessions = Colls.Courses.findOne({_id: courseId}).avaibleSessionTimes;
    var query = {'courses': courseId};
    query['roles.'+ courseId +'.0'] = 'course_student';
    var usersInCourse = Meteor.users.find(query);
    var prevAllUsers;
    var withoutUsers;
    var concatUsers;
    var groupMin = min || 7;
    var groupMax = max || 13;

    var p1 = [];
    var p2 = [];
    var p3 = [];
    var pn = [];
    var pnl = [];
    var uusers = [];
    var uusers2 = [];

    var i;
    var p1s;
    var pns;

    usersInCourse.forEach(function (u) {
        usersSessions = _.where(u.groupSessions, {course: courseId})[0].sessions;
        usersWithSessions.push({
            userId: u._id,
            userSessions: usersSessions
        });
    });
    p1 = iterationRun(usersWithSessions, groupMin, 0);

    prevAllUsers = _.uniq(_.flatten(_.pluck(p1, 'users')));
    withoutUsers = _.uniq(_.flatten(_.pluck(_.filter(p1, function (j) {
        return j.ready;
    }), 'users')));

    usersWithSessions = [];
    usersInCourse.forEach(function (u) {
        usersSessions = _.where(u.groupSessions, {course: courseId})[0].sessions;
        if (withoutUsers.indexOf(u._id) === -1) {
            usersWithSessions.push({
                userId: u._id,
                userSessions: usersSessions
            });
        }
    });
    p2 = iterationRun(usersWithSessions, groupMin, 1);

    p1.forEach(function (s) {
        var p2s = _.findWhere(p2, {session: s.session});
        var ready;
        var users = [];
        var intersectionWithPrevUsers = [];

        if (p2s) {
            concatUsers = _.uniq(s.users.concat(p2s.users));
            intersectionWithPrevUsers = _.intersection(prevAllUsers, concatUsers);
            if (_.isArray(intersectionWithPrevUsers) && intersectionWithPrevUsers.length) {
                for (i = 0; i < intersectionWithPrevUsers.length; i++) {
                    concatUsers.splice(concatUsers.indexOf(intersectionWithPrevUsers[i]), 1);
                }
            }
            concatUsers.forEach(function (u) {
                if (_.intersection(uusers, concatUsers).indexOf(u) === -1) {
                    users.push(u);
                }
            });
            uusers = _.uniq(uusers.concat(users));
            if (users.length > groupMin) {
                ready = true;
            } else {
                ready = false;
            }
        } else {
            users = s.users;
            ready = s.ready;
        }
        pn.push({
            session: s.session,
            users: users,
            ready: ready
        });
    });

    for (i = 0; i < p2.length; i++) {
        p1s = !_.findWhere(p1, {session: p2[i].session});
        if (p1s) {
            pn = pn.concat(p2[i]);
        }
    }

    withoutUsers = _.uniq(_.flatten(_.pluck(_.filter(pn, function (j) {
        return j.ready;
    }), 'users')));

    usersWithSessions = [];
    usersInCourse.forEach(function (u) {
        usersSessions = _.where(u.groupSessions, {course: courseId})[0].sessions;
        if (withoutUsers.indexOf(u._id) === -1) {
            usersWithSessions.push({
                userId: u._id,
                userSessions: usersSessions
            });
        }
    });
    p3 = iterationRun(usersWithSessions, groupMin, 2);

    pn.forEach(function (s) {
        var p3s = _.findWhere(p3, {session: s.session});
        var ready;
        var users = [];
        if (p3s) {
            concatUsers = _.uniq(s.users.concat(p3s.users));
            concatUsers.forEach(function (u) {
                if (_.intersection(uusers2, concatUsers).indexOf(u) === -1) {
                    users.push(u);
                }
            });
            uusers2 = _.uniq(uusers2.concat(users));
            if (users.length > groupMin) {
                ready = true;
            } else {
                ready = false;
            }
        } else {
            users = s.users;
            ready = s.ready;
        }
        pnl.push({
            session: s.session,
            users: users,
            ready: ready
        });
    });

    for (i = 0; i < p3.length; i++) {
        pns = !_.findWhere(pn, {session: p3[i].session});
        if (pns) {
            pnl = pnl.concat(p3[i]);
        }
    }

    // final iteration and group forming
    var unassignedUsers = [];

    pnl.forEach(function (s) {
        var groups = [];
        var allUsers = s.users;
        var sessionDay, sessionHour, sessionTimezone;

        if (s.ready) {
            allUsers = s.users;
            while (allUsers.length > groupMin) {
                groups.push(allUsers.splice(0, groupMin));
            }
            if (allUsers.length) {
                for (i = 0; i < groups.length; i++) {
                    if (groups[i].length < groupMax) {
                        groups[i].push(allUsers.splice(0, groupMax - groups[i].length)); // need to be improved to divide equally
                        groups[i] = _.flatten(groups[i]);
                    }
                }
            }
            if (allUsers.length) {
                unassignedUsers.push(s.users);
            }
            sessionDay = _.where(courseSessions, {sessionId: s.session})[0].day;
            sessionHour = _.where(courseSessions, {sessionId: s.session})[0].hour;
            sessionTimezone = _.where(courseSessions, {sessionId: s.session})[0].timezone;
            // collection inserts
            groups.forEach(function (g) {
                var result = Colls.Groups.insert({
                    users: g,
                    course: courseId,
                    sessionId: s.session,
                    sessionHour: sessionHour,
                    sessionDay: sessionDay,
                    sessionTimezone: sessionTimezone
                });
                Roles.addUsersToRoles(g, 'group_student', result);
            });
        } else {
            unassignedUsers.push(s.users);
        }
    });

    // assign unasigned
    // TODO: better match - for now we place the student in group which has a space for him
    // anyway.. it could be changed and absorbed in the 'reschedule' functionality

    var flattenUnassignedUsers = _.uniq(_.flatten(unassignedUsers));
    var groupWithFreeSlots;
    var userToAsign;
    var leftUsersSection;
    var tenUsers;
    var result;

    while (flattenUnassignedUsers.length > 0) {
        for (i = groupMin; i < groupMax; i++) {
            if (_.isObject(groupWithFreeSlots) && !_.isEmpty(groupWithFreeSlots)) {
                break;
            }
            groupWithFreeSlots = Colls.Groups.findOne({course: courseId, users: {$size: i}});
        }
        if (_.isObject(groupWithFreeSlots) && !_.isEmpty(groupWithFreeSlots)) {
            userToAsign = flattenUnassignedUsers.splice(0, 1);
            Colls.Groups.update({_id: groupWithFreeSlots._id}, {$addToSet: {users: userToAsign[0]}});
            Roles.addUsersToRoles(userToAsign[0], 'group_student', groupWithFreeSlots._id);
        } else {
            // we must create another incomplete group for users who are left
            // hardcoded for now
            leftUsersSection = _.where(courseSessions, {timezone: 'Europe/Warsaw', hour: '17'});
            while (flattenUnassignedUsers.length > 0) {
                tenUsers = flattenUnassignedUsers.splice(0, 10);
                result = Colls.Groups.insert({
                    users: tenUsers,
                    sessionId: leftUsersSection[0] && leftUsersSection[0].sessionId,
                    sessionDay: '4',
                    sessionHour: '17',
                    sessionTimezone: 'Europe/Warsaw',
                    course: courseId,
                    unassignedUsers: true
                });
                Roles.addUsersToRoles(tenUsers, 'group_student', result);
            }
            flattenUnassignedUsers = [];
        }
        groupWithFreeSlots = null;
    }

    // update auto-title
    Colls.Groups.find({course: courseId}).forEach(function (g, j) {
        Colls.Groups.update({_id: g._id}, {$set: {title: 'Group ' + (j + 1)}});
    });
    console.log('Groups for course id: "' + courseId + '" created!');
    Meteor.call('_sendEmailAboutGroupAssignment', courseId, function (err) {
        if(err){
            console.error('error in _sendEmailAboutGroupAssignment:', err);
        }
    });
    /*eslint-enable */
};

// Meteor method
Meteor.methods({
    _sendEmailAboutGroupAssignment: function (courseId) {
        check(courseId, String);
        this.unblock();

        if (!Roles.userIsInRole(this.userId, ['global_admin'])) {
            throw new Meteor.Error('403', 'Only admin can send group assignment emails');
        }

        Colls.Groups.find({course: courseId})
            .map(function (group) {
                // get all users email address from the group
                var emails = Meteor.users.find({
                    _id: {$in: group.users}
                }, {
                    fields: {
                        emails: 1
                    }
                }).map(function (user) {
                    return UniUtils.get(user, 'emails.0.address');
                });

                return {
                    emails: _.compact(emails),
                    // if you want to add additional fields for the template do it here:
                    group_title: group.title
                };
            })
            .forEach(function (data) {
                // send email for each group separately
                App.triggerEmail('group_allocation', {
                    courseId: courseId,
                    to: data.emails,
                    data: {
                        group_title: data.group_title
                    }
                });
            });
    },
    // min - minimum users amount in group (default 7)
    // max - maximum users amount in group (default 13)
    formStudentsGroups: function (courseId, min, max) {
        check(courseId, String);
        if (this.userId && Roles.userIsInRole(this.userId, 'global_admin')) {
            App.runGroupsCreation(courseId, min, max);
        }
    },
    // this is only for a while
    createOneGroupForLiveVersionTesting: function (courseId) {
        var usersArr, courseSessions, createdGroupId, users;

        if (this.userId && Roles.userIsInRole(this.userId, 'global_admin')) {
            usersArr = Meteor.users.find({'courses': courseId}).fetch();
            courseSessions = Colls.Courses.findOne({_id: courseId}).avaibleSessionTimes;
            users = usersArr.map(function (u) {
                return u._id;
            });
            if (_.isArray(users)) {
                createdGroupId = Colls.Groups.insert({
                    title: 'Group 1',
                    users: users,
                    sessionId: courseSessions[0] && courseSessions[0].sessionId,
                    sessionDay: '4',
                    sessionHour: '20',
                    sessionTimezone: 'Europe/Warsaw',
                    course: courseId
                });
            }
            Roles.addUsersToRoles(users, 'group_student', createdGroupId);
        }
    }
});
