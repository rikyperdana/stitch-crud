var state = {},

withThis = (obj, cb) => cb(obj),
randomId = () =>
  [1, 1].map(() =>
    Math.random().toString(36).slice(2)
  ).join(''),

makeModal = name => m('.modal',
  {class: state[name] && 'is-active'},
  m('.modal-background'),
  m('.modal-content', state[name]),
  m('.modal-close.is-large', {onclick: () =>
    [state[name] = null, m.redraw()]
  })
)

m.mount(document.body, {view: () => m('.container', m('.content',
  m('h1', 'Atlas Stitch CRUD'),

  !localStorage.dbName ? m(autoForm({
    id: 'atlas',
    schema: {
      appId: {type: String, label: 'Stitch App ID'},
      dbName: {type: String, label: 'Database name'}
    },
    action: doc => [
      localStorage.setItem('appId', doc.appId),
      localStorage.setItem('dbName', doc.dbName),
      confirm('Refresh') && location.reload()
    ]
  })) :

  // Top row buttons
  m('.buttons',
    m('.button.is-primary', {
      onclick: () => state.modalGetCollection = m('.box',
        m(autoForm({
          id: 'getCollection', doc: state.target,
          schema: {
            collName: {type: String, label: 'Collection Name'},
          },
          action: doc => dbCall(
            db => db.collection(doc.collName).find({}).asArray(),
            res => _.assign(state, {
              target: doc, collData: res, modalGetCollection: null
            }) && m.redraw()
          )
        }))
      )
    }, 'Get Collection'),

    // Buttons only shows when collection loaded
    state.collData && [
      m('.button.is-success', {
        onclick: () => [
          state.collData = [], dbCall(
            db => db.collection(state.target.collName).find({}).asArray(),
            res => _.assign(state, {collData: res}) && m.redraw()
          )
        ]
      }, 'Refresh'),
      m('.button.is-info', {
        onclick: () => state.modalAdd = m('.box',
          m(autoForm({
            id: 'addItem',
            schema: {content: {
              type: String, autoform: {type: 'textarea', rows: 18}
            }},
            action: doc => [
              dbCall(
                db => db.collection(state.target.collName).insertOne(
                  _.merge(JSON.parse(doc.content), {_id: randomId()})
                ),
                console.log
              ),
              state.modalAdd = null, m.redraw()
            ]
          }))
        )
      }, 'Add'),
      m('.button.is-link', {
        onclick: () => saveAs((
          new Blob([
            [state.collData.map(i => JSON.stringify(i)+';').join('\n')]
          ], {type: 'text/csv;charset=utf-8;'})
        ), state.target.dbName+'-'+state.target.collName+'-'+Date()+'.csv')
      }, 'Export'),
      m('.button.is-warning', m('.file.is-warning', m('label.file-label',
        m('input.file-input', {type: 'file', name: 'import', onchange: e =>
          Papa.parse(e.target.files[0], {
            delimiter: ';', newline: ';',
            complete: result => dbCall(
              db => db.collection(state.target.collName)
                .insertMany(result.data.map(i => JSON.parse(i[0]))),
              console.log
            )
          })
        }),
        m('span.file-cta', m('span.file-label', 'Import'))
      ))),
      m('.button.is-danger', {
        ondblclick: () => confirm('Are you sure to drop this collection?')
        && dbCall(
          db => db.collection(state.target.collName).deleteMany({}),
          console.log
        )
      }, 'Drop')
    ]
  ),

  // Serach query bar
  state.collData && m('.control.is-expanded',
    m('input.input.is-fullwidth', {
      type: 'text', placeholder: 'Search by query, Ex: {"_id": "abc123"}',
      onkeypress: e => [
        e.redraw = false,
        e.key === 'Enter' && [
          state.searchResults = state.collData.filter(
            sift.default(JSON.parse(e.target.value))
          )
        ],
        m.redraw()
      ]
    })
  ),
  makeModal('modalGetCollection'),
  makeModal('modalItem'),
  makeModal('modalAdd'),

  // Collection table
  state.collData && m('table.table.is-striped',
    m('thead', m('tr', m('th', '#'), m('th', 'Document'))),
    m('tbody', (state.searchResults || state.collData || []).map((i, j) => m('tr',
      {
        ondblclick: () => state.modalItem = m('.box',
          m(autoForm({
            id: 'updateItem',
            schema:{ content: {
              type: String, autoform: {type: 'textarea', rows: 18}
            }},
            doc: {content: JSON.stringify(i, null, 4)},
            action: doc => [
              dbCall(
                db => withThis( JSON.parse(doc.content), obj =>
                  db.collection(state.target.collName)
                  .updateOne({_id: obj._id}, obj)
                ), console.log
              ),
              state.modalItem = null, m.redraw()
            ],
            submit: {value: 'Update', class: 'is-warning'}
          })),
          m('.button.is-danger', {
            ondblclick: () => [
              dbCall(
                db => db.collection(state.target.collName)
                  .deleteOne({_id: i._id}),
                console.log
              ),
              state.modalItem = null, m.redraw()
            ]
          }, 'Delete')
        )
      },
      m('td', j+1),
      m('td', JSON.stringify(i).substring(0, 150)+' ...')
    )))
  )
))})
