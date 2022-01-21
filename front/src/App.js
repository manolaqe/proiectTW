// import './App.css';
import React from 'react'
import store from './PersonStore'
import Login from './Login'
import Person from './Person'
import StudentProjectList from './StudentProjectList'
import ProjectAddForm from './ProjectAddForm'
import projectStore from './ProjectStore'
import Project from './Project'
import Select from 'react-select'
import TeacherProjectList from './TeacherProjectList'
import LivrabilAddForm from './LivrabilAddForm'
import GradeAddForm from './GradeAddForm'
import gradeStore from './GradeStore'
import btnStyle from './css/btnStyle.css'
import Register from './Register'
let listaMembrii = []
let listaEchipa = []
let selectedMemberId = -1

class App extends React.Component{
  constructor(){
    super()
    //starea aplicatiei
    this.state={
      people:[],
      projects: [],
      myProjects: [],
      foreignProjects: [],
      projectsForTeacher: [],
      grades: [],
      registerType: 'Log In',
      projectStatus: 'myProjects',
      isCorrect: false,
      loggedPersonId: -1,
      loggedPersonType: '',
      selected: -1,
      link: 'www.youtube.com'
    }
    //functia face validari pe date si permite accesul la alta componenta a interfetei daca datele se gasesc in tabela PEOPLE
    //daca user-ul logat este de tip TEACHER populeaza lista cu toate proiectele si toate versiunile lor si notele aferente cu posibilitatea de a viziona proiectele
    //daca user-ul logat este de tip STUDENT, populeaza lista cu toate proiectele proprii si inca 2 butoane pentru a adauga un proiect si a vizualiza proiectele celorlalte echipe
    this.logIn =(value)=>
    {
        let check = false
        this.state.people.forEach(person => {
          if(person.username === value.username && person.password === value.password)
          {
            this.setState({
              isCorrect: true,
              loggedPersonId: person.id,
              loggedPersonType: person.type
            })
            if(person.type === 'TEACHER')
            {
              //din toate proiectele din BD populeaza proiectele pentru utilizatorul TEACHER pentru a avea o intrare a unei versiuni de proiect unica 
              this.state.projects.forEach(project => {
                let proiectDummy
                let titleDeAdaugat = project.title + ', versiunea ' + project.version
                let contor = -1
                this.state.projectsForTeacher.forEach(projectDeVerificat => {
                  if(titleDeAdaugat === projectDeVerificat.title)
                  {
                    contor = 1
                  }
                })
                if(contor === -1)
                {
                  proiectDummy = {
                    id: project.id,
                    fileLink: project.fileLink,
                    version: project.version,
                    title: titleDeAdaugat,
                    deadline: project.deadline,
                    personID: project.personID
                  }
                  this.state.projectsForTeacher.push(proiectDummy)
                }
              })
              let numeProiect = ''
              let versiune = 0
              this.state.projectsForTeacher.forEach(project =>{
                this.state.projects.forEach(projectDeVerificat =>{
                  if(project.id === projectDeVerificat.id)
                  {
                    numeProiect = projectDeVerificat.title
                    versiune = projectDeVerificat.version
                  }
                })
                let grade = 0
                let sum = 0
                let count = 0
                let min = 11
                let max = 1
                this.state.grades.forEach(gradeDeAdaugat =>{
                  if(gradeDeAdaugat.projectTitle === numeProiect && gradeDeAdaugat.version === versiune)
                  {
                    count ++
                    sum = sum + gradeDeAdaugat.grade
                    if(gradeDeAdaugat.grade > max)
                    {
                      max = gradeDeAdaugat.grade
                    }
                    if(gradeDeAdaugat.grade < min)
                    {
                      min = gradeDeAdaugat.grade
                    }
                  }
                })
                if(count === 0)
                {
                  project.title = project.title + ", nu exista note"
                }
                else{
                  if(count >= 3){
                    sum = sum - max - min
                    grade = sum / (count - 2)
                  }
                  else{
                    grade = sum / count
                  }
      
                  project.title = project.title + ", nota: " + grade.toFixed(2)
                }
              })
            }
            else
            {
              //populeaza lista cu proiectele user-ului logat, daca acesta este STUDENT
              this.state.projects.forEach(project => {
                if(project.personID === person.id && project.version === 1)
                {
                  this.state.myProjects.push(project)
                }
              })
              //populeaza lista cu proiectele care pot fi notate, cu intrare unica pentru fiecare versiune a unui proiect, respectiv proiectele din care user-ul logat nu contribuie
              this.state.projects.forEach(project => {
                let contor = -1
                let proiectDummy
                let titleDeAdaugat = project.title + ', versiune ' + project.version
                this.state.myProjects.forEach(projectDeVerificat => {
                  if(project.title === projectDeVerificat.title)
                  {
                    contor = 1
                  }
                })
                this.state.foreignProjects.forEach(projectDeVerificat => {
                  if(titleDeAdaugat === projectDeVerificat.title)
                  {
                    contor = 1
                  }
                })
                if(contor === -1)
                {
                  proiectDummy = {
                    id: project.id,
                    fileLink: project.fileLink,
                    version: project.version,
                    title: titleDeAdaugat,
                    deadline: project.deadline,
                    personID: project.personID
                  }
                  this.state.foreignProjects.push(proiectDummy)
                }
              })
            }
            check = true
          }
        })
        if(check === false)
        {
          alert('Nu sunt corecte datele introduse de logare.')
        }
    }
    //afiseaza interfata de sign in
    this.signIn =()=>{
      this.setState({
        registerType: 'Sign In'
      })
    }
    //adauga o persoana in baza de date in cazul in care datele introduse sunt valide
    this.add=(person)=>{
      let check = true
      if(person.type !== 'TEACHER' && person.type !== 'STUDENT')
      {
        check = false
        alert('Tipul trebuie sa fie STUDENT sau TEACHER')
      }
      let grupa = parseInt(person.group)
      let serie = parseInt(person.series)
      if(isNaN(grupa) && person.type === 'STUDENT')
      {
        check = false
        alert('Grupa trebuie sa fie numerica')
      }

      if(!isNaN(serie) && person.type === 'STUDENT')
      {
        check = false
        alert('Seria trebuie sa fie litera')
      }
      if(person.group.toString().length === 0 && person.type === 'STUDENT')
      {
        check = false
        alert('Grupa trebuie completata')
      }

      if(person.series.toString().length !== 1 && person.type === 'STUDENT')
      {
        check = false
        alert('Seria trebuie sa fie aiba o singura litera')
      }
      this.state.people.forEach(existentPerson => {
        if(person.username === existentPerson.username)
        {
          check = false
          alert('Username-ul exista deja')
        }
      })
      if(person.name.toString().length<1){
        check=false;
        alert('Completati numele!')
      }
      if (person.password.toString().length<1){
        check=false;
        alert('Completati parola!')
      }
      if (person.username.toString().length<1){
        check=false;
        alert('Completati ussername-ul!')
      }
      if(check === true)
      {
        person.series = person.series.toUpperCase()
        person.group = grupa
        if(person.type === 'TEACHER')
        {
          person.group = 0
          person.series = ''
        }
        store.addOne(person)
        this.state.people.push(person)
        this.setState({
          registerType: 'Log In'
        })
      }
    }
    //afiseaza fereastra de log in 
    this.cancel=()=>{
      this.setState({
        registerType: 'Log In'
      })
    }
    //creeaza un proiect daca datele sunt valide 
    //populeaza in baza de date pentru fiecare membru al echipei o intrare 
    this.createProject=()=>{
      this.setState({
        projectStatus: 'create',
        selected: -1
      })
      listaEchipa = []
      listaMembrii = []
      selectedMemberId = -1
      this.state.people.forEach(person=>{
        if(this.state.loggedPersonId !== person.id && person.type !== 'TEACHER')
        {
          let l = person.name + ", grupa " + person.group + ", seria " + person.series
          let v = person.id
          let item = {
            value: v,
            label: l
          }
          listaMembrii.push(item)
        }
        if(this.state.loggedPersonId === person.id)
        {
          listaEchipa.push(person)
        }
      })
    }
    //primeste id-ul din Select-ul de membri posibili
    this.selectieMembruEchipa=(evt)=>
    {
        selectedMemberId = evt.value
    }
    //afiseaza interfata proiectelor utilizatorului de tip student
    this.myProjects=()=>{
      this.setState({
        projectStatus: 'myProjects',
        selected: -1
      })
    }
    //afiseaza interfata proiectelor pe care le poate nota utilizatorul de tip student
    this.gradeProjects=()=>{
      this.setState({
        projectStatus: 'gradeProjects',
        selected: -1
      })
    }
    //se populeaza lista cu membri selectati pentru echipa
    //o echipa poate avea maximum 4 persoane
    this.addMembruToProject=()=>{
      if(selectedMemberId === -1)
      {
        alert('Trebuie selectat un membru pe care vreti sa il adaugati din lista')
      }
      else if(listaEchipa.length >= 4)
      {
        alert('Pot fi maxim 4 membrii intr-o echipa')
      }
      else
      {
        this.state.people.forEach(person =>{
          if(person.id === selectedMemberId)
          {
            listaEchipa.push(person)
          }
        })
        let contor = 0
        let index = 0
        listaMembrii.forEach(item => {
          if(item.value === selectedMemberId)
          {
            index = contor
          }
          contor++
        })
        listaMembrii.splice(index, 1)
        this.setState({
        })
        selectedMemberId = -1
      }
    }
    //adauga un proiect in cazul in care datele introduse sunt valide
    //pe baza campurilor temporale creeaza un format de tip DATE pentru baza de date
    //ne afiseaza din nou interfata cu proiectele proprii dupa creare
    this.addProject=(project)=>{
      let check = true
      let an = parseInt(project.year)
      let luna = parseInt(project.month)
      let zi = parseInt(project.day)
      let ora = parseInt(project.hour)
      let minute = parseInt(project.minutes)
      let secunde = parseInt(project.seconds)
      if(project.title.toString().length === 0)
      {
        check = false
        alert("Titlul nu trebuie sa fie gol")
      }
      let contor = -1
      this.state.projects.forEach(projectDeVerificat =>{
        if(project.title === projectDeVerificat.title)
        {
          check = false
          contor = 1
        }
      })
      if(contor === 1)
      {
        alert("Titlul proiectului trebuie sa fie unic")
      }
      if(project.link.toString().length<1){
        check=false;
        alert('Introduceti link-ul')
      }
      if(isNaN(an))
      {
        check = false
        alert("Anul trebuie sa fie format din cifre")
      } 
      else if(an < 0 )
      {
        check = false
        alert("Anul trebuie sa fie un numar pozitiv")
      }
      else if(an.toString().length !== 4 || an < 1000)
      {
        check = false
        alert("Anul trebuie sa aiba 4 cifre si sa fie mai mare sau egal cu 1000")
      }
      if(isNaN(luna))
      {
        check = false
        alert("Luna trebuie sa fie formata din cifre")
      } 
      else if(luna <= 0 )
      {
        check = false
        alert("Luna trebuie sa fie un numar pozitiv mai mare ca 0")
      }
      else if(luna > 12)
      {
        check = false
        alert("Luna trebuie sa fie intre 1 si 12")
      }
      if(isNaN(zi))
      {
        check = false
        alert("Ziua trebuie sa fie formata din cifre")
      } 
      else if(zi <= 0 )
      {
        check = false
        alert("Ziua trebuie sa fie un numar pozitiv mai mare ca 0")
      }
      else if(zi > 31)
      {
        check = false
        alert("Ziua trebuie sa fie intre 1 si 31")
      }
      if(isNaN(ora))
      {
        check = false
        alert("Ora trebuie sa fie formata din cifre")
      } 
      else if(ora < 0 )
      {
        check = false
        alert("Ora trebuie sa fie un numar pozitiv")
      }
      else if(ora > 23)
      {
        check = false
        alert("Ora trebuie sa fie intre 0 si 23")
      }
      if(isNaN(minute))
      {
        check = false
        alert("Minutele trebuie sa fie formate din cifre")
      } 
      else if(minute < 0 )
      {
        check = false
        alert("Minutele trebuie sa fie un numar pozitiv")
      }
      else if(minute > 59)
      {
        check = false
        alert("Minutele trebuie sa fie intre 0 si 59")
      }
      if(isNaN(secunde))
      {
        check = false
        alert("Secundele trebuie sa fie formate din cifre")
      } 
      else if(secunde < 0 )
      {
        check = false
        alert("Secundele trebuie sa fie un numar pozitiv")
      }
      else if(secunde > 59)
      {
        check = false
        alert("Secundele trebuie sa fie intre 0 si 59")
      }
      if(check === true)
      {
        let deadlineDeAdaugat = ''
        if(luna.toString().length === 1)
        {
          luna = '0' + luna
        }
        if(zi.toString().length === 1)
        {
          zi = '0' + zi
        }
        if(ora.toString().length === 1)
        {
          ora = '0' + ora
        }
        if(minute.toString().length === 1)
        {
          minute = '0' + minute
        }
        if(secunde.toString().length === 1)
        {
          secunde = '0' + secunde
        }
        deadlineDeAdaugat = an + '-' + luna + '-' + zi + ' ' + ora + ':' + minute + ':' + secunde
        listaEchipa.forEach(membru => { 
          let proiectDeAdaugat ={
            version: 1,
            title: project.title,
            fileLink: project.link,
            deadline: deadlineDeAdaugat,
            personID: membru.id
          }
          projectStore.addOne(proiectDeAdaugat)
        })
        this.setState({
          projectStatus: 'myProjects'
        })
      }
    }
    //odata cu apsarea pe un element din orice lista de proiecte se obtin id-ul si link-ul aferente proiectului
    this.Select = (id) =>
    {
      let linkDeAdaugat
      this.state.projects.forEach(project => {
        if(project.id === id)
        {
          linkDeAdaugat = project.fileLink
        }
      })
      this.setState({
        selected: id,
        link: linkDeAdaugat
      })
    }
    //se adauga un livrabil pentru proiectul selectat
    this.addLivrabil = (value) =>{
      let check = true
      if(value.link.toString().length === 0)
      {
        check = false
        alert('Link-ul trebuie completat')
      }

      if(check === true)
      {
        let numeProiect = ''
        this.state.projects.forEach(project => {
          if(project.id === this.state.selected)
          {
            numeProiect = project.title
          }
        })
        let contor = 1
        let index = this.state.projects.length-1
        let listaProiecteDeAdaugat = []
        while((contor === 1 || contor === 0) && index >= 0)
        {
          if(this.state.projects[index].title === numeProiect)
          {
            contor = 0
            let projectDeAdaugat = {
              fileLink: '',
              version: this.state.projects[index].version,
              title: numeProiect,
              deadline: this.state.projects[index].deadline,
              personID: this.state.projects[index].personID
            }
            listaProiecteDeAdaugat.push(projectDeAdaugat)
          }
          else if(contor === 0)
          {
            contor = 2
          }
          index--
        }
      
        listaProiecteDeAdaugat.forEach(project => {
          project.fileLink = value.link
          project.version++
          projectStore.addOne(project)

        })
        this.setState({
          selected:-1
        })
      }
    }
    // NU MERGE se deschide intr-un nou tab link-ul proiectului selectat
    this.viziteazaLink=()=>{
      window.open(this.state.link.toString())
    }
    //se adauga o nota pentru proiectul selectat doar daca nu au trecut mai mult de 30 de zile de la deadline
    this.addGrade=(value)=>{
      let check = true
      if(isNaN(parseFloat(value.grade)))
      {
        check = false
        alert("Nota trebuie sa fie un numar")
      }
      else if(parseFloat(value.grade) < 1 || parseFloat(value.grade) > 10)
      {
        check = false
        alert("Nota trebuie sa fie intre 1 si 10")
      }
      if(check === true)
      {
        let numeProiect = ''
        let versionDeAdaugat = 0
        let deadlineDeParsat
        this.state.projects.forEach(project => {
          if(project.id === this.state.selected)
          {
            numeProiect = project.title
            versionDeAdaugat = project.version
            deadlineDeParsat = project.deadline
          }
        })
        if(Date.now - Date.parse(deadlineDeParsat) < 0)
        {
          alert("Nu a trecut deadline-ul inca")
        }
        else if (Date.now - Date.parse(deadlineDeParsat) > 2592000000)
        {
          alert("A trecut timpul destinat acordarii notelor")
        }
        else
        {
          let grade = 
          {
            projectTitle: numeProiect,
            version: versionDeAdaugat,
            grade: parseFloat(parseFloat(value.grade).toFixed(2))
          }
          gradeStore.addOne(grade)
          this.setState({
            selected:-1
          })
         }
      }
    }
  }

  componentDidMount(){
   //iau persoane, note, proiecte de pe server 
   //store se ocupa de comunicarea cu serverul 
    store.getAll()
    store.emitter.addListener('GET_PEOPLE_SUCCES',()=>{
      this.setState({
        people:store.data
      })
    })
    projectStore.getAll()
    projectStore.emitter.addListener('GET_PROJECTS_SUCCES',()=>{
      if(this.state.loggedPersonId !== -1)
      {
        let listaProiecteProprii = []
        let listaProiecteDeNotat = []
        let listaProiecteForTeacher = []
        if(this.state.loggedPersonType === 'TEACHER')
        {
              projectStore.data.forEach(project => {
                let proiectDummy
                let titleDeAdaugat = project.title + ', versiunea ' + project.version
                let contor = -1
                listaProiecteForTeacher.forEach(projectDeVerificat => {
                  if(titleDeAdaugat === projectDeVerificat.title)
                  {
                    contor = 1
                  }
                })
                if(contor === -1)
                {
                  proiectDummy = {
                    id: project.id,
                    fileLink: project.fileLink,
                    version: project.version,
                    title: titleDeAdaugat,
                    deadline: project.deadline,
                    personID: project.personID
                  }
                  listaProiecteForTeacher.push(proiectDummy)
                }
              })
        }
        else 
        {
          projectStore.data.forEach(proiect => {
            if(proiect.personID === this.state.loggedPersonId && proiect.version === 1)
            {
              listaProiecteProprii.push(proiect)
            }
          })
        projectStore.data.forEach(proiect => {
          let proiectDummy
          let titleDeAdaugat = proiect.title + ', versiunea ' + proiect.version
          let contor = -1
          listaProiecteProprii.forEach(projectDeVerificat => {
            if(proiect.title === projectDeVerificat.title)
            {
              contor = 1
            }  
          })
          listaProiecteDeNotat.forEach(projectDeVerificat => {
            if(titleDeAdaugat === projectDeVerificat.title)
            {
              contor = 1
            }
          })
          if(contor === -1)
          {
            proiectDummy = {
              id: proiect.id,
              fileLink: proiect.fileLink,
              version: proiect.version,
              title: titleDeAdaugat,
              deadline: proiect.deadline,
              personID: proiect.personID
            }
            listaProiecteDeNotat.push(proiectDummy)
          }
        }) 
        }      
        this.setState({
          projects: projectStore.data,
          myProjects: listaProiecteProprii,
          foreignProjects: listaProiecteDeNotat,
          projectsForTeacher: listaProiecteForTeacher
        })
      }
      else
      {
        this.setState({
          projects:projectStore.data
        })
      }
    })
    gradeStore.getAll()
    gradeStore.emitter.addListener('GET_GRADES_SUCCES',()=>{
      let numeProiect = ''
      let versiune = 0
      this.state.projectsForTeacher.forEach(project =>{
        this.state.projects.forEach(projectDeVerificat =>{
          if(project.id === projectDeVerificat.id)
          {
            numeProiect = projectDeVerificat.title
            versiune = projectDeVerificat.version
          }
        })
        let grade = 0
        let sum = 0
        let count = 0
        let min = 11
        let max = 1
        this.state.grades.forEach(gradeDeAdaugat =>{
          if(gradeDeAdaugat.projectTitle === numeProiect && gradeDeAdaugat.version === versiune)
          {
            count ++
            sum = sum + gradeDeAdaugat.grade
            if(gradeDeAdaugat.grade > max)
            {
              max = gradeDeAdaugat.grade
            }
            if(gradeDeAdaugat.grade < min)
            {
              min = gradeDeAdaugat.grade
            }
          }
        })
        if(count === 0)
        {
          project.title = project.title + ", nu exista note"
        }
        else{
          if(count >= 3){
            sum = sum - max - min
            grade = sum / (count - 2)
          }
          else{
            grade = sum / count
          }
          project.title = project.title + ", nota: " + grade.toFixed(2)
        }
      })
      this.setState({
        grades:gradeStore.data
      })
    })
    //in cazul in care se fac modificari pe server de la alt client, sa se afiseze modificarile si pe clientul curent
    setInterval(function(){
      store.getAll()
      projectStore.getAll()
      gradeStore.getAll()
    },10000)
  }
//se ocupa de interfata proiectului
render(){
  //afiseaza componentele ecranului de log in
  if((this.state.registerType === 'Log In') && (this.state.isCorrect === false))
  {
    return (
      <div>
        <Login onLog = {this.logIn} onSign = {this.signIn}/>
        </div>
    )
  }
  //afiseaza componentele ecranului de sign in 
  else if(this.state.registerType === 'Sign In'&& (this.state.isCorrect === false))
  {return (
  <div>
    <Register onAdd={this.add} onCancel={this.cancel}/>
  </div>
  )
  }
  //afiseaza componentele ecranului de creare proiect
  else if(this.state.isCorrect === true && this.state.projectStatus === 'create' && this.state.loggedPersonType === 'STUDENT')
  {
    return (    <div>
      <div style={{display: 'block'}}>
      <StudentProjectList onCreateProject={this.createProject} onMyProjects={this.myProjects} onGradeProjects={this.gradeProjects}/>
      </div >
      <br/>
      <div style={{ maxWidth:'40%', margin: '0 auto'}}>
      <div style={{fontSize:16,marginTop:'10px',textAlign:'center'}}>TEAM MEMBERS: </div>
      <br/>
      <ol style={{fontSize:16,marginTop:'10px',width:'300px',textAlign:'center', display:'table', margin:'0 auto'}}>
        {listaEchipa.map(e=><li onMouseOver="this.style.color='#cc9900'"><Person item={e} key={e.id}/></li>)}
      </ol>
      <br/>
      <div style={{margin: '0 auto'}}>
      <Select name="membriiAditionali" id="membriiAditionali"  options={listaMembrii} onChange={this.selectieMembruEchipa}></Select>
      </div>
      <br/>
      <input type="button" className='bCute' style={btnStyle} value="Add Member" onClick={this.addMembruToProject}></input>
      </div>
      <br/>
      <br/>
      <div style={{display: 'block'}}>
      <ProjectAddForm onSaveProject={this.addProject}/>
      </div>
    </div>)
  }
  //afiseaza componentele ecranului de afisare proiecte proprii + interfata de adaugare livrabil
  else if(this.state.isCorrect === true && this.state.projectStatus === 'myProjects' && this.state.loggedPersonType === 'STUDENT' && this.state.selected !== -1)
  {
    return (    
    <div>
      <div style={{fontSize:22,marginTop:'10px', textAlign:'center'}}>
      <StudentProjectList onCreateProject={this.createProject} onMyProjects={this.myProjects} onGradeProjects={this.gradeProjects}/>
      <br/><br/>
      <div style={{display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'start',
      minHeight: '10vh',
      maxWidth: '40vh',
      margin: 'auto',
      fontSize: '50 px',
      backgroundColor: 'rgb(23, 238, 33);'}}>
      <div style={{fontSize:16, marginTop:'10px',textAlign:'center'}}>PROJECTS </div>
      
      {
      this.state.myProjects.map(e=><Project item={e} key={e.id} onSelect={this.Select}/>)
    }
    </div>
       <LivrabilAddForm onAddLivrabil={this.addLivrabil}/>
      </div>,
    </div>)
  }
  //afiseaza componentele ecranului de afisare proiecte proprii 
  else if(this.state.isCorrect === true && this.state.projectStatus === 'myProjects' && this.state.loggedPersonType === 'STUDENT')
  {
    return (    <div>
      <div style={{fontSize:22,marginTop:'10px', textAlign:'center'}}>
      <StudentProjectList onCreateProject={this.createProject} onMyProjects={this.myProjects} onGradeProjects={this.gradeProjects}/>
      <br/><br/>
      <div style={{display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'start',
    minHeight: '10vh',
    maxWidth: '40vh',
    margin: 'auto',
    fontSize: '50 px',
    backgroundColor: 'rgb(23, 238, 33);'}}>
      <div style={{fontSize:16,marginTop:'10px',textAlign:'center'}}>PROJECTS </div> 
      {
      this.state.myProjects.map(e=><Project item={e} key={e.id} onSelect={this.Select}/>)
    }
    </div>
      </div>
    </div>)
  }
  //afiseaza componentele ecranului de notare proiecte + interfata de adaugare a unei note
  else if(this.state.isCorrect === true && this.state.projectStatus === 'gradeProjects' && this.state.loggedPersonType === 'STUDENT' && this.state.selected !== -1)
  {
    return (    <div>
      <div style={{fontSize:22,marginTop:'10px', textAlign:'center'}}>
      <StudentProjectList onCreateProject={this.createProject} onMyProjects={this.myProjects} onGradeProjects={this.gradeProjects}/>
      <br/><br/>
      <div style={{display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'start',
    minHeight: '10vh',
    maxWidth: '40vh',
    margin: 'auto',
    fontSize: '50 px',
    backgroundColor: 'rgb(23, 238, 33);'}}>
      <div style={{fontSize:16,marginTop:'10px',textAlign:'center'}}>PROJECTS </div>
      {
      this.state.foreignProjects.map(e=><Project item={e} key={e.id} onSelect={this.Select}/>)
    }
    </div>
    
    <input type='button' value='View Project' className='bCute' style={btnStyle} onClick={this.viziteazaLink}/>
    <br></br>
    <GradeAddForm onAddGrade={this.addGrade}/>
      </div>
    </div>)
  }
  //afiseaza componentele ecranului de notare proiecte
  else if(this.state.isCorrect === true && this.state.projectStatus === 'gradeProjects' && this.state.loggedPersonType === 'STUDENT')
  {
    return (    <div>
      <div style={{fontSize:22,fontWeight:'bold',marginTop:'10px', textAlign:'center'}}>
      <StudentProjectList onCreateProject={this.createProject} onMyProjects={this.myProjects} onGradeProjects={this.gradeProjects}/>
      <br/><br/>
      <div style={{display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'start',
    minHeight: '10vh',
    maxWidth: '40vh',
    margin: 'auto',
    fontSize: '50 px',
    backgroundColor: 'rgb(23, 238, 33);'}}>
      <div style={{fontSize:16,marginTop:'10px',textAlign:'center'}}>PROJECTS </div>
      
      {
      this.state.foreignProjects.map(e=><Project item={e} key={e.id} onSelect={this.Select}/>)
    }
    </div>
      </div>
    </div>)
  }
  //afiseaza componentele ecranului cu lista completa de proiecte + interfata de vizualizare proiecte pentru TEACHER
  else if(this.state.isCorrect === true && this.state.loggedPersonType === 'TEACHER'&& this.state.selected !== -1 )
  {
    return(
      <div style={{fontSize:22,marginTop:'10px', textAlign:'center'}}>
         <TeacherProjectList style={btnStyle}/>
         <br/><br/>
      <div style={{display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'start',
    minHeight: '10vh',
    maxWidth: '40vh',
    margin: 'auto',
    fontSize: '50 px',
    backgroundColor: 'rgb(23, 238, 33);'}}>
        {
          this.state.projectsForTeacher.map(e=><Project item={e} key={e.id} onSelect={this.Select}/>)
        } 
        </div>
        <input type='button' value='View Project' className='bCute' style={btnStyle} onClick={this.viziteazaLink}/>
        
      </div>
    )
  }
  //afiseaza componentele ecranului cu lista completa de proiecte
  else if(this.state.isCorrect === true && this.state.loggedPersonType === 'TEACHER')
  {
    return(
      <div style={{fontSize:22,marginTop:'10px', textAlign:'center'}}>
         <TeacherProjectList style={btnStyle}/>
         <br/><br/>
      <div style={{display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'start',
    minHeight: '10vh',
    maxWidth: '40vh',
    margin: 'auto',
    fontSize: '50 px',
    backgroundColor: 'rgb(23, 238, 33);'}}>
        {
          this.state.projectsForTeacher.map(e=><Project item={e} key={e.id} onSelect={this.Select}/>)
        }
        </div>
      </div>
    )
  }
}
}

export default App;
