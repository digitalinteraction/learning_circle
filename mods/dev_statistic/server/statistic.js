'use strict';
function makeid () {
    var objectId = new Meteor.Collection.ObjectID();
    return objectId._str;
}

Meteor.methods({
    getStatisticToken: function () {
        check(this.userId, String);
        var user = UniUsers.findOne({_id: this.userId});
        var token = makeid();
        if (user.isAdmin()) {
            UniUsers.update({_id: user._id}, {$set: {statisticToken: token}});
        }
        return 'statistic-export?t=' + token;
    }
});

var getStatisticJson = function (token) {
    var json = {
        projects: [],
        blogs: [],
        wall: [],
        comments: [],
        messages: [],
        users: []
    };
    var allUsersIdKey = {};
    var allCommentsContainerIdKey = {};
    var allProjectsIdKey = {};
    var allBlogsIdKey = {};
    var allActivitiesIdKey = {};
    var allCoursesIdKey = {};
    var user = UniUsers.findOne({statisticToken: token});
    if (user && user.isAdmin()) {
        Colls.Courses.find({}).forEach(function (c) {
            if (c.description) {
                c.description = App.clearText(c.description);
            }
            if (c.syllabus) {
                c.syllabus = App.clearText(c.syllabus);
            }
            allCoursesIdKey[c._id] = c;
        });
        Meteor.users.find({}).forEach(function (u) {
            var cList = [];
            var mcList = [];
            if (u.courses) {
                cList = u.courses.map(function (coursId) {
                    return allCoursesIdKey[coursId];
                });
                u.courses = cList;
            }
            if (u.mentorshipCourses) {
                mcList = u.mentorshipCourses.map(function (coursId) {
                    return allCoursesIdKey[coursId];
                });
                u.mentorshipCourses = mcList;
            }
            json.users.push(u);
            allUsersIdKey[u._id] = u;
        });
        UniComments.Comments.find({}).forEach(function (c) {
            if (!allCommentsContainerIdKey[c.containerId]) {
                allCommentsContainerIdKey[c.containerId] = [];
            }
            if (allUsersIdKey[c.userId]) {
                c.authorName = allUsersIdKey[c.userId].name;
            }
            if (c.text) {
                c.text = App.clearText(c.text);
            }
            allCommentsContainerIdKey[c.containerId].push(c);
        });
        Project.find({}).forEach(function (p) {
            p.content = App.clearText(p.content);
            allProjectsIdKey[p._id] = p;
        });
        Blog.find({}).forEach(function (b) {
            b.content = App.clearText(b.content);
            allBlogsIdKey[b._id] = b;
        });
        UniRiver.Activities.find({}).forEach(function (a) {
            if (a.o.description) {
                a.o.description = App.clearText(a.o.description);
            }
            allActivitiesIdKey[a._id] = a;
        });


        Project.find({}).forEach(function (project) {
            project.content = App.clearText(project.content);
            project.author = allUsersIdKey[project.ownerId];
            project.comments = allCommentsContainerIdKey[project._id];
            json.projects.push(project);
        });
        Blog.find({}).forEach(function (blog) {
            blog.content = App.clearText(blog.content);
            blog.author = allUsersIdKey[blog.ownerId];
            blog.comments = allCommentsContainerIdKey[blog._id];
            json.blogs.push(blog);
        });
        UniRiver.Activities.find({}).forEach(function (activity) {
            if (activity.o.description) {
                activity.o.description = App.clearText(activity.o.description);
            }
            if (activity.o.content) {
                activity.o.content = App.clearText(activity.o.content);
            }
            activity.author = allUsersIdKey[activity.actor._id];
            activity.comments = allCommentsContainerIdKey[activity._id];
            json.wall.push(activity);
        });
        UniComments.Comments.find({}).forEach(function (comment) {
            comment.refferedTo = allBlogsIdKey[comment.containerId] || allProjectsIdKey[comment.containerId] || allActivitiesIdKey[comment.containerId];
            if (allUsersIdKey[comment.userId]) {
                comment.authorName = allUsersIdKey[comment.userId].name;
            }
            if (comment.text) {
                comment.text = App.clearText(comment.text);
            }
            json.comments.push(comment);
        });
        UniUsers.update({_id: user._id}, {$set: {statisticToken: ''}});
        UniMessages.find().forEach(function (message) {
            delete message.text;
            json.messages.push(message);
        });
        return json;
    }
};


Router.map(function () {
    this.route('statisticJsonExport', {
        where: 'server',
        path: '/statistic-export',
        action: function () {
            var mimeType = 'text/json; charset=UTF-8';
            var fileName = 'statistic';
            var fileFormat = 'json';
            var token = this.params.query.t;
            var response = false;

            if (token) {
                response = getStatisticJson(token);
            }
            if (!response) {
                console.log('No response data');
                return this.response.end({response: 'You dont have access'});
            }
            var content = JSON.stringify(response);
            this.response.writeHead(200, {
                'Content-Type': mimeType,
                'Content-Disposition': 'attachment; filename="' + fileName + '.' + fileFormat + '"'
            }, fileName);
            this.response.end(content);
        }
    });
});
