import json
import database_manager
import enum_list as enu
import uuid

class User:
    def __init__(self, username):
        self.username = username 

    def to_json(self):
        # Convert instance to a dictionary
        user_dict = {
            "username": self.username
        }
        return json.dumps(user_dict)

    @staticmethod
    def from_json(json_str):
        # Convert JSON string to a dictionary
        user_dict = json.loads(json_str)
        return User(**user_dict)
    


def create_new_user(username):
    new_user = User(username)
    database_manager.add_user_to_db(new_user)
    id = database_manager.get_user_id_by_username(username)

    #TODO create levels of difficulty and not hardcode/magic numbers shit like this

    difficulty= [1.0,3.0,6.0,10.0]
    completion= [0.25,0.8,1.0,1.5]
    importance= [5.0,13.0,20.0]

    database_manager.add_scaling_to_user(id, difficulty,completion,importance)
    database_manager.add_rppoints_to_user(id, 0,0,0,database_manager.JSONCategory.PPOINTS)
    database_manager.add_rppoints_to_user(id, 0,0,0,database_manager.JSONCategory.RPOINTS)

def get_user_id_from_username(username):
    return database_manager.get_user_id_by_username(username)

#create_new_user('Aotrix')

# ALTER SEQUENCE users_id_seq RESTART WITH 1;
