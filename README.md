# Tasks to Paradise

## Overview

It's a task manager with a system of penalties and rewards. The task manager is thought to be complex and modular in order to let the user create a perfect environment for him to stay disciplined **even** if doesn't have any motiavtion at any given time. 

The core principle behind this application's design is to motivate the user's actions by fear and pleasure rather than by letting him rely on his own motivation, which is by nature fluctuent. The thought process is the good ol' stick and carrot, with the user being the one setting for himself his own tasks, sticks, and carrots (writing about this, having another person controling your tasks to paradise sounds like... an interesting idea).

We know from psychological study that indivuals balance the rewards of completing a project and the cost of doing it. When they are about to work on the project, the perceived cost is too high compared to the thoughts of the reward and we often prefer to do something else very easy to do and that provides instant gratification (but instant gratification is not useful nor fulfilling at all). However, there are times when the perceived rewards of completing a project outscale the cost of doing it. Those times are when we are in our bed at night before sleeping, or in the shower. We are full of motivation because the perceived cost is extremly low (as we are not about to undertake any tasks), and we can only think about the potential rewards of doing these actions.

This app uses this bias to make us productive. By setting all of our tasks at night before going to sleep (when the perceived cost is at its lowest), we will be forced the next days to achieve those, or we will get penalized. As long as the user stay commited to the app, and don't cheat his way by marking penalties as completed when they weren't, any planning of big project at night will backfire on us if we don't truly achieve them (hence forcing us to work).

Driving you by the fear of penalties and the sweetness of rewards, your tasks shall lead you to your paradise.



## Tasks and tasks type

### Tasks and parameters

Tasks are composed of a title, a detailed content (optional), an expiration date, a difficulty of completing the task (very easy - no star, easy - 1 Star, medium - 2 star, difficult - 3 star) and an importance, how much is it important to achieve this task? (not important, important, very important).

You can complete each task with 4 level of completion. 'Went through the motion' (meaning you just performed the task but didn't put any effort, or wasn't efficient), 'Average', 'Good', 'Perfect'

If you complete the task, you will earn reward points according to the difficulty of the task mulitply by a percentage depending of your level of completion. 

These values can be further customized in the settings section.

Example : 

If you complete a medium task. It earns you 6 reward points by default. Then you multiply it by the completion rate. If you did 'good', you mutliply by 1, so you get 6 points. The rate of 'Perfect' is 1.5, 'average' 0.8 and 'went through the motion' is 0.25 by default. 

Similarly, the importance of a task measures how much of penalty points you will get if you fail to achieve the task before it expires. There are no multipliers, so if you fail to complete a very important task, by default you take 20 points of penalty points, which is equivalent to 2 of your levels of penalties unlcoked the next day. 

You can set also a penalty induced for a task, which means that if you fail to perform the task, it will create an active penalty in the section 'do it or it doubles the next day' which would have the content of the text you have entered in the section of the penalty induced.

Example : I add a task 'cleaning the shower' with the penalty induced 'cleaning the whole house'. If I fail to complete the first one before it expires, I get the next day 'cleaning the whole house' as an active penalty (which means if I don't do it before the next day, I will have 2 cleaning the whole house to do the next day).

### type of tasks 

There are 4 types of tasks : 

Daily (purple) : it comes back everyday. You have to complete during the day . It doesn't have an expiration date. If you don't want it anymore just delete it. 

Habits (light blue) : comes back every 'frequency of coming back', and to be completed under a 'time to completion'. You first set a date of expiration, and even if you complete it before this time, it will come back at the date of the date of expiration + $(the frequency of coming back) days. The new date of expiration will be then this date of coming back + $(time of completion) days. 

Once (dark blue) : Have an expiration date, don't come back after. You have to complete it before the expiration date. 

Prohibited (red): A special type of tasks, not displayed in the same section as other tasks. This task contains no expiration date, or difficulty points. Only a title, an importance, and if needed a penalty induced. It's purpose is to forbid to do certain actions. Example, I don't want to spend more than 20 minutes of twitter by day. I create a prohibited task named 'Spending 20 minutes of twitter per day'. Then if I do spend this much time on twitter, I will mark this task as done, which will result in penalty points, and the task will not disappear. So you can click on it as much as you want, it will just generates penalty points. 

Disclaimer : The system of the 'prohibited' task is not the same as other tasks, and rely on the honesty of the user. For other tasks, if you do nothing, they will expire and you will get penalty points. They require active cheating (mark them completed even though you didn't) to derive from their purposes. The prohibited task is the reverse way. You need to actively say that you did something wrong (in general we don't like to admit our errors) in order to get penalized. So its efficiency depends of your commitment and sincerity to tasks of paradise.


## Penalties & penalty points

Penalties are separated in 3 categories, daily, weekly and monthly. They also have a place, in each category, with the first penalty being the one that is the softest, and the last being the hardest. It's up to the user to configure its penalties. 

Those kind of penalties are only passive and don't reuiqre you to do anything. 

Penalties can become active. An active penalty is a penalty that you will see on your dashboard in the section 'do it or it doubles the next day'. As the section names it, if you don't do your active penalty in a day (like taking a cold shower), you get 2 cold showers to do the next day etc. 

Penalties are unlocked/activated by penalty points (ppoints). When you fail to complete a task, or when you do a prohibited task, you earn ppoints. These ppoints are then added to daily ppoints, weekly ppoints, and monthly ppoints which resets on a daily/weekly/monthly basis. 

For now, only daily ppoints are doing something (new features coming soon). At the end of each day, you daily ppoints resets, but you get (daily ppoints)//10 of your daily penalties being activated. So if you gathered daily 44 ppoints, you get the 4 first daily penalties activated in the list for the next day. 



## Rewards

Rewards are the same principle as penalties except that you don't have daily rewards, and the system for the weekly and monthly rewards isn't defined yet, as for the weekly and monthly penalties.

## Pause mode and Settings

If you are a bit overwhelmed by all of your active penalties and the task to paradise app, you can set the pause mode on in the Settings menu. When the pause mode is on, there are no more active penalties unlocked, nor rewards unlocked, nor reset of your ppoints or rpoints. Tasks that expired arent' either cleaned up etc. Your whole account is set to pause. Once you are ready to come back you can unpause and everything (in theory) should resume/

## Projects 

Coming soon. Will be huge.



**By fyhr.**