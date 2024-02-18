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
def create_new_reward(user_id,content,type,place): 
    new_reward = Reward(content) #cold shower
    database_manager.add_penalty_reward_to_db(user_id, new_reward,database_manager.JSONCategory.REWARD,type,place)

#create_new_reward(2,'Test & DOdo',enu.TimeEnum.MONTHLY,1)
# create_new_reward(2,'1Tesssst',enu.TimeEnum.DAILY,1)

# create_new_reward(2,'2Tesssst',enu.TimeEnum.DAILY,2)
# create_new_reward(2,'3Tesssst',enu.TimeEnum.DAILY,3)


# create_new_reward(2,'WTesssst',enu.TimeEnum.WEEKLY,0)
# create_new_reward(2,'ATesssst',enu.Active.ACTIVE,0)



def get_all_reward_sorted(user_id):


    daily = database_manager.get_with_one_condition(user_id,database_manager.JSONCategory.REWARD,'type',enu.TimeEnum.DAILY)
    weekly = database_manager.get_with_one_condition(user_id,database_manager.JSONCategory.REWARD,'type',enu.TimeEnum.WEEKLY)
    monthly = database_manager.get_with_one_condition(user_id,database_manager.JSONCategory.REWARD,'type',enu.TimeEnum.MONTHLY)


    return daily,weekly,monthly


# print(get_all_reward_sorted(2)[1][0]['content'])

def add_reward_to_all(value,user):
    category = database_manager.JSONCategory.RPOINTS
    time = [enu.TimeEnum.DAILY,enu.TimeEnum.WEEKLY,enu.TimeEnum.MONTHLY]

    for i in range(len(time)):
        ancient_value = database_manager.get_value(user,category,time[i])
        database_manager.change_value(user,value+ancient_value,category,time[i])



def reset_total_value(user,time):
    database_manager.change_value(user,0,database_manager.JSONCategory.RPOINTS,time)

# add_reward_to_all(3,2)
# reset_total_value(2,enu.TimeEnum.MONTHLY)

def activate_reward(user,time,number_iteration):
    contents =  database_manager.penalty_reward_iterate(user,database_manager.JSONCategory.REWARD,time,number_iteration)
    for content in contents:
        create_new_reward(user,content,enu.Active.ACTIVE,0)

#activate_reward(2,enu.TimeEnum.DAILY,4)

def remove_reward(user,id):
    database_manager.delete_penalty_reward_by_id(user,id,database_manager.JSONCategory.REWARD)


def get_active_reward(user):
    return database_manager.get_active(database_manager.JSONCategory.REWARD,user)


#create_new_reward('fyhr',"Meditate",enu.TimeEnum.DAILY,1)
#activate_reward('fyhr',enu.TimeEnum.DAILY,4)
#remove_active_penalty('fyhr',"Meditate")