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
class CustomModalPenalty extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeItem: this.props.activeItem,
      sectionName: this.props.sectionName,
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
    const { content } = this.state.activeItem;
    let errors = {};
    if (!content) errors.content = "Content is required";
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
        <ModalHeader toggle={toggle}> Penalty </ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label for="content">Content</Label>
              <Input
                type="text"
                name="content"
                value={this.state.activeItem.content}
                onChange={this.handleChange}
                placeholder={`Enter ${this.state.sectionName} Content`}
                invalid={!!validationErrors.content}
              />
              {validationErrors.content && (
                <div className="text-danger">{validationErrors.content}</div>
              )}
            </FormGroup> 

            <FormGroup>
              <Label for="type">Type</Label>
              <Input
                type="select"
                name="type"
                value={this.state.activeItem.type}
                onChange={this.handleChange}
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </Input>
            </FormGroup>
            
            <FormGroup>
              <Label for="place">Place in { this.state.sectionName } list</Label>
              <Input
                type="text"
                name="place"
                value={this.state.activeItem.place}
                onChange={this.handleChange}
              >
                
              </Input>
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
export default CustomModalPenalty;
