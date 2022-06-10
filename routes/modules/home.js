const express = require('express')
const router = express.Router()

const Restaurant = require('../../models/Restaurant')


// render indexed.hbs

router.get('/', (req, res) => {
  const userId = req.user._id
  Restaurant.find({ userId })
    .lean()
    .then(restaurants => res.render('index', { restaurants }))
    .catch(error => console.log(error))
})

// add Search function

router.get('/search', (req, res) => {
  const keyword = req.query.keyword.trim()
  const sort = req.query.sort
  const sortRule = {
    default: { _id: 'asc' },
    name_asc: { name: 'asc' },
    name_desc: { name: 'desc' },
    rating_asc: { rating: 'asc' },
    rating_desc: { rating: 'desc' },
    category_asc: { category: 'asc' }
  }
  // console.log('sortRule', sortRule[sort])
  // console.log('sort', sort)
  // $regex 提供了在查詢 (query) 中找到符合的字串
  // $options: 'i' 代表大小寫皆可
  // $or 代表任一條件符合皆可
  Restaurant.find({
    $or: [
      { name: { $regex: keyword, $options: 'i' } },
      { name_en: { $regex: keyword, $options: 'i' } },
      { category: { $regex: keyword, $options: 'i' } }
    ]
  })
    .lean()
    .sort(sortRule[sort])
    .then(restaurants => res.render('index', { restaurants, keyword, sortRule }))
    .catch(error => console.log(error))
})

// router.get('/search', (req, res) => {
//   const keyword = req.query.keyword.trim().toLowerCase()
//   console.log('keyword', keyword)
//   Restaurant.find({})
//     .lean()
//     .then((restaurants) => {
//       const searchedRestaurant = restaurants.filter(restaurant => {
//         return restaurant.name.toLowerCase().includes(keyword) || restaurant.category.includes(keyword)
//       })
//       res.render('index', { restaurants: searchedRestaurant, keyword })
//     })
//     .catch(error => console.log(error))
// })




module.exports = router