const express = require("express");
const bodyParser = require('body-parser');
const Sequelize = require('sequelize');

const PORT = process.env.PORT || 5050;

const app = express();

app.get("/api", (req, res) => {
    res.json({ message: "Hello from server!" });
});

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storate: 'anonymous.db'
});

const Student = sequelize.define('student', {
    nume: Sequelize.STRING,
    prenume: Sequelize.STRING,
    email: Sequelize.STRING,
    grupa: Sequelize.NUMBER,
    seria: Sequelize.STRING,
    proiect: Sequelize.NUMBER
}, {
    timestamps: false
});

app.use(bodyParser.json());

app.get('/create', async(req, res) => {
    try {
        await sequelize.sync({ force: true })
        for (let i = 0; i < 10; i++) {
            const student = new Student({
                nume: 'nume ' + i,
                prenume: 'prenume ' + i,
                email: 'email' + i + '@something.com',
                grupa: 1000 + 10 * i + i,
                seria: 'A',
                proiect: 'proiect ' + i
            })
            await student.save()
        }
        res.status(201).json({ message: 'created' })
    } catch (err) {
        console.warn(err.stack)
        res.status(500).json({ message: 'server error' })
    }
});

app.get('/studenti', async(req, res) => {
    try {
        const studenti = await Student.findAll()
        res.status(200).json(studenti)
    } catch (err) {
        console.warn(err.stack)
        res.status(500).json({ message: 'server error' })
    }
})