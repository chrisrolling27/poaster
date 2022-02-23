

const initialData = {

  sessions: {
    'session-1': {id: 'session-1', content: 'Hello switcher' },
    'session-2': {id: 'session-2', content: 'Swiper no swiping' },
    'session-3': {id: 'session-3', content: 'Jezebel was innocent' },
    'session-4': {id: 'session-4', content: 'One more time with feeling' },
  },

  columns: {
    'column-1': {
      id: 'column-1',
      title: 'Ideas',
      sessionIds: ['session-1', 'session-2', 'session-3', 'session-4'],
    },
    'column-2': {
      id: 'column-2',
      title: 'Notes',
      sessionIds: [],
    },
    'column-3': {
      id: 'column-3',
      title: 'Suggestions',
      sessionIds: [],
    },
  },
    columnOrder: ['column-1', 'column-2', 'column-3'],

    addSession: false,

};

export default initialData;



