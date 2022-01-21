import {EventEmitter} from 'fbemitter'
const SERVER='http://localhost:8080'

class PlaneStore{
    constructor(){
        this.data=[]
        this.emitter=new EventEmitter()
    }

    async getAll(){
        try{
            const response=await fetch(`${SERVER}/people`)
            const data=await response.json()
            this.data=data
            this.emitter.emit("GET_PEOPLE_SUCCES")
        }catch(err){
            console.warn(err)
            
            this.emitter.emit("GET_PEOPLE_ERR")
        }
    }

    async addOne(person){
        //met async=>try/catch
     try{
        await fetch(`${SERVER}/person`,{
        method:'post',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify(person)
    })

        }catch(err){
            console.warn(err)
            this.emitter.emit('ADD_PERSON_ERROR')
        }
}

    async saveOne(id,person){}

    async deleteOne(id){}
}

const store=new PlaneStore()

export default store//toata lumea are acces la acelasi store care contine o serie de metode ce interactioneaza cu serverul
