import React, { Component } from "react";
import ModalCompletion from "../components/ModalCompletion";
import CustomCheckbox from "../components/CustomCheckbox";
import starIcon from '../svg/star.svg';

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
    };
  }

  componentDidMount() {
    this.refreshList();
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
        this.setState({ taskList: data.tasks });
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

  

  renderTabList = () => {
    return (
      <div className=" taskZone tab-list">
        <span>Tasks</span>
      </div>
    );
  };

  // Main variable to render items on the screen
  // renderItems = () => {
  //   const newItems = this.state.taskList.slice(0, 5);
  //   return newItems.map((item) => (
  //     <li
  //       key={item.title}

  //       className={`list-group-item dashboard justify-content-between align-items-center ${item.difficulty}`}
  //     >
  //       <CustomCheckbox onCheck={() => this.manageCompletion(item.title,item.task_type)} checked={this.state.checkedTasks[item.title] || false}/>

  //       <span>
  //         {item.title} - {item.content} - Expires the {item.expiration_time}
  //       </span>

  //     </li>
  //   ));
  // };

  calculateDaysLeft = (expirationDate) => {
    const currentDate = new Date();
    const dueDate = new Date(expirationDate);
    const timeDiff = dueDate - currentDate;
    let number = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)); // Adding 1 to include today
    if(number===1) number = "1 day left"
    else number = number === 0 ? "Today" : number + " days left";
    return number;
  };


  renderStars = (difficulty) => {
    const stars = {
      easy: 1,
      medium: 2,
      hard: 3,
    };
    let starElements = [];
  
    for (let i = 0; i < stars[difficulty]; i++) {
      starElements.push(<img key={i} src={starIcon} alt="star" className="star-icon" />);
    }
  
    return starElements;
  };

  renderItems = () => {
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

  render() {
    return (
      <>
        <main className="content">
          <h2 className="text-uppercase text-center my-4">Tasks To Paradise</h2>
          <div className="row">
            <div className="col-md-6 col-sm-10 mx-auto p-0">
              <div className=" p-3 ">
                {this.renderTabList()}
                <ul className=" list-group-flush">{this.renderItems()}</ul>
              </div>
            </div>
          </div>
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
