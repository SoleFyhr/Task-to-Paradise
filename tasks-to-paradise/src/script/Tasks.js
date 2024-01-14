import React, { Component } from "react";
import Modal from "../components/Modal";
import ModalCompletion from "../components/ModalCompletion";

import CustomCheckbox from "../components/CustomCheckbox";

class Tasks extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewCompleted: false,
      activeItem: {
        title: "",
        content: "",
        difficulty: "",
        expiration_time: "",
        importance: "",
        penalty_induced: null,
        type: "",
      },
      activeItemCompletion: {
        title:"",
        completion:"",
        type:""
        
      },
      once: [],
      daily: [],
      habits: [],
      prohibited: [],
      checkedTasks: {},
      
    };
  }
  componentDidMount() {
    this.refreshList();
  }

  refreshList = () => {
    this.post_method("", "http://127.0.0.1:5000/get_tasks", (data) => {
      this.setState({
        once: data.once,
        daily: data.daily,
        habits: data.habits,
        prohibited: data.prohibited,
      });
    });
  };

  post_method(body_content, path, return_func) {
    fetch(path, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: body_content,
    })
      .then((response) => response.json()) // Assuming your server responds with JSON
      .then((data) => {
        if (data) {
          return_func(data);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  toggle = () => {
    //add this after modal creation
    this.setState({ modal: !this.state.modal }); //add this after modal creation
  };

  toggleCompletion = () => {
    //add this after modal creation
    if (this.state.modalCompletion === true) {
      this.setState({
        checkedTasks: {},
        modalCompletion: !this.state.modalCompletion,
      }); //add this after modal creation
    } else {
      this.setState({ modalCompletion: !this.state.modalCompletion }); //add this after modal creation
    }
  };

  manageCompletion = (title, type) => {
    const itemCompletion = {
      title: title,
      completion: "went with the motion",
      type: type,
    };
    this.setState((prevState) => ({
      activeItemCompletion: itemCompletion,
      checkedTasks: { ...prevState.checkedTasks, [title]: true },
      modalCompletion: !this.state.modalCompletion,
    }));
  };

  handleCompletion = (item) => {
    this.toggleCompletion();
    let body_content = JSON.stringify(item);
    this.post_method(
      body_content,
      "http://127.0.0.1:5000/button_task_completion",
      (data) => {
        this.refreshList();
      }
    );
  };

  createItem = () => {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split("T")[0]; // Formats the date to 'YYYY-MM-DD'

    const item = {
      title: "",
      content: "",
      difficulty: "easy",
      expiration_time: formattedDate, // Set to current date
      importance: "not so important",
      penalty_induced: null,
      type: "once",
    };
    this.setState({ activeItem: item, modal: !this.state.modal });
  };

  handleDelete = (title) => {
    let body_content = JSON.stringify({
      title: title,
    });
    this.post_method(
      body_content,
      "http://127.0.0.1:5000/button_delete_task",
      (data) => {
        this.refreshList();
      }
    );
  };

  // Submit an item
  handleSubmit = (item) => {
    this.toggle();
    let body_content = JSON.stringify(item);
    this.post_method(
      body_content,
      "http://127.0.0.1:5000/button_create_task",
      (data) => {
        this.refreshList();
      }
    );
  };

  renderItems = (list) => {
    return list.map((item) => (
      <li
        key={item.title}
        className={`list-group-item d-flex align-items-center ${item.difficulty}`}
      >
        <div className="d-flex align-items-center flex-grow-1 mr-2">
          <CustomCheckbox
            onCheck={() => this.manageCompletion(item.title, item.task_type)}
            checked={this.state.checkedTasks[item.title] || false}
          />
          <span className="task-content">
            {item.title} - {item.content} - Expires the {item.expiration_time}
          </span>
        </div>
        <div className="button-group">
          <button
            onClick={() => console.log("Edit:", item.title)}
            className="btn btn-info btn-spacing"
          >
            Edit
          </button>
          <button
            onClick={() => this.handleDelete(item.title)}
            className="btn btn-danger"
          >
            Delete
          </button>
        </div>
      </li>
    ));
  };

  render() {
    return (
      <>
        <main className="content">
          <h2 className="text-uppercase text-center my-4">Tasks</h2>
          <div className="row ">
            <div className="col-md-6 col-sm-10 mx-auto p-0">
              <div className="taskZone">
                <button onClick={this.createItem} className="btn btn-primary">
                  Add Task
                </button>
              </div>
              <h3 className="text-uppercase  my-4">Once</h3>

              <div className="card p-3 penaltyGroup">
                {/* {this.renderTabList()} */}
                <ul className="list-group list-group-flush">
                  {this.renderItems(this.state.once)}
                </ul>
              </div>
              <h3 className="text-uppercase  my-4">Daily</h3>

              <div className="card p-3 penaltyGroup">
                {/* {this.renderTabList()} */}
                <ul className="list-group list-group-flush">
                  {this.renderItems(this.state.daily)}
                </ul>
              </div>
              <h3 className="text-uppercase  my-4">Habits</h3>

              <div className="card p-3 penaltyGroup">
                {/* {this.renderTabList()} */}
                <ul className="list-group list-group-flush">
                  {this.renderItems(this.state.habits)}
                </ul>
              </div>
              <h3 className="text-uppercase  my-4">Prohibited</h3>

              <div className="card p-3 penaltyGroup">
                {/* {this.renderTabList()} */}
                <ul className="list-group list-group-flush">
                  {this.renderItems(this.state.prohibited)}
                </ul>
              </div>
            </div>
          </div>
          {this.state.modal ? (
            <Modal
              activeItem={this.state.activeItem}
              toggle={this.toggle}
              onSave={this.handleSubmit}
            />
          ) : null}

          {this.state.modalCompletion ? (
            <ModalCompletion
              activeItem={this.state.activeItemCompletion}
              toggle={this.toggleCompletion}
              onSave={this.handleCompletion}
            />
          ) : null}
        </main>
      </>
    );
  }
}

export default Tasks;
