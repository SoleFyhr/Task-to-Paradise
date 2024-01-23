import json
import json_manager
import enum_list as enu
import uuid

class Task:
    def __init__(self, title,content, task_type, expiration_time, difficulty=enu.Difficulty.EASY, importance=0, penalty_induced=None,time_to_completion="",frequency_coming_back="",id=None):
        self.id = str(id) if id is not None else str(uuid.uuid4())
        self.title = title
        self.content = content
        self.task_type = task_type #daily/oncy/habits
        self.expiration_time = expiration_time
        self.difficulty = difficulty
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
    


def create_new_task(user,title,content, type, expiration_time,difficulty=enu.Difficulty.EASY, importance=0,penalty_induced=None,time_to_completion="",frequency_coming_back=""):
    
    new_task = Task(title,content,type,expiration_time,difficulty,importance,penalty_induced,time_to_completion,frequency_coming_back)
    task_json = new_task.to_json()
    
    json_manager.add_task_to_json(user, task_json,json_manager.JSONCategory.TASK,type)
    return task_json


 
def delete_task(id,user):
    json_manager.delete_task_by_id(user,id)

def get_all_tasks(user):
    return json_manager.get_all_things(json_manager.JSONCategory.TASK,user)

def get_all_tasks_sorted(user):
    return json_manager.get_all_tasks_by_type(user)

def get_all_tasks_sorted_with_historic(user):
    return json_manager.get_all_tasks_by_type_with_historic(user)


def get_importance_values(user):
    return json_manager.retrieve_scaling(user,enu.Scaling_Cat.IMPORTANCE)

def get_completion_values(user):
    return json_manager.retrieve_scaling(user,enu.Scaling_Cat.COMPLETION)


#create_new_task("SuperTest","",enu.TaskType.HABITS,"2024-02-11",difficulty=enu.Difficulty.HARD,importance=10,time_to_completion=7,frequency_coming_back=3)