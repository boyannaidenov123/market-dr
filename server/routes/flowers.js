var express = require("express");
var router = express.Router();
const multer = require("multer");
const Flower = require("../models/flower");
const Lot = require("../models/lot");
const checkAuth = require("../middleware/check-auth");

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
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
    const name = file.originalname.toLowerCase().split(" ").join("-");
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + "-" + Date.now() + "." + ext);
  },
});

router.post(
  "/newFlower",
  checkAuth,
  multer({ storage: storage }).single("image"),
  (req, res) => {
    const url = req.protocol + "://" + req.get("host");

    const flower = new Flower({
      name: req.body.name,
      type: req.body.type,
      itemsInContainer: +req.body.itemsInContainer,
      height: req.body.height,
      weight: req.body.weight,
      blockPrice: +req.body.blockPrice,
      imagePath: url + "/images/" + req.file.filename,
      additionalInformation: req.body.additionalInformation,
    });

    let lot = new Lot({
      seller: req.userData.userId,
      auctionName: req.body.auctionName,
      currentPrice: 100,
      status: {
        registered: true,
        scheduledState: false,
        active: false,
        sold: false,
      },
      containers: +req.body.containers,
    });

    flower
      .save()
      .then((createFlower) => {
        lot.flowerId = createFlower._id;
        lot
          .save()
          .then(() => {
            Lot.findById(createFlower._id)
              .populate("flowerId")
              .then((product) => {
                res.status(201).json({
                  message: "Flower added successfully",
                  flower: {
                    ...product,
                    id: createFlower._id,
                  },
                });
              });
          })
          .catch((err) => {
            console.log(err);
            res.status(500).json({
              message: "Sending a flower failed!",
            });
          });
      })
      .catch(() => {
        res.status(500).json({
          message: "Creating a flower failed!",
        });
      });
  }
);

router.get("/", checkAuth, (req, res) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const selected = +req.query.selected;
  let seller = {
    seller: req.userData.userId,
  };
  if (selected == 1) {
    seller = {}; // If radio button option is "All" products
  }

  const productQuery = Lot.find(seller)
    .where("status.scheduledState")
    .equals(false)
    .where("status.sold")
    .equals(false)
    .where("status.active")
    .equals(false);
  if (pageSize && currentPage) {
    productQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  Lot.find(seller)
    .where("status.scheduledState")
    .equals(false)
    .where("status.sold")
    .equals(false)
    .where("status.active")
    .equals(false)
    .countDocuments(function (err, count) {
      productQuery
        .populate("flowerId")
        .then((flowers) => {
          res.status(200).json({
            message: "Products fetch successfully",
            products: flowers,
            maxProducts: count,
          });
        })
        .catch((err) => {
          console.log(err);
          res.status(404).json({
            message: "Fetching the flowers failed!",
          });
        });
    });
});

router.delete("/:id", checkAuth, (req, res) => {
  Lot.deleteOne({
    flowerId: req.params.id,
    seller: req.userData.userId,
  }).then((relult) => {
    if (relult.n > 0) {
      res.status(200).json({
        message: "Delition successful!",
      });
    } else {
      res.status(401).json({
        message: "Not authorized!",
      });
    }
  });
});

router.get("/:id", (req, res) => {
  Lot.findOne({ flowerId: req.params.id })
    .populate("flowerId")
    .then((product) => {
      if (product) {
        res.status(200).json({
          product: product,
        });
      } else {
        res.status(404).json({
          message: "Flower doesn't exist",
        });
      }
    });
});

router.put(
  "/:id",
  checkAuth,
  multer({ storage: storage }).single("image"),
  (req, res) => {
    let imagePath = req.body.imagePath;
    if (req.file) {
      const url = req.protocol + "://" + req.get("host");
      imagePath = url + "/images/" + req.file.filename;
    }
    Lot.findOneAndUpdate(
      {
        _id: req.params.id,
        seller: req.userData.userId,
      },
      { containers: +req.body.containers, auctionName: req.body.auctionName }
    )
      .then((result) => {
        const product = new Flower({
          _id: result.flowerId,
          name: req.body.name,
          type: req.body.type,
          itemsInContainer: +req.body.itemsInContainer,
          height: +req.body.height,
          weight: +req.body.weight,
          blockPrice: +req.body.blockPrice,
          imagePath: imagePath,
          additionalInformation: req.body.additionalInformation,
        });
        Flower.updateOne({ _id: result.flowerId }, product).then(() => {
          res.status(200).json({
            message: "Update successful!",
          });
        });
      })
      .catch(function (err) {
        res.status(500).json({
          message: "Updating a flower failed!",
        });
      });
  }
);

module.exports = router;
