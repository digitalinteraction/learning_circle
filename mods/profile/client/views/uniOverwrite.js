'use strict';

// uniProfile templates overwrites

// uniProfile
Template.customProfileView.replaces('uniProfile');

Template.customProfileView.inheritsHelpersFrom('uniProfile');
Template.customProfileView.inheritsEventsFrom('uniProfile');
Template.customProfileView.inheritsHooksFrom('uniProfile');


// uniProfile buttons
Template.customUniProfileButtons.replaces('uniProfileButtons');

Template.customUniProfileButtons.inheritsHelpersFrom('uniProfileButtons');
Template.customUniProfileButtons.inheritsEventsFrom('uniProfileButtons');
Template.customUniProfileButtons.inheritsHooksFrom('uniProfileButtons');


// uni profile status
Template.customUniProfileStatus.replaces('uniProfileStatus');

Template.customUniProfileStatus.inheritsHelpersFrom('uniProfileStatus');
Template.customUniProfileStatus.inheritsEventsFrom('uniProfileStatus');
Template.customUniProfileStatus.inheritsHooksFrom('uniProfileStatus');


// uni chat send message button
Template.customUniChatStartBtn.replaces('uniChatStartBtn');

Template.customUniChatStartBtn.inheritsHelpersFrom('uniChatStartBtn');
Template.customUniChatStartBtn.inheritsEventsFrom('uniChatStartBtn');
Template.customUniChatStartBtn.inheritsHooksFrom('uniChatStartBtn');
