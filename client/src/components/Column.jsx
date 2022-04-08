import React from 'react';
import styled from 'styled-components';
import SessionCard from './SessionCard.jsx';
import { Droppable, Draggable } from 'react-beautiful-dnd';

const Container = styled.div`
  margin: 8px;
  border: 1px solid lightgrey;
  border-radius: 2px;
  margin-bottom: 8px;
  width: 220px;
  display: flex;
  flex-direction: column;
  background-color: white;
`;
const Title = styled.h3`
  paddings: 8px;
  border: 1px solid lightgrey;
`;
const SessionList = styled.div`
  paddings: 8px;
  min-height: 100px;
  flex-grow: 1;
`;

const TextBox = styled.textarea`
  border: 1px solid lightgrey;
  margin-left: 5px;
`;


export default class Column extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      addSession: false,
      sessionText: '',
      addedFrom: ''
    };

    this.makeSession = this.makeSession.bind(this);
    this.handleChange = this.handleChange.bind(this);

  }

  makeSession(id) {
    this.setState({ addSession: true, addedFrom: id });
  }

  handleChange(e) {
    this.setState({ sessionText: e.target.value })
  }


  render() {
    return (
      <Draggable draggableId={this.props.column.id} index={this.props.index}>
        {(provided) => (
          <Container {...provided.draggableProps}
            ref={provided.innerRef}>
            <Title {...provided.dragHandleProps}>
              {this.props.column.title}
            </Title>
            <Droppable droppableId={this.props.column.id} type="session">
              {provided => (
                <SessionList
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {this.props.sessions.map((session, index) => (
                    <SessionCard key={session.id} session={session} index={index} />
                  ))}
                  {provided.placeholder}
                </SessionList>
              )}
            </Droppable>

            {this.state.addSession ?
              <form onSubmit={(e) => this.props.submitSession(e, this.state.addedFrom, this.state.sessionText)}>
                <TextBox rows="1" cols="18" name="sessiontext" onChange={this.handleChange}>
                </TextBox>
                <input type="submit" value="Submit" />
              </form> : ''}

            <button onClick={() => this.makeSession(this.props.column.id)}> + Add a Card </button>

          </Container>
        )}
      </Draggable>
    );
  }
}