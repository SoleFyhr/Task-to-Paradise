import json
from enum import Enum
import enum_list as enu
import datetime
import psycopg2
import psycopg2.extras


#----------------- ENUM --------------------------

class JSONCategory(Enum):
    TASK = "tasks"
    PROJECT = "projects"
    PENALTY = "penalties"
    REWARD = "rewards"
    HISTORIC = "historic"
    PPOINTS = "penalty_points"
    RPOINTS = "reward_points"
    SCALING = "scaling"



    REWARD_UNLOCKING_STEP ="reward_unlocking_steps"
    PAUSE ="pause"
    DATE ="last_date"

#!----------------- GENERAL --------------------------

def get_db_connection():
    conn = psycopg2.connect(
        dbname="d31gg1ou0eg97a",
        user="rmolyzjqfixxyu",
        password="f741cd0e4a78459876509a2850a7056dd8a63fa64dbe561b1ede70538a61e1b1",
        host="ec2-44-215-40-87.compute-1.amazonaws.com",
        port="5432"
    )
    return conn


def get_all_field(user_id,table):
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
    sql = f"SELECT * FROM {table.value} WHERE user_id = %s"
    cursor.execute(sql, (user_id,))
    bundle = cursor.fetchall()

    cursor.close()
    conn.close()
    return bundle


def get_one_field(user_id,table,field):


    field = field.value if isinstance(field, Enum) else field

    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
    sql = f"SELECT {field} FROM {table.value} WHERE user_id = %s"
    cursor.execute(sql, (user_id,))
    fieldd = cursor.fetchone()[field]

    cursor.close()
    conn.close()
    return fieldd


def get_with_one_condition(user_id,table,condition_name,condition_field):


    condition_field = condition_field.value if isinstance(condition_field, Enum) else condition_field

    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
    sql = f"SELECT * FROM {table.value} WHERE user_id = %s AND {condition_name} = %s"
    cursor.execute(sql, (user_id,condition_field))
    data = cursor.fetchall()

    cursor.close()
    conn.close()
    return data

def get_one_thing_by_id(user_id,table,id):
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
    sql = f"SELECT * FROM {table} WHERE user_id = %s AND id = %s"
    cursor.execute(sql, (user_id,id))
    fieldd = cursor.fetchall()

    cursor.close()
    conn.close()
    return fieldd


def update_one_field_by_id(user_id,table,parameter,value,id):
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)

    sql = f"UPDATE {table} SET {parameter} = %s WHERE user_id = %s AND id = %s"

    cursor.execute(sql, (value,user_id,id))


    conn.commit()
    cursor.close()
    conn.close()
    

#!----------------- USERS --------------------------



def add_user_to_db(user):
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)

    cursor.execute("""
        INSERT INTO users (username) VALUES (%s)
    """, (user.username,))  # Note the comma after user.username

    conn.commit()
    cursor.close()
    conn.close()



def get_user_id_by_username(username):
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)

    cursor.execute("""
        SELECT id FROM users WHERE username = %s
    """, (username,))

    result = cursor.fetchone()

    cursor.close()
    conn.close()

    if result:
        return result[0]  # result[0] contains the first column returned, which is id
    else:
        return None  # Or an appropriate value/exception if the user is not found

def get_one_field_from_users(user_id,field):
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
    sql = f"SELECT {field} FROM users WHERE id = %s"
    cursor.execute(sql, (user_id,))
    fieldd = cursor.fetchone()[field]

    cursor.close()
    conn.close()
    return fieldd


#!----------------- TASKS --------------------------



def add_task_to_db(user_id, new_task):
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
    
    # Prepare data for insertion
    expiration_time = new_task.expiration_time
    if expiration_time:
        expiration_time = datetime.datetime.strptime(expiration_time, "%Y-%m-%d")
    else:
        expiration_time = None  # Use None for NULL in SQL

    # Build and execute the INSERT SQL statement
    sql = """
        INSERT INTO tasks 
        (user_id,id, title, content, task_type, expiration_time, difficulty, importance, penalty_induced, time_to_completion, frequency_coming_back) 
        VALUES (%s,%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """
    cursor.execute(sql, (
        user_id,
        new_task.id,
        new_task.title, 
        new_task.content, 
        new_task.task_type,  
        expiration_time, 
        new_task.difficulty, 
        new_task.importance, 
        new_task.penalty_induced, 
        new_task.time_to_completion, 
        new_task.frequency_coming_back
    ))

    conn.commit()
    cursor.close()
    conn.close()


def get_all_tasks_by_type(user_id):
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)

    # Fetch and order 'once' and 'habits' tasks by expiration_time
    cursor.execute("""
        SELECT * FROM tasks WHERE user_id = %s AND task_type = 'once'
        ORDER BY expiration_time ASC
    """, (user_id,))
    once = cursor.fetchall()

    cursor.execute("""
        SELECT * FROM tasks WHERE user_id = %s AND task_type = 'habits'
        ORDER BY expiration_time ASC
    """, (user_id,))
    habits = cursor.fetchall()

    # Fetch 'daily' and 'prohibited' tasks (no specific ordering)
    cursor.execute("""
        SELECT * FROM tasks WHERE user_id = %s AND task_type = 'daily'
    """, (user_id,))
    daily = cursor.fetchall()

    cursor.execute("""
        SELECT * FROM tasks WHERE user_id = %s AND task_type = 'prohibited'
    """, (user_id,))
    prohibited = cursor.fetchall()

    cursor.close()
    conn.close()

    return once, daily, habits, prohibited

# once,_,_,_ = get_all_tasks_by_type(1)
# for element in once:
#     print(element['importance'])


def get_all_tasks_by_type_with_historic(user_id):
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)

    cursor.execute("""
        SELECT * FROM historic WHERE user_id = %s AND task_type = 'daily'
    """, (user_id,))
    daily_hist = cursor.fetchall()

    cursor.execute("""
        SELECT * FROM historic WHERE user_id = %s AND task_type = 'habits'
        ORDER BY expiration_time ASC
    """, (user_id,))
    habits_hist = cursor.fetchall()
    
    once, daily, habits, prohibited = get_all_tasks_by_type(user_id)

    cursor.close()
    conn.close()
    
    return once, daily_hist + daily, habits_hist + habits, prohibited


def delete_task_by_id(user_id, task_id):
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)

    cursor.execute("""
        DELETE FROM tasks WHERE user_id = %s AND id = %s
    """, (user_id, task_id))

    # Check if a task was deleted
    if cursor.rowcount == 0:
        cursor.execute("""
        DELETE FROM historic WHERE user_id = %s AND id = %s
    """, (user_id, task_id))
        if cursor.rowcount == 0:
            print('Task not found')

    conn.commit()
    cursor.close()
    conn.close()

    print("Task deleted successfully.")
    return True


# def change_one_field_of_given_task(user, type_task, id, parameter, new_value):
#     data = init_check_procedure(user)
#     if data is None:
#         raise ValueError("Initial check failed or no data found for user.")

#     for task in data[JSONCategory.TASK.value][type_task.value]:
#         if task["id"] == id:
#             task[parameter]=new_value
#             break

#     with open(json_path + user + file_ext, 'w') as file:
#         json.dump(data, file, indent=4)

def change_one_field_of_given_task(user_id, task_id, parameter, new_value):

    update_one_field_by_id(user_id,JSONCategory.TASK.value,parameter,new_value,task_id)
  
        
def get_thing_by_id(user_id, task_id):
    task = get_one_thing_by_id(user_id,JSONCategory.TASK.value,task_id)

    if task:
        return task
    else:
        print("Task not found.")
        return False


# def move_task_to_historic(user_id, tasks_to_move):
#     data = init_check_procedure(user_id)
#     if data is None:
#         raise ValueError("Initial check failed or no data found for user.")

#     # Ensure tasks_to_move is a list
#     if not isinstance(tasks_to_move, list):
#         tasks_to_move = [tasks_to_move]

#     # Create a set of IDs for the tasks to move
#     tasks_to_move_id = {task.id for task in tasks_to_move}

#     # Iterate over each task category and update tasks
#     for category in data["tasks"]:
#         # Filter out tasks that need to be moved to 'historic'
#         tasks_remaining = [task for task in data["tasks"][category] if task['id'] not in tasks_to_move_id]
#         tasks_moved = [task for task in data["tasks"][category] if task['id'] in tasks_to_move_id and task['task_type'] != enu.TaskType.ONCE.value]

#         # Update the tasks in the current category
#         data["tasks"][category] = tasks_remaining

#         # Add the moved tasks to the 'historic' category
#         data["historic"].extend(tasks_moved)

#     # Save the updated data to the file
#     with open(json_path + user_id + file_ext, 'w') as file:
#         json.dump(data, file, indent=4)


def move_task_to_historic(user_id, tasks_to_move):
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)

    # Ensure tasks_to_move is a list
    if not isinstance(tasks_to_move, list):
        tasks_to_move = [tasks_to_move]

    for task_id in tasks_to_move:
        # Move each task to the historic table (can be an INSERT followed by DELETE or an UPDATE, depending on your schema)
        cursor.execute("""
            SELECT task_type FROM tasks WHERE user_id = %s AND id = %s
        """, (user_id, task_id))
        type = cursor.fetchone()[0]

        

        if(type in [enu.TaskType.ONCE.value,enu.TaskType.PROHIBITED.value]):
            cursor.execute("""
            DELETE FROM tasks WHERE user_id = %s AND id = %s
            """, (user_id, task_id))
            continue

        cursor.execute("""
            INSERT INTO historic (SELECT * FROM tasks WHERE user_id = %s AND id = %s)
        """, (user_id, task_id))

        cursor.execute("""
            DELETE FROM tasks WHERE user_id = %s AND id = %s
        """, (user_id, task_id))
        

    conn.commit()
    cursor.close()
    conn.close()

#move_task_to_historic(2,['1f96f9ee-e368-43ea-aed1-310922fc13e2','101c1f69-4ed1-45be-b77d-f29eeadc0496','9e8e0753-c368-40bd-81e0-d4fde1465884','9691e410-33e1-4f96-b5d6-a82ebaa64d73'])

# def clean_historic(user):
#     data = init_check_procedure(user)
#     if data is None:
#         raise ValueError("Initial check failed or no data found for user.")
#     historic = data[JSONCategory.HISTORIC.value]
#     tasks_to_remove=[]
#     for task in historic :
#         if task["task_type"] == enu.TaskType.DAILY.value:
#             data[JSONCategory.TASK.value][enu.TaskType.DAILY.value].append(task)
#             tasks_to_remove.append(task)
        
#         elif task["task_type"] == enu.TaskType.HABITS.value:
#             current_date = datetime.datetime.now().date()
#             expiration_date = datetime.datetime.strptime(task["expiration_time"], '%Y-%m-%d').date()
#             frequency_coming_back = int(task["frequency_coming_back"])
#             new_expiration_date = expiration_date + datetime.timedelta(days=frequency_coming_back)
            
#             if current_date == new_expiration_date:
#                 time_to_completion = int(task["time_to_completion"])
#                 new_expiration_date = current_date + datetime.timedelta(days=time_to_completion)
#                 task["expiration_time"] = new_expiration_date.strftime('%Y-%m-%d')               
#                 data[JSONCategory.TASK.value][enu.TaskType.HABITS.value].append(task)
#                 tasks_to_remove.append(task)
                
    
#     for tasks in tasks_to_remove:
#         data[JSONCategory.HISTORIC.value].remove(tasks)

#     with open(json_path + user + file_ext, 'w') as file:
#         json.dump(data, file, indent=4)

#TODO To test!!
def clean_historic(user_id):
    conn = get_db_connection()
    cursor = conn.cursor()

    current_date = datetime.datetime.now().date()

    cursor.execute("""
            INSERT INTO tasks (SELECT * FROM tasks WHERE user_id = %s AND task_type = %s)
        """, (user_id, enu.TaskType.DAILY.value))
    cursor.execute("""
        DELETE FROM historic WHERE user_id = %s AND task_type = %s
    """, (user_id, enu.TaskType.DAILY.value))
    
    current_date = datetime.datetime.now().date()

    # Select 'habits' tasks from historic
    cursor.execute("""
        SELECT id, expiration_time, frequency_coming_back, time_to_completion
        FROM historic
        WHERE user_id = %s AND task_type = 'habits'
    """, (user_id,))

    tasks = cursor.fetchall()

    for task in tasks:
        task_id, expiration_date, frequency, completion_time = task
        expiration_date = datetime.datetime.strptime(expiration_date, '%Y-%m-%d').date()
        new_expiration_date = expiration_date + datetime.timedelta(days=int(frequency))

        if current_date == new_expiration_date:
            new_expiration_date = current_date + datetime.timedelta(days=int(completion_time))
            new_expiration_str = new_expiration_date.strftime('%Y-%m-%d')

            # Move task back to tasks table
            cursor.execute("""
                INSERT INTO tasks (SELECT * FROM historic WHERE id = %s)
            """, (task_id,))
            cursor.execute("""
                UPDATE tasks SET expiration_time = %s WHERE id = %s
            """, (new_expiration_str, task_id,))
            cursor.execute("""
                DELETE FROM historic WHERE id = %s
            """, (task_id,))

    conn.commit()
    cursor.close()
    conn.close()

#-----------------  REWARD STEPS  --------------------------



def get_reward_unlocking_steps(user_id):
    reward_unlocking_steps = get_one_field_from_users(user_id,JSONCategory.REWARD_UNLOCKING_STEP.value)
    return reward_unlocking_steps


def change_reward_unlocking_steps(user_id,value):
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
    cursor.execute("""
        UPDATE public.users
        SET reward_unlocking_steps = %s
        WHERE id = %s
        
    """, (value,user_id))
    

    conn.commit()
    cursor.close()
    conn.close()

#----------------- PENALTY & REWARD  --------------------------
def add_penalty_reward_to_db(user_id, penalty,category,type,place):
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
    sql_previous = f"""
        SELECT * FROM {category.value} WHERE user_id = %s AND type = %s AND place = {place}        
    """
    cursor.execute(sql_previous, (user_id,type.value))
    value = cursor.fetchone()
    if not value:
        # Build and execute the INSERT SQL statement
        sql = f"""
            INSERT INTO {category.value} 
            (user_id,id, content,type,place) 
            VALUES (%s,%s, %s, %s, %s)
        """
        cursor.execute(sql, (
            user_id,
            penalty.id,
            penalty.content, 
            type.value,
            place  
        ))
    else:
        sql = f"""
            UPDATE {category.value} SET CONTENT = %s WHERE user_id = %s and type = %s and place = {place}
        """
        cursor.execute(sql, (penalty.content,user_id,type.value))

    conn.commit()
    cursor.close()
    conn.close()

#If num_iterations = 3, returns 0,1,2 in place (idk if this is the right thing but this is what this function does)
def penalty_reward_iterate(user_id, category, time, num_iterations):
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
    
    value_to_start = 0
    # if category == JSONCategory.REWARD:
    #     # Assuming there's a function or a way to get the current unlocking steps for the user
    #     value_to_start = get_reward_unlocking_steps(user_id) // 10
    #     # Optionally update the unlocking steps, if necessary
    #     change_reward_unlocking_steps(user_id, (num_iterations + value_to_start) * 10)
    
    # Adjust the SQL query based on the category to select only the relevant items
    # and order them by 'place'. Limit the results to 'num_iterations' starting from 'value_to_start'.
    
    sql = f"""
        SELECT content
        FROM {category.value}
        WHERE user_id = %s AND type = %s
        ORDER BY place
        OFFSET %s LIMIT %s
    """
    cursor.execute(sql, (user_id, time.value, value_to_start, num_iterations))
    rows = cursor.fetchall()
    
    # Extract the 'content' from each row
    contents = [row['content'] for row in rows]
    
    cursor.close()
    conn.close()

    return contents

#print(penalty_reward_iterate(2,JSONCategory.PENALTY,enu.TimeEnum.DAILY,3))
    

def delete_penalty_reward_by_id(user_id, pen_rew_id,category):
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
    

    # Build and execute the INSERT SQL statement
    sql = f"""
        DELETE FROM {category.value} WHERE user_id = %s AND id = %s
    """
    cursor.execute(sql, (
        user_id,
        pen_rew_id,
    ))
    
    conn.commit()
    cursor.close()
    conn.close()
    
    #print("Pen or Rew deleted successfully.")

def get_active(category,user_id):
    active = get_with_one_condition(user_id,category,"type","active")
    return active

#----------------- PPOINTS - RPOINTS --------------------------


def add_rppoints_to_user(user_id,daily,weekly,monthly,category):
    conn = get_db_connection()
    cursor = conn.cursor()

    # Use a dynamic SQL query to update the correct column
    sql = f"INSERT INTO {category.value} (user_id,daily,weekly,monthly) VALUES (%s,%s, %s, %s)"
    
    cursor.execute(sql, (user_id,daily,weekly,monthly))

    conn.commit()
    cursor.close()
    conn.close()
    
def change_value(user_id,value, category, time_period):
    conn = get_db_connection()
    cursor = conn.cursor()

    # Use a dynamic SQL query to update the correct column
    sql = f"UPDATE {category.value} SET {time_period.value} = %s WHERE user_id = %s"
    cursor.execute(sql, (value, user_id))

    conn.commit()
    cursor.close()
    conn.close()

    

def get_value(user_id,category, time_period):
    rppoint = get_one_field(user_id,category,time_period.value)
    return rppoint

def get_points_category(user_id,category):
    values = get_all_field(user_id,category)[0]
    values.pop(0)
    return values

#add_rppoints_to_user(3,2,3,4,JSONCategory.PPOINTS)
# print(get_points_category(3,JSONCategory.PPOINTS))
# change_value(3,4,JSONCategory.PPOINTS,enu.TimeEnum.DAILY)
# print(get_points_category(3,JSONCategory.PPOINTS))
# print(get_value(3,JSONCategory.PPOINTS,enu.TimeEnum.DAILY))


#----------------- SCALING ---------------------

#A task completed, will earn X points if it's easy, X points if meidum... x level of completion
#A task failed, will penalize X points if it's not so important, X points if it's important...

def add_scaling_to_user(user_id, difficulty, completion,importance):
    conn = get_db_connection()
    cursor = conn.cursor()

    difficulty_pg_array = '{' + ','.join(map(str, difficulty)) + '}'
    completion_pg_array = '{' + ','.join(map(str, completion)) + '}'

    importance_pg_array = '{' + ','.join(map(str,importance)) + '}'


    # Use a dynamic SQL query to update the correct column
    sql = "INSERT INTO scaling (user_id,difficulty,completion,importance) VALUES (%s,%s, %s, %s)"
    
    cursor.execute(sql, (user_id,difficulty_pg_array,completion_pg_array,importance_pg_array))

    conn.commit()
    cursor.close()
    conn.close()


#add_scaling_to_user(3,[1,2,3],[1,2,3],[1,2,3])
                        
def update_sequence_to_scaling(user_id, sequence,category):

    conn = get_db_connection()
    cursor = conn.cursor()

    sequence_pg_array = '{' + ','.join(map(str, sequence)) + '}'

    # Use a dynamic SQL query to update the correct column
    sql = f"UPDATE scaling SET {category.value} = %s WHERE user_id = %s"
    cursor.execute(sql, (sequence_pg_array, user_id))

    conn.commit()
    cursor.close()
    conn.close()

#update_sequence_to_scaling(3,[3.8,2,3,5,7],enu.Scaling_Cat.COMPLETION)

def retrieve_value_in_scaling(user_id, category,number):
    values = get_one_field(user_id,JSONCategory.SCALING,category.value)
    print(values)
    print(values[number])
    return values[number]

#retrieve_value_in_scaling(3,enu.Scaling_Cat.COMPLETION,0)

def retrieve_scaling(user_id, category):
    scalings = get_one_field(user_id,JSONCategory.SCALING,category.value)
    return scalings

#retrieve_scaling(3,enu.Scaling_Cat.COMPLETION)


#----------------- PAUSE --------------------------


def retrieve_pause_field(user_id):
    pause = get_one_field_from_users(user_id,JSONCategory.PAUSE.value)
    return pause

def change_pause(user_id):
    variable = "yes"
    if retrieve_pause_field(user_id) == "yes":
        variable = "no"

    sql = f"UPDATE public.users SET {JSONCategory.PAUSE.value} = %s WHERE id = %s"

    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
    cursor.execute(sql, (variable,user_id))
    

    conn.commit()
    cursor.close()
    conn.close()
#----------------- DATE --------------------------

def retrieve_date_field(user_id):
    date = get_one_field_from_users(user_id,"last_date")
    return date



def change_date(user_id, new_date):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
        UPDATE users
        SET last_date = %s
        WHERE id = %s
    """, (new_date, user_id))

    conn.commit()
    cursor.close()
    conn.close()



#----------------- USERS.TXT --------------------------


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



