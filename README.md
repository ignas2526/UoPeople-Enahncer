UoP Enhancer
==============
UoP Enhancer is a script written in JavaScript with a purpose to enhance student's experience while using the University of The people's Moodle. The script relies on the extension Greasemonkey (or Tampermonkey in the Chrome browser) to embed it into the Moodle. Once installed, a small menu will appear in the top-right corner from which some of the script's features can be accessed and configured.

Features
--------------
**One Click Login** By clicking on the "Log me in" in the menu, you can Log back into the Moodle with one click. The script not only performs login in the background, but also patches the sesskey on the current page. This allows you to submit current form without getting invalid sesskey error.

**Inactivity Warning** If you stay on the Moodle page for more than 2 hours, a warning will appear if you click anywhere on the page informing you that you might have been logged out automatically. If you left any form, for example learning journal or forum reply for more than two hours, when submitting it, you will loose all your work. After getting this warning and clicking on "Log me in" in the menu, you should be able to submit your work without risking to loose it. Alternatively, you can copy your work somewhere, and login manually.

**Grammarly** You can access Grammarly window anywhere on the Moodle by clicking on "Grammarly" in the UoP Enhancer menu. Here, you can paste the text and check it for plagiarism and grammatical issues using grammarly.com API.

**Events** Events were designed as an alternative way to manage your time. Here, you will find how much time is left till a particular event, for example, how many days and hours is left till the course week ends. Currently, following events are included: beginnings and endings of each week and start and end of the course exam. There are plans to add more events.

**Student Data** Consists of your data as well as some information about the courses you're enrolled into. Can be found by clicking on the "Settings" in the UoP Enhancer menu and then on the "Student Data". The data presented here can be useful to quickly find out who is your instructor in each course and to quickly contact that instructor. After gathering the data, you can contact your instructor from any Moodle page in 3 clicks!
The data gathering involves visiting a bunch of Moodle pages on your behalf to figure out the courses you're enrolled into and who is your instructor in each course. This process can take some time and it is recommended that you click on "Gather Student Data" only once during the term or when the courses you're enrolled into change. After data was gathered, it will be saved in your browser. When Student Data is present, will show your courses in the menu for quick access.

**Cosmetic Fixes** UoP Enhancer also performs some cosmetic changes on the main course page.
 - Removes big logo at the top
 - Orders weeks in reverse order so that current week is at the top of the page
 - Embeds last two weeks forums into the course page under the "Discussion Forum Unit X"
