var express = require('express');
var router = express.Router();

const productHelpers = require('../helpers/product-helpers')
const adminHelpers = require('../helpers/admin-helpers')

/* GET users listing. */

router.get('/', (req, res) => {
  let adminUser = req.session.admin
  if (adminUser) {

    productHelpers.getAllProducts().then((products) => {
      res.render('admin/view-products', { admin: true, products, adminUser, homeStatus: true })
    })
  } else {
    adminHelpers.findAdminCount().then((result) => {
      if (result.status > 0) {
        res.render('admin/no-user', { admin: true, count: true })
      } else {
        res.render('admin/no-user', { admin: true, count: false })
      }
    })
  }
})


router.get('/add-product', (req, res) => {
  let adminUser = req.session.admin
  res.render('admin/add-product', { admin: true, adminUser, homeStatus: false })
})

router.post('/add-product', (req, res) => {
  let adminUser = req.session.admin
  if (req.body.new) {
    productHelpers.addNewDrop(req.body, (id) => {
      let image = req.files.Image
      image.mv('./public/new-drop-images/' + id + '.jpg', (err) => {
        if (!err) {
          res.render('admin/add-product', { admin: true, adminUser })
        } else {
          console.log(err);
        }
      })
    })
  }
  productHelpers.addProduct(req.body, (id) => {
    let image = req.files.Image
    image.mv('./public/product-images/' + id + '.jpg', (err) => {
      if (!err) {
        res.render('admin/add-product', { admin: true, adminUser })
      } else {
        console.log(err)
      }
    })
  })
})

router.get('/delete-product/:id', (req, res) => {
  let proId = req.params.id
  productHelpers.deleteProduct(proId).then((response) => {
    res.redirect('/admin')
  })
})

router.get('/edit-product/:id', async (req, res) => {
  let adminUser = req.session.admin
  let product = await productHelpers.getProductDetails(req.params.id)
  res.render('admin/edit-product', { product, admin: true, adminUser, homeStatus: false })
})

router.post('/edit-product/:id', (req, res) => {
  if (req.body.new) {

  }
  productHelpers.updateProduct(req.params.id, req.body).then(() => {
    res.redirect('/admin')
  })
})

router.get('/new-drops', function (req, res, next) {
  let adminUser = req.session.admin
  productHelpers.getAllNewDrop().then((products) => {
    res.render('admin/new-drops', { admin: true, products, adminUser, homeStatus: false })
  })
});

router.get('/delete-new-drops-product/:id', (req, res) => {
  let proId = req.params.id
  productHelpers.deleteNewDropProduct(proId).then((response) => {
    res.redirect('/admin/new-drops')
  })
})

router.get('/admin-signup', (req, res) => {
  res.render('admin/admin-signup', { admin: true });
})

router.post('/admin-signup', (req, res) => {
  adminHelpers.doSignup(req.body).then((response) => {
    res.redirect('/admin')
  })
})

router.get('/admin-login', (req, res) => {
  res.render('admin/admin-login', { admin: true });
})


router.post('/admin-login', (req, res) => {
  adminHelpers.doLogin(req.body).then((response) => {
    if (response.status) {
      req.session.loggedIn = true
      req.session.admin = response.admin
      console.log(req.session.admin);
      res.redirect('/admin')
    } else {
      res.redirect('admin/admin-login')
    }
  })
})

router.get('/admin-log-out', (req, res) => {
  req.session.destroy()
  res.redirect('/admin')
})

router.get('/view-carousel', async (req, res) => {
  let adminUser = req.session.admin
  await adminHelpers.getAllCarousel().then((image) => {
    res.render('admin/view-carousel', { admin: true, image, adminUser, homeStatus: false })
  })
})

router.get('/add-carousel-image', async (req, res) => {
  let adminUser = req.session.admin
  res.render('admin/add-carousel-image', { admin: true, adminUser, homeStatus: false })
})

router.post('/add-carousel-image', (req, res) => {
  let adminUser = req.session.admin
  adminHelpers.addCarouselImage(req.body, (id) => {
    let image = req.files.Image
    image.mv('./public/carousel-images/' + id + '.jpg', (err) => {
      if (!err) {
        res.render('admin/add-carousel-image', { admin: true, adminUser, homeStatus: false })
      } else {
        console.log(err)
      }
    })
  })
})

router.get('/delete-carousel-image/:id', (req, res) => {
  let imgId = req.params.id
  adminHelpers.deleteCarouselImage(imgId).then((response) => {
    res.redirect('/admin/view-carousel')
  })
})

module.exports = router;
