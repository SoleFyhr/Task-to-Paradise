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
  Select,
} from "@chakra-ui/react";

class CustomModalCompletion extends Component {
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


  handleSave = () => {
    this.props.onSave(this.state.activeItem);
  };

  render() {
    const { toggle } = this.props;
    const { activeItem } = this.state;

    return (
      <Modal isOpen={true} onClose={toggle}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Completion</ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <FormControl>
              <FormLabel htmlFor="completion">Type</FormLabel>
              <Select
                id="completion"
                name="completion"
                value={activeItem.completion}
                onChange={this.handleChange}
              >
                <option value="went through the motion">Went through the motion</option>
                <option value="average">Average</option>
                <option value="good">Good</option>
                <option value="perfect">Perfect</option>
              </Select>
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

export default CustomModalCompletion;