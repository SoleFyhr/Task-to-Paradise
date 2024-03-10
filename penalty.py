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
def create_new_penalty(user_id,content,type,place,id=None): 
    new_penalty = Penalty(content,id) #cold shower

    database_manager.add_penalty_reward_to_db(user_id, new_penalty,database_manager.JSONCategory.PENALTY,type,place)



# create_new_penalty(2,'accc',enu.Active.ACTIVE,3)
# create_new_penalty(2,'acc2',enu.Active.ACTIVE,3)


# create_new_penalty(2,'oui',enu.TimeEnum.WEEKLY,0)

# create_new_penalty(2,'Tessss',enu.TimeEnum.MONTHLY,0)


def get_all_penalty_sorted(user_id):

    daily = database_manager.get_with_one_condition(user_id,database_manager.JSONCategory.PENALTY,'type',enu.TimeEnum.DAILY,order_by="place")
    weekly = database_manager.get_with_one_condition(user_id,database_manager.JSONCategory.PENALTY,'type',enu.TimeEnum.WEEKLY,order_by="place")
    monthly = database_manager.get_with_one_condition(user_id,database_manager.JSONCategory.PENALTY,'type',enu.TimeEnum.MONTHLY,order_by="place")


    return daily,weekly,monthly


#print(get_all_penalty_sorted(2)[1][0]['content'])

# ([{'id': 'e3b6c9a3-80c1-447f-888c-4c5342d333c1', 'content': 'Penalty Daily 1'}, {'id': 'edaa6dd0-c8d4-4ede-b75c-0705ee25fcbd', 'content': 'Pen 2'}], [{'id': '078ad9ef-8763-4918-ba3f-7e45813bd7d7', 'content': 'Pen weekly?'}], [{'id': '3b07a5cd-eaed-40e6-a628-86552f54e8c1', 'content': 'Pen Month example'}])

def add_penalty_to_all(value,user):
    category = database_manager.JSONCategory.PPOINTS
    time = [enu.TimeEnum.DAILY,enu.TimeEnum.WEEKLY,enu.TimeEnum.MONTHLY]

    for i in range(len(time)):
        ancient_value = database_manager.get_value(user,category,time[i])
        database_manager.change_value(user,value+ancient_value,category,time[i])



def reset_total_value(user,time):
    database_manager.change_value(user,0,database_manager.JSONCategory.PPOINTS,time)

#reset_total_value(2,enu.TimeEnum.MONTHLY)

# add_penalty_to_all(2,2)

def double_penalty(user):
    active = database_manager.get_active(database_manager.JSONCategory.PENALTY,user)
    if (len(active)==0):
        return
    contents = []
    for content in active:
        contents +=[content["content"]]
        
    for content in contents:
        create_new_penalty(user,content,enu.Active.ACTIVE,0)


#double_penalty(2)


def activate_penalty(user,time,number_iteration):

    contents =  database_manager.penalty_reward_iterate(user,database_manager.JSONCategory.PENALTY,time,number_iteration)
    for content in contents:
        create_new_penalty(user,content,enu.Active.ACTIVE,0)

def remove_penalty(user,id):
    database_manager.delete_penalty_reward_by_id(user,id,database_manager.JSONCategory.PENALTY)

#json_manager.change_value(9,json_manager.JSONCategory.PPOINTS,"daily",json_manager.user)

def get_active_penalty(user):
    return database_manager.get_active(database_manager.JSONCategory.PENALTY,user)
