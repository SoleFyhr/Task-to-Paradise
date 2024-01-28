import json
import database_manager
import enum_list as enu
import uuid

class Penalty:
    def __init__(self, content,id=None):
        self.id = str(id) if id is not None else str(uuid.uuid4())
        self.content = content #Cold Shower 1 time
       
    def to_json(self):
        # Convert instance to a dictionary
        penalty_dict = {
            "id": self.id,
            "content": self.content
        }
        return json.dumps(penalty_dict)

    @staticmethod
    def from_json(json_str):
        # Convert JSON string to a dictionary
        penalty_dict = json.loads(json_str)
        return Penalty(**penalty_dict)
    



#type = in daily scale, place= 2nd rank
def create_new_penalty(user,content,type,place): 
    new_penalty = Penalty(content) #cold shower
    penalty_json = new_penalty.to_json()
    database_manager.add_penalty_reward_to_db(user, penalty_json,database_manager.JSONCategory.PENALTY,type,place)
    return penalty_json

def get_all_penalty_sorted(user):
    data = database_manager.get_all_things(database_manager.JSONCategory.PENALTY,user)
    return data['daily'], data['weekly'], data['monthly']


def add_penalty_to_all(value,user):
    category = database_manager.JSONCategory.PPOINTS
    time = [enu.TimeEnum.DAILY,enu.TimeEnum.WEEKLY,enu.TimeEnum.MONTHLY]

    for i in range(len(time)):
        ancient_value = database_manager.get_value(category,time[i],user)
        database_manager.change_value(value+ancient_value,category,time[i],user)

def reset_total_value(user,time):
    database_manager.change_value(0,database_manager.JSONCategory.PPOINTS,time,user)

def double_penalty(user):
    active = database_manager.get_active(database_manager.JSONCategory.PENALTY,enu.Active.ACTIVE,user)
    if (len(active)==0):
        return
    contents = []
    for content in active:
        contents +=[content["content"]]
    
    for content in contents:
        json_pen =Penalty(content).to_json()
        database_manager.add_penalty_reward_to_db(user,json_pen,database_manager.JSONCategory.PENALTY,enu.Active.ACTIVE,-1)



def activate_penalty(user,time,number_iteration):

    contents =  database_manager.penalty_reward_iterate(user,database_manager.JSONCategory.PENALTY,time,number_iteration)
    for content in contents:
        json_pen =Penalty(content).to_json()
        database_manager.add_penalty_reward_to_db(user,json_pen,database_manager.JSONCategory.PENALTY,enu.Active.ACTIVE,-1)

def activate_penalty_through_content(user, content):
    json_pen =Penalty(content).to_json()
    database_manager.add_penalty_reward_to_db(user,json_pen,database_manager.JSONCategory.PENALTY,enu.Active.ACTIVE,-1)

def remove_active_penalty(user,id):
    database_manager.remove_penalty_reward_in_active(user,id,database_manager.JSONCategory.PENALTY)

def remove_penalty(user,id,type):
    database_manager.delete_penalty_reward_by_id(user,id,database_manager.JSONCategory.PENALTY,type)

#json_manager.change_value(9,json_manager.JSONCategory.PPOINTS,"daily",json_manager.user)

def get_active_penalty(user):
    return database_manager.get_active(database_manager.JSONCategory.PENALTY,enu.Active.ACTIVE,user)
