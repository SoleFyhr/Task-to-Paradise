import json
import json_manager
import enum_list as enu

class Reward:
    def __init__(self, content):
        self.content = content #Meditate
       
    def to_json(self):
        # Convert instance to a dictionary
        reward_dict = {
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
    json_manager.add_penalty_reward_to_json(user, reward_json,json_manager.JSONCategory.REWARD,type,place)


def get_all_reward_sorted(user):
    data = json_manager.get_all_things(json_manager.JSONCategory.REWARD,user)
    return data['daily'], data['weekly'], data['monthly']


def add_reward_to_all(value,user):
    category = json_manager.JSONCategory.RPOINTS
    time = [enu.TimeEnum.DAILY,enu.TimeEnum.WEEKLY,enu.TimeEnum.MONTHLY]

    for i in range(len(time)):
        ancient_value = json_manager.get_value(category,time[i],user)
        json_manager.change_value(value+ancient_value,category,time[i],user)

def reset_total_value(user,time):
    json_manager.change_value(0,json_manager.JSONCategory.RPOINTS,time,user)


def activate_reward(user,time,number_iteration):

    contents =  json_manager.penalty_reward_iterate(user,json_manager.JSONCategory.REWARD,time,number_iteration)
    for content in contents:
        json_rew =Reward(content).to_json()
        json_manager.add_penalty_reward_to_json(json_manager.user,json_rew,json_manager.JSONCategory.REWARD,enu.Active.ACTIVE,-1)

def remove_active_reward(user,content):
    json_manager.remove_penalty_reward_in_active(user,content,json_manager.JSONCategory.REWARD)
    
def remove_reward(user,content,type):
    json_manager.delete_penalty_reward_by_content(user,content,json_manager.JSONCategory.REWARD,type)

def get_active_reward(user):
    return json_manager.get_active(json_manager.JSONCategory.REWARD,enu.Active.ACTIVE,user)


#create_new_reward('fyhr',"Meditate",enu.TimeEnum.DAILY,1)
#activate_reward('fyhr',enu.TimeEnum.DAILY,4)
#remove_active_penalty('fyhr',"Meditate")