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
| `PUT` | `/goals/:year` | Set how many books you want to finish this year |
| `GET` | `/goals/:year` | Progress toward your goal, and your weekly streak |

## Goals and streaks

Set a yearly target with `PUT /goals/2026 { "target": 24 }`. Progress says how many
books are left and whether you're on pace. A streak counts consecutive weeks, Monday
to Sunday, in which you finished at least one book.

`npm run export` writes your shelf as CSV.
