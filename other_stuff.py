import json
import database_manager
import enum_list as enu


#!--------------------Scaling-------------------

def new_sequence(user,sequence,category):
    database_manager.add_sequence_to_scaling(user,sequence,category)

def get_scaling_parameters(user):
    difficulty = database_manager.retrieve_scaling(user,enu.Scaling_Cat.DIFFICULTY)
    importance = database_manager.retrieve_scaling(user,enu.Scaling_Cat.IMPORTANCE)
    completion = database_manager.retrieve_scaling(user,enu.Scaling_Cat.COMPLETION)

    return difficulty,importance,completion

#!--------------------Pause-------------------

def change_pause_field(user):
    database_manager.change_pause(user)

def get_pause_field(user):
    return database_manager.retrieve_pause_field(user)


#!--------------------Points-------------------
def get_ppoints_rpoints(user):
    rpoints = database_manager.get_points_category(user,database_manager.JSONCategory.RPOINTS)
    ppoints = database_manager.get_points_category(user,database_manager.JSONCategory.PPOINTS)

    return rpoints,ppoints


#!--------------------users-------------------
def do_user_exist(user):
    if(user in database_manager.read_usernames_from_file('users.txt')):
        return True
  
    return False
  
