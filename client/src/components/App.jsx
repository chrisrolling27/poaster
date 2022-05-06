import React from 'react'
import styled from 'styled-components';
import Column from './Column.jsx';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { firebaseConfig } from '../firebase/firebase_config.js';
import { initializeApp } from 'firebase/app';
import { getFirestore, addDoc, query, collection, where, doc, getDoc, getDocs, setDoc } from 'firebase/firestore';


const Container = styled.div`
display: flex;
`;
const FormContainer = styled.div`
  paddings: 8px; 
`;
const AddColumnButton = styled.button`
  color: tomato;
  border-color: tomato;
  display: inline-block;
  color: palevioletred;
  font-size: 1em;
  margin: 1em;
  padding: 0.25em 1em;
  border: 2px solid palevioletred;
  border-radius: 3px;
  display: block;
`;

let orig = {

  sessions: {},
  columns: {},
  columnOrder: [],
  addSession: false,
  addColumn: false,
  columnName: '',

};



export default class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = JSON.parse(
      window.localStorage.getItem('mysakey')
    ) || orig;
  

    this.submitSession = this.submitSession.bind(this);
    this.makeColumn = this.makeColumn.bind(this);
    this.submitColumn = this.submitColumn.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {

    console.log(window.localStorage.getItem('mysakey'));


    // getDoc(userRef)
    //   .then((snapshot) => {

    //     let userSessions = snapshot.data().sessions;
    //     let userColumns = snapshot.data().columns;
    //     let columnOrder = snapshot.data().columnOrder || [];

    //     this.setState({ sessions: userSessions, columns: userColumns, columnOrder: columnOrder })
    //   })
    //   .catch(err => {
    //     console.log(err);
    //   })
  }

  componentDidUpdate() {
    window.localStorage.setItem(
      'mysakey',
      JSON.stringify(this.state)
    );
  }

  submitSession(addedFrom, text) {

    if (Object.keys(this.state.sessions || {}).length === 0) {
      var nextId = 1;
    } else {
      var nextId = Object.keys(this.state.sessions).length + 1;
    }
    let newId = `session-${nextId}`;

    let newSession = { id: newId, content: text, isHidden: false, date: Date.now() };

    let updatedSessions = this.state.sessions || {};
    updatedSessions[newId] = newSession;

    let currentColumns = this.state.columns;

    let newOrder = Array.from(currentColumns[addedFrom].sessionIds);
    newOrder.push(newId);

    currentColumns[addedFrom].sessionIds = newOrder;

    let newState = {
      sessions: updatedSessions,
      columns: currentColumns,
      addSession: false
    }

    let nestedUpdate = {};

    nestedUpdate['sessions'] = updatedSessions;
    nestedUpdate['columns'] = currentColumns;

    //setDoc(userRef, nestedUpdate);
    this.setState(newState);
  }


  makeColumn() {
    this.setState({ addColumn: !this.state.addColumn });
  }

  handleChange(e) {
    this.setState({ columnName: e.target.value });
  }

  submitColumn(e) {
    e.preventDefault();

    if (Object.keys(this.state.columns || {}).length === 0) {
      var nextColumn = 1;
    } else {
      var nextColumn = Object.keys(this.state.columns).length + 1;
    }

    let newId = `column-${nextColumn}`;

    let newColumn = { id: newId, title: this.state.columnName, sessionIds: [] };

    if (nextColumn === 1) {
      var updatedColumns = {};
    } else {
      var updatedColumns = this.state.columns;
    }

    updatedColumns[newId] = newColumn;

    let updatedColumnOrder = this.state.columnOrder;
    updatedColumnOrder.push(newId);

    const newState = {
      columns: updatedColumns,
      columnOrder: updatedColumnOrder,
      addColumn: false
    };

    //setDoc(userRef, newState);
    this.setState(newState);
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

      setDoc(userRef, newState);
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


      //setDoc(userRef, newState);
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

    //setDoc(userRef, newState);
    this.setState(newState);
  };


  render() {
    return (
      <div className="app">
        <DragDropContext
          onDragStart={this.onDragStart}
          onDragEnd={this.onDragEnd}
          onDragUpdate={this.onDragUpdate}
        >
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
        <AddColumnButton onClick={this.makeColumn}>+ Column</AddColumnButton>
        {this.state.addColumn ?
          <FormContainer>
            <form onSubmit={(e) => this.submitColumn(e)}>
              {/* <label> Title: </label> */}
              <input type="text" onChange={this.handleChange} required />
              <input type="submit" value="Submit" />
            </form> </FormContainer>
          : ''}
      </div>
    );
  }
}

//DB SETUP
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

//test dummy user
const userRef = doc(db, "userDocs", "eiiXq5FO1dFPa0WJlff0");


