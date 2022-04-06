import React from 'react';
import styled from 'styled-components';
import SessionCard from './SessionCard.jsx';
import SessionAdder from './SessionAdder.jsx';
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

export default class Column extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      addSession: false
    };

    this.makeSession = this.makeSession.bind(this);
   
  }

 makeSession(e, id) {
    console.log('make sesh');
    this.setState({ addSession: true });
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

            {this.state.addSession ? <SessionAdder> </SessionAdder> : ''}
            <button onClick={(e) => this.makeSession(e, this.props.column.id)}> + Add a Card </button>
          </Container>
        )}
      </Draggable>
    );
  }
}