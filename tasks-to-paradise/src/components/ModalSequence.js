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
class CustomModalSequence extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeItem: this.props.activeItem,
      activeCategory: this.props.activeCategory,
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
    const { number1,number2,number3 } = this.state.activeItem;
    let errors = {};
    if (!number1) errors.number1 = "Number 1 is required";
    if (!number2) errors.number2 = "Number 2 is required";
    if (!number3) errors.number3 = "Number 3 is required";
    // Add other field validations as necessary

    this.setState({ validationErrors: errors });
    return Object.keys(errors).length === 0; // Return true if no errors
  };

  handleSave = () => {
    if (this.validateForm()) {
      this.props.onSave(this.state.activeItem,this.state.activeCategory);
    }
  };



  // rendering modal in the custommodal class received toggle and on save as props,
  render() {
    const { toggle } = this.props;
    const { validationErrors } = this.state;

    return (
      <Modal isOpen={true} toggle={toggle}>
        <ModalHeader toggle={toggle}> Sequence </ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label for="number1">Number 1</Label>
              <Input
                type="text"
                name="number1"
                value={this.state.activeItem.number1}
                onChange={this.handleChange}
                placeholder={`Enter Number 1`}
                invalid={!!validationErrors.number1}
              />
              {validationErrors.number1 && (
                <div className="text-danger">{validationErrors.content}</div>
              )}
            </FormGroup> 
            <FormGroup>
              <Label for="number2">Number 2</Label>
              <Input
                type="text"
                name="number2"
                value={this.state.activeItem.number2}
                onChange={this.handleChange}
                placeholder={`Enter Number 2`}
                invalid={!!validationErrors.number2}
              />
              {validationErrors.number2 && (
                <div className="text-danger">{validationErrors.content}</div>
              )}
            </FormGroup> 
            <FormGroup>
              <Label for="number3">Number 3</Label>
              <Input
                type="text"
                name="number3"
                value={this.state.activeItem.number3}
                onChange={this.handleChange}
                placeholder={`Enter Number 3`}
                invalid={!!validationErrors.number3}
              />
              {validationErrors.number3 && (
                <div className="text-danger">{validationErrors.content}</div>
              )}
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
export default CustomModalSequence;
