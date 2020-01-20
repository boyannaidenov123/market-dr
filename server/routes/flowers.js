var express = require("express");
var router = express.Router();
const multer = require("multer");
const Flower = require("../models/flower");
const Lot = require("../models/lot");
const checkAuth = require("../middleware/check-auth");

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg"
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    if (isValid) {
      error = null;
    }
    cb(error, "./public/images");
  },
  filename: (req, file, cb) => {
    console.log("tuk2");
    const name = file.originalname
      .toLowerCase()
      .split(" ")
      .join("-");
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + "-" + Date.now() + "." + ext);
  }
});

router.post(
  "/newFlower",
  checkAuth,
  multer({ storage: storage }).single("image"),
  (req, res, next) => {
    console.log(req.body);
    console.log("tuk");
    const url = req.protocol + "://" + req.get("host");
    console.log("tuk3");

    const flower = new Flower({
      seller: req.userData.userId,
      name: req.body.name,
      type: req.body.type,
      auctionName: req.body.auctionName,
      containers: +req.body.containers,
      itemsInContainer: +req.body.itemsInContainer,
      height: req.body.height,
      weight: req.body.weight,
      blockPrice: +req.body.blockPrice,
      imagePath: url + "/images/" + req.file.filename,
      additionalInformation: req.body.additionalInformation
    });
    console.log(flower);

    let lot = new Lot({
      auctionName: req.body.auctionName,
      currentPrice: 100,
      status: {
        registered: true,
        scheduledState: false,
        active: false,
        sold: false
      }
    });

    flower.save().then(createFlower => {
      lot.flowerId = createFlower._id;
      lot.save().then(createLot => {
        console.log(createLot);
      });
      res.status(201).json({
        message: "Flower added successfully",
        flower: {
          ...createFlower,
          id: createFlower._id
        }
      });
    });
  }
);

router.get("/", checkAuth, (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const selected = +req.query.selected;

  const productQuery = Flower
  .find()
  .where('containers').gte(1)
  let fetchedProducts;

  if (pageSize && currentPage) {
    if (selected == 2) {
      // If radio button option is "Yours" products
      productQuery
        .find({ seller: req.userData.userId })
        .skip(pageSize * (currentPage - 1))
        .limit(pageSize);
    } else {
      // If radio button option is "All" products
      productQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
    }
  }

  productQuery
    .then(flowers => {
      fetchedProducts = flowers;

      return productQuery.countDocuments();
    })
    .then(count => {
      res.status(200).json({
        message: "Products fetch successfully",
        products: fetchedProducts,
        maxProducts: count
      });
    });
});

router.delete("/:id", checkAuth, (req, res, next) => {
  Lot.deleteOne({
    flowerId: req.params.id
  }).then(result => {
    console.log("delete lot");
  });
  Flower.deleteOne({
    _id: req.params.id,
    seller: req.userData.userId
  }).then(relult => {
    if (relult.n > 0) {
      res.status(200).json({
        message: "Delition successful!"
      });
    } else {
      res.status(401).json({
        message: "Not authorized!"
      });
    }
  });
});

router.get("/:id", (req, res, next) => {
  Flower.findById(req.params.id).then(product => {
    if (product) {
      res.status(200).json({
        product: product
      });
    } else {
      res.status(404);
    }
  });
});

router.put(
  "/:id",
  checkAuth,
  multer({ storage: storage }).single("image"),
  (req, res, next) => {
    console.log("tuk");
    let imagePath = req.body.imagePath;
    if (req.file) {
      const url = req.protocol + '://' + req.get("host");
      imagePath = url + "/images/" + req.file.filename;
    }
    const product = new Flower({
      _id: req.body.id,
      seller: req.userData.userId,
      name: req.body.name,
      type: req.body.type,
      containers: +req.body.containers,
      itemsInContainer: +req.body.itemsInContainer,
      height: +req.body.height,
      weight: +req.body.weight,
      blockPrice: +req.body.blockPrice,
      imagePath: imagePath,
      additionalInformation: req.body.additionalInformation
    });
    console.log(req.body);
    Flower.updateOne(
      {
        _id: req.params.id,
        seller: req.userData.userId
      },
      product
    ).then(result => {
      if (result.nModified > 0) {
        res.status(200).json({
          message: "Update successful!"
        });
      } else {
        res.status(401).json({
          message: "Not authorized!"
        });
      }
    }).catch(function (err) {
      console.log(err)
    })
  }
);

module.exports = router;
