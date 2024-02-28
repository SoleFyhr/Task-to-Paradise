import json
import database_manager
import enum_list as enu
import uuid

class Task:
    def __init__(self, title,content, task_type, expiration_time, difficulty=enu.Difficulty.EASY, importance=0, penalty_induced=None,time_to_completion="",frequency_coming_back="",id=None):
        self.id = str(id) if id is not None else str(uuid.uuid4())
        self.title = title
        self.content = content
        self.task_type = task_type.value #daily/oncy/habits
        self.expiration_time = expiration_time
        self.difficulty = difficulty.value
        self.importance = importance
        self.penalty_induced = penalty_induced
        self.time_to_completion = time_to_completion
        self.frequency_coming_back = frequency_coming_back


    def to_json(self):
        # Convert instance to a dictionary
        task_dict = {
            "id": self.id,
            "title": self.title,
            "content": self.content,
            "task_type": self.task_type.value,
            "expiration_time": self.expiration_time, #for once tasks
            "difficulty": self.difficulty.value,
            "importance":self.importance,
            "penalty_induced": self.penalty_induced,
            "time_to_completion": self.time_to_completion, #for habits
            "frequency_coming_back": self.frequency_coming_back #for habits
            
        }
        return json.dumps(task_dict)

    @staticmethod
    def from_json(json_str):
        task_dict = json.loads(json_str)
        return Task(**task_dict)
    


def create_new_task(user_id, title, content, task_type, expiration_time, difficulty=enu.Difficulty.EASY, importance=0, penalty_induced=None, time_to_completion="", frequency_coming_back=""):
    
    new_task = Task(title, content, task_type, expiration_time, difficulty, importance, penalty_induced, time_to_completion, frequency_coming_back)
    
    # Directly pass the Task object to the database manager
    database_manager.add_task_to_db(user_id, new_task)

 
def delete_task(id,user_id):
    database_manager.delete_task_by_id(user_id,id)

def get_all_tasks(username):
    id = database_manager.get_user_id_by_username(username)
    return database_manager.get_all_field(id,database_manager.JSONCategory.TASK)

def get_all_tasks_sorted(user_id):
    return database_manager.get_all_tasks_by_type(user_id)

def get_all_tasks_sorted_with_historic(user_id):
    return database_manager.get_all_tasks_by_type_with_historic(user_id)


def get_importance_values(user_id):
    return database_manager.retrieve_scaling(user_id,enu.Scaling_Cat.IMPORTANCE)

def get_completion_values(user_id):
    return database_manager.retrieve_scaling(user_id,enu.Scaling_Cat.COMPLETION)


# create_new_task(2,"SuperTes","",enu.TaskType.HABITS,"2024-02-05",difficulty=enu.Difficulty.EASY,importance=10,time_to_completion=5,frequency_coming_back=7)
# create_new_task(2,"ooononcy","",enu.TaskType.ONCE,"2024-02-05",difficulty=enu.Difficulty.HARD,importance=10)
# create_new_task(2,"prohiiii","",enu.TaskType.PROHIBITED,"2024-02-05",difficulty=enu.Difficulty.MEDIUM,importance=10)
#create_new_task(2,"dailyy","",enu.TaskType.DAILY,"2024-02-05",difficulty=enu.Difficulty.MEDIUM,importance=10)