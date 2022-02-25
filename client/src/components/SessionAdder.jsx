import React from 'react';

class SessionAdder extends React.Component {

  constructor(props) {
    super(props);


    this.state = {
      sessionText: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.submitSession = this.submitSession.bind(this);
  }

  handleChange(e) {
    this.setState({ sessionText: e.target.value })
  }

  submitSession(e) {
    console.log(this.state.sessionText);
    axios.post('/session', {
      text: this.state.sessionText
    })
      .then((response) => {
        console.log(response);
      })
      .catch((response) => {
        console.log(error);
      });
  }

  render() {
    return (
      <div className="sessionAdder">

        <form onSubmit={this.submitSession}>

          <textarea rows="5" cols="50" name="sessiontext" defaultValue="Notes here" onChange={this.handleChange}>

          </textarea>

          <input type="submit" value="submit" />
        </form>

      </div>
    );
  }
}



export default SessionAdder;