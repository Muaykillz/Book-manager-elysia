import { Elysia, t } from "elysia";
import { jwt } from "@elysiajs/jwt";
import { swagger } from '@elysiajs/swagger'
import { getBooks, getBook, createBook, updateBook, deleteBook, createUser, getUser } from "./book-model";

const app = new Elysia().use(
  jwt({
    name: 'jwt',
    secret: process.env.JWT_SECRET || ""
  })
)
  .derive(async ({ jwt, cookie: { token } }) => ({
    profile: await jwt.verify(token.value)
  }))
  .use(swagger())


app.guard({
  beforeHandle: ({ profile, set }) => {
    console.log("GUARD 👮🏻‍♂️")
    if (!profile) {
      set.status = 401
      return {
        message: "Unauthorized"
      }
    }
  }
}, app => {
  // get all books
  app.get("/books", () => getBooks())

  // get a book by id
  app.get("/books/:id", async ({ params }) => {
    const bookId = parseInt(params.id)
    return getBook(bookId)
  })

  // create a new book
  app.post("/books", ({ body, set }) => {
    try {
      const bookData: any = body
      const response = createBook({
        name: bookData.name,
        author: bookData.author,
        price: bookData.price
      })

      if (response.status === "error") {
        set.status = 400
        return {
          message: "insert incomplete"
        }
      }
      return {
        message: "Book created"
      }
    } catch (error) {
      set.status = 500
      return {
        message: "Something went wrong"
      }
    }
  }, {
    body: t.Object({
      name: t.String(),
      author: t.String(),
      price: t.Number()
    })
  })

  // update a book
  app.put("/books/:id", ({ params, body, set }) => {
    try {
      const bookId: number = parseInt(params.id)
      const bookData: any = body
      const response = updateBook(bookId, {
        name: bookData.name,
        author: bookData.author,
        price: bookData.price
      })

      if (response.status === "error") {
        set.status = 400
        return {
          message: "update failed"
        }
      }
      return {
        message: "Book updated"
      }
    } catch (error) {
      set.status = 500
      return {
        message: "Something went wrong"
      }
    }
  }, {
    body: t.Object({
      name: t.String(),
      author: t.String(),
      price: t.Number()
    })
  })

  // delete a book
  app.delete("/books/:id", ({ params, set }) => {
    try {
      const bookId: number = parseInt(params.id)
      const response = deleteBook(bookId)
      if (response.status === "error") {
        set.status = 400
        return {
          message: "delete failed"
        }
      }
      return {
        message: `Book deleted Id: ${bookId}`
      }
    } catch (error) {
      set.status = 500
      return {
        message: "Something went wrong"
      }
    }
  })

  return app
})

// register a new user
app.post("/register", async ({ body, set }) => {
  try {
    const userData: any = body
    userData.password = await Bun.password.hash(userData.password, {
      algorithm: "bcrypt",
      cost: 4
    })
    const response = createUser(userData)
    if (response.status === "error") {
      set.status = 400
      return {
        message: "insert incomplete"
      }
    }
    return {
      message: "User created successfully"
    }
  } catch (error) {
    set.status = 500
    return {
      message: "Something went wrong"
    }
  }
}, {
  body: t.Object({
    email: t.String(),
    password: t.String()
  })
})

// login a user
app.post("/login", async ({ body, set, jwt, cookie: { token } }) => {
  try {
    const userData: any = body

    const response = await getUser(userData)
    if (!response.loggedIn) {
      set.status = 403
      return {
        message: "Login failed"
      }
    }

    token.set({
      value: await jwt.sign({
        email: userData.email
      }),
      httpOnly: true,
      maxAge: 86400 * 7
    })

    return {
      message: "Login successful",
      token: token.value
    }
  }
  catch (error) {
    set.status = 500
    return {
      message: "Something went wrong"
    }
  }
}, {
  body: t.Object({
    email: t.String(),
    password: t.String()
  })
})

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`🦊 Elysia is running at http://localhost:${port}`);
});
