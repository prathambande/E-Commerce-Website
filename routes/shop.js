const express = require('express');
const shopController = require('../controllers/shop');

const router = express.Router();

const isAuth = require('../middleware/is-auth');

router.get('/', shopController.getIndex);
router.get('/cart', isAuth, shopController.getCart);
router.post('/cart', isAuth, shopController.postCart);
router.post('/cart-delete-item', isAuth, shopController.postDeleteCart);
router.post('/create-order', isAuth, shopController.postOrder);
router.get('/orders', isAuth, shopController.getOrders);
router.get('/checkout', isAuth, shopController.getCheckout);
router.get('/products', shopController.getProducts);
router.get('/products/:productId', shopController.getProduct);

module.exports = router;