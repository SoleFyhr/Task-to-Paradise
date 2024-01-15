
from flask import Flask, render_template,jsonify, request
from flask import Flask, send_from_directory
from flask_cors import CORS
import tasks as ta
import penalty as pe
import reward as rew
import enum_list as enu
import manager as man
import other_stuff as other
import os

app = Flask(__name__, static_folder='./tasks-to-paradise/build')

CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})



#------------------ HTML ------------------
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

# @app.route('/')
# @app.route('/<path:path>')
# def serve():
#     print("ayoooo")
#     return send_from_directory('./tasks-to-paradise/build', 'index.html')

# @app.route('/')
# def home():
#     user = {'username': 'Fyhr'}
#     tasks_ = ta.get_all_tasks()
#     return render_template('home.html', user=user,tasks=tasks_)
#     #return render_template('base.html')


# @app.route('/tasks')
# def tasks_page():
#     tasks_ = ta.get_all_tasks()
#     return render_template('tasks.html',tasks = tasks_)

# @app.route('/penalty')
# def penalty_page():
#     penalty_ = pe.get_all_penalty() #Separate in the function for daily etc
#     return render_template('penalty.html')


#!------------------ TASK ------------------


@app.route('/button_create_task', methods=['POST'])
def my_function():

    data = request.json  # This will contain the data sent from the JavaScript
    
    title = data.get('title')
    content = data.get('content')
    type =  enu.TaskType.from_string(data.get('type'))
   
    expiration_time = data.get('expiration_time')
    values = ta.get_importance_values('fyhr')
   
    importance = enu.Importance.value_importance(enu.Importance.from_string(data.get('importance')),values)
    difficulty = enu.Difficulty.from_string(data.get('difficulty')) # if penalty task, the js put this at 0.
    penalty_induced = data.get('penalty_induced')# title of the penalty
    task_feedback = ta.create_new_task(title, content,type, expiration_time,difficulty, importance,penalty_induced)
    response_data = {"message": "Task added successfully","task":task_feedback}
    return jsonify(response_data)

@app.route('/get_dashboard_tasks', methods=['POST'])
def all_dashboard_tasks():
    tasks = ta.get_all_tasks('fyhr')
    response_data = {"message": "Task sent successfully","tasks":tasks}
    return jsonify(response_data)

@app.route('/get_tasks', methods=['POST'])
def all_tasks():
    once, daily, habits, prohibited = ta.get_all_tasks_sorted('fyhr')
    response_data = {"message": "Task sent successfully","once":once, "daily":daily, "habits":habits, "prohibited":prohibited}
    return jsonify(response_data)

@app.route('/button_delete_task', methods=['POST'])
def function_task_deleting():

    data = request.json  # This will contain the data sent from the JavaScript
    title = data.get('title')
    

    ta.delete_task(title,'fyhr')
    response_data = {"message": "Task deleted successfully"}
    return jsonify(response_data) #if it's once or habits, it should be erased (for habits it will just appear again the next day/week...)


@app.route('/button_task_completion', methods=['POST'])
def function_task_completion():

    data = request.json  # This will contain the data sent from the JavaScript
    title = data.get('title')
    type =  enu.TaskType.from_string(data.get('type'))
 

    if(type == enu.TaskType.PROHIBITED):
        if(data.get('penalty_induced') == None): #test this
            pe.activate_penalty_through_content('fyhr',data.get('penalty_induced'))
        man.penalty_task_done('fyhr',title)
        response_data = {"message": "Task treated successfully","action":"reactivate"}
 

    else: #Not a prohibited task
        completion = enu.Completion.from_string(data.get('completion'))
        man.task_completed('fyhr',title,completion)
        #remove task from pending (delete once or move to trash, and move habits and daily in other compartiments)        
        response_data = {"message": "Task treated successfully","action":"erase"}

    return jsonify(response_data) #if it's once or habits, it should be erased (for habits it will just appear again the next day/week...)


#!------------------ PENALTY ------------------


@app.route('/button_create_penalty', methods=['POST'])
def function_create_penalty():

    data = request.json  # This will contain the data sent from the JavaScript
    content = data.get('content')
    place_in_scale = data.get('place')
    type = enu.TimeEnum.from_string(data.get('type'))
    penalty_feedback = pe.create_new_penalty('fyhr',content,type,place_in_scale)
    response_data = {"message": "Penalty added successfully","penalty":penalty_feedback}
    return jsonify(response_data)


@app.route('/button_remove_active_penalty', methods=['POST'])
def function_remove_penalty():

    data = request.json  # This will contain the data sent from the JavaScript
    content = data.get('content')
    type = enu.Active.ACTIVE
    pe.remove_penalty('fyhr',content,type)
    response_data = {"message": "Penalty removed successfully"}
    return jsonify(response_data)

@app.route('/button_get_penalty', methods=['POST'])
def function_get_penalty():
    daily,weekly,monthly = pe.get_all_penalty_sorted('fyhr')
    response_data = {"message": "Penalty captured successfully","daily":daily,"weekly":weekly,"monthly":monthly}
    return jsonify(response_data)

@app.route('/button_get_active_penalty', methods=['POST'])
def function_get_active_penalty():
    active = pe.get_active_penalty('fyhr')
    response_data = {"message": "Penalty captured successfully","active": active}
    return jsonify(response_data)


#!------------------ Reward ------------------


@app.route('/button_create_reward', methods=['POST'])
def function_create_reward():

    data = request.json  # This will contain the data sent from the JavaScript
    content = data.get('content')
    place_in_scale = data.get('place')
    type = enu.TimeEnum.from_string(data.get('type'))
    rew.create_new_reward('fyhr',content,type,place_in_scale)
    response_data = {"message": "Reward added successfully"}
    return jsonify(response_data)


@app.route('/button_remove_active_reward', methods=['POST'])
def function_remove_reward():

    data = request.json  # This will contain the data sent from the JavaScript
    content = data.get('content')
    type = enu.TimeEnum.from_string(data.get('type'))
    rew.remove_reward('fyhr',content,type)
    response_data = {"message": "Reward removed successfully"}
    return jsonify(response_data)

@app.route('/button_get_reward', methods=['POST'])
def function_get_reward():
    daily,weekly,monthly = rew.get_all_reward_sorted('fyhr')
    response_data = {"message": "Reward captured successfully","daily":daily,"weekly":weekly,"monthly":monthly}
    return jsonify(response_data)



#!------------------ Points ------------------
@app.route('/button_get_points', methods=['POST'])
def function_get_points():
    rpoints,ppoints = other.get_ppoints_rpoints('fyhr')
    response_data = {"message": "points captured successfully","rpoints":rpoints,"ppoints":ppoints}
    return jsonify(response_data)

#!------------------ Scaling ------------------

@app.route('/button_get_scaling', methods=['POST'])
def function_get_scaling():
    difficulty,importance,completion = other.get_scaling_parameters('fyhr')
    response_data = {"message": "Scaling captured successfully","difficulty":difficulty,"importance":importance,"completion":completion}
    return jsonify(response_data)



@app.route('/change_scaling', methods=['POST'])
def function_change_scaling():
    data = request.json
    category = enu.Scaling_Cat.from_string(data.get('category'))

    # Function to determine the number of inputs for the given category
    num_inputs = enu.Scaling_Cat.number_of_inputs(category)

    sequence = data.get('sequence')
    try:
        true_sequence = []
        for i in range(1, num_inputs + 1):
            num_key = f'number{i}'
            if num_key in sequence:
                true_sequence.append(float(sequence[num_key]))
            else:
                return jsonify({"error": f"Missing {num_key} in sequence."}), 400

        other.new_sequence('fyhr', true_sequence, category)
    except ValueError as e:
        return jsonify({"error": "Invalid input. Sequence values must be integers."}), 400

    response_data = {"message": "Scaling changed successfully"}
    return jsonify(response_data)


#!------------------ Pause ------------------

@app.route('/button_get_pause', methods=['POST'])
def function_get_pause():
    pause = other.get_pause_field('fyhr')
    response_data = {"message": "Pause captured successfully","pause":pause}
    return jsonify(response_data)

@app.route('/change_pause', methods=['POST'])
def function_change_pause():
    other.change_pause_field('fyhr')
    response_data = {"message": "pause changed successfully"}
    return jsonify(response_data)


#Don't touch
if __name__ == '__main__':
    app.run(debug=True)