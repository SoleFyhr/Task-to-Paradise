import React, { Component } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  FormErrorMessage,
} from "@chakra-ui/react";

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

  render() {
    const { toggle } = this.props;
    const { validationErrors, activeItem } = this.state;

    return (
      <Modal isOpen={true} onClose={toggle}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{this.state.sectionName}</ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <FormControl isInvalid={!!validationErrors.content}>
              <FormLabel htmlFor="content">Content</FormLabel>
              <Input
                id="content"
                type="text"
                name="content"
                value={activeItem.content}
                onChange={this.handleChange}
                placeholder={`Enter ${this.state.sectionName} Content`}
              />
              <FormErrorMessage>{validationErrors.content}</FormErrorMessage>
            </FormControl>

            <FormControl>
              <FormLabel htmlFor="type">Type</FormLabel>
              <Select
                id="type"
                name="type"
                value={activeItem.type}
                onChange={this.handleChange}
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel htmlFor="place">Place in {this.state.sectionName} list</FormLabel>
              <Input
                id="place"
                type="text"
                name="place"
                value={activeItem.place}
                onChange={this.handleChange}
              />
            </FormControl>
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

export default CustomModalPenalty;