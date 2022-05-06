import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import styled from 'styled-components';

const Container = styled.div`
  margin: 8px;
  text-align: center;
  
  padding: 50px 0;
  border: 1px solid lightgrey;
  border-radius: 2px;
  margin-bottom: 8px;
  background-color: white;
  height: 30px;
  background-color: ${props => (props.isDragging ? 'lightgreen' : 'white')};
`;

 const SessionCard = (props) => {

    return (
      <Draggable draggableId={props.session.id} index={props.index}>
        {(provided, snapshot) => (
          <Container
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
            isDragging={snapshot.isDragging}
          >
            {props.session.content}
          </Container>
        )}
      </Draggable>
    );
}

export default SessionCard;