import React, { Component } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverBody,
} from "@chakra-ui/react";

import ModalSequence from "../components/ModalSequence";

class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pause: "",
      activeItem: {
        number1: "",
        number2: "",
        number3: "",
      },
      activeCategory:"",
      importanceScaling: [],
      difficultyScaling: [],
      isOpen: false,
    };
    this.openPopover = this.openPopover.bind(this);
    this.closePopover = this.closePopover.bind(this);
  }

  componentDidMount() {
    this.refreshList();
  }

  refreshList = () => {
    this.post_method("", "http://127.0.0.1:5000/button_get_pause", (data) => {
      this.setState({
        pause: data.pause,
      });
    });
    this.post_method("", "http://127.0.0.1:5000/button_get_scaling", (data) => {
      this.setState({
        difficultyScaling: data.difficulty,
        importanceScaling: data.importance,
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

  openPopover() {
    this.setState({ isOpen: true });
  }

  closePopover() {
    this.setState({ isOpen: false });
  }

  renderPopoverTrigger = () => {
    return (
      <PopoverTrigger>
        <span
          onMouseEnter={this.openPopover}
          onMouseLeave={this.closePopover}
          style={{ cursor: "pointer", textDecoration: "underline" }}
        >
          <strong>Importance Scaling</strong>
        </span>
      </PopoverTrigger>
    );
  };
  // Main variable to render items on the screen
  renderScale = (list) => {
    return list.map((item, index) => (
      <span
        key={index}
        className={` justify-content-between align-items-center ${item.difficulty}`}
      >
         {item} {index === 2 ?" ":"- "}
        </span>
        
    ));
  };

  toggle = () => {
    //add this after modal creation
    this.setState({ modal: !this.state.modal }); //add this after modal creation
  };

  createItem = (category) => {
    const item = {
      number1: "",
      number2: "",
      number3: "",
    };
    this.setState({ activeItem: item,activeCategory: category, modal: !this.state.modal });
  };

  handleDelete = (content, type) => {
    let body_content = JSON.stringify({ content: content, type: type });
    this.post_method(
      body_content,
      "http://127.0.0.1:5000/button_remove_active_reward",
      (data) => {
        this.refreshList();
      }
    );
  };

  // Submit an item
  handleChangePause = () => {
    this.post_method("", "http://127.0.0.1:5000/change_pause", (data) => {
      this.refreshList();
    });
  };
  // Submit an item
  handleNewSequence = (sequence,category) => {
    this.toggle();
    let body_content = JSON.stringify({ category: category, sequence: sequence });
    this.post_method(body_content, "http://127.0.0.1:5000/change_scaling", (data) => {
      this.refreshList();
    });
  };

  render() {
    return (
      <>
        <main className="content">
          <h2 className="text-uppercase text-center my-4">Settings</h2>
          <div className="outer-flex-container text-center  ">
            <div className="inner-flex-container">
              <div>
                
                <strong>Pause mode</strong>: {this.state.pause}
              </div>
              <span>
                <button
                  onClick={() => this.handleChangePause()}
                  className="btn btn-info btn-spacing"
                >
                  Change
                </button>
              </span>
            </div>
          </div>
          <div className="outer-flex-container text-center  ">
            <div className="inner-flex-container">
              <div>
                <Popover
                  isLazy
                  isOpen={this.state.isOpen}
                  onClose={this.closePopover}
                >
                  {this.renderPopoverTrigger()}
                  <PopoverContent>
                    
                    <PopoverArrow />

                    <PopoverBody>
                      Importance determines how much point you lose if you fail
                      to complete a task.
                      <br></br>
                      <br></br>
                      There are 3 degrees : not so important / important / very
                      important.
                      <br></br>
                      <br></br>A not so important task penalizes less than a very
                      important for example.
                    </PopoverBody>
                  </PopoverContent>
                </Popover>
                : {this.renderScale(this.state.importanceScaling)}
              </div>
              <span>
                <button
                  onClick={() => this.createItem("importance")}
                  className="btn btn-info btn-spacing"
                >
                  Add New Sequence
                </button>
              </span>
            </div>
          </div>
          <div className="outer-flex-container text-center  ">
            <div className="inner-flex-container">
              <div>
                
                  
                Difficulty: {this.renderScale(this.state.difficultyScaling)}
              </div>
              <span>
                <button
                  onClick={() => this.createItem("difficulty")}
                  className="btn btn-info btn-spacing"
                >
                  Add New Sequence
                </button>
              </span>
            </div>
          </div>


          {this.state.modal ? (
            <ModalSequence
              activeItem={this.state.activeItem}
              activeCategory={this.state.activeCategory}
              toggle={this.toggle}
              onSave={this.handleNewSequence}
            />
          ) : null}
        </main>
      </>
    );
  }
}

export default Settings;
