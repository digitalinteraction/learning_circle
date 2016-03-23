'use strict';

var buildQuery = function (userId) {
    var query = {};

    if (!userId) {
        // not logged in, show only published projects
        query.status = 'published';
        query.public = true;
        return query;
    }


    if (Roles.userIsInRole(userId, ['global_mentor', 'global_admin'])) {
        // admin and mentor can see everything, for now at least
        query = {};
    } else {
        // logged normal user, show published and own projects
        // in the future show only published posts from own section
        query.$or = [
            {ownerId: userId}, // show all own posts
            {status: 'published'} // show published and published projects
        ];
    }

    return query;
};

Meteor.publish('ProjectHomepage', function () {
    var query = buildQuery(this.userId);
    query.public = true;
    return Project.find(query, {
        limit: 6
    });
});

Meteor.publish('ProjectUserProfile', function (userId) {
    check(userId, String);

    // custom query for this publication
    var query = {
        ownerId: userId,
        status: 'published'
    };

    return Project.find(query, {
        limit: 10,
        fields: {
            title: 1,
            image: 1,
            ownerId: 1,
            brief: 1
        }
    });
});

Meteor.publish('ProjectView', function (id) {
    check(id, String);

    var query = buildQuery(this.userId);
    query._id = id;

    return Project.find(query, {
        limit: 1
    });
});

Meteor.publish('ProjectsInTask', function (taskId) {
    check(taskId, String);

    return Project.find({taskId: taskId});
});

SearchSource.defineSource('projects', function (searchText, params) {

    function buildRegExp (str) {
        // this is dumb implementation
        var parts = str.trim().split(/[ \-\:]+/);
        return new RegExp('(' + parts.join('|') + ')', 'ig');
    }

    params = params || {};
    params.limit = Math.min(params.limit, 50) || 6;

    var options = {
        limit: params.limit,
        sort: {
            createdAt: -1
        },
        fields: {
            title: 1,
            image: 1,
            brief: 1,
            createdAt: 1,
            ownerId: 1
        }
    };

    var query;
    var regExp;
    var userId = UniUsers.getLoggedInId();

    if (searchText) {
        regExp = buildRegExp(searchText);
        query = {
            '$and': [
                buildQuery(userId),
                {
                    '$or': [
                        {title: regExp},
                        {brief: regExp}
                    ]
                },
                circleConcept.getQuery({}, 'Project', params)
            ]
        };

    } else {
        query = buildQuery(userId);
        query = circleConcept.getQuery(query, 'Project', params);
    }

    var data = Project.getCollection().find(query, options).fetch();

    var showMore = (function () {
        if (params.limit === 50) {
            // max limit reached
            return false;
        }

        // show more as long as we fill the limit
        return data.length === params.limit;
    })();

    return {
        data: data,
        metadata: {
            showMore: showMore
        }
    };
});

Meteor.publish('projectPosts', function (projectId) {
    check(projectId, String);
    return ProjectPost.find({projectId: projectId});
});
