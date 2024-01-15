import json
import json_manager
import enum_list as enu

class Task:
    def __init__(self, title,content, task_type, expiration_time, difficulty, importance, penalty_induced=None):
        self.title = title
        self.content = content
        self.task_type = task_type #daily/oncy/habits
        self.expiration_time = expiration_time
        self.difficulty = difficulty
        self.importance = importance
        self.penalty_induced = penalty_induced


    def to_json(self):
        # Convert instance to a dictionary
        task_dict = {
            "title": self.title,
            "content": self.content,
            "task_type": self.task_type.value,
            "expiration_time": self.expiration_time,
            "difficulty": self.difficulty.value,
            "importance":self.importance,
            "penalty_induced": self.penalty_induced
            
        }
        return json.dumps(task_dict)

    @staticmethod
    def from_json(json_str):
        # Convert JSON string to a dictionary
        task_dict = json.loads(json_str)
        return Task(**task_dict)
    
    



def create_new_task(name,content, type, expiration_time,difficulty, importance,penalty_induced=None):
    
    new_task = Task(name,content,type,expiration_time,difficulty,importance,penalty_induced)
    task_json = new_task.to_json()
    json_manager.add_task_to_json(json_manager.user, task_json,json_manager.JSONCategory.TASK)
    return task_json


def delete_task(title,user):
    json_manager.delete_task_by_title(user,title)
    
def get_all_tasks(user):
    return json_manager.get_all_things(json_manager.JSONCategory.TASK,user)

def get_all_tasks_sorted(user):
    return json_manager.get_all_tasks_by_type(user)

def get_importance_values(user):
    return json_manager.retrieve_scaling(user,enu.Scaling_Cat.IMPORTANCE)

def get_completion_values(user):
    return json_manager.retrieve_scaling(user,enu.Scaling_Cat.COMPLETION)