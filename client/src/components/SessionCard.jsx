import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import styled from 'styled-components';

const Container = styled.div`
  margin: 8px;
  border: 1px solid lightgrey;
  border-radius: 2px;
  margin-bottom: 8px;
  background-color: white;
`;

 const SessionCard = (props) => {

    return (
      <Draggable draggableId={props.session.id} index={props.index}>
        {provided => (
          <Container
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
          >
            {props.session.content}
          </Container>
        )}
      </Draggable>
    );
}

export default SessionCard;