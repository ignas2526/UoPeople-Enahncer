# UoP-Enahncer

UoP Enhancer
==============
UoP Enahncer is script written in JavaScript with a purpose to enhance student's experience while using the University of The people's Moodle. The script relies on the extension Greasemonkey (or Tampermonkey in the Chrome browser) to be added to the Moodle. Once intalled, a small menu will appear in the top-right corner from which some of the script's features can be accessed and confugred.

Features
--------------
**One Click Login** By clicking on the "Log me in" in the menu, you can Log back into the Moodle and continue your work. The script not only performs login in the background, but also patches sesskey on the current page which allows you to submit any current form without getting invalid sesskey error.

**Inactivity Warning** If you stay on the Moodle page for more than 2 hours, a warning will appear if you click anywhere on the page informing you that you might have been logged out automtically. If you left any form, for example learning journal, forum reply, pm, for more than two hours, when submitting it, you will loose all your work. After getting this warning and clicking on "Log me in", you should be able to submit your work without a risk of loosing it. Alternatively, you can copy your work somewhere, and login manually.

**Grammarly** You can access Grammarly window anywhere on the Moodle by clicking on "Grammarly" in the UoP Enhancer menu. Here, you can paste the text and check it for plagiarism and gramatical isssues using grammarly.com API.

**Events** Events were designed as an alternative way to manage your time. Here, you will find how much time is left till a particlar event, e.g. how many days and hours is left till the week ends. Currently, followig events are included: beginnings and endings of each week, start and end of the course exam. There are plans to add more events.

**Student Data** Consists of your data as well as some information about the courses you're enrolled into. Can be found by clicking on the "Settings" in the UoP Enhancher menu and then on the "Stuent Data". The data presented there can be useful to quickly find out who is your intructor in each course and to quickly contact that instructor. After gathering the data, you can contact your instructor from any Moodle page in 3 clicks!
The data gathering invovles visiting a bunch of Moodle pages on your behalf to figure out the courses you're enrolled into and who is your instructor in each course. This process can take some time and it is recommended that you click on "Gather Student Data" only once during a term or when the courses you're enrolled into change. After data was gathered, it will be saved in your browser. When Student Data is present, will show your courses in the menu for quick access.

**Cosmetic Fixes** The script also does some comsmetic changes on the main course page.
 - Removes big logo at the top
 - Orders weeks in reverse order so that current week is at the top of the page
 - Embeds last two weeks forums into the course page under the "Discussion Forum Unit X"
