import { Database } from "bun:sqlite";

const db = new Database("mydb.sqlite");

const getBooks = () => {
    try {
        const query = db.query("SELECT * from books");
        return query.all();
    } catch (error) {
        console.error(error);
        return [];
    }
}

const getBook = (id: number) => {
    try {
        const query = db.query("SELECT * from books WHERE id = $id");
        return query.get({
            $id: id
        });
    } catch (error) {
        console.error(error);
        return {};
    }
}

const createBook = (book: any) => {
    try {
        const query = db.query("INSERT INTO books (name, author, price) VALUES ($name, $author, $price)");
        query.run({
            $name: book.name,
            $author: book.author,
            $price: book.price
        });

        return {status: "ok"}
    } catch (error) {
        console.error(error);
        return {status: "error", error};

    }
}

const updateBook = (id: number, book: any) => {
    try {
        const query = db.query("UPDATE books SET name = $name, author = $author, price = $price WHERE id = $id");
        query.run({
            $id: id,
            $name: book.name,
            $author: book.author,
            $price: book.price
        });

        return {status: "ok"}
    } catch (error) {
        console.error(error);
        return {status: "error", error};
    }
}

const deleteBook = (id: number) => {
    try {
        const query = db.query("DELETE FROM books WHERE id = $id");
        query.run({
            $id: id
        });
        return {status: "ok"}
    } catch (error) {
        console.error(error);
        return {status: "error", error};
    }
}

const createUser = (user: any) => {
    try {
        const query = db.query("INSERT INTO users (email, password) VALUES ($email, $password)");
        query.run({
            $email: user.email,
            $password: user.password
        });

        return {status: "ok"}
    } catch (error) {
        console.error(error);
        return {status: "error", error};
    }
}

const getUser = async (user: any) => {
    try {
        const query = db.query("SELECT * from users WHERE email = $email");
        const userData: any = query.get({
            $email: user.email
        });
        if (!userData) {
            throw new Error("User not found");
        }
        const isMatch = await Bun.password.verify(user.password, userData.password)
        if (!isMatch) {
            throw new Error("User invalid");
        }
        return {loggedIn: true};
    } catch (error) {
        console.error("Error: ", error);
        return {loggedIn: false};
    }
}

export { getBooks, getBook, createBook, updateBook, deleteBook, createUser, getUser };
