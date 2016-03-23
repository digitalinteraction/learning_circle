'use strict';

Template.circleConceptFilterDesktop.helpers({
    getActiveCircle: function () {
        return circleConcept.getFilter();
    }
});

Template.circleConceptFilterDesktop.events({
    'click .circle-concept-container': function () {
        circleConcept.switchNext();
    }
});
