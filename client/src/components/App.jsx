import React from 'react'
import styled from 'styled-components';
import SessionAdder from './SessionAdder.jsx';
import SessionCard from './SessionCard.jsx';
import Column from './Column.jsx';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { firebaseConfig } from '../firebase/firebase_config.js';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, addDoc } from 'firebase/firestore';


const Container = styled.div`
display: flex;
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

      addSession: false,
      columnOrder: ['column-1', 'column-2', 'column-3'],
      addedFrom: '',


    };

    this.makeSession = this.makeSession.bind(this);
    this.submitSession = this.submitSession.bind(this);
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


  makeSession(e, id) {

    //console.log(id);
    this.setState({addSession: true, addedFrom: id});

  }

  submitSession(e, text) {
    e.preventDefault();

    //console.log(text);

    console.log(this.state.addedFrom);

    //just make the session itself (maybe have global counter?) and then separately worry about position

    //let fromy = String(this.state.addedFrom);
    //console.log(fromy);
    //console.log(this.state.sessions.fromy.content);




    //console.log(this.state.sessions.fromy.content)
   //console.log(this.state);
    //this works and does in fact add state.
    // addDoc(colRef, this.state)
    // .then(() => {
    //   console.log('added state?')
    // })
    //

    this.setState({addSession: false});

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

                return <Column key={column.id} column={column} sessions={sessions} index={index} makeSession={this.makeSession}/>;
              })}
              {provided.placeholder}
            </Container>
          )}
        </Droppable>
      </DragDropContext>

      {this.state.addSession ? <SessionAdder submitSession={this.submitSession}> </SessionAdder> : ''}
      </div>
    );
  }
}

//DB SETUP
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const colRef = collection(db, 'posts');
