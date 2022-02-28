import React from 'react';

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
      <div className="sessionAdder">

        <form onSubmit={(e) => this.props.submitSession(e, this.state.sessionText)}>


          <textarea rows="5" cols="50" name="sessiontext" defaultValue="Notes here" onChange={this.handleChange}>

          </textarea>

          <input type="submit" value="submit" />
        </form>

      </div>
    );
  }
}



export default SessionAdder;