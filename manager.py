import database_manager as js
import tasks as ta
import user as us
import penalty as pen
import reward as rew
import enum_list as enum
import datetime
import sys


#Function to run everytime someone connects
def daily_routine():

    if check_if_new_day(1): #hard coded because I am the user that will always be there

        users = js.read_usernames_from_file('users.txt')
        for i in range(len(users)):
            users[i] = us.get_user_id_from_username(users[i])
        for user in users:
            if(js.retrieve_pause_field(user)=="no"):
                current_date = datetime.datetime.now().date()
                js.change_date(user,current_date)

                check_if_penalty_completed(user) #If we are a new day, if there are any penalties in 'active', we double them
                check_tasks_expiration(user) #Remove expired tasks, add penalties to ppoints
                update_penalties_unlocking(user,enum.TimeEnum.DAILY) #Given points in the ppoints,activate penalties from the precedent day

                pen.reset_total_value(user,enum.TimeEnum.DAILY) #Reset daily ppoint counter, for new day
                rew.reset_total_value(user,enum.TimeEnum.DAILY) #Reset daily rpoint counter, for new day
                manage_historic(user) #if daily not done, let in daily but add penalty points, if daily in histroic put back, if habits not done, add penalty points and extend their time expiration by their time of completion, if habits in historic, move back when we reach the good date and change the date of expiration.

                #TODO Create a good balance based on the rate of completion, of prohibited, of tasks failed. See what said Chatos
                # today = datetime.datetime.now().date()
                # if today.weekday() == 0: #It's Monday
                #     update_penalties_unlocking(user,enum.TimeEnum.WEEKLY)
                #     pen.reset_total_value(user,enum.TimeEnum.WEEKLY)
                #     update_reward_unlocking(user,enum.TimeEnum.WEEKLY)
                #     rew.reset_total_value(user,enum.TimeEnum.WEEKLY) 
        

                # if today.day == 1: # It's the first day of the month
                #     update_penalties_unlocking(user,enum.TimeEnum.MONTHLY) 
                #     pen.reset_total_value(user,enum.TimeEnum.MONTHLY) 
                #     update_reward_unlocking(user,enum.TimeEnum.MONTHLY)
                #     rew.reset_total_value(user,enum.TimeEnum.MONTHLY) 
        

#Iterate over tasks and manage if they expired
def check_tasks_expiration(user):    
    current_date = datetime.datetime.now().date()
    tasks_to_move = []
    total_penalty = 0

    once, daily, habits,_ = js.get_all_tasks_by_type(user)
    for task in daily: #If there is any task in daily, it means they weren't completed on the day so -> failed
        value = int(task["importance"])
        total_penalty += value
        penalty_induced_manager(task,user)
        js.change_one_field_of_given_task(user,task["id"],"expiration_time",current_date.strftime('%Y-%m-%d'))

    
    list_task = once + habits
    for task in list_task:
        expiration_date = datetime.datetime.strptime(task["expiration_time"], '%Y-%m-%d').date()
       
        if current_date > expiration_date:
            
            penalty_induced_manager(task,user)
            
            if task["task_type"] == "habits":
                try: #TODO a changer pck pour l'instant la tache habits reste tant qu'on l'a pas fait. idéalement ca devrait aller dans l'historique je trouve c'est mieux. Et revenir quand c'est le moment.
                    time_to_completion = int(task["time_to_completion"])
                    new_expiration_date = expiration_date + datetime.timedelta(days=time_to_completion)
                    js.change_one_field_of_given_task(user,task["id"],"expiration_time",new_expiration_date.strftime('%Y-%m-%d'))
                except ValueError as e:
                    print("Error: Invalid 'time_to_completion'. It must be an integer")

            else: 
                
                tasks_to_move.append(task["id"])  
            try: 
                value = int(task["importance"])
                total_penalty += value
            except ValueError as e:
                print("error Invalid input. Sequence values must be integers.")
    
    

    if(len(tasks_to_move)>0):
        js.move_task_to_historic(user,tasks_to_move)

    pen.add_penalty_to_all(total_penalty,user)


def check_if_penalty_completed(user):
    pen.double_penalty(user)


def penalty_induced_manager(task,user):

    penalty_induced = task["penalty_induced"]

    #The field penalty induced contains either "false" or the content of the penalty
    if(penalty_induced != "false"):
        pen.create_new_penalty(user,penalty_induced,enum.Active.ACTIVE,0)


#Activate as much penalty from the daily etc categories than the points
#unlocking is 10points =1rst penalty /20 points = second /30/40...
def update_penalties_unlocking(user,time):
    number_penalties = js.get_value(user,js.JSONCategory.PPOINTS,time)
    number_iteration = int(number_penalties)//10
    pen.activate_penalty(user,time,number_iteration)


def update_reward_unlocking(user,time):
    number_reward = js.get_value(user,js.JSONCategory.RPOINTS,time)
    number_iteration = int(number_reward)//10
    rew.activate_reward(user,time,number_iteration)


def check_if_new_day(user): 
    date = js.retrieve_date_field(user) 
    current_date = datetime.datetime.now().date()

    if date != current_date:
        js.change_date(user,current_date)
        return True
    return False


def task_completed(user, id,completion):
    task = js.get_thing_by_id(user,id)
    difficulty = enum.Difficulty.from_string(task[0]['difficulty'])
    completion_scaling = ta.get_completion_values(user)
    
    value_completion = enum.Completion.value_completion(completion,completion_scaling)
    value_of_task = js.retrieve_value_in_scaling(user,enum.Scaling_Cat.DIFFICULTY,list(enum.Difficulty).index(difficulty))
    rew.add_reward_to_all(value_completion*value_of_task,user)
    
    # if(task.task_type==enum.TaskType.HABITS.value): Commented because then the counter starts when i do the task. like if I want a task every week, and i do it the wednesday it will come back next wednesday
    
    #     current_date = datetime.datetime.now().date()
    #     js.change_one_field_of_given_task(user,enum.TaskType.HABITS,task.id,"expiration_time",current_date.strftime('%Y-%m-%d'))

    js.move_task_to_historic(user,task[0]['id'])
    update_reward_unlocking(user,enum.TimeEnum.DAILY) #Choice of doing it only daily. If you do a hard task during your day, I want it to be rewarded. As for the week or the month, I prefer to have it done at the end of the week or end of the month.
    

def penalty_task_done(user,id):
    task = js.get_thing_by_id(user,id)
    try:
        importance_value = int(task[0]['importance'])
    except ValueError as e:
                print("error Invalid input. Sequence values must be integers.")

    pen.add_penalty_to_all(importance_value,user)


def manage_historic(user):
    js.clean_historic(user)

def user_process(user):
    #Check if the user doesn't exist
    if(user in js.read_usernames_from_file('users.txt')):
        print("user found")
        #go dailyroutine from there
    else:
       #js.create_json_from_template('./json/'+user+'.json') 
       js.add_user_to_user_file('users.txt',user)
       check_if_new_day(user)#update the date in the json file created

#daily_routine()
#user_process('aotrix')
#ta.create_new_task("Sampe Task","test task", enum.TaskType.ONCE,"2023-12-20",enum.Difficulty.MEDIUM,enum.Importance.NSIMPORTANT)
    
if __name__ == '__main__':
    if len(sys.argv) > 1:  # Check if any command line arguments were provided
        command = sys.argv[1]  # sys.argv[0] is the script name, so we take the next argument
        if command == 'daily':
            daily_routine()
        else:
            print(f'Command {command} not recognized.')
    else:
        print('No command provided.')