const express = require('express')
const session = require('express-session')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')

const routes = require('./routes')
require('./config/mongoose')

const usePassport = require('./config/passport')

const app = express()
const port = 3000
// const { redirect } = require('express/lib/response')突然自己冒出
// const urlencoded = require('body-parser/lib/types/urlencoded')突然自己冒出
const Handlebars = require('handlebars')

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

app.use(session({
  secret: 'thisismysecret',
  resave: false,
  saveUninitialized: true
}))

app.use(methodOverride('_method'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'))

usePassport(app)
// 設定路由
app.use(routes)


Handlebars.registerHelper('select', function (selected, options) {
  return options.fn(this).replace(
    new RegExp(' value=\"' + selected + '\"'),
    '$& selected="selected"');
});
// 設定 port 3000
app.listen(port, () => {
  console.log(`Express is listening on http://localhost:${port}`)
})