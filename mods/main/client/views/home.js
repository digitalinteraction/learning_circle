'use strict';

Template.home.created = function () {
    var self = this;

    self.learners = new ReactiveVar();
    self.projects = new ReactiveVar();
    self.posts = new ReactiveVar();
};

Template.home.rendered = function () {
    var self = this;

    Meteor.call('getCounts', function (err, res) {
        var learnersCount, projectsCount, postsCount, freq;

        if (err) {
            return;
        }

        learnersCount = res.users || 0;
        postsCount = res.posts || 0;
        projectsCount = res.projects || 0;
        freq = 200;

        learnersCount += 216;
        postsCount += 212;
        projectsCount += 12;

        update(learnersCount, self.learners, $('.js-impact-learners'));
        update(projectsCount, self.projects, $('.js-impact-projects'));
        update(postsCount, self.posts, $('.js-impact-posts'));

        function update (count, sum, selector) {
            var curVal, curAdd;
            if (selector.isOnScreen()) {
                curVal = sum.get() || 0;
                curAdd = Math.ceil(count / freq);
                sum.set(curVal + curAdd);
                count -= curAdd;
            }
            if (count > 0 || !selector.isOnScreen()) {
                setTimeout(function () {
                    update(count, sum, selector);
                }, Math.floor(freq / count));
            }
        }
    });
};

Template.home.helpers({
    getLearners: function () {
        var t = Template.instance();
        return t.learners.get() || 0;
    },
    getProjects: function () {
        var t = Template.instance();
        return t.projects.get() || 0;
    },
    getPosts: function () {
        var t = Template.instance();
        return t.posts.get() || 0;
    }
});


Template.home.events({
    'click .js-slide-init': function (e, t) {
        $('html, body').animate({
            scrollTop: t.$('.js-slide-target').offset().top
        }, 1000);
    }
});


// homepage courses block
Template.homepageCourses.created = function () {
    this.subscribe('homepageCourses');
};

Template.homepageCourses.helpers({
    isHomepageCoursesDataReady: function () {
        return Template.instance().homepageCoursesSubs.ready();
    },
    homepageCoursesData: function () {
        return Colls.Courses.find({}, {
            limit: 2, fields: {
                title: 1,
                description: 1,
                startDate: 1,
                endDate: 1,
                image: 1
            }
        });
    }
});

// homepage blogs block
Template.homepageBlogs.created = function () {
    this.subscribe('BlogPostsListing', {
        limit: 6
    });
};
Template.homepageBlogs.helpers({
    posts: function () {
        return Blog.find({public: true}, {limit: 6});
    }
});

// homepage projects block
Template.homepageProjects.created = function () {
    this.subscribe('ProjectHomepage');
};
Template.homepageProjects.helpers({
    project: function () {
        return Project.find({public: true}, {limit: 6});
    }
});

Template.homeHeader.events({
    'click .js-open-homepage-menu': function (e) {
        e.preventDefault();
        Session.set('isHomepageMenuOpen', true);
    },
    'click .js-close-homepage-menu': function (e) {
        e.preventDefault();
        Session.set('isHomepageMenuOpen', false);
    }
});

Template.homeHeader.helpers({
    isHomepageMenuOpen: function () {
        return Session.get('isHomepageMenuOpen');
    }
});
