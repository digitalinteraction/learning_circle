'use strict';

Router.map(function () {
    this.route('/c/:communityId/courses/add', {
        name: 'coursesAdd'
    });
    this.route('/course/:courseId', {
        name: 'courseView'
    });
    this.route('/courses', {
        name: 'coursesListing'
    });
    this.route('/course/:courseId/edit', {
        name: 'courseEdit'
    });
});
