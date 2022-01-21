import { EventEmitter } from 'fbemitter'
const SERVER = 'http://localhost:8080'

class ProjectStore {
    constructor() {
        this.data = []
        this.emitter = new EventEmitter()
    }

    async getAll() {
        try {
            const response = await fetch(`${SERVER}/projects`)
            const data = await response.json()
            this.data = data
            this.emitter.emit("GET_PROJECTS_SUCCES")
        } catch (err) {
            console.warn(err)

            this.emitter.emit("GET_PROJECTS_ERR")
        }
    }

    async addOne(project) {
        //met async=>try/catch
        try {
            await fetch(`${SERVER}/projects`, {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(project)
            })


        } catch (err) {
            console.warn(err)
            this.emitter.emit('ADD_PROJECT_ERROR')
        }
    }

    async saveOne(id, person) {}
}

const projectStore = new ProjectStore()

export default projectStore //toata lumea are acces la acelasi store care contine o serie de metode ce interactioneaza cu serverul