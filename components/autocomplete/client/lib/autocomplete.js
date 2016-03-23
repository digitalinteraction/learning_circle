'use strict';

window.AutocompleteUsers = function (options) {
    this.autocomplete = '.js-autocompleteUsers';
    this.searchText = false;
    this.offset = 0;
    this.position;
    this.triggerChar = options && options.triggerChar || '@';

    this.sessionUpdate();
};

AutocompleteUsers.prototype.sessionUpdate = function () {
    var self = this;
    Session.set('autocompleteUsers', {
        text: self.searchText,
        offset: self.offset
    });
};

AutocompleteUsers.prototype.summernoteKeyUp = function (summernote) {
    var self = this;
    var $autocomplete, text, offset, lastChar;
    var $summernote = $(summernote);
    var $noteEditable = $summernote.next('.note-editor').find('.note-editable');

    offset = AutocompleteUsers.getCaretCharacterOffsetWithin($noteEditable[0]);
    lastChar = AutocompleteUsers.getLastChar($noteEditable.text(), offset);
    text = AutocompleteUsers.getSearchText($noteEditable.text(), offset, self.triggerChar);

    if (lastChar === self.triggerChar) {
        $autocomplete = $(self.autocomplete);
        self.position = AutocompleteUsers.getCaretPixelPos();
        self.searchText = false;
    } else {
        self.searchText = text;
        self.offset = offset;
    }
    self.sessionUpdate();

    if ($autocomplete) {
        $autocomplete.css({top: self.position.top + 20, left: self.position.left});
    }
};

AutocompleteUsers.prototype.summernoteBlur = function () {
    var self = this;
    Meteor.setTimeout(function () {
        self.searchText = false;
        self.sessionUpdate();
    }, 500);
};

AutocompleteUsers.getSearchText = function (text, pos, triggerChar) {
    var t = text.substring(0, pos);
    var texts = t.split(triggerChar);
    if (texts.length < 2) {
        return false;
    }
    return texts[texts.length - 1];
};

AutocompleteUsers.getLastChar = function (text, pos) {
    return text.substring(pos - 1, pos);
};

AutocompleteUsers.saveSelection = function () {
    var sel;

    if (window.getSelection) {
        sel = window.getSelection();
        if (sel.getRangeAt && sel.rangeCount) {
            return sel.getRangeAt(0);
        }
    } else if (document.selection && document.selection.createRange) {
        return document.selection.createRange();
    }
    return null;
};

AutocompleteUsers.restoreSelection = function (range) {
    var sel;

    if (range) {
        if (window.getSelection) {
            sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
        } else if (document.selection && range.select) {
            range.select();
        }
    }
};

AutocompleteUsers.replaceHtmlAtCaret = function (html) {
    var sel, range, el, frag, node, lastNode, originalRange;
    if (window.getSelection) {
        // IE9 and non-IE
        sel = window.getSelection();
        if (sel.getRangeAt && sel.rangeCount) {
            range = sel.getRangeAt(0);
            range.deleteContents();

            el = document.createElement('div');
            el.innerHTML = html;
            frag = document.createDocumentFragment();
            while ((node = el.firstChild)) {
                lastNode = frag.appendChild(node);
            }
            range.insertNode(frag);

            if (lastNode) {
                range = range.cloneRange();
                range.setStartAfter(lastNode);
                range.collapse(true);

                sel.removeAllRanges();
                sel.addRange(range);
            }
        }
    } else if ((sel = document.selection) && sel.type !== 'Control') {
        // IE < 9
        originalRange = sel.createRange();
        originalRange.collapse(true);
        sel.createRange().pasteHTML(html);
    }
};

AutocompleteUsers.getCaretPixelPos = function () {
    var range, sel, top1, top2, rect;
    var pos = {left: 0, top: 0};

    if (document.selection) {
        range = document.selection.createRange();
        pos.left = range.offsetLeft + 'px';
        pos.top = range.offsetTop + 'px';
    } else if (window.getSelection) {
        sel = window.getSelection();
        range = sel.getRangeAt(0).cloneRange();
        try {
            range.setStart(range.startContainer, range.startOffset - 1);
        } catch (e) {
            //catch
        }

        rect = range.getBoundingClientRect();
        if (range.endOffset === 0 || range.toString() === '') {
            // first char of line
            pos.top = range.startContainer.offsetTop + 'px';
            pos.left = range.startContainer.offsetLeft + 'px';
        } else {
            pos.left = rect.left + rect.width + 'px';
            pos.top = rect.top + 'px';
        }
    }

    top1 = parseInt(pos.top.replace('px', ''));
    top2 = $(window).scrollTop();

    pos.top = top1 + top2;
    return pos;
};

AutocompleteUsers.getCaretCharacterOffsetWithin = function (element) {
    var range, preCaretRange, textRange, preCaretTextRange;
    var caretOffset = 0;
    var doc = element.ownerDocument || element.document;
    var win = doc.defaultView || doc.parentWindow;
    var sel;
    if (typeof win.getSelection !== 'undefined') {
        sel = win.getSelection();
        if (sel.rangeCount > 0) {
            range = win.getSelection().getRangeAt(0);
            preCaretRange = range.cloneRange();
            preCaretRange.selectNodeContents(element);
            preCaretRange.setEnd(range.endContainer, range.endOffset);
            caretOffset = preCaretRange.toString().length;
        }
    } else if ((sel = doc.selection) && sel.type !== 'Control') {
        textRange = sel.createRange();
        preCaretTextRange = doc.body.createTextRange();
        preCaretTextRange.moveToElementText(element);
        preCaretTextRange.setEndPoint('EndToEnd', textRange);
        caretOffset = preCaretTextRange.text.length;
    }
    return caretOffset;
};

Template.autocompleteUsers.events({
    'click button': function (e) {
        var $el = $(e.target);
        var data = Session.get('autocompleteUsers');
        var domain;

        if (!data) {
            return false;
        }

        var newText = $el.text();
        var userId = $el.attr('data-id');
        var oldText = data.text || '';
        var offset = data.offset || 0;

        var range = AutocompleteUsers.saveSelection();
        range.setStart(range.startContainer, range.startOffset - oldText.length - 1);
        AutocompleteUsers.restoreSelection(range);

        if (newText && offset !== undefined) {
            domain = window.location.origin;

            AutocompleteUsers.replaceHtmlAtCaret('<a href="' + domain + '/profile/' + userId + '" class="label label-xs label-info js-username-link">' + newText + '</a>&nbsp;', offset);
        }
        Session.set('autocompleteUsers', false);
    }
});
