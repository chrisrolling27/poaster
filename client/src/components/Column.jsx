import React from 'react';
import styled from 'styled-components';
import SessionCard from './SessionCard.jsx';
import { Droppable } from 'react-beautiful-dnd';


const Container = styled.div`
  margin: 8px;
  border: 1px solid lightgrey;
  border-radius: 2px;
  margin-bottom: 8px;
`;
const Title = styled.h3`
  paddings: 8px;
`;
const SessionList = styled.div`
  paddings: 8px;
`;


export default class Column extends React.Component {

  render() {
    return (
      <Container>
        <Title>  {this.props.column.title} </Title>
        <Droppable droppableId={this.props.column.id}>
          {provided => (
            <SessionList ref={provided.innerRef} {...provided.droppableProps} >

              {this.props.sessions.map((session, index) => (
              <SessionCard key={session.id} session={session} index={index} />
          ))}
              {provided.placeholder}
            </SessionList>
          )}
        </Droppable>
      </Container>
    );
  }
}