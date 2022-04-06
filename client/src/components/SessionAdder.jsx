import React from 'react';
import styled from 'styled-components';

const TextBox = styled.textarea`

  border: 1px solid lightgrey;
  margin-left: 5px;

`;

class SessionAdder extends React.Component {

  constructor(props) {
    super(props);


    this.state = {
      sessionText: ''
    };

    this.handleChange = this.handleChange.bind(this);

  }

  handleChange(e) {
    this.setState({ sessionText: e.target.value })
  }

  render() {
    return (

      <form onSubmit={(e) => this.props.submitSession(e, this.state.sessionText)}>

        <TextBox rows="3" cols="20" name="sessiontext" onChange={this.handleChange}>
        </TextBox>

        <input type="submit" value="Submit" />
      </form>
    );
  }
}



export default SessionAdder;