const jsonresponse = require("../lib/jsonresponse");
const router = require("express").Router();
const User = require("../schema/user");

router.post("/", async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  // campos requeridos
  if (!name || !email || !password || !confirmPassword) {
    return res.status(400).json(
      jsonresponse(400, {
        error: "Fields are Required",
      }),
    );
  }

  // valdacion para que la contraseña coincida
  if (password !== confirmPassword) {
    return res.status(400).json(
      jsonresponse(400, {
        error: "Passwords do not match",
      }),
    );
  }

  try {
    // ver si el email ya existe
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res
        .status(400)
        .json(jsonresponse(400, { error: "User already exists" }));
    }

    // ya aqui se crea el usuario, tambien se encripta la contraseña
    const newUser = new User({ name, email, password });
    await newUser.save();

    return res.status(201).json(
      jsonresponse(201, {
        message: "User Created Successfully",
      }),
    );
  } catch (error) {
    console.log(error);
    if (error.code === 11000) {
      return res.status(400).json(
        jsonresponse(400, {
          error: "Email already exists",
        }),
      );
    }

    return res.status(500).json(
      jsonresponse(500, {
        error: "User could not be created",
      }),
    );
  }
});

module.exports = router;
