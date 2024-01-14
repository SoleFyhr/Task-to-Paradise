import json_manager as js
import json
import tasks as ta
import penalty as pen
import reward as rew
import enum_list as enum
import datetime

#Function to run everytime someone connects
def daily_routine():

    if check_if_new_day('fyhr'):

        users = js.read_usernames_from_file('users.txt')

        for user in users:
            if(js.retrieve_pause_field(user)=="no"):
                check_if_penalty_completed(user) #If we are a new day, if there are any penalties in 'active', we double them
                check_tasks_expiration(user) #Remove expired tasks, add penalties to ppoints
                update_penalties_unlocking(user,enum.TimeEnum.DAILY) #Given points in the ppoints,activate penalties from the precedent day

                pen.reset_total_value(user,enum.TimeEnum.DAILY) #Reset daily ppoint counter, for new day
                rew.reset_total_value(user,enum.TimeEnum.DAILY) #Reset daily rpoint counter, for new day

                today = datetime.datetime.now().date()
                if today.weekday() == 0: #It's Monday
                    update_penalties_unlocking(user,enum.TimeEnum.WEEKLY)
                    pen.reset_total_value(user,enum.TimeEnum.WEEKLY)
                    update_reward_unlocking(user,enum.TimeEnum.WEEKLY)
                    rew.reset_total_value(user,enum.TimeEnum.WEEKLY) 
        

                if today.day == 1: # It's the first day of the month
                    update_penalties_unlocking(user,enum.TimeEnum.MONTHLY) 
                    pen.reset_total_value(user,enum.TimeEnum.MONTHLY) 
                    update_reward_unlocking(user,enum.TimeEnum.MONTHLY)
                    rew.reset_total_value(user,enum.TimeEnum.MONTHLY) 
        


#Iterate over tasks and manage if they expired
def check_tasks_expiration(user):    
    # Get the current date
    current_date = datetime.datetime.now().date()
    tasks_to_move = []
    total_penalty = 0

    tasks = js.get_all_things(js.JSONCategory.TASK,user)
    # Iterate over the tasks
    for task in tasks:
        expiration_date = datetime.datetime.strptime(task["expiration_time"], '%Y-%m-%d').date()
       
        if current_date > expiration_date:
            task2 = json.dumps(task)
            tasks_to_move.append(ta.Task.from_json(task2))  
            try: 
                value = int(task["importance"])
                total_penalty += value
            except ValueError as e:
                print("error Invalid input. Sequence values must be integers.")

    if(len(tasks_to_move)>0):
        js.move_task_to_historic(js.user,tasks_to_move)
        pen.add_penalty_to_all(total_penalty,user)


def check_if_penalty_completed(user):
    pen.double_penalty(user)

#Activate as much penalty from the daily etc categories than the points
#unlocking is 10points =1rst penalty /20 points = second /30/40...
def update_penalties_unlocking(user,time):
    number_penalties = js.get_value(js.JSONCategory.PPOINTS,time,user)
    number_iteration = int(number_penalties)//10
    pen.activate_penalty(user,time,number_iteration)


def update_reward_unlocking(user,time):
    number_reward = js.get_value(js.JSONCategory.RPOINTS,time,user)
    number_iteration = int(number_reward)//10
    rew.activate_reward(user,time,number_iteration)


def check_if_new_day(user): 
    date = js.get_all_things(js.JSONCategory.DATE,user) 
    current_date = datetime.datetime.now().date().strftime('%Y-%m-%d')

    if date != current_date:
        js.change_date(user,current_date)
        return True
    return False
        

def task_completed(user, title,completion):
    task = js.get_thing_by_title(user,title,js.JSONCategory.TASK)
    difficulty = enum.Difficulty.from_string(ta.Task.from_json(task).difficulty)

    value_completion = enum.Completion.value_completion(completion)
    value_of_task = js.retrieve_value_in_scaling('fyhr',enum.Scaling_Cat.DIFFICULTY,list(enum.Difficulty).index(difficulty))
    rew.add_reward_to_all(value_completion*value_of_task,user)
    js.move_task_to_historic(user,ta.Task.from_json(task))
    update_reward_unlocking(user,enum.TimeEnum.DAILY) #Choice of doing it only daily. If you do a hard task during your day, I want it to be rewarded. As for the week or the month, I prefer to have it done at the end of the week or end of the month.
    

def penalty_task_done(user,title):
    task = ta.Task.from_json(js.get_thing_by_title(user,title,js.JSONCategory.TASK))
    try:
        importance_value = int(task.importance)
    except ValueError as e:
                print("error Invalid input. Sequence values must be integers.")

    pen.add_penalty_to_all(importance_value,user)
    #We let the task in pending    

def user_process(user):
    #Check if the user doesn't exist
    if(user in js.read_usernames_from_file('users.txt')):
        print("okay")
        #go dailyroutine from there
    else:
       js.create_json_from_template(user+'.json') 
       js.add_user_to_user_file('users.txt',user)
       check_if_new_day(user)#update the date in the json file created


daily_routine()

#ta.create_new_task("Sampe Task","test task", enum.TaskType.ONCE,"2023-12-20",enum.Difficulty.MEDIUM,enum.Importance.NSIMPORTANT)