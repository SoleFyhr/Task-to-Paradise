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
  Select,
  Checkbox,
  FormErrorMessage,
} from "@chakra-ui/react";

class CustomModal extends Component {
  constructor(props) {
    super(props);
    const penaltyInducedAsBoolean =
      this.props.activeItem.penalty_induced !== "";
    console.log("ayo");
    console.log(penaltyInducedAsBoolean);
    this.state = {
      activeItem: { ...this.props.activeItem },
      validationErrors: {},
      checked_penalty: penaltyInducedAsBoolean,
    };
    this.fieldConfig = {
      daily: [
        "title",
        "content",
        "type",
        "difficulty",
        "importance",
        "penalty_induced",
      ],
      prohibited: ["title", "content", "type", "importance", "penalty_induced"],
      once: [
        "title",
        "content",
        "type",
        "expiration_time",
        "difficulty",
        "importance",
        "penalty_induced",
      ],
      habits: [
        "title",
        "content",
        "type",
        "time_to_completion",
        "frequency_coming_back",
        "difficulty",
        "importance",
        "penalty_induced",
      ],
      // Add new types here as needed
    };
  }

  // changes handler to check if a checkbox is checked or not
  handleChange = (e) => {
    let { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      value = checked; // Store boolean value for checkbox
      // Reset penalty_induced_content if checkbox is unchecked
      if (!checked) {
        this.setState((prevState) => ({
          activeItem: { ...prevState.activeItem, penalty_induced: "" },
        }));
      }

      this.setState({
        checked_penalty: checked,
      });
    } else {
      const activeItem = { ...this.state.activeItem, [name]: value };
      this.setState({ activeItem });
    }
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
      // Before saving, adjust the penalty_induced value based on the checkbox and input field
      // const { penalty_induced, penalty_induced_content, ...rest } =
      //   this.state.activeItem;
      // const activeItemToSave = {
      //   ...rest,
      //   penalty_induced: penalty_induced
      //     ? penalty_induced_content || "false"
      //     : "false",
      // };
      this.props.onSave(this.state.activeItem);
    }
  };

  renderField = (fieldName) => {
    const { activeItem, validationErrors, checked_penalty } = this.state;

    switch (fieldName) {
      case "title":
        return (
          <FormControl key="title" isInvalid={!!validationErrors.title}>
            <FormLabel htmlFor="title">Title</FormLabel>
            <Input
              id="title"
              type="text"
              name="title"
              value={activeItem.title}
              onChange={this.handleChange}
              placeholder="Enter Task Title"
            />
            <FormErrorMessage>{validationErrors.title}</FormErrorMessage>
          </FormControl>
        );
      case "content":
        return (
          <FormControl key="content">
            <FormLabel htmlFor="content">Details</FormLabel>
            <Input
              id="content"
              type="text"
              name="content"
              value={activeItem.content}
              onChange={this.handleChange}
              placeholder="Enter Task Details"
            />
          </FormControl>
        );
      case "difficulty":
        return (
          <FormControl key="difficulty">
            <FormLabel htmlFor="difficulty">Difficulty</FormLabel>
            <Select
              id="difficulty"
              name="difficulty"
              value={activeItem.difficulty}
              onChange={this.handleChange}
            >
              <option value="very_easy">Very Easy</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Difficult</option>
            </Select>
          </FormControl>
        );
      case "importance":
        return (
          <FormControl key="importance">
            <FormLabel htmlFor="importance">Importance</FormLabel>
            <Select
              id="importance"
              name="importance"
              value={activeItem.importance}
              onChange={this.handleChange}
            >
              <option value="not so important">Not so important</option>
              <option value="important">Important</option>
              <option value="very important">Very important</option>
            </Select>
          </FormControl>
        );

      case "type":
        return (
          <FormControl key="type">
            <FormLabel htmlFor="type">Type</FormLabel>
            <Select
              id="type"
              name="type"
              value={activeItem.type}
              onChange={this.handleChange}
            >
              <option value="once">Once</option>
              <option value="daily">Daily</option>
              <option value="habits">Habits</option>
              <option value="prohibited">Prohibited</option>
            </Select>
          </FormControl>
        );
      case "expiration_time":
        return (
          <FormControl key="expiration_time">
            <FormLabel htmlFor="expiration_time">Expiration Time</FormLabel>
            <Input
              id="expiration_time"
              type="date"
              name="expiration_time"
              value={activeItem.expiration_time}
              onChange={this.handleChange}
            />
          </FormControl>
        );
      case "time_to_completion":
        return (
          <FormControl key="time_to_completion">
            <FormLabel htmlFor="time_to_completion">
              Time to Complete the Habits
            </FormLabel>
            <Input
              id="time_to_completion"
              type="text"
              name="time_to_completion"
              value={activeItem.time_to_completion}
              onChange={this.handleChange}
              placeholder="Enter the amount of time under which you should complete the task"
            />
          </FormControl>
        );
      case "frequency_coming_back":
        return (
          <FormControl key="frequency_coming_back">
            <FormLabel htmlFor="frequency_coming_back">
              Frequency of Coming Back
            </FormLabel>
            <Input
              id="frequency_coming_back"
              type="text"
              name="frequency_coming_back"
              value={activeItem.frequency_coming_back}
              onChange={this.handleChange}
              placeholder="Enter the frequency in which the habits should come back in being active"
            />
          </FormControl>
        );

      case "penalty_induced":
        return (
          <FormControl key="penalty_induced">
            <Checkbox
              id="check_penalty_induced"
              name="check_penalty_induced"
              isChecked={checked_penalty}
              onChange={this.handleChange}
            >
              Penalty induced
            </Checkbox>
            {checked_penalty && (
              <Input
                mt={4}
                id="penalty_induced"
                type="text"
                name="penalty_induced"
                value={activeItem.penalty_induced}
                onChange={this.handleChange}
                placeholder="Enter penalty induced "
              />
            )}
          </FormControl>
        );

      default:
        return null;
    }
  };

  render() {
    const { toggle } = this.props;
    const { activeItem } = this.state;
    const fieldsToShow = this.fieldConfig[activeItem.type] || [];

    return (
      <Modal isOpen={true} onClose={toggle}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Task</ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            {fieldsToShow.map((fieldName) => this.renderField(fieldName))}
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

export default CustomModal;
