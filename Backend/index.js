import express from "express";
import Database from "better-sqlite3";
import z from "zod";

const db = new Database("database.db");
db.pragma("journal_mode = WAL");
db.exec(`CREATE TABLE IF NOT EXISTS reports
         ( id integer primary key autoincrement,
           username text not null,
           title text not null,
           type text not null,
           resolve boolean not null default 0,
           CONSTRAINT type_check CHECK (type IN ('lost', 'found')) 
         )`);

const app = express();

app.use(express.json());

const report_schema = z.object({
    username: z.string(),
    title:z.string(),
    type: z.enum(["lost", "found"]),
});

//insertion of reports into the database
app.post("/report", (req, res) => { 
const verify = report_schema.safeParse(req.body);
if (!verify.success) { 
    res.status(400).json({ error: "Invalid report data" });
    return;
}
const body = verify.data;
db.prepare(`INSERT INTO reports (username,title,type) 
            VALUES (?,?,?)`).run(body.username, body.title, body.type);
res.status(200).json({ message: "Report submitted successfully" });
});

//searching for reports by title
app.get("/report/:title", (req, res) => {
const title = req.params.title;
const rows = db.prepare(`SELECT * FROM reports WHERE title LIKE ?`).all(`%${title}%`);
if (rows.length == 0){
    res.status(404).json({ error: "No reports found" });
} else {
    res.status(200).json(rows);
}
});
// viewing a report by id
app.get("/report/view/:id", (req, res) => {
const id = req.params.id;
const rows = db.prepare(`SELECT * FROM reports WHERE id = ?`).all(id);
if (rows.length == 0){
    res.status(404).json({ error: "No reports found" });
} else {
    res.status(200).json(rows[0]);
}
});
const update_report_schema = z.object({
    username: z.string(),
    title:z.string().optional(),
    resolve: z.string().boolean().optional(),
    id: z.number().int()
});
//update report
app.patch("/report", (req, res) => {
const verify = update_report_schema.safeParse(req.body);
if (!verify.success) { 
    res.status(400).json({ error: "Invalid report data" });
    return;
}
const body = verify.data;
db.prepare(`UPDATE reports SET title = ?, resolve = ? 
            WHERE id = ? AND username = ?`).run(body.title, body.resolve, body.id, body.username);
res.status(200).json({ message: "Report updated successfully" });
});