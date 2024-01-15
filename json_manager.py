import json
from enum import Enum
from datetime import datetime


user='fyhr'

#----------------- ENUM --------------------------

class JSONCategory(Enum):
    TASK = "tasks"
    PROJECT = "projects"
    PENALTY = "penalty"
    REWARD = "reward"
    PPOINTS = "penalty_points"
    RPOINTS = "reward_points"
    DATE ="last_date"

#----------------- GENERAL --------------------------

def init_check_procedure(user_id):
    # Read the existing data from the file
    try:
        with open(user_id +".json", 'r') as file:
            data = json.load(file)
            
    except FileNotFoundError:
        print("File not found.")
        return
    
    return data
def delete_task_by_title(user_id, title):
    
    data = init_check_procedure(user_id)
    if data is None:
        raise ValueError("Initial check failed or no data found for user.")


    task_to_move = None
    for task in data[JSONCategory.TASK.value]:
        if task["title"] == title:
            task_to_move = task
            break

    if task_to_move is None:
        print("Task not found.")
        return False

    data["tasks"].remove(task_to_move)

    # Write the updated data back to the file
    with open(user_id +".json",'w') as file:
        json.dump(data, file, indent=4)

    print("task deleted successfully.")

def get_thing_by_title(user_id, title,category):
    
    data = init_check_procedure(user_id)
    if data is None:
        raise ValueError("Initial check failed or no data found for user.")

    for obj in data[category.value]:
        if obj["title"] == title:
            # Convert the task dictionary to a JSON string
            obj_json = json.dumps(obj)
            # Use the from_json method to create a Task object
            return obj_json

    print("obj not found.")
    return None



def get_all_things(category,user_id):
    data = init_check_procedure(user_id)
    if data is None:
        raise ValueError("Initial check failed or no data found for user.")
    return data[category.value]

#----------------- TASKS --------------------------

def add_task_to_json(user_id, new_task_json, category):
    # Read the existing data from the file
    data = init_check_procedure(user_id)
    # Check if the data is None or empty
    if data is None:
        raise ValueError("Initial check failed or no data found for user.")

    # Parse the new task JSON
    new_task = json.loads(new_task_json)

    # Ensure the new task has an expiration date
    if 'expiration_time' not in new_task or not new_task['expiration_time']:
        raise ValueError("New task must have an expiration time.")

    # Convert expiration time to a datetime object for comparison
    new_task_expiration = datetime.strptime(new_task['expiration_time'], "%Y-%m-%d")

    # Find the correct position to insert the new task
    for index, task in enumerate(data[category.value]):
        task_expiration = datetime.strptime(task['expiration_time'], "%Y-%m-%d")
        if new_task_expiration < task_expiration:
            # Insert the new task before the first task that expires later
            data[category.value].insert(index, new_task)
            break
    else:
        # If all tasks expire earlier, append the new task
        data[category.value].append(new_task)

    with open(user_id +".json", 'w') as file:
        json.dump(data, file, indent=4)


def move_task_to_historic(user_id, tasks_to_move):
    data = init_check_procedure(user_id)
    if data is None:
        raise ValueError("Initial check failed or no data found for user.")

    if type(tasks_to_move) is list:
        tasks_to_move_titles = {task.title for task in tasks_to_move}
    else:
        tasks_to_move_titles = {tasks_to_move.title}
    tasks_remaining = [task for task in data["tasks"] if task['title'] not in tasks_to_move_titles]
    tasks_moved = [task for task in data["tasks"] if task['title'] in tasks_to_move_titles]

    data["tasks"] = tasks_remaining
    data["historic"].extend(tasks_moved)

    with open(user_id + ".json", 'w') as file:
        json.dump(data, file, indent=4)


def get_all_tasks_by_type(user_id):
    data = init_check_procedure(user_id)
    if data is None:
        raise ValueError("Initial check failed or no data found for user.")
    
    tasks = data[JSONCategory.TASK.value]

    tasks_once = []
    tasks_daily = []
    tasks_habits = []
    tasks_prohibited = []

    for task in tasks:
        if task["task_type"] == "once":
            tasks_once.append(task)
        elif task["task_type"] == "daily":
            tasks_daily.append(task)
        elif task["task_type"] == "habits":
            tasks_habits.append(task)
        elif task["task_type"] == "prohibited":
            tasks_prohibited.append(task)

    return tasks_once, tasks_daily, tasks_habits, tasks_prohibited



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
    with open(user +".json", 'w') as file:
        json.dump(data, file, indent=4)

#----------------- PENALTY & REWARD  --------------------------

def add_penalty_reward_to_json(user_id, penalty_json,category,type,place):
    data = init_check_procedure( user_id)
    if data is None:
        raise ValueError("Initial check failed or no data found for user.")
    data[category.value][type.value].insert(int(place)-1,json.loads(penalty_json))

    with open(user_id +".json", 'w') as file:
        json.dump(data, file, indent=4)


def is_there_this_penalty_or_reward_in_active(user,content_target,category):
    data = init_check_procedure(user)
    if data is None:
        raise ValueError("Initial check failed or no data found for user.")

    for content in data[category.value]['active']:
        if content["content"] == content_target:
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
        change_reward_unlocking_steps('fyhr',(num_iterations)*10)
    contents = []

    for i in list_range:
        if i < len(lists):
        #if not is_there_this_penalty_or_reward_in_active(user,lists[i]["content"],category):
        #Vu qu'on fait que une fois par jour le unlocking de penalty, pas besoin de check si on a deja unlock le seuil de 10 points etc.
            contents.append(lists[i]["content"])
        else:
            break

    return contents



def remove_penalty_reward_in_active(user,content,category):
    data = init_check_procedure(user)
    if data is None:
        raise ValueError("Initial check failed or no data found for user.")
    
    new_active_list = [item for item in data[JSONCategory.PENALTY.value]["active"] if item["content"] != content]

    # Update the data
    data[category.value]["active"] = new_active_list


    with open(user +".json", 'w') as file:
        json.dump(data, file, indent=4)

#Only for penalty
def double_penalty_in_activate(user):
    data = init_check_procedure(user)
    if data is None:
        raise ValueError("Initial check failed or no data found for user.")
    
    new_active_list = [] 
    if bool(data[JSONCategory.PENALTY.value]['active']): #Double penlaties only if there is anything in active
        for content_dict in data[JSONCategory.PENALTY.value]['active']:
            # Duplicate the entire dictionary, not just the content string
            duplicated_content_dict = content_dict.copy()
            duplicated_content_dict["content"] = content_dict["content"]
            new_active_list.append(duplicated_content_dict)
            new_active_list.append(duplicated_content_dict.copy())  # Duplicate it again

    data[JSONCategory.PENALTY.value]['active'] = new_active_list
    with open(user + ".json", 'w') as file:
        json.dump(data, file, indent=4)


def delete_penalty_reward_by_content(user_id, content,category,type):
    
    data = init_check_procedure(user_id)
    if data is None:
        raise ValueError("Initial check failed or no data found for user.")


    pen_or_rew_to_delete = None
    for pen_or_rew in data[category.value][type.value]:
        if pen_or_rew["content"] == content:
            pen_or_rew_to_delete = pen_or_rew
            break

    if pen_or_rew_to_delete is None:
        print("Pen or Rew not found.")
        return False

    data[category.value][type.value].remove(pen_or_rew_to_delete)

    # Write the updated data back to the file
    with open(user_id +".json",'w') as file:
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

    with open(user_id +".json", 'w') as file:
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

    with open(user +".json", 'w') as file:
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

    with open(user +".json", 'w') as file:
        json.dump(data, file, indent=4)



#----------------- DATE --------------------------

def change_date(user, date):

    data = init_check_procedure(user)
    if data is None:
        raise ValueError("Initial check failed or no data found for user.")
    
    # Add the 'penalty' field with the sequence
    data["last_date"] = date

    with open(user +".json", 'w') as file:
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