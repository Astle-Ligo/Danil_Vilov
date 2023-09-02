var express = require('express');
var router = express.Router();


const productHelpers = require('../helpers/product-helpers');
const adminHelpers = require('../helpers/admin-helpers');

/* GET home page. */
router.get('/', function (req, res, next) {
  Promise.all([
    productHelpers.getAllNewDrop(),
    adminHelpers.getAllCarousel()
  ])
    .then(([products, images]) => {
      res.render('user/view-products', { admin: false, products, images });
    })
    .catch(error => {
      // handle error
      next(error);
    });
});


// router.get('/', (req, res, next)=>{
// })

router.get('/about-us', (req, res) => {
  res.render('user/about-us')
})

router.get('/products', (req, res, next) => {
  productHelpers.getAllProducts().then((products) => {
    res.render('user/products', { admin: false, products })
  })
})

router.get('/product/:id', async (req, res) => {
  let product = await productHelpers.getProductDetails(req.params.id)
  console.log(product);
  res.render('user/product-page', { product, admin: false })
})

router.post('/product/:id', async (req, res) => {
  console.log(req.body);
})

router.get(':id', async (req, res) => {
  let product = await productHelpers.getProductDetails(req.params.id)
  console.log(product);
  res.render('user/product-page', { product, admin: false })
})

module.exports = router;
