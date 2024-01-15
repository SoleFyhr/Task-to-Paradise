import React, { Component } from "react";
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

class CustomModalSequence extends Component {
  constructor(props) {
    super(props);
    // Create an initial state based on the number of inputs
    const activeItem = {};
    for (let i = 1; i <= this.props.numberOfInputs; i++) {
      activeItem[`number${i}`] = '';
    }

    this.state = {
      activeItem,
      activeCategory: this.props.activeCategory,
      validationErrors: {},
    };
  }

  handleChange = (e) => {
    const { name, value } = e.target;
    const activeItem = { ...this.state.activeItem, [name]: value };
    this.setState({ activeItem });
  };

  validateForm = () => {
    let errors = {};
    for (let i = 1; i <= this.props.numberOfInputs; i++) {
      if (!this.state.activeItem[`number${i}`]) {
        errors[`number${i}`] = `Number ${i} is required`;
      }
    }

    this.setState({ validationErrors: errors });
    return Object.keys(errors).length === 0;
  };

  handleSave = () => {
    if (this.validateForm()) {
      this.props.onSave(this.state.activeItem,this.state.activeCategory);
    }
  };

  renderInputFields = () => {
    const { validationErrors, activeItem } = this.state;
    let inputFields = [];

    for (let i = 1; i <= this.props.numberOfInputs; i++) {
      inputFields.push(
        <FormGroup key={`number${i}`}>
          <Label for={`number${i}`}>{`Number ${i}`}</Label>
          <Input
            type="text"
            name={`number${i}`}
            value={activeItem[`number${i}`]}
            onChange={this.handleChange}
            placeholder={`Enter Number ${i}`}
            invalid={!!validationErrors[`number${i}`]}
          />
          {validationErrors[`number${i}`] && (
            <div className="text-danger">{validationErrors[`number${i}`]}</div>
          )}
        </FormGroup>
      );
    }

    return inputFields;
  };

  render() {
    const { toggle } = this.props;

    return (
      <Modal isOpen={true} toggle={toggle}>
        <ModalHeader toggle={toggle}>Sequence</ModalHeader>
        <ModalBody>
          <Form>
            {this.renderInputFields()}
          </Form>
        </ModalBody>
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
