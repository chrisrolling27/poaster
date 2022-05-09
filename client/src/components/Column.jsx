import React from 'react';
import styled from 'styled-components';
import SessionCard from './SessionCard.jsx';
import { Droppable, Draggable } from 'react-beautiful-dnd';

const Container = styled.div`
  margin: 8px;
  border: 1px;
  border-radius: 2px;
  margin-bottom: 8px;
  width: 500px;
  height: 700px;
  display: flex;
  flex-direction: column;
  background-color: lightskyblue;
`;
const Title = styled.h3`
  paddings: 8px;
  border: 1px;
  font-size: 1em;
  background-color: moccasin;
  text-align: center;
  font-family: 'Roboto Flex', sans-serif;
`;
const SessionList = styled.div`
  paddings: 8px;
  min-height: 100px;
  flex-grow: 1;
  font-size: 1em;
  background-color: ${props => (props.isDraggingOver ? 'SkyBlue' : 'lightskyblue')};
`;

const TextBox = styled.input`
  font-size: 1em;
  margin-left: 5px;
  margin-bottom: 5px;in
  background-color: white;
  
`;

const AddCardButton = styled.button`

background-color: lightskyblue;
border: light;
text-align: left;
font-size: 1em;
border: 1px solid lightskyblue;

`;

const SubmitButton = styled.button`

background-color: red;
border: light;
text-align: left;
border: 1px solid lightskyblue;

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
    this.submitClear = this.submitClear.bind(this);
  }

  makeSession(id) {
    this.setState({ addSession: true, addedFrom: id });
  }

  handleChange(e) {
    this.setState({ sessionText: e.target.value })
  }

  submitClear(e, addedFrom, sessionText) {
    e.preventDefault();
    this.props.submitSession(addedFrom, sessionText);
    this.setState({ addSession: false });
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
              {(provided, snapshot) => (
                <SessionList
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  isDraggingOver={snapshot.isDraggingOver}
                >
                  {this.props.sessions.map((session, index) => (
                    <SessionCard key={session.id} session={session} index={index} />
                  ))}
                  {provided.placeholder}
                </SessionList>
              )}
            </Droppable>
            
            {this.state.addSession ?
              <form onSubmit={(e) => this.submitClear(e, this.state.addedFrom, this.state.sessionText) }>
                <TextBox name="sessiontext" required onChange={this.handleChange}>
                </TextBox>
              
                <input type="submit" background value="Submit!" />
              </form> : <AddCardButton onClick={() => this.makeSession(this.props.column.id)}> + Add a Card </AddCardButton>}

          </Container>
        )}
      </Draggable>
    );
  }
}

