import json
import json_manager
import enum_list as enu


#!--------------------Scaling-------------------

def new_sequence(user,sequence,category):
    json_manager.add_sequence_to_scaling(user,sequence,category)

def get_scaling_parameters(user):
    difficulty = json_manager.retrieve_scaling(user,enu.Scaling_Cat.DIFFICULTY)
    importance = json_manager.retrieve_scaling(user,enu.Scaling_Cat.IMPORTANCE)
    return difficulty,importance

#!--------------------Pause-------------------

def change_pause_field(user):
    json_manager.change_pause(user)

def get_pause_field(user):
    return json_manager.retrieve_pause_field(user)