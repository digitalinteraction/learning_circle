'use strict';

Router.map(function () {
    this.route('/apply/:courseId', {
        name: 'applyView'
    });
    this.route('/apply/mentor/:courseId', {
        name: 'applyMentorView'
    });
});
