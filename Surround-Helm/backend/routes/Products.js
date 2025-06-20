const express = require("express");
const Product = require("../model/Product");
const fetchUser = require("../middleware/Fetchuser");
const upload = require("../middleware/upload");
const { body, validationResult } = require("express-validator");
const router = express.Router();

// all user product
router.get("/getallproduct", async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};
    if (search) {
      query = {
        $or: [
          { title: { $regex: search, $options: "i" } },
          { category: { $regex: search, $options: "i" } },
        ],
      };
    }
    // Populate the 'user' field with the user's name
    const products = await Product.find(query).populate("user", "name");
    res.json(products);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("internal server Error");
  }
});

// peruser product

router.get("/getproduct", fetchUser, async (req, res) => {
  try {
    const products = await Product.find({ user: req.user.id });
    res.json(products);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("internal server Error");
  }
});
router.post(
  "/addproduct",
  fetchUser,
  upload.single("image"),
  [
    body("title", "Product title must be at least 3 characters").isLength({
      min: 3,
    }),
    body("description", "Description must be at least 8 characters").isLength({
      min: 8,
    }),
    body("price", "Price must be a number").isNumeric(),
    body("category", "Category must be at least 3 characters").isLength({
      min: 3,
    }),
    body("instock", "In stock must be a number").isNumeric(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { title, description, price, instock, category } = req.body;

      let imagePath = "";
      if (req.file) {
        // path for the image
        imagePath = `/uploads/${req.file.filename}`;
      }

      const product = new Product({
        title,
        price,
        description,
        instock,
        category,
        image: imagePath,
        user: req.user.id,
      });

      const savedProduct = await product.save();
      res.status(201).json(savedProduct);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

router.put("/updateproduct/:id", fetchUser, async (req, res) => {
  const { title, description, price, instock, category } = req.body;
  //   console.log("req body", req.body);
  try {
    const newProduct = {};
    if (title) newProduct.title = title;
    if (description) newProduct.description = description;
    if (price) newProduct.price = price;
    if (instock) newProduct.instock = instock;
    if (category) newProduct.category = category;

    let product = await Product.findById(req.params.id);
    // condition to know if the user is authorized
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    if (!product.user || product.user.toString() !== req.user.id) {
      return res
        .status(401)
        .json({ message: "Unauthorized to update others product" });
    }
    product = await Product.findByIdAndUpdate(req.params.id, newProduct, {
      new: true,
    });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// delete product
router.delete("/deleteproduct/:id", fetchUser, async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    if (!product.user || product.user.toString() !== req.user.id) {
      return res
        .status(401)
        .json({ message: "Unauthorized to delete others product" });
    }
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
module.exports = router;
