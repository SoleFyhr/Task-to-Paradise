import React, { Component } from "react";
import Modal from "../components/Modal";
import ModalCompletion from "../components/ModalCompletion";
import starIcon from "../svg/star.svg";
import CustomCheckbox from "../components/CustomCheckbox";


const apiUrl = process.env.API_URL || '';

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
        time_to_completion: "",
        frequency_coming_back: "",
        importance: "",
        penalty_induced: "false",
        type: "",
        id:"",
      },
      activeItemCompletion: {
        title: "",
        completion: "",
        type: "",
      },
      once: [],
      daily: [],
      habits: [],
      prohibited: [],
      checkedTasks: {},
      isEfficient:"",
      importanceValues:"",
    };
  }
  componentDidMount() {
    this.refreshList();
  }

  refreshList = () => {
    this.post_method("", `${apiUrl}/get_tasks`, (data) => {
      this.setState({
        once: data.once,
        daily: data.daily,
        habits: data.habits,
        prohibited: data.prohibited,
      });
    });
    this.post_method(
      "",
      `${apiUrl}/button_get_setting`,
      (data) => {
        this.setState({ isEfficient: data.efficient, importanceValues:data.importance_values});
      }
    );
  };

  post_method(body_content, path, return_func) {
    fetch(path, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: body_content,
      credentials: 'include',
    })
      .then((response) => {
        if (response.ok) {
          // If the response is OK, parse it as JSON
          return response.json();
        } else {
          // If the response is not OK, parse it as JSON and throw an error
          return response.json().then((data) => {
            throw new Error(data.error || "Unknown server error");
          });
        }
      })
      .then((data) => {
        if (data) {
          return_func(data);
        }
      })
      .catch((error) => {
        // This will catch both network errors and the errors thrown above
        console.error("Error:", error.message);
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

  manageCompletion = (id, type) => {
    const itemCompletion = {
      id: id,
      completion: "went through the motion",
      type: type,
    };
    this.setState((prevState) => ({
      activeItemCompletion: itemCompletion,
      checkedTasks: { ...prevState.checkedTasks, [id]: true },
      modalCompletion: !this.state.modalCompletion,
    }));
  };

  handleCompletion = (item) => {
    this.toggleCompletion();
    let body_content = JSON.stringify(item);
    this.post_method(
      body_content,
      `${apiUrl}/button_task_completion`,
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
      time_to_completion: "",
      frequency_coming_back: "",
      importance: "not so important",
      penalty_induced: "",
      type: "once",
      id:"",
    };
    this.setState({ activeItem: item, modal: !this.state.modal });
  };

  editItem = (task) => {
    //const currentDate = new Date();
    //const formattedDate = currentDate.toISOString().split("T")[0]; // Formats the date to 'YYYY-MM-DD'
    const importanceLevels = ["not so important", "important", "very important"];
    const importanceIndex = this.state.importanceValues.findIndex(value => parseFloat(value) === task.importance);
    const importanceString = importanceIndex !== -1 ? importanceLevels[importanceIndex] : "unknown importance";
    const penalty_induced = task.penalty_induced === "false" ? "" : task.penalty_induced

    const item = {
      title: task.title,
      content: task.content,
      difficulty: task.difficulty,
      expiration_time: task.expiration_time, // Set to current date
      time_to_completion: task.time_to_completion,
      frequency_coming_back: task.frequency_coming_back,
      importance: importanceString,
      penalty_induced: penalty_induced,
      type: task.task_type,
      id:task.id,
    };
    this.setState({ activeItem: item, modal: !this.state.modal });
  };

  handleDelete = (id) => {
    let body_content = JSON.stringify({
      id: id,
    });
    this.post_method(
      body_content,
      `${apiUrl}/button_delete_task`,
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
      `${apiUrl}/button_create_task`,
      (data) => {
        this.refreshList();
      }
    );
  };

  calculateDaysLeft = (expirationDate) => {
    let number;
    if (expirationDate === "") number = "Today";
    else {
      const currentDate = new Date();
      const dueDate = new Date(expirationDate);
      const timeDiff = dueDate - currentDate;
      number = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)); // Adding 1 to include today
      if (number === 1) number = "1 day left";
      else number = number === 0 ? "Today" : number + " days left";
    }
    return number;
  };

  renderStars = (difficulty) => {
    const stars = {
      very_easy: 0,
      easy: 1,
      medium: 2,
      hard: 3,
    };
    let starElements = [];

    for (let i = 0; i < stars[difficulty]; i++) {
      starElements.push(
        <img key={i} src={starIcon} alt="star" className="star-icon" />
      );
    }

    return starElements;
  };



  renderProhibited = (newItems) => {
    return newItems.map((item) => (
      <li
        key={item.id}
        className={`dashboard task-grid basic ${
          item.penalty_induced ? "penalty" : "no-penalty"
        } ${item.task_type}`}
      >
        {item.penalty_induced && <div>{/* Content for penalty_induced */}</div>}
        <CustomCheckbox
          onCheck={() => this.handleProhibited(item)}
        />
        <span className="task-title">{item.title}</span>
        <span className="days-left"></span>
        <div className="difficulty-importance-column">
          <div>{`-${item.importance}`}</div>
        </div>
      </li>
    ));
  };

  renderItems = (list) => {
    return list.map((item) => (
      <li
        key={item.id}
        className={`list-group-item d-flex align-items-center ${item.difficulty}`}
      >
        <div className="d-flex align-items-center flex-grow-1 mr-2">
          {/* <CustomCheckbox
            onCheck={() => this.manageCompletion(item.title, item.task_type)}
            checked={this.state.checkedTasks[item.title] || false}
          /> */}
          <span className="task-content">
            {item.title} {item.task_type === "prohibited" ? null : "- " +item.difficulty} {item.task_type === "once" ?"- Expires the " +item.expiration_time : null} {"- importance :  -"+item.importance}
          </span>
        </div>
        <div className="button-group">
          <button
            onClick={() => this.editItem(item)}
            className="btn btn-info btn-spacing"
          >
            Edit
          </button>
          <button
            onClick={() => this.handleDelete(item.id)}
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
      <>  <main className="content">
          {/* <h2 className="text-uppercase text-center my-4">Tasks</h2> */}
          <div className="row">
            <div className="col-md-6 col-sm-10 mx-auto p-0">
              <div className="add_Task taskZone">
              <div className="addTask">
                <button onClick={this.createItem} className="btn btn-primary">
                  Add Task
                </button>
              </div>
              <h4 className="text-uppercase  my-4">Once</h4>

              <div className="card penaltyGroup">
                {/* {this.renderTabList()} */}
                <ul className="list-group list-group-flush">
                  {this.renderItems(this.state.once)}
                </ul>
              </div>
              <h4 className="text-uppercase  my-4">Daily</h4>

              <div className="card penaltyGroup">
                {/* {this.renderTabList()} */}
                <ul className="list-group list-group-flush">
                  {this.renderItems(this.state.daily)}
                </ul>
              </div>

              </div>


              <div className="between_section taskZone">
              <h4 className="text-uppercase  my-4">Habits</h4>

              <div className="card penaltyGroup">
                {/* {this.renderTabList()} */}
                <ul className="list-group list-group-flush">
                  {this.renderItems(this.state.habits)}
                </ul>
              </div>
              <h4 className="text-uppercase  my-4">Prohibited</h4>

              <div className="card penaltyGroup">
                {/* {this.renderTabList()} */}
                <ul className="list-group list-group-flush">
                  {this.renderItems(this.state.prohibited)}
                </ul>
              </div>
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
