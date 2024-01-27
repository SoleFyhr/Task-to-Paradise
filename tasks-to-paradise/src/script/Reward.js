import React, { Component } from "react";
import ModalReward from "../components/ModalPenalty";

const apiUrl = process.env.API_URL || '';


class Reward extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeItem: {
        content: "",
        place: "",
        type: "",
      },
      rewardDaily: [],
      rewardWeekly: [],
      rewardMonthly: [],
    };
  }
  componentDidMount() {
    this.refreshList();
  }

  refreshList = () => {
    this.post_method("", `${apiUrl}/button_get_reward`, (data) => {
      this.setState({
        rewardDaily: data.daily,
      });
      this.setState({
        rewardWeekly: data.weekly,
      });
      this.setState({
        rewardMonthly: data.monthly,
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
      credentials: "include",
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

  // Main variable to render items on the screen
  renderItems = (newItems, type) => {
    return newItems.map((item, index) => (
      <li
        key={item.id}
        className={`list-group-item d-flex justify-content-between align-items-center ${item.difficulty}`}
      >
        <span>{(index + 1) * 10}</span>
        <span>{item.content}</span>
        <span>
          <button
            onClick={() => console.log("yo en travaux")}
            className="btn btn-info btn-spacing"
          >
            Edit
          </button>
          <button
            onClick={() => this.handleDelete(item.id, type)}
            className="btn btn-danger"
          >
            Delete
          </button>
        </span>
      </li>
    ));
  };

  toggle = () => {
    //add this after modal creation
    this.setState({ modal: !this.state.modal }); //add this after modal creation
  };

  createItem = () => {
    const item = {
      content: "",
      place: "1",
      type: "daily",
    };
    this.setState({ activeItem: item, modal: !this.state.modal });
  };

  handleDelete = (id, type) => {
    let body_content = JSON.stringify({ id: id, type: type });
    this.post_method(
      body_content,
      `${apiUrl}/button_remove_reward`,
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
      `${apiUrl}/button_create_reward`,
      (data) => {
        this.refreshList();
      }
    );
  };

  render() {
    return (
      <>
        <main className="content scroll-container">
          {/* <h2 className="text-uppercase text-center my-4">Reward</h2> */}
          <div className="row ">
              <div className="col-md-6 col-sm-10 mx-auto p-0">
                <div className="scroll-section taskZone">
                  <div className="scroll-section-inner">
                    <div className="addTask">
                      <button
                        onClick={this.createItem}
                        className="btn btn-primary"
                      >
                        Add Reward
                      </button>
                    </div>
                    <h4 className="text-uppercase  my-4">Daily</h4>

                    <div className="card penaltyGroup">
                      {/* {this.renderTabList()} */}
                      <ul className="list-group list-group-flush">
                        {this.renderItems(this.state.rewardDaily, "daily")}
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="scroll-section taskZone">
                  <div className="scroll-section-inner">
                    <h4 className="text-uppercase  my-4">Weekly</h4>
                    <div className="card penaltyGroup">
                      {/* {this.renderTabList()} */}
                      <ul className="list-group list-group-flush">
                        {this.renderItems(this.state.rewardWeekly, "weekly")}
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="scroll-section taskZone">
                  <div className="scroll-section-inner">
                    <h4 className="text-uppercase  my-4">Monthly</h4>
                    <div className="card penaltyGroup">
                      {/* {this.renderTabList()} */}
                      <ul className="list-group list-group-flush">
                        {this.renderItems(this.state.rewardMonthly, "monthly")}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          {this.state.modal ? (
            <ModalReward
              activeItem={this.state.activeItem}
              sectionName="Reward"
              toggle={this.toggle}
              onSave={this.handleSubmit}
            />
          ) : null}
        </main>
      </>
    );
  }
}

export default Reward;
