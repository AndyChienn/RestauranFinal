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
      .then(hash => {
        return User.create({
          name: SEED_USER.name,
          email: SEED_USER.email,
          password: hash
        }).then((user) => {
          const addRestaurants = restaurantList.filter(restaurant => {
            return SEED_USER.restaurantId.includes(restaurant.id)
          })
          return Promise.all(Array.from(addRestaurants, addRestaurant => {
            addRestaurant.userId = user._id
            return Restaurant.create(addRestaurant)
          }))
        })
      })
  }))
    .then(() => {
      console.log('Seeds done.')
      process.exit()
    })
    .catch(err => console.log(err))
})

//以下為學習後面教案所更新的各種用法 SEED_USERS的設定也些許不同
// const SEED_USERS = [
//   {
//     name: 'USER1',
//     email: 'user1@example.com',
//     password: '12345678',
//   },
//   {
//     name: 'USER2',
//     email: 'user2@example.com',
//     password: '12345678',
//   }
// ]

//method: async await

// db.once('open', async () => {
//   await Promise.all(
//     SEED_USERS.map(async (SEED_USER, SEED_USER_index) => {
//       const salt = await bcrypt.genSalt(10)
//       const hash = await bcrypt.hash(SEED_USER.password, salt)
//       const user = await User.create({ name: SEED_USER.name, email: SEED_USER.email, password: hash })
//       console.log('user created')
//       const userRestaurant = []
//       restaurantList.forEach((restaurant, rest_index) => {
//         if (rest_index >= 3 * SEED_USER_index && rest_index < 3 * (SEED_USER_index + 1)) {
//           restaurant.userId = user._id
//           userRestaurant.push(restaurant)
//         }
//       })
//       await Restaurant.create(userRestaurant)
//       console.log('restaurant created')
//     })
//   )
//   console.log('all created')
//   process.exit()
// })

// method: Promise.all
// db.once('open', () => {
//   Promise.all(
//     SEED_USERS.map((SEED_USER, SEED_USER_index) => {
//       return bcrypt.genSalt(10)
//         .then(salt => bcrypt.hash(SEED_USER.password, salt))
//         .then(hash => {
//           return User.create({
//             name: SEED_USER.name,
//             email: SEED_USER.email,
//             password: hash
//           }).then((SEED_USER) => {
//             console.log('users created')
//             const userRestaurant = []
//             restaurantList.forEach((restaurant, rest_index) => {
//               if (rest_index >= 3 * SEED_USER_index && rest_index < 3 * (SEED_USER_index + 1)) {
//                 restaurant.userId = SEED_USER._id
//                 userRestaurant.push(restaurant)
//               }
//             })
//             return Restaurant.create(userRestaurant)
//           })
//         })
//     })
//   ).then(() => {
//     console.log('all created!')
//     process.exit()
//   })
// })



// method: promise

// db.once('open', () => {
//   new Promise((resolve, _reject) => {
//     for (const [SEED_USER_index, SEED_USER] of SEED_USERS.entries()) {
//       bcrypt.genSalt(10)
//         .then(salt => bcrypt.hash(SEED_USER.password, salt))
//         .then(hash => {
//           return User.create({
//             name: SEED_USER.name,
//             email: SEED_USER.email,
//             password: hash
//           }).then((SEED_USER) => {
//             console.log('user created')
//             console.log('SEED_USER', SEED_USER)
//             const userRestaurant = []
//             restaurantList.forEach((restaurant, rest_index) => {
//               if (rest_index >= 3 * SEED_USER_index && rest_index < 3 * (SEED_USER_index + 1)) {
//                 restaurant.userId = SEED_USER._id
//                 userRestaurant.push(restaurant)
//               }
//             })
//             return Restaurant.create(userRestaurant)
//           })
//         })
//         .then(() => {
//           console.log('restaurants created!')

//           if (SEED_USER_index >= SEED_USERS.length - 1) {
//             resolve()
//           }
//         })
//     }
//   }).then(() => {
//     console.log('all created!')
//     process.exit()
//   })

// })

// db.once('open', () => {
//   new Promise((resolve, _reject) => {
//     for (const [SEED_USER_index, SEED_USER] of SEED_USERS.entries()) {
//       bcrypt.genSalt(10)
//         .then(salt => bcrypt.hash(SEED_USER.password, salt))
//         .then(hash => {
//           return User.create({
//             name: SEED_USER.name,
//             email: SEED_USER.email,
//             password: hash
//           })
//         })
//         .then((SEED_USER) => {
//           console.log('user created')
//           console.log('SEED_USER', SEED_USER)
//           const userRestaurant = []
//           restaurantList.forEach((restaurant, rest_index) => {
//             if (rest_index >= 3 * SEED_USER_index && rest_index < 3 * (SEED_USER_index + 1)) {
//               restaurant.userId = SEED_USER._id
//               userRestaurant.push(restaurant)
//             }
//           })
//           return Restaurant.create(userRestaurant)
//         }).then(() => {
//           console.log('restaurants created!')
//           if (SEED_USER_index >= SEED_USERS.length - 1) {
//             resolve()
//           }
//         })
//     }
//   }).then(() => {
//     console.log('all created!')
//     process.exit()
//   })

// })



//method: callback

// db.once('open', () => {
//   for (const [SEED_USER_index, SEED_USER] of SEED_USERS.entries()) {
//     bcrypt.genSalt(10)
//       .then(salt => bcrypt.hash(SEED_USER.password, salt))
//       .then(hash => {
//         User.create({
//           name: SEED_USER.name,
//           email: SEED_USER.email,
//           password: hash
//         },
//           (err, SEED_USER) => {
//             console.log('SEED_USER created')
//             const userRestaurant = []
//             restaurantList.forEach((restaurant, res_index) => {
//               if (res_index >= 3 * SEED_USER_index && res_index < 3 * (SEED_USER_index + 1)) {
//                 restaurant.userId = SEED_USER._id
//                 userRestaurant.push(restaurant)
//               }
//             })
//             Restaurant.create(userRestaurant, () => {
//               console.log('restaurants created!')
//               // console.log(userRestaurant)
//               if (SEED_USER_index >= SEED_USERS.length - 1) {
//                 console.log('all created!')
//                 process.exit()
//               }
//             })
//           })
//       })
//   }
// })

// db.once('open', () => {
//   return Promise.all(Array.from(SEED_USERS, SEED_USER => {
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
//         const addRestaurants = restaurantList.filter(restaurant => {
//           return SEED_USER.restaurantId.includes(restaurant._id)
//         })
//         return Promise.all(Array.from(addRestaurants, restaurant => {
//           restaurant.userId = userId
//           return Restaurant.create(restaurant)
//         }))
//       })
//   }))
//     .then(() => {
//       console.log('Seeds done.')
//       process.exit()
//     })
//     .catch(err => console.log(err))
// })

