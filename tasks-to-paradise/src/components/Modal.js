import React, { Component } from "react";
// importing all of these classes from reactstrap module
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Input,
  Label,
} from "reactstrap";

// build a class base component
class CustomModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeItem: this.props.activeItem,
      validationErrors: {},
    };
  }
  // changes handler to check if a checkbox is checked or not
  handleChange = (e) => {
    let { name, value } = e.target;
    if (e.target.type === "checkbox") {
      value = e.target.checked;
    }
    const activeItem = { ...this.state.activeItem, [name]: value };
    this.setState({ activeItem });
  };

  validateForm = () => {
    const { title } = this.state.activeItem;
    let errors = {};
    if (!title) errors.title = "Title is required";
    
    // Add other field validations as necessary

    this.setState({ validationErrors: errors });
    return Object.keys(errors).length === 0; // Return true if no errors
  };

  handleSave = () => {
    if (this.validateForm()) {
      this.props.onSave(this.state.activeItem);
    }
  };



  // rendering modal in the custommodal class received toggle and on save as props,
  render() {
    const { toggle } = this.props;
    const { validationErrors } = this.state;

    return (
      <Modal isOpen={true} toggle={toggle}>
        <ModalHeader toggle={toggle}> Task </ModalHeader>
        <ModalBody>
          <Form>
            {/* 3 formgroups
            1 title label */}
            <FormGroup>
              <Label for="title">Title</Label>
              <Input
                type="text"
                name="title"
                value={this.state.activeItem.title}
                onChange={this.handleChange}
                placeholder="Enter Task Title"
                invalid={!!validationErrors.title}
                />
                {validationErrors.title && (
                  <div className="text-danger">{validationErrors.title}</div>
                )}
            </FormGroup>

            {/* 2 content label */}
            <FormGroup>
              <Label for="content">Details</Label>
              <Input
                type="text"
                name="content"
                value={this.state.activeItem.content}
                onChange={this.handleChange}
                placeholder="Enter Task Details"
              />
              
            </FormGroup> 

            <FormGroup>
              <Label for="type">Type</Label>
              <Input
                type="select"
                name="type"
                value={this.state.activeItem.type}
                onChange={this.handleChange}
              >
                <option value="once">Once</option>
                <option value="daily">Daily</option>
                <option value="habits">Habits</option>
                <option value="prohibited">Prohibited</option>
              </Input>
            </FormGroup>
            {/* Rajouter trois milliards de trucs genre, le habits */}
            <FormGroup>
              <Label for="expiration_time">Expiration Time</Label>
              <Input
                type="date"
                name="expiration_time"
                value={this.state.activeItem.expiration_time}
                onChange={this.handleChange}
              ></Input>
            </FormGroup>

            <FormGroup>
              <Label for="difficulty">Difficulty</Label>
              <Input
                type="select"
                name="difficulty"
                value={this.state.activeItem.difficulty}
                onChange={this.handleChange}
              >
                <option value="very_easy">Very Easy</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Difficult</option>
              </Input>
            </FormGroup>

            <FormGroup>
              <Label for="importance">Importance</Label>
              <Input
                type="select"
                name="importance"
                value={this.state.activeItem.importance}
                onChange={this.handleChange}
              >
                <option value="not so important">Not so important</option>
                <option value="important">Important</option>
                <option value="very important">Very important</option>
              </Input>
            </FormGroup>

            {/* 3 penalty induced label */}
            <FormGroup check>
              <Label for="penalty induced">
                <Input
                  type="checkbox"
                  name="penalty induced"
                  checked={this.state.activeItem.penalty_induced}
                  onChange={this.handleChange}
                />
                Penalty induced
              </Label>
            </FormGroup>
          </Form>
        </ModalBody>
        {/* create a modal footer */}
        <ModalFooter>
          <Button color="success" onClick={this.handleSave}>
            Save
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}
export default CustomModal;
