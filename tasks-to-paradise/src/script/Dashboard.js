import React, { Component } from "react";
import ModalCompletion from "../components/ModalCompletion";
import CustomCheckbox from "../components/CustomCheckbox";

import starIcon from "../svg/star.svg";
import exclamation from "../svg/exclamationRed.svg";

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeItem: {
        title: "",
        completion: "",
        type: "",
      },
      checkedTasks: {},
      taskList: [],
      taskListProhibited: [],
      activePenaltyList: [],
    };
  }

  componentDidMount() {
    this.refreshList();
    this.setState({
      activePenaltyList: this.state.activePenaltyList.map((item, index) => ({
        ...item,
        uniqueId: `unique-${index}-${Date.now()}`,
      })),
    });
  }

  // componentDidUpdate(prevProps, prevState) {
  //   if (prevState.taskList !== this.state.taskList) {
  //     console.log(this.state.taskList);
  //   }
  // }

  refreshList = () => {
    this.post_method(
      "",
      "http://127.0.0.1:5000/get_dashboard_tasks",
      (data) => {
        this.setState({ taskList: data.tasks});
      }
    );
    this.post_method(
      "",
      "http://127.0.0.1:5000/button_get_active_penalty",
      (data) => {
        this.setState({ activePenaltyList: data.active });
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
    if (this.state.modal === true) {
      this.setState({ checkedTasks: {}, modal: !this.state.modal }); //add this after modal creation
    } else {
      this.setState({ modal: !this.state.modal }); //add this after modal creation
    }
  };

  manageCompletion = (title, type) => {
    const item = {
      title: title,
      completion: "went through the motion",
      type: type,
    };
    this.setState((prevState) => ({
      activeItem: item,
      checkedTasks: { ...prevState.checkedTasks, [title]: true },
      modal: !this.state.modal,
    }));
  };

  handleCompletion = (item) => {
    this.toggle();
    let body_content = JSON.stringify(item);
    this.post_method(
      body_content,
      "http://127.0.0.1:5000/button_task_completion",
      (data) => {
        this.refreshList();
      }
    );
  };

  handleCompletionActive = (content) => {
    let body_content = JSON.stringify({ content: content });
    // Introduce a delay before executing the post method
    setTimeout(() => {
      this.post_method(
        body_content,
        "http://127.0.0.1:5000/button_remove_active_penalty",
        (data) => {
          this.refreshList();
        }
      );
    }, 500); // Delay in milliseconds, adjust as needed
  };

  renderTabList = (title) => {
    return (
      <div className=" taskZone tab-list">
        <span>{title}</span>
      </div>
    );
  };

  calculateDaysLeft = (expirationDate) => {
    const currentDate = new Date();
    const dueDate = new Date(expirationDate);
    const timeDiff = dueDate - currentDate;
    let number = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)); // Adding 1 to include today
    if (number === 1) number = "1 day left";
    else number = number === 0 ? "Today" : number + " days left";
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

  renderTasks = () => {
    const newItems = this.state.taskList.slice(0, 5);
    return newItems.map((item) => (
      <li
        key={item.title}
        className={`dashboard task-grid basic ${
          item.penalty_induced ? "penalty" : "no-penalty"
        } ${item.task_type}`}
      >
        {item.penalty_induced && <div>{/* Content for penalty_induced */}</div>}
        <CustomCheckbox
          onCheck={() => this.manageCompletion(item.title, item.task_type)}
          checked={this.state.checkedTasks[item.title] || false}
        />
        <span className="task-title">{item.title}</span>
        <span className="days-left">
          {this.calculateDaysLeft(item.expiration_time)}
        </span>
        <div className="difficulty-importance-column">
          <div className="difficulty-stars">
            {this.renderStars(item.difficulty)}
          </div>
          <div>{`-${item.importance}`}</div>
        </div>
      </li>
    ));
  };

  renderActive = () => {
    return this.state.activePenaltyList.map((item, index) => (
      <li key={item.content} className={`dashboard task-grid basic no-penalty`}>
        <CustomCheckbox
          onCheck={() => this.handleCompletionActive(item.content)}
        />
        <span className="task-title">{item.content}</span>
        <span className="days-left">{"Today"}</span>
        <div className="difficulty-importance-column">
          <div className="difficulty-stars">
            {
              <img
                src={exclamation}
                alt="exclamation"
                className="exclamation-icon"
              />
            }
          </div>
        </div>
      </li>
    ));
  };

  renderSection(title, renderFunction = null) {
    return (
      <div className="col-md-6 col-sm-10 mx-auto p-0">
        <div className=" p-3 ">
          {this.renderTabList(title)}
          {renderFunction ? (
            <ul className=" list-group-flush">{renderFunction()}</ul>
          ) : null}
        </div>
      </div>
    );
  }

  render() {
    return (
      <>
        <main className="content">
          <h2 className="text-uppercase text-center my-4">Tasks To Paradise</h2>

          {this.state.activePenaltyList.length === 0
            ? ""
            : this.renderSection("Do it or it doubles", this.renderActive)}
          {this.renderSection("Tasks", this.renderTasks)}
          {this.renderSection("Penalty Points")}
          {this.renderSection("Reward Points")}

          {this.state.modal ? (
            <ModalCompletion
              activeItem={this.state.activeItem}
              toggle={this.toggle}
              onSave={this.handleCompletion}
            />
          ) : null}
        </main>
      </>
    );
  }
}

export default Dashboard;
