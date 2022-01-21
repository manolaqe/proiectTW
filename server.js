const express = require('express')
const bodyParser = require('body-parser')
const Sequelize = require('sequelize')
const sqlite = require('sqlite3')
const cors = require('cors')


//Se creeaza o instanta sequelize ce foloseste baza de date creata de noi
const sequelize = new Sequelize({ dialect: 'sqlite', storage: './anonymousGradingApp.sqlite' })

//Se creeaza tabela persoane si se definesc campurile aferente
const Person = sequelize.define('person', {
    type: {
        type: Sequelize.ENUM,
        allowNull: false,
        values: ['STUDENT', 'TEACHER']
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    group: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    series: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    username: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
    }
}, {
    timestamps: false
})

//Se creeaza tabela proiecte si se definesc campurile aferente
const Project = sequelize.define('project', {
    fileLink: {
        type: Sequelize.STRING,
        allowNull: true
    },
    version: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    deadline: {
        type: Sequelize.DATE,
        allowNull: false
    },
    final_grade: {
        type: Sequelize.DOUBLE,
        allowNull: true
    },
    personID: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
}, {
    timestamps: false
})

//Se creeaza tabela note si se definesc campurile aferente
const Grade = sequelize.define('grade', {
    projectTitle: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    version: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    grade: {
        type: Sequelize.DOUBLE,
        allowNull: true
    }
}, {
    timestamps: false
})



const app = express()
app.use(cors())
app.use(bodyParser.json())

//Se creaza tabelele definite anterior in caz ca acestea nu exista
app.get('/create', async(req, res, next) => {
    try {
        await sequelize.sync({ alter: true })
        res.status(201).json({ message: 'created' })
    } catch (err) {
        next(err)
    }
})

//Se populeaza o intrare in tabela de persoane
app.post('/person', async(req, res, next) => {
    try {
        await Person.create(req.body)
        res.status(201).json({ message: 'created' })
    } catch (err) {
        next(err)
    }
})

//Se obtine lista de persoane
app.get('/people', async(req, res, next) => {
    try {
        const people = await Person.findAll()
        res.status(200).json(people)
    } catch (err) {
        next(err)
    }
})

//Se populeaza o intrare in tabela proiecte
app.post('/projects', async(req, res, next) => {
    try {
        await Project.create(req.body)
        res.status(201).json({ message: 'created' })
    } catch (err) {
        next(err)
    }
})

//Se actualizeaza datele unei intrari din tabela de proiecte
app.put('/projects/:id/:version/:personID', async(req, res, next) => {
    try {
        let projID = req.params.id
        let versionID = req.params.version
        let persID = req.params.personID
        await Project.update(req.body, {
            where: {
                id: projID,
                version: versionID,
                personID: persID
            }
        })
        res.status(200).json({ message: "updated" })
    } catch (err) {
        next(err)
    }
})

//Se obtine lista de proiecte
app.get('/projects', async(req, res, next) => {
    try {
        const projects = await Project.findAll()
        res.status(200).json(projects)
    } catch (err) {
        next(err)
    }
})

//Se obtine lista de proiecte pentru o anumita persoana
app.get('/projects/:personID', async(req, res, next) => {
    try {
        let persID = req.params.personID
        const projects = await Project.findAll({
            where: {
                personID: persID
            }
        })
        res.status(200).json(projects)
    } catch (err) {
        next(err)
    }
})

//Se populeaza o intrare in tabela de note
app.post('/grades', async(req, res, next) => {
    try {
        await Grade.create(req.body)
        res.status(201).json({ message: 'created' })
    } catch (err) {
        next(err)
    }
})

//Se obtine lista de note
app.get('/grades', async(req, res, next) => {
    try {
        const grades = await Grade.findAll()
        res.status(200).json(grades)
    } catch (err) {
        next(err)
    }
})

//Aici revin toate erorile
app.use((err, req, res, next) => {
    console.warn(err)
    res.status(500).json({ message: 'server error' })
})

//Am definit portul pe care asculta aplicatia
app.listen(8080)