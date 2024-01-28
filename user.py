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


#create_new_user('Aotrix')