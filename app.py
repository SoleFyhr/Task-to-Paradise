
from flask import Flask,jsonify, request,send_from_directory, session, redirect
from flask_cors import CORS
from datetime import timedelta
import tasks as ta
import penalty as pe
import reward as rew
import enum_list as enu
import manager as man
import other_stuff as other
import os
from dotenv import load_dotenv
import os
 
app = Flask(__name__, static_folder='./tasks-to-paradise/build')
app.secret_key = 'your_secret_key'
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(days=31)
app.config['SESSION_COOKIE_NAME'] = 'your_session_cookie_name'
app.config['SESSION_COOKIE_HTTPONLY'] = True

load_dotenv()

if os.getenv('FLASK_ENV') == 'production':
    app.config['SESSION_COOKIE_SECURE'] = True

else:
    print(os.getenv('FLASK_ENV'))
    app.config['SESSION_COOKIE_SECURE'] = False


app.config['SESSION_COOKIE_SECURE'] = False  # Set to True if you're using HTTPS

CORS(app,supports_credentials=True, resources={r"/*": {"origins": "http://localhost:3000"}})



#!------------------ HTML ------------------


# @app.route('/home')
# def home():
#     if 'username' in session:
        
#         # Handle user-specific data
#         return f'Welcome, {username}'
#     else:
#         return redirect('/login')
    
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

#!------------------ Login ------------------

@app.route('/login', methods=['POST'])
def login():
    username = request.json.get('username')
    # Check if username == None exists in users.txt
    if other.do_user_exist(username):
        session['username'] = username
        session.permanent = True  # Make the session persistent
        man.daily_routine()
        return jsonify({'message': 'Logged in successfully'}), 200
    else:
        return jsonify({'message': 'User not found'}), 404
    
@app.route('/logout')
def logout():
    # Clear the session
    session.clear()
    return jsonify({'message': 'Logged out successfully'}), 200

#!------------------ TASK ------------------
def get_logged_in_user():
    """Check if a user is logged in and return their username."""
    if os.getenv('FLASK_ENV') == 'production':
        username = session.get('username')
        if not username:
            return False  # or raise an exception, based on your design choice
        return username 

    else:
        return 'fyhr'

    

@app.route('/button_create_task', methods=['POST'])
def my_function():
    username = get_logged_in_user()
    if username == None:
        return jsonify({'message': 'Unauthorized'}), 401

    
    data = request.json  # This will contain the data sent from the JavaScript
    
    title = data.get('title')
    content = data.get('content')
    type =  enu.TaskType.from_string(data.get('type'))
   
    expiration_time = data.get('expiration_time')
    values = ta.get_importance_values(username)
   
    importance = enu.Importance.value_importance(enu.Importance.from_string(data.get('importance')),values)
    difficulty = enu.Difficulty.from_string(data.get('difficulty')) # if penalty task, the js put this at 0.
    penalty_induced = data.get('penalty_induced')# title of the penalty
    time_to_completion = data.get('time_to_completion')
    frequency_coming_back = data.get('frequency_coming_back')
    
    task_feedback = ta.create_new_task(username,title=title, content=content,type=type, expiration_time=expiration_time,difficulty= difficulty, importance=importance,penalty_induced=penalty_induced,time_to_completion=time_to_completion,frequency_coming_back=frequency_coming_back)
    response_data = {"message": "Task added successfully","task":task_feedback}
    return jsonify(response_data)

@app.route('/get_dashboard_tasks', methods=['POST'])
def all_dashboard_tasks():
    username = get_logged_in_user()
    if username == None:
        return jsonify({'message': 'Unauthorized'}), 401

    man.daily_routine()
    once, daily, habits, prohibited = ta.get_all_tasks_sorted(username)
    response_data = {"message": "Task sent successfully","once":once, "daily":daily, "habits":habits, "prohibited":prohibited}
    return jsonify(response_data)

@app.route('/get_tasks', methods=['POST'])
def all_tasks():
    username = get_logged_in_user()
    if username == None:
        return jsonify({'message': 'Unauthorized'}), 401

    
    once, daily, habits, prohibited = ta.get_all_tasks_sorted_with_historic(username)
    response_data = {"message": "Task sent successfully","once":once, "daily":daily, "habits":habits, "prohibited":prohibited}
    return jsonify(response_data)

@app.route('/button_delete_task', methods=['POST'])
def function_task_deleting():
    username = get_logged_in_user()
    if username == None:
        return jsonify({'message': 'Unauthorized'}), 401

    
    data = request.json  # This will contain the data sent from the JavaScript
    id = data.get('id')
    

    ta.delete_task(id,username)
    response_data = {"message": "Task deleted successfully"}
    return jsonify(response_data) #if it's once or habits, it should be erased (for habits it will just appear again the next day/week...)


@app.route('/button_task_completion', methods=['POST'])
def function_task_completion():
    username = get_logged_in_user()
    if username == None:
        return jsonify({'message': 'Unauthorized'}), 401

    
    data = request.json  # This will contain the data sent from the JavaScript
    id = data.get('id')
    type =  enu.TaskType.from_string(data.get('task_type'))
 

    if(type == enu.TaskType.PROHIBITED):
        if(data.get('penalty_induced') != None): #test this
            pe.activate_penalty_through_content(username,data.get('penalty_induced'))
        man.penalty_task_done(username,id)
        response_data = {"message": "Task treated successfully","action":"reactivate"}
 

    else: #Not a prohibited task
        completion = enu.Completion.from_string(data.get('completion'))
        man.task_completed(username,id,completion)
        #remove task from pending (delete once or move to trash, and move habits and daily in other compartiments)        
        response_data = {"message": "Task treated successfully","action":"erase"}

    return jsonify(response_data) #if it's once or habits, it should be erased (for habits it will just appear again the next day/week...)


#!------------------ PENALTY ------------------


@app.route('/button_create_penalty', methods=['POST'])
def function_create_penalty():
    username = get_logged_in_user()
    if username == None:
        return jsonify({'message': 'Unauthorized'}), 401

    


    data = request.json  # This will contain the data sent from the JavaScript
    content = data.get('content')
    place_in_scale = data.get('place')
    type = enu.TimeEnum.from_string(data.get('type'))
    penalty_feedback = pe.create_new_penalty(username,content,type,place_in_scale)
    response_data = {"message": "Penalty added successfully","penalty":penalty_feedback}
    return jsonify(response_data)


@app.route('/button_remove_active_penalty', methods=['POST'])
def function_remove_penalty_cative():
    username = get_logged_in_user()
    if username == None:
        return jsonify({'message': 'Unauthorized'}), 401

    


    data = request.json  # This will contain the data sent from the JavaScript
    id = data.get('id')
    type = enu.Active.ACTIVE
    pe.remove_penalty(username,id,type)
    response_data = {"message": "Penalty removed successfully"}
    return jsonify(response_data)

@app.route('/button_remove_penalty', methods=['POST'])
def function_remove_penalty():
    username = get_logged_in_user()
    if username == None:
        return jsonify({'message': 'Unauthorized'}), 401

    


    data = request.json  # This will contain the data sent from the JavaScript
    id = data.get('id')
    type = enu.TimeEnum.from_string(data.get('type'))
    pe.remove_penalty(username,id,type)
    response_data = {"message": "Penalty removed successfully"}
    return jsonify(response_data)

@app.route('/button_get_penalty', methods=['POST'])
def function_get_penalty():
    username = get_logged_in_user()
    if username == None:
        return jsonify({'message': 'Unauthorized'}), 401

    


    daily,weekly,monthly = pe.get_all_penalty_sorted(username)
    response_data = {"message": "Penalty captured successfully","daily":daily,"weekly":weekly,"monthly":monthly}
    return jsonify(response_data)

@app.route('/button_get_active_penalty', methods=['POST'])
def function_get_active_penalty():
    username = get_logged_in_user()
    if username == None:
        return jsonify({'message': 'Unauthorized'}), 401

    


    active = pe.get_active_penalty(username)
    response_data = {"message": "Penalty captured successfully","active": active}
    return jsonify(response_data)


#!------------------ Reward ------------------


@app.route('/button_create_reward', methods=['POST'])
def function_create_reward():
    username = get_logged_in_user()
    if username == None:
        return jsonify({'message': 'Unauthorized'}), 401

    

    data = request.json  # This will contain the data sent from the JavaScript
    content = data.get('content')
    place_in_scale = data.get('place')
    type = enu.TimeEnum.from_string(data.get('type'))
    rew.create_new_reward(username,content,type,place_in_scale)
    response_data = {"message": "Reward added successfully"}
    return jsonify(response_data)


@app.route('/button_remove_active_reward', methods=['POST'])
def function_remove_reward_active():
    username = get_logged_in_user()
    if username == None:
        return jsonify({'message': 'Unauthorized'}), 401

    

    data = request.json  # This will contain the data sent from the JavaScript
    content = data.get('content')
    type = enu.TimeEnum.from_string(data.get('type'))
    rew.remove_reward(username,content,type)
    response_data = {"message": "Reward removed successfully"}
    return jsonify(response_data)

@app.route('/button_remove_reward', methods=['POST'])
def function_remove_reward():
    username = get_logged_in_user()
    if username == None:
        return jsonify({'message': 'Unauthorized'}), 401

    

    data = request.json  # This will contain the data sent from the JavaScript
    id = data.get('id')
    type = enu.TimeEnum.from_string(data.get('type'))
    rew.remove_reward(username,id,type)
    response_data = {"message": "Reward removed successfully"}
    return jsonify(response_data)

@app.route('/button_get_reward', methods=['POST'])
def function_get_reward():
    username = get_logged_in_user()
    if username == None:
        return jsonify({'message': 'Unauthorized'}), 401

    

    daily,weekly,monthly = rew.get_all_reward_sorted(username)
    response_data = {"message": "Reward captured successfully","daily":daily,"weekly":weekly,"monthly":monthly}
    return jsonify(response_data)



#!------------------ Points ------------------
@app.route('/button_get_points', methods=['POST'])
def function_get_points():
    username = get_logged_in_user()
    if username == None:
        return jsonify({'message': 'Unauthorized'}), 401

    

    rpoints,ppoints = other.get_ppoints_rpoints(username)
    response_data = {"message": "points captured successfully","rpoints":rpoints,"ppoints":ppoints}
    return jsonify(response_data)

#!------------------ Scaling ------------------

@app.route('/button_get_scaling', methods=['POST'])
def function_get_scaling():
    username = get_logged_in_user()
    if username == None:
        return jsonify({'message': 'Unauthorized'}), 401

    

    difficulty,importance,completion = other.get_scaling_parameters(username)
    response_data = {"message": "Scaling captured successfully","difficulty":difficulty,"importance":importance,"completion":completion}
    return jsonify(response_data)



@app.route('/change_scaling', methods=['POST'])
def function_change_scaling():
    username = get_logged_in_user()
    if username == None:
        return jsonify({'message': 'Unauthorized'}), 401

    

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

        other.new_sequence(username, true_sequence, category)
    except ValueError as e:
        return jsonify({"error": "Invalid input. Sequence values must be integers."}), 400

    response_data = {"message": "Scaling changed successfully"}
    return jsonify(response_data)


#!------------------ Pause ------------------

@app.route('/button_get_pause', methods=['POST'])
def function_get_pause():
    username = get_logged_in_user()
    if username == None:
        return jsonify({'message': 'Unauthorized'}), 401

    

    pause = other.get_pause_field(username)
    response_data = {"message": "Pause captured successfully","pause":pause}
    return jsonify(response_data)

@app.route('/change_pause', methods=['POST'])
def function_change_pause():
    username = get_logged_in_user()
    if username == None:
        return jsonify({'message': 'Unauthorized'}), 401

    

    other.change_pause_field(username)
    response_data = {"message": "pause changed successfully"}
    return jsonify(response_data)


#Don't touch
if __name__ == '__main__':
    app.run(debug=True)