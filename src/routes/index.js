const express = require("express");
const userRoute = require("./user.route");
const authRoute = require("./auth.route");
const productRoute = require("./product.route");
const categoryRoute = require("./category.route");
const subCategoryRoute = require("./subcategory.route");
const orderRoute = require("./order.route");
const couponRoute = require("./coupon.route");
const checkoutRoute = require("./checkout.route");
const cartRoute = require("./cart.route");
const imageRoute = require("./image.route");

const router = express.Router();

const defaultRoutes = [
  {
    path: "/auth",
    route: authRoute,
  },
  {
    path: "/users",
    route: userRoute,
  },
  {
    path: "/products",
    route: productRoute,
  },
  {
    path: "/category",
    route: categoryRoute,
  },
  {
    path: "/sub-category",
    route: subCategoryRoute,
  },
  {
    path: "/order",
    route: orderRoute,
  },
  {
    path: "/coupon",
    route: couponRoute,
  },
  {
    path: "/checkout",
    route: checkoutRoute,
  },
  {
    path: "/cart",
    route: cartRoute,
  },
  {
    path: "/products-image",
    route: imageRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
// if (config.env === 'development') {
//   devRoutes.forEach((route) => {
//     router.use(route.path, route.route)
//   })
// }

module.exports = router;
