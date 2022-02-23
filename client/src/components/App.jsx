import React from 'react'
import SessionAdder from './SessionAdder.jsx';
import SessionCard from './SessionCard.jsx';
import styled from 'styled-components';
import { DragDropContext } from 'react-beautiful-dnd';
import axios from 'axios';
import Column from './Column.jsx';
import initialData from './initialData';
import { firebaseConfig } from '../firebase/firebase_config.js';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, addDoc } from 'firebase/firestore';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const colRef = collection(db, 'posts');

const Container = styled.div`
display: flex;
`;



export default class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = initialData;

    this.makeSession = this.makeSession.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);

  }

  componentDidMount() {

    getDocs(colRef)
      .then((snapshot) => {
        let posts = [];
        snapshot.docs.forEach((doc) => {
          posts.push({ ...doc.data(), id: doc.id })
        })
        console.log(posts);
        for (let i = 0; i < posts.length; i++) {
          console.log(posts[i].content);
        }
      })
      .catch(err => {
        console.log(err.message);
      })
  }



  makeSession() {

    console.log('boink');
    console.log(this.state);

    //this works and does in fact add state.
    // addDoc(colRef, this.state)
    // .then(() => {
    //   console.log('added state?')
    // })

  }

  onDragEnd(result) {

    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
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

          <Container>
            {this.state.columnOrder.map(columnId => {
              const column = this.state.columns[columnId];
              const sessions = column.sessionIds.map(sessionId => this.state.sessions[sessionId]);

              return <Column key={column.id} column={column} sessions={sessions} />;
            })}
          </Container>
        </DragDropContext>

        {this.state.addSession ? <SessionAdder> </SessionAdder> : ''}
        <button className="addSessionButton" onClick={this.makeSession}> + </button>
      </div>
    )
  };
};