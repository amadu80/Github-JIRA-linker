Github JIRA Linker
==================

A simple user script that links JIRA issue numbers to JIRA. It must be in the format of: [issue-type]-[jira-issue]  
Where:
 * [issue-type] can be F, B, or H
   * F: Feature
   * B: Bug fix
   * H: Hot fix
 * [jira-issue] is in the format of: [project-key]-[issue-number]

The following is a valid issue type:
 * B-PROJ-123
 * PROJ-123

Only issues with a type will be appropriately highlighted.


Install
=======

For Firefox use either [Scriptish](https://addons.mozilla.org/en-US/firefox/addon/scriptish/) (preferred) or [Greasemonkey](https://addons.mozilla.org/en-US/firefox/addon/greasemonkey/). For Chrome use [Tampermonkey](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo?hl=en).

Then just install [this file](https://github.com/hoshsadiq/Github-JIRA-linker/blob/master/github-jira-linker.user.js).

Then go to settings and change the settings at the bottom of the page.
