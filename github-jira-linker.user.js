// ==UserScript==
// @id          github-jira-linker
// @name        GitHub JIRA Linker
// @namespace   github-jira-linker
// @description Link JIRA issues on Github to JIRA.
// @author      Hosh Sadiq <superaktieboy@gmail.com> http://github.com/hoshsadiq
// @version     1.1.2
// @homepage    https://github.com/hoshsadiq/github-jira-linker
// @updateURL   https://github.com/hoshsadiq/github-jira-linker/blob/master/github-jira-linker.user.meta.js
// @match       http://*.github.com/*
// @match       https://*.github.com/*
// @include     https://github.com/*
// @include     https://*.github.com/*
// @require     https://ajax.googleapis.com/ajax/libs/jquery/2.0.3/jquery.min.js
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_addStyle
// @grant       GM_listValues
// @run-at      document-end
// ==/UserScript==

var defaults = {
        jira_link_url: '',
        jira_link_projects: '',
        jira_link_color_f: '#009400',
        jira_link_color_b: '#f18600',
        jira_link_color_h: '#bf0500',
        jira_link_color_none: '#00468f'
    },
    projectList = GM_getValue('jira_link_projects', defaults.jira_link_projects).toLowerCase().split(','),
    settingsPage = '\
<div class="boxed-group">\
    <h3>JIRA link settings</h3>\
    <div class="boxed-group-inner">\
        <form method="post" id="jira-link-settings" class="jira-link-settings">\
            <dl class="form jira-link-url">\
                <dt><label for="jira_link_url">JIRA URL</label></dt>\
                <dd>\
                    <span>https://</span>\
                    <input type="text" id="jira_link_url" class="jira-gm-auto-save" value="{jira_link_url}" style="width:280px">\
                    <span>/browse/BUG-123</span>\
                </dd>\
            </dl>\
            <dl class="form jira-link-projects">\
                <dt><label for="jira_link_projects">Projects (comma separated)</label></dt>\
                <dd><input type="text" id="jira_link_projects" class="jira-gm-auto-save" value="{jira_link_projects}"></dd>\
            </dl>\
            <dl class="form jira-link-color-f">\
                <dt><label for="jira_link_color_f">Feature type color</label></dt>\
                <dd><input type="text" id="jira_link_color_f" class="jira-gm-auto-save" value="{jira_link_color_f}"></dd>\
            </dl>\
            <dl class="form jira-link-color-b">\
                <dt><label for="jira_link_color_b">Bug fix type color</label></dt>\
                <dd><input type="text" id="jira_link_color_b" class="jira-gm-auto-save" value="{jira_link_color_b}"></dd>\
            </dl>\
            <dl class="form jira-link-color-h">\
                <dt><label for="jira_link_color_h">Hot fix type color</label></dt>\
                <dd><input type="text" id="jira_link_color_h" class="jira-gm-auto-save" value="{jira_link_color_h}"></dd>\
            </dl>\
            <dl class="form jira-link-color-none">\
                <dt><label for="jira_link_color_none">No type color</label></dt>\
                <dd><input type="text" id="jira_link_color_none" class="jira-gm-auto-save" value="{jira_link_color_none}"></dd>\
            </dl>\
        </form>\
    </div>\
</div>\
    ';
settingsPage = settingsPage.replace(/\{([a-z\_]+)\}/gi, function (match, key) {
        return GM_getValue(key, defaults[key]);
    }
);


/**
 * Shamelessly stolen from James Padolsey and (slightly) improved on
 * http://james.padolsey.com/javascript/find-and-replace-text-with-javascript/
 * @param  {String|RegExp} regex
 * @param  {String|Function} replacement
 * @param  {HTMLElement} searchNode
 */
function findAndReplace(regex, replacement, searchNode) {
    if (!regex || typeof replacement === 'undefined') {
        return;
    }
    var excludes = [
            'html', 'head', 'style', 'title', 'link', 'meta',
            'script', 'object', 'iframe', 'img', 'embed', 'param',
            'video', 'source', 'track', 'canvas', 'map', 'svg',
            'math', 'input', 'button', 'select', 'textarea'
        ],
        nodes = (searchNode || document.body).childNodes,
        i, node;

    for (i in nodes) {
//        if(nodes.hasOwnProperty(i)) {
        node = nodes[i];
        if (node.nodeType === Node.ELEMENT_NODE) {
            if(node.getAttribute('class') && ' ' + node.getAttribute('class').indexOf(' jira-issue') > -1) {
                continue;
            }
            if (excludes.indexOf(node.nodeName.toLowerCase()) === -1) {
                arguments.callee(regex, replacement, node);
            }
        }

        if (node.nodeType !== Node.TEXT_NODE || !regex.test(node.data)) {
            continue;
        }
        //
        var parent = node.parentNode,
            frag = (function () {
                var wrap = document.createElement('div'),
                    frag = document.createDocumentFragment();
                wrap.innerHTML = node.data.replace(regex, replacement);
                while (wrap.firstChild) {
                    frag.appendChild(wrap.firstChild);
                }
                return frag;
            })();

        parent.insertBefore(frag, node);
        parent.removeChild(node);
    }
//    }
}

$('.settings-content').on('keyup keydown', '.jira-gm-auto-save',function () {
    GM_setValue($(this).attr('id'), $(this).val());
}).append(settingsPage);

$('body').on('click', 'a.jira-issue', function (e) {
    window.open(this.href);
    e.preventDefault();
    e.stopPropagation();
    return false;
});

(function ($) {

    gmMain();
    $(document).ajaxSuccess(function (event, request, settings) {
        gmMain();
    });

})(unsafeWindow.jQuery);

GM_addStyle('a.jira-issue { width: 16px; height: 16px; display: inline-block !important; background-repeat: no-repeat; background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABMklEQVQ4jY2TvVHDQBBGnzwuwLGj6wCpAsTQgB1sbodEhgooQSZyaBNvgBrQjKnApgIuIlYHJvDKLNINeJO7uf327Xd/2aaZnoAd8PJw/3Xkitg00xxYAYsxUAAVcNg00wjsgQ+gD8uBG6AEgumKzFFLo87+MVCb2z1AllIYbGJdMTdtV+TjAhCNJ6O/q4R1CiwaH4FbYKYSMoCxy0ezPxONR+teWe7JXFROC8DIAV7dvDI3rYlrYJvSesDakXMrKIA58Mb55Lvuly3+OkTRmAMHt7SzcWFjC9yphMsVD25BNC56dn3MVULtF0Z9hUrYActE8bJfnARY7BOQSUo4AIjGEvjsurrUs2gM1zhY2bjlfPed7YnL/Qko3TxyfkRdDP5JCtDttVYJrUqI/PzM0Bd/AwZuWskVNmmFAAAAAElFTkSuQmCC); }');
GM_addStyle('span.jira-issue.jira-issue-type-F { color: ' + GM_getValue('jira_link_color_f', defaults.jira_link_color_f) + '; }');
GM_addStyle('span.jira-issue.jira-issue-type-B { color: ' + GM_getValue('jira_link_color_b', defaults.jira_link_color_b) + '; }');
GM_addStyle('span.jira-issue.jira-issue-type-H { color: ' + GM_getValue('jira_link_color_h', defaults.jira_link_color_h) + '; }');
GM_addStyle('span.jira-issue.jira-issue-type-none { color: ' + GM_getValue('jira_link_color_none', defaults.jira_link_color_none) + '; }');


// because of some sort of bug, getURI() should be used.
var jiraURI = GM_getValue('jira_link_url');
function getURI() {
    return jiraURI || GM_getValue('jira_link_url');
}

function gmMain() {
    findAndReplace(/(?:([FBH])(?:_|\-))?(([A-Z]+)\-([0-9]+))/g, function (match, type, jiraIssue, project, id) {
        if (projectList.indexOf(project.toLowerCase()) === -1) {
            return match;
        }
        var classes = 'jira-issue ' + ((!!type) ? 'jira-issue-type-' + type : 'jira-issue-type-none');

        return '<a class="' + classes + '" href="https://' + getURI() + '/browse/' + jiraIssue + '" target="_blank"></a>' +
            '<span class="' + classes + '">' + match + '</span>';
    });
}
