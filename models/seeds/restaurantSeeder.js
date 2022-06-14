const bcrypt = require('bcryptjs')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const Restaurant = require('../Restaurant')
const User = require('../user')
const db = require('../../config/mongoose')
const restaurantList = require('../../restaurant.json').results



const SEED_USERS = [
  {
    name: 'USER1',
    email: 'user1@example.com',
    password: '12345678',
    restaurantId: [1, 2, 3]
  },
  {
    name: 'USER2',
    email: 'user2@example.com',
    password: '12345678',
    restaurantId: [4, 5, 6]
  }

]

db.once('open', () => {
  return Promise.all(Array.from(SEED_USERS, SEED_USER => {
    return bcrypt
      .genSalt(10)
      .then(salt => bcrypt.hash(SEED_USER.password, salt))
      .then(hash => User.create({
        name: SEED_USER.name,
        email: SEED_USER.email,
        password: hash
      }))
      .then(user => {
        const userId = user._id
        const addRestaurants = restaurantList.filter(restaurant => {
          return SEED_USER.restaurantId.includes(restaurant._id)
        })
        return Promise.all(Array.from(addRestaurants, restaurant => {
          restaurant.userId = userId
          return Restaurant.create(restaurant)
        }))
      })
  }))
    .then(() => {
      console.log('Seeds done.')
      process.exit()
    })
    .catch(err => console.log(err))
})

// db.once('open', () => {
//   Promise.all(Array.from(SEED_USERS, SEED_USER => {
//     return bcrypt
//       .genSalt(10)
//       .then(salt => bcrypt.hash(SEED_USER.password, salt))
//       .then(hash => User.create({
//         name: SEED_USER.name,
//         email: SEED_USER.email,
//         password: hash
//       }))
//       .then(user => {

//         const userId = user._id
//         const seedRestaurants = restaurantList.filter(restaurant => {
//           return SEED_USER.restaurantId.includes(restaurant.id)

//         })
//         return Promise.all(Array.from(seedRestaurants, restaurant => {
//           restaurant.userId = userId
//           return Restaurant.create(restaurant)
//         }))
//       })
//   })
//   )
//     .then(() => {
//       console.log('Seeds Done.')
//       process.exit()
//     })
// })
      // .then(SEED_USER => {
      //   return Promise.all(Array.from(SEED_USER.restaurants, index => {
      //     const restaurant = restaurants[index]
      //     Object.assign(restaurant, { userId: user._id })
      //     return Restaurant.create(restaurant)

      //   }))
      // })



// db.once('open', () => {
//   return Promise.all(SEED_USERS.map(user => {
//     const resList = user.restaurantsForUser
//     User.create({
//       name: user.name,
//       email: user.email,
//       password: bcrypt.hashSync(user.password, bcrypt.genSaltSync(10))
//     })
//       .then(user => {
//         return Promise.all(resList.map(restaurant => {
//           Restaurant.create({
//             name: restaurant.name,
//             name_en: restaurant.name_en,
//             category: restaurant.category,
//             image: restaurant.image,
//             location: restaurant.location,
//             phone: restaurant.phone,
//             google_map: restaurant.google_map,
//             rating: restaurant.rating,
//             description: restaurant.description,
//             userId: user._id
//           })
//         }))
//       })
//   }))
//     .then(() => {
//       console.log('done!')
//       process.exit()
//     })