import json
import database_manager
import enum_list as enu


#!--------------------Scaling-------------------

def new_sequence(user,sequence,category):
    database_manager.update_sequence_to_scaling(user,sequence,category)

def update_tasks_importance(user_id,old_importance_values,new_importance_values):
    for i in range(len(old_importance_values)):
        database_manager.update_tasks_importance_values(user_id,old_importance_values[i],new_importance_values[i])
    

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


#!--------------------Efficient-------------------

def change_efficient_field(user):
    database_manager.change_efficient(user)

def get_efficient_field(user):
    return database_manager.retrieve_efficient_field(user)

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
  
