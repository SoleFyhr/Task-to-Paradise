import json
from enum import Enum
import enum_list as enu
import datetime


json_path = "./json/"
file_ext = ".json"

#----------------- ENUM --------------------------

class JSONCategory(Enum):
    TASK = "tasks"
    PROJECT = "projects"
    PENALTY = "penalty"
    REWARD = "reward"
    HISTORIC = "historic"

    PPOINTS = "penalty_points"
    RPOINTS = "reward_points"
    DATE ="last_date"

#----------------- GENERAL --------------------------

def init_check_procedure(user_id):
    # Read the existing data from the file
    try:
        with open(json_path+user_id +file_ext, 'r') as file:
            data = json.load(file)
            
    except FileNotFoundError:
        print("File not found.")
        return
    
    return data

def get_all_things(category,user_id):
    data = init_check_procedure(user_id)
    if data is None:
        raise ValueError("Initial check failed or no data found for user.")
    return data[category.value]

#----------------- TASKS --------------------------

def add_task_to_json(user_id, new_task_json, category,type):
    data = init_check_procedure(user_id)
    if data is None:
        raise ValueError("Initial check failed or no data found for user.")
    
    new_task = json.loads(new_task_json)
    if(type == enu.TaskType.ONCE or type == enu.TaskType.HABITS): #Order the task in the list
        new_task_expiration = datetime.datetime.strptime(new_task['expiration_time'], "%Y-%m-%d")
        size_list = len(data[category.value][type.value])
        if(size_list==0):
            data[category.value][type.value].append(new_task)
        else:
            for index, task in enumerate(data[category.value][type.value]):
                task_expiration = datetime.datetime.strptime(task['expiration_time'], "%Y-%m-%d")
                if new_task_expiration < task_expiration:
                    data[category.value][type.value].insert(index, new_task)
                    break
                if(index == size_list-1):
                    data[category.value][type.value].insert(index +1, new_task)

    
   
    else:     
        new_task['expiration_time']=""

        data[category.value][type.value].append(new_task) #daily and prohibited don't care about order

    with open(json_path + user_id +file_ext, 'w') as file:
        json.dump(data, file, indent=4)

def get_all_tasks_by_type(user_id):
    data = init_check_procedure(user_id)
    if data is None:
        raise ValueError("Initial check failed or no data found for user.")
    
    tasks = data[JSONCategory.TASK.value]
    daily = tasks[enu.TaskType.DAILY.value]
    habits = tasks[enu.TaskType.HABITS.value]
    once = tasks[enu.TaskType.ONCE.value]
    prohibited = tasks[enu.TaskType.PROHIBITED.value]

    return once, daily, habits, prohibited


def get_all_tasks_by_type_with_historic(user_id):
    data = init_check_procedure(user_id)
    if data is None:
        raise ValueError("Initial check failed or no data found for user.")
    
    tasks = data[JSONCategory.TASK.value]
    daily = tasks[enu.TaskType.DAILY.value]
    habits = tasks[enu.TaskType.HABITS.value]
    once = tasks[enu.TaskType.ONCE.value]
    prohibited = tasks[enu.TaskType.PROHIBITED.value]
    historic = data[JSONCategory.HISTORIC.value]
    for task in historic:
        if task["task_type"]==enu.TaskType.DAILY.value:
            daily.append(task)
        elif task["task_type"]==enu.TaskType.HABITS.value:
            habits.append(task)
    return once, daily, habits, prohibited

def delete_task_by_id(user_id, id):
    data = init_check_procedure(user_id)
    if data is None:
        raise ValueError("Initial check failed or no data found for user.")
    once, daily, habits, prohibited = get_all_tasks_by_type(user_id)
    historic = data[JSONCategory.HISTORIC.value]
    task_found = False
    task_types = [("once", once), ("daily", daily), ("habits", habits), ("prohibited", prohibited),("historic",historic)]
    for task_type, task_list in task_types:
        for task in task_list:
            if task["id"] == id:
                task_list.remove(task)  # Remove the task from the list
                task_found = True
                break

        if task_found:
            break

    if not task_found:
        print("Task not found.")
        return False

    data["tasks"]["once"] = once
    data["tasks"]["daily"] = daily
    data["tasks"]["habits"] = habits
    data["tasks"]["prohibited"] = prohibited
    data[JSONCategory.HISTORIC.value] = historic

    with open(json_path + user_id + file_ext, 'w') as file:
        json.dump(data, file, indent=4)

    print("Task deleted successfully.")

def change_one_field_of_given_task(user, type_task, id, parameter, new_value):
    data = init_check_procedure(user)
    if data is None:
        raise ValueError("Initial check failed or no data found for user.")

    for task in data[JSONCategory.TASK.value][type_task.value]:
        if task["id"] == id:
            task[parameter]=new_value
            break

    with open(json_path + user + file_ext, 'w') as file:
        json.dump(data, file, indent=4)


def get_thing_by_id(user_id, id):
    
    data = init_check_procedure(user_id)
    if data is None:
        raise ValueError("Initial check failed or no data found for user.")
    
    once, daily, habits, prohibited = get_all_tasks_by_type(user_id)
    task_types = [("once", once), ("daily", daily), ("habits", habits), ("prohibited", prohibited)]

    for task_type, task_list in task_types:
        for task in task_list:
            if task["id"] == id:
                
                obj_json = json.dumps(task)
                return obj_json

        


    print("Task not found.")
    return False


def move_task_to_historic(user_id, tasks_to_move):
    data = init_check_procedure(user_id)
    if data is None:
        raise ValueError("Initial check failed or no data found for user.")

    # Ensure tasks_to_move is a list
    if not isinstance(tasks_to_move, list):
        tasks_to_move = [tasks_to_move]

    # Create a set of IDs for the tasks to move
    tasks_to_move_id = {task.id for task in tasks_to_move}

    # Iterate over each task category and update tasks
    for category in data["tasks"]:
        # Filter out tasks that need to be moved to 'historic'
        tasks_remaining = [task for task in data["tasks"][category] if task['id'] not in tasks_to_move_id]
        tasks_moved = [task for task in data["tasks"][category] if task['id'] in tasks_to_move_id and task['task_type'] != enu.TaskType.ONCE.value]

        # Update the tasks in the current category
        data["tasks"][category] = tasks_remaining

        # Add the moved tasks to the 'historic' category
        data["historic"].extend(tasks_moved)

    # Save the updated data to the file
    with open(json_path + user_id + file_ext, 'w') as file:
        json.dump(data, file, indent=4)


def clean_historic(user):
    data = init_check_procedure(user)
    if data is None:
        raise ValueError("Initial check failed or no data found for user.")
    historic = data[JSONCategory.HISTORIC.value]
    tasks_to_remove=[]
    for task in historic :
        if task["task_type"] == enu.TaskType.DAILY.value:
            data[JSONCategory.TASK.value][enu.TaskType.DAILY.value].append(task)
            tasks_to_remove.append(task)
        
        elif task["task_type"] == enu.TaskType.HABITS.value:
            current_date = datetime.datetime.now().date()
            expiration_date = datetime.datetime.strptime(task["expiration_time"], '%Y-%m-%d').date()
            frequency_coming_back = int(task["frequency_coming_back"])
            new_expiration_date = expiration_date + datetime.timedelta(days=frequency_coming_back)
            
            if current_date == new_expiration_date:
                time_to_completion = int(task["time_to_completion"])
                new_expiration_date = current_date + datetime.timedelta(days=time_to_completion)
                task["expiration_time"] = new_expiration_date.strftime('%Y-%m-%d')               
                data[JSONCategory.TASK.value][enu.TaskType.HABITS.value].append(task)
                tasks_to_remove.append(task)
                
    
    for tasks in tasks_to_remove:
        data[JSONCategory.HISTORIC.value].remove(tasks)

    with open(json_path + user + file_ext, 'w') as file:
        json.dump(data, file, indent=4)



#-----------------  REWARD STEPS  --------------------------



def get_reward_unlocking_steps(user):
    data = init_check_procedure(user)
    if data is None:
        raise ValueError("Initial check failed or no data found for user.")    
    return data['reward_unlocking_steps']

def change_reward_unlocking_steps(user,value):
    data = init_check_procedure(user)
    if data is None:
        raise ValueError("Initial check failed or no data found for user.")    
    
    data['reward_unlocking_steps'] = value
    with open(json_path + user +file_ext, 'w') as file:
        json.dump(data, file, indent=4)

#----------------- PENALTY & REWARD  --------------------------

def add_penalty_reward_to_json(user_id, penalty_json,category,type,place):
    data = init_check_procedure( user_id)
    if data is None:
        raise ValueError("Initial check failed or no data found for user.")
    data[category.value][type.value].insert(int(place)-1,json.loads(penalty_json))

    with open(json_path + user_id +file_ext, 'w') as file:
        json.dump(data, file, indent=4)


def is_there_this_penalty_or_reward_in_active(user,id_target,category):
    data = init_check_procedure(user)
    if data is None:
        raise ValueError("Initial check failed or no data found for user.")

    for thing in data[category.value]['active']:
        if thing["id"] == id_target:
            return True
    return False

def penalty_reward_iterate(user, category,time, num_iterations):
    
    data = init_check_procedure(user)
    if data is None:
        raise ValueError("Initial check failed or no data found for user.")

    lists = data[category.value][time.value]
    list_range = list(range(0, num_iterations))

    if(category==JSONCategory.REWARD): #If reward, we check how many we unlocked today.
        value_to_start = get_reward_unlocking_steps(user)//10 #if 20, we unlcoked 2 steps, so 2
        list_range = list(range(value_to_start, num_iterations))#0,1 are excluded, since we took 20
        change_reward_unlocking_steps(user,(num_iterations)*10)
    contents = []

    for i in list_range:
        if i < len(lists):
        #if not is_there_this_penalty_or_reward_in_active(user,lists[i]["id"],category):
        #Vu qu'on fait que une fois par jour le unlocking de penalty, pas besoin de check si on a deja unlock le seuil de 10 points etc.
            contents.append(lists[i]["content"])
        else:
            break

    return contents



def remove_penalty_reward_in_active(user,id,category):
    data = init_check_procedure(user)
    if data is None:
        raise ValueError("Initial check failed or no data found for user.")
    
    new_active_list = [item for item in data[JSONCategory.PENALTY.value]["active"] if item["id"] != id]

    # Update the data
    data[category.value]["active"] = new_active_list


    with open(json_path + user +file_ext, 'w') as file:
        json.dump(data, file, indent=4)

#Only for penalty
def double_penalty_in_activate(user):
    data = init_check_procedure(user)
    if data is None:
        raise ValueError("Initial check failed or no data found for user.")
    
    new_active_list = [] 
    if bool(data[JSONCategory.PENALTY.value]['active']): #Double penlaties only if there is anything in active
        for things in data[JSONCategory.PENALTY.value]['active']:
            # Duplicate the entire dictionary, not just the content string
            duplicated_things = things.copy()
            duplicated_things["id"] = things["id"]#TODO with id, create a new penalty
            new_active_list.append(duplicated_things)
            new_active_list.append(duplicated_things.copy())  # Duplicate it again

    data[JSONCategory.PENALTY.value]['active'] = new_active_list
    with open(json_path + user + file_ext, 'w') as file:
        json.dump(data, file, indent=4)


def delete_penalty_reward_by_id(user_id, id,category,type):
    
    data = init_check_procedure(user_id)
    if data is None:
        raise ValueError("Initial check failed or no data found for user.")


    pen_or_rew_to_delete = None
    for pen_or_rew in data[category.value][type.value]:
        if pen_or_rew["id"] == id:
            pen_or_rew_to_delete = pen_or_rew
            break

    if pen_or_rew_to_delete is None:
        print("Pen or Rew not found.")
        return False

    data[category.value][type.value].remove(pen_or_rew_to_delete)

    # Write the updated data back to the file
    with open(json_path + user_id +file_ext,'w') as file:
        json.dump(data, file, indent=4)

    print("Pen or Rew deleted successfully.")

def get_active(category,active_category,user_id):
    data = init_check_procedure(user_id)
    if data is None:
        raise ValueError("Initial check failed or no data found for user.")    
    return data[category.value][active_category.value]

#----------------- PPOINTS - RPOINTS --------------------------



def change_value(value, category, time_period,user_id):
    data = init_check_procedure(user_id)
    if data is None:
        raise ValueError("Initial check failed or no data found for user.")    
    data[category.value][time_period.value] = value

    with open(json_path + user_id +file_ext, 'w') as file:
        json.dump(data, file, indent=4)

def get_value(category, time_period,user_id):
    data = init_check_procedure(user_id)
    if data is None:
        raise ValueError("Initial check failed or no data found for user.")    
    return data[category.value][time_period.value]

def get_points_category(category,user_id):
    data = init_check_procedure(user_id)
    if data is None:
        raise ValueError("Initial check failed or no data found for user.")    
    return data[category.value]


  


#----------------- SCALING --------------------------

#A task completed, will earn X points if it's easy, X points if meidum... x level of completion
#A task failed, will penalize X points if it's not so important, X points if it's important...


def add_sequence_to_scaling(user, sequence,category):

    data = init_check_procedure(user)
    if data is None:
        raise ValueError("Initial check failed or no data found for user.")
    

    # Add the 'penalty' field with the sequence
    data["scaling"][category.value] = sequence

    with open(json_path + user +file_ext, 'w') as file:
        json.dump(data, file, indent=4)


def retrieve_value_in_scaling(user, category,number):
    data = init_check_procedure(user)
    if data is None:
        raise ValueError("Initial check failed or no data found for user.")
    
    return int(data["scaling"][category.value][number])

def retrieve_scaling(user, category):
    data = init_check_procedure(user)
    if data is None:
        raise ValueError("Initial check failed or no data found for user.")
    
    return data["scaling"][category.value]



#----------------- PAUSE --------------------------


def retrieve_pause_field(user):
    data = init_check_procedure(user)
    if data is None:
        raise ValueError("Initial check failed or no data found for user.")
    
    return data["pause"]

def change_pause(user):

    data = init_check_procedure(user)
    if data is None:
        raise ValueError("Initial check failed or no data found for user.")
    
    pause_value = data["pause"]
    if(pause_value == 'yes'):
        data["pause"]='no'
    else:
        data["pause"]='yes'

    with open(json_path + user +file_ext, 'w') as file:
        json.dump(data, file, indent=4)



#----------------- DATE --------------------------

def change_date(user, date):

    data = init_check_procedure(user)
    if data is None:
        raise ValueError("Initial check failed or no data found for user.")
    
    # Add the 'penalty' field with the sequence
    data["last_date"] = date

    with open(json_path + user +file_ext, 'w') as file:
        json.dump(data, file, indent=4)


#----------------- USERS --------------------------

def create_json_from_template(new_file_path):
    # Read the template JSON file
    with open('template.json', 'r') as template_file:
        template_data = json.load(template_file)

    # Write the data to a new JSON file
    with open(new_file_path, 'w') as new_file:
        json.dump(template_data, new_file, indent=4)


def read_usernames_from_file(file_path):
    with open(file_path, 'r') as file:
        usernames = file.readlines()
    # Stripping newline characters from each username
    usernames = [username.strip() for username in usernames]
    return usernames

def add_user_to_user_file(file_path, new_user):
    with open(file_path, 'a') as file:
        file.write(new_user + '\n')



#----------------- ID --------------------------



#!alert
#//code crossed
#?query
#TODO to do stuff
#*highlited

#After that create basic front end (login,all pages with the info that is needed to see (even if it's ugly))
#Deploy to Hiraku


#get the good user for objects in session and replace everywhere with this.
#Put cookie in the session in order for the user to not be disconnected if he leaves the page open
#advanced front end
#make the front end adaptative for ipad and iphone


#make an anti "I tap multiple times and i get 3* the planified rewards because it was sent 3 times by the js"


#Do projects
#Do achievements
#Add authentification with google or smth not crackable