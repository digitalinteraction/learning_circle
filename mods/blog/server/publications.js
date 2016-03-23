'use strict';

var buildQuery = function (userId) {
    var query = {};

    if (!userId) {
        // not logged in, show only published posts
        query.status = 'published';
        query.public = true;

    } else if (Roles.userIsInRole(userId, ['global_admin'])) {
        // admin and mentor can see everything

    } else {
        // logged in, show published and own posts
        query.$or = [
            {ownerId: userId}, // show all own posts
            {status: 'published'} // show published posts
        ];
    }

    return query;
};

Meteor.publish('BlogPostsListing', function (params) {

    params = params || {};
    params.limit = Math.max(params.limit, 50) || 0;

    var query = buildQuery(this.userId);

    return Blog.find(query, {
        limit: params.limit,
        sort: {
            createdAt: -1
        },
        fields: {
            title: 1,
            image: 1,
            ownerId: 1,
            createdAt: 1,
            brief: 1,
            status: 1,
            public: 1,
            disabled: 1
        }
    });
});

Meteor.publish('BlogPostView', function (id) {
    check(id, String);

    var query = buildQuery(this.userId);
    query._id = id;

    return Blog.find(query, {
        limit: 1
    });
});

Meteor.publish('BlogMostPopular', function (limit) {
    limit = limit || 4;
    check(limit, Number);

    var query = buildQuery(this.userId);

    return Blog.find(query, {
        sort: {
            title: 1 // @todo change this later to some popularity factor
        },
        limit: limit,
        fields: {
            title: 1,
            image: 1,
            ownerId: 1,
            brief: 1,
            status: 1,
            disabled: 1
        }
    });
});

Meteor.publish('BlogUserProfile', function (userId) {
    check(userId, String);

    // custom query for this publication
    var query = {
        ownerId: userId,
        status: 'published'
    };

    return Blog.find(query, {
        limit: 10,
        fields: {
            title: 1,
            image: 1,
            ownerId: 1,
            brief: 1,
            status: 1,
            disabled: 1
        }
    });
});

SearchSource.defineSource('blogs', function (searchText, params) {

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
            ownerId: 1,
            createdAt: 1,
            brief: 1
            // content: 1
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
                circleConcept.getQuery({}, 'Blog', params)
            ]
        };

    } else {
        query = buildQuery(userId);
        query = circleConcept.getQuery(query, 'Blog', params);
    }

    var data = Blog.getCollection().find(query, options).fetch();

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
