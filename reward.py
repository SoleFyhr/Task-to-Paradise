import json
import database_manager
import enum_list as enu
import uuid


class Reward:
    def __init__(self, content,id=None):
        self.id = str(id) if id is not None else str(uuid.uuid4())
        self.content = content #Meditate
       
    def to_json(self):
        # Convert instance to a dictionary
        reward_dict = {
            "id": self.id,
            "content": self.content
        }
        return json.dumps(reward_dict)

    @staticmethod
    def from_json(json_str):
        # Convert JSON string to a dictionary
        reward_dict = json.loads(json_str)
        return Reward(**reward_dict)
    

#type = in daily scale, place= 2nd rank
def create_new_reward(user,content,type,place): 
    new_reward = Reward(content) #cold shower
    reward_json = new_reward.to_json()
    database_manager.add_penalty_reward_to_db(user, reward_json,database_manager.JSONCategory.REWARD,type,place)


def get_all_reward_sorted(user):
    data = database_manager.get_all_things(database_manager.JSONCategory.REWARD,user)
    return data['daily'], data['weekly'], data['monthly']


def add_reward_to_all(value,user):
    category = database_manager.JSONCategory.RPOINTS
    time = [enu.TimeEnum.DAILY,enu.TimeEnum.WEEKLY,enu.TimeEnum.MONTHLY]

    for i in range(len(time)):
        ancient_value = database_manager.get_value(category,time[i],user)
        database_manager.change_value(value+ancient_value,category,time[i],user)

def reset_total_value(user,time):
    database_manager.change_value(0,database_manager.JSONCategory.RPOINTS,time,user)


def activate_reward(user,time,number_iteration):

    contents =  database_manager.penalty_reward_iterate(user,database_manager.JSONCategory.REWARD,time,number_iteration)
    for content in contents:
        json_rew =Reward(content).to_json()
        database_manager.add_penalty_reward_to_db(user,json_rew,database_manager.JSONCategory.REWARD,enu.Active.ACTIVE,-1)

def remove_active_reward(user,id):
    database_manager.remove_penalty_reward_in_active(user,id,database_manager.JSONCategory.REWARD)
    
def remove_reward(user,id,type):
    database_manager.delete_penalty_reward_by_id(user,id,database_manager.JSONCategory.REWARD,type)

def get_active_reward(user):
    return database_manager.get_active(database_manager.JSONCategory.REWARD,enu.Active.ACTIVE,user)


#create_new_reward('fyhr',"Meditate",enu.TimeEnum.DAILY,1)
#activate_reward('fyhr',enu.TimeEnum.DAILY,4)
#remove_active_penalty('fyhr',"Meditate")