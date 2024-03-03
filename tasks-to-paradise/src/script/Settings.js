import React, { Component } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverBody,
  Button,
} from "@chakra-ui/react";

import ModalSequence from "../components/ModalSequence";

const apiUrl = process.env.API_URL || "";

class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pause: "",
      activeCategory: "",
      numberOfInputs: 3,
      importanceScaling: [],
      difficultyScaling: [],
      completionScaling: [],
      isOpen: false,
    };
    this.openPopover = this.openPopover.bind(this);
    this.closePopover = this.closePopover.bind(this);
  }

  componentDidMount() {
    this.refreshList();
  }

  refreshList = () => {
    this.post_method("", `${apiUrl}/button_get_pause`, (data) => {
      this.setState({
        pause: data.pause,
      });
    });
    this.post_method("", `${apiUrl}/button_get_scaling`, (data) => {
      this.setState({
        difficultyScaling: data.difficulty,
        importanceScaling: data.importance,
        completionScaling: data.completion,
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

  renderScale = (list) => {
    const lastIndex = list.length - 1; // Calculate the last index of the list

    return list.map((item, index) => (
      <span
        key={index}
        className={`justify-content-between align-items-center ${item.difficulty}`}
      >
        {item} {index === lastIndex ? " " : "- "}
      </span>
    ));
  };

  toggle = () => {
    //add this after modal creation
    this.setState({ modal: !this.state.modal }); //add this after modal creation
  };

  handleButtonClickSequence = (number, category) => {
    this.setState({
      numberOfInputs: number,
      activeCategory: category,
      modal: !this.state.modal,
    });
  };

  handleDelete = (content, type) => {
    let body_content = JSON.stringify({ content: content, type: type });
    this.post_method(
      body_content,
      `${apiUrl}/button_remove_active_reward`,
      (data) => {
        this.refreshList();
      }
    );
  };

  // Submit an item
  handleChangePause = () => {
    this.post_method("", `${apiUrl}/change_pause`, (data) => {
      this.refreshList();
    });
  };
  // Submit an item
  handleNewSequence = (sequence, category) => {
    this.toggle();
    let body_content = JSON.stringify({
      category: category,
      sequence: sequence,
    });
    this.post_method(body_content, `${apiUrl}/change_scaling`, (data) => {
      this.refreshList();
    });
  };

  render() {
    return (
      <>
        <main className="content scroll-container">
          {/* <h2 className="text-uppercase text-center my-4">Settings</h2> */}
          <div className="scroll-section-tasks">
            <div className="outer-flex-container text-center">
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
                        Importance determines how much point you lose if you
                        fail to complete a task.
                        <br></br>
                        <br></br>
                        There are 3 degrees : not so important / important /
                        very important.
                        <br></br>
                        <br></br>A not so important task penalizes less than a
                        very important for example.
                      </PopoverBody>
                    </PopoverContent>
                  </Popover>
                  : {this.renderScale(this.state.importanceScaling)}
                </div>
                <span>
                  <button
                    onClick={() =>
                      this.handleButtonClickSequence(3, "importance")
                    }
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
                    onClick={() =>
                      this.handleButtonClickSequence(4, "difficulty")
                    }
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
                  Completion: {this.renderScale(this.state.completionScaling)}
                </div>
                <span>
                  <button
                    onClick={() =>
                      this.handleButtonClickSequence(5, "completion")
                    }
                    className="btn btn-info btn-spacing"
                  >
                    Add New Sequence
                  </button>
                </span>
              </div>
            </div>
            <div className="text-center my-4">
              <Button
                colorScheme="blue"
                onClick={() => {
                  const link = document.createElement("a");
                  link.href = `${process.env.PUBLIC_URL}/user_manual.pdf`; // Use PUBLIC_URL to get the correct path
                  link.download = "user_manual.pdf";
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
              >
                Download User Manual
              </Button>
            </div>
          </div>

          {this.state.modal ? (
            <ModalSequence
              numberOfInputs={this.state.numberOfInputs}
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
