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



  // rendering modal in the custommodal class received toggle and on save as props,
  render() {
    const { toggle } = this.props;


    return (
      <Modal isOpen={true} toggle={toggle}>
        <ModalHeader toggle={toggle}> Completion </ModalHeader>
        <ModalBody>
          <Form>
          <FormGroup>
              <Label for="completion">Type</Label>
              <Input
                type="select"
                name="completion"
                value={this.state.activeItem.completion}
                onChange={this.handleChange}
              >
                <option value="went with the motion">Went with the motion</option>
                <option value="average">Average</option>
                <option value="good">Good</option>
                <option value="perfect">Perfect</option>
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
export default CustomModalCompletion;
