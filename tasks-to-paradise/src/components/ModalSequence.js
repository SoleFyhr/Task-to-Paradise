import React, { Component } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
} from "@chakra-ui/react";

class CustomModalSequence extends Component {
  constructor(props) {
    super(props);
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
        <FormControl key={`number${i}`} isInvalid={!!validationErrors[`number${i}`]}>
          <FormLabel htmlFor={`number${i}`}>{`Number ${i}`}</FormLabel>
          <Input
            id={`number${i}`}
            type="text"
            name={`number${i}`}
            value={activeItem[`number${i}`]}
            onChange={this.handleChange}
            placeholder={`Enter Number ${i}`}
          />
          <FormErrorMessage>{validationErrors[`number${i}`]}</FormErrorMessage>
        </FormControl>
      );
    }

    return inputFields;
  };

  render() {
    const { toggle } = this.props;

    return (
      <Modal isOpen={true} onClose={toggle}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Sequence</ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            {this.renderInputFields()}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="green" onClick={this.handleSave}>
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  }
}

export default CustomModalSequence;