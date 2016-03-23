'use strict';

var schema = new SimpleSchema({
    users: { // id
        type: [String]
    },
    groups: { // id
        type: [String]
    },
    course: { // id
        type: String
    }
});

Colls.Sections = new UniCollection('Sections');
Colls.Sections.Schema = schema;
Colls.Sections.attachSchema(schema);
