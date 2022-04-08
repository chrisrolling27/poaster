import React from 'react'
import styled from 'styled-components';
import Column from './Column.jsx';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { firebaseConfig } from '../firebase/firebase_config.js';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, addDoc } from 'firebase/firestore';

const Container = styled.div`
display: flex;
`;

const FormContainer = styled.div`
  paddings: 8px;
  
`;

export default class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {

      sessions: {
        'session-1': { id: 'session-1', content: 'Hello switcher' },
        'session-2': { id: 'session-2', content: 'Swiper no swiping' },
        'session-3': { id: 'session-3', content: 'Jezebel was innocent' },
        'session-4': { id: 'session-4', content: 'One more time with feeling' },
      },

      columns: {
        'column-1': {
          id: 'column-1',
          title: 'Ideas',
          sessionIds: ['session-1', 'session-2', 'session-3'],
        },
        'column-2': {
          id: 'column-2',
          title: 'Notes',
          sessionIds: [],
        },
        'column-3': {
          id: 'column-3',
          title: 'Suggestions',
          sessionIds: ['session-4'],
        },
      },

      columnOrder: ['column-1', 'column-2', 'column-3'],
      addSession: false,
      addColumn: false,
      totalSessions: 5,
      totalColumns: 3,
      columnName: '',


    };

    this.submitSession = this.submitSession.bind(this);
    this.makeColumn = this.makeColumn.bind(this);
    this.submitColumn = this.submitColumn.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {

    getDocs(colRef)
      .then((snapshot) => {
        let posts = [];
        snapshot.docs.forEach((doc) => {
          posts.push({ ...doc.data(), id: doc.id })
        })
        //console.log(posts);
        for (let i = 0; i < posts.length; i++) {
          //console.log(posts[i].content);
        }
      })
      .catch(err => {
        console.log(err.message);
      })
  }

//what lives in App and gets passed down as props?
// totalSessions, 

  submitSession(addedFrom, text) {
    
    let newId = `session-${this.state.totalSessions}`;
    let newSession = { id: newId, content: text };

    let updatedSessions = {
      ...this.state.sessions
    }

    updatedSessions[newId] = newSession;

    let updatedOrder = Array.from(this.state.columns[addedFrom].sessionIds);

    updatedOrder.push(newId);

    let oldColumns = this.state.columns;

    oldColumns[addedFrom].sessionIds = updatedOrder;

    let newTotal = this.state.totalSessions + 1;

    let newState = {
      ...this.state,
      sessions: updatedSessions,
      addSession: false,
      columns: oldColumns,
      totalSessions: newTotal
    }

    this.setState(newState);
  }


  //console.log(this.state.sessions.fromy.content)
  //console.log(this.state);
  //this works and does in fact add state.
  // addDoc(colRef, this.state)
  // .then(() => {
  //   console.log('added state?')
  // })
  ////



  makeColumn(e) {
    this.setState({ addColumn: !this.state.addColumn });
  }

  handleChange(e) {
    this.setState({ columnName: e.target.value });
  }

  submitColumn(e) {
    e.preventDefault();

    let incrementCol = this.state.totalColumns + 1;
    let newId = `column-${incrementCol}`;

    let newColumn = { id: newId, title: this.state.columnName, sessionIds: [] };
    let updatedColumns = this.state.columns;
    updatedColumns[newId] = newColumn;

    //Not sure why columns update without updatedColumnOrder state update
    let updatedColumnOrder = this.state.columnOrder;
    updatedColumnOrder.push(newId);

    this.setState({ addColumn: false, totalColumns: incrementCol });
  }



  onDragEnd(result) {

    const { destination, source, draggableId, type } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    if (type === 'column') {
      const newColumnOrder = Array.from(this.state.columnOrder);
      newColumnOrder.splice(source.index, 1);
      newColumnOrder.splice(destination.index, 0, draggableId);

      const newState = {
        ...this.state,
        columnOrder: newColumnOrder,
      };
      this.setState(newState);
      return;
    }

    const start = this.state.columns[source.droppableId];
    const finish = this.state.columns[destination.droppableId];

    if (start === finish) {
      const newSessionIds = Array.from(start.sessionIds);
      newSessionIds.splice(source.index, 1);
      newSessionIds.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...start,
        sessionIds: newSessionIds,
      };

      const newState = {
        ...this.state,
        columns: {
          ...this.state.columns,
          [newColumn.id]: newColumn,
        },
      };

      this.setState(newState);
      return;
    }

    const startSessionIds = Array.from(start.sessionIds);
    startSessionIds.splice(source.index, 1);
    const newStart = {
      ...start,
      sessionIds: startSessionIds,
    };

    const finishSessionIds = Array.from(finish.sessionIds);
    finishSessionIds.splice(destination.index, 0, draggableId);
    const newFinish = {
      ...finish,
      sessionIds: finishSessionIds,
    };

    const newState = {
      ...this.state,
      columns: {
        ...this.state.columns,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish,
      },
    };
    this.setState(newState);

  };


  render() {
    return (
      <div>
        <DragDropContext onDragEnd={this.onDragEnd}>
          <Droppable
            droppableId="all-columns"
            direction="horizontal"
            type="column"
          >
            {provided => (
              <Container
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {this.state.columnOrder.map((columnId, index) => {
                  const column = this.state.columns[columnId];
                  const sessions = column.sessionIds.map(sessionId => this.state.sessions[sessionId]);
                  return <Column 
                  key={column.id} 
                  column={column} 
                  submitSession={this.submitSession} 
                  sessions={sessions}
                  index={index} 
                  
                   />;
                })}
                {provided.placeholder}
              </Container>
            )}
          </Droppable>
        </DragDropContext>

        {/* ADDS COLUMS  */}
        <button onClick={this.makeColumn}>+ Column</button>
        {this.state.addColumn ?
          <FormContainer>
            <form onSubmit={(e) => this.submitColumn(e)}>
              <label> Title: </label>
              <input type="text" onChange={this.handleChange} />
              <input type="submit" value="Submit"  />
            </form> </FormContainer>
          : ''}

      </div>
    );
  }
}


//DB SETUP
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const colRef = collection(db, 'posts');