import json
import json_manager
import enum_list as enu


#!--------------------Scaling-------------------

def new_sequence(user,sequence,category):
    json_manager.add_sequence_to_scaling(user,sequence,category)

def get_scaling_parameters(user):
    difficulty = json_manager.retrieve_scaling(user,enu.Scaling_Cat.DIFFICULTY)
    importance = json_manager.retrieve_scaling(user,enu.Scaling_Cat.IMPORTANCE)
    completion = json_manager.retrieve_scaling(user,enu.Scaling_Cat.COMPLETION)

    return difficulty,importance,completion

#!--------------------Pause-------------------

def change_pause_field(user):
    json_manager.change_pause(user)

def get_pause_field(user):
    return json_manager.retrieve_pause_field(user)


#!--------------------Points-------------------
def get_ppoints_rpoints(user):
    rpoints = json_manager.get_points_category(json_manager.JSONCategory.RPOINTS,user)
    ppoints = json_manager.get_points_category(json_manager.JSONCategory.PPOINTS,user)

    return rpoints,ppoints


#!--------------------users-------------------
def do_user_exist(user):
    if(user in json_manager.read_usernames_from_file('users.txt')):
        return True
  
    return False
  
