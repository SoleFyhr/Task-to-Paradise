import React, { Component } from "react";
import ModalCompletion from "../components/ModalCompletion";
import CustomCheckbox from "../components/CustomCheckbox";

import starIcon from "../svg/star.svg";
import exclamation from "../svg/exclamationRed.svg";

import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

// Use theme (optional)
am4core.useTheme(am4themes_animated);

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
      onceList: [],
      dailyList: [],
      habitsList: [],
      prohibitedList: [],
      taskList: [],
      activePenaltyList: [],
    };
  }

  createDonutChart = (chartDiv, data) => {
    // Create chart instance
    let chart = am4core.create(chartDiv, am4charts.PieChart);
    chart.hiddenState.properties.opacity = 0; // this creates initial fade-in

    // Set data
    chart.data = data;

    // Add and configure Series
    let pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.dataFields.value = "value";
    pieSeries.dataFields.category = "category";

    // Inner radius for Donut chart
    pieSeries.innerRadius = am4core.percent(50);

    // Animations
    pieSeries.slices.template.states.getKey(
      "active"
    ).properties.shiftRadius = 0;
    pieSeries.slices.template.states.getKey("hover").properties.scale = 1.1;
    pieSeries.alignLabels = false;
    pieSeries.labels.template.text = "{value.percent.formatNumber('#.0')}%";
    pieSeries.labels.template.radius = am4core.percent(-40);
    pieSeries.labels.template.fill = am4core.color("white");

    return chart;
  };

  componentDidMount() {
    this.refreshList();
    const penaltyPointsData = [
      { category: "Category A", value: 50 },
      { category: "Category B", value: 50 },
    ];
    const rewardsPointsData = [
      { category: "Category X", value: 40 },
      { category: "Category Y", value: 60 },
    ];

    // Create charts
    this.penaltyPointsChart = this.createDonutChart(
      "penaltyPointsChartDiv",
      penaltyPointsData
    );
    this.rewardsPointsChart = this.createDonutChart(
      "rewardsPointsChartDiv",
      rewardsPointsData
    );
  }

  componentWillUnmount() {
    if (this.penaltyPointsChart) {
      this.penaltyPointsChart.dispose();
    }
    if (this.rewardsPointsChart) {
      this.rewardsPointsChart.dispose();
    }
  }

  // componentDidUpdate(prevProps, prevState) {
  //   if (prevState.taskList !== this.state.taskList) {
  //     console.log(this.state.taskList);
  //   }
  // }

  refreshList = () => {
    this.post_method("", "http://127.0.0.1:5000/get_tasks", (data) => {
      // Concatenate the arrays using the spread operator
      const concatenatedList = [...data.daily, ...data.habits, ...data.once];

      this.setState({
        onceList: data.once,
        habitsList: data.habits,
        dailyList: data.daily,
        prohibitedList: data.prohibited,
        taskList: concatenatedList, // Updated taskList
      });
    });
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
  handleProhibited = (prohibited) => {
    console.log(prohibited)
    let body_content = JSON.stringify(prohibited);
    setTimeout(() => {
      this.post_method(
        body_content,
        "http://127.0.0.1:5000/button_task_completion",
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

  renderTasks = (newItems) => {
    return newItems.map((item) => (
      <li
        key={item.id}
        className={`task-grid basic ${
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

  renderActive = () => {
    return this.state.activePenaltyList.map((item, index) => (
      <li key={item.id} className={`dashboard task-grid basic no-penalty`}>
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

  renderSection(title, renderFunction = null, args = null) {
    return (
      <div className="scroll-section-tasks">
      <div className="col-md-6 col-sm-10 mx-auto p-0 ">
      {this.renderTabList(title)}
        <div className=" p-3 ">
          
          {renderFunction ? (
            <ul className=" list-group-flush">{renderFunction(args)}</ul>
          ) : null}
        </div>
      </div>
      </div>
    );
  }

  render() {
    return (
      <>
        <main className="content scroll-container">
          <div className="scroll-section-title">
            <h1 className="title">TASKS TO PARADISE</h1>
          </div>
          {this.state.activePenaltyList.length === 0
            ? ""
            : this.renderSection("Do it or it doubles", this.renderActive)}
          {this.renderSection(
            "Tasks",
            this.renderTasks,
            this.state.taskList.slice(0, 8)
          )}
          {this.renderSection(
            "Prohibited",
            this.renderProhibited,
            this.state.prohibitedList
          )}
          {this.renderSection("Penalty Points")}
          <div
            id="penaltyPointsChartDiv"
            style={{ width: "100%", height: "500px" }}
          ></div>
          {this.renderSection("Reward Points")}
          {/* Penalty Points Chart */}

          {/* Rewards Points Chart */}
          <div
            id="rewardsPointsChartDiv"
            style={{ width: "100%", height: "500px" }}
          ></div>
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
