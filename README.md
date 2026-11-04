# Shelf

A small API for tracking what you read: books, the people reading them, and when
they finished.

```bash
npm install
npm run dev     # http://localhost:3000
npm test
```

## Endpoints

| Method | Path | |
| --- | --- | --- |
| `GET` | `/books` | Books on your shelf |
| `POST` | `/books` | Add a book |
| `DELETE` | `/books/:id` | Remove a book (admins only) |
| `GET` | `/me` | The signed-in reader |
| `POST` | `/sessions` | Sign in |

`npm run export` writes your shelf as CSV.
