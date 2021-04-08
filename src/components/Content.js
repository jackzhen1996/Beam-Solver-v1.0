import React, {Component} from 'react';
import ButtonGroup from './ButtonGroup'
import Canvas from './Canvas'
import Table from './Table'
import classes from './Content.module.css'
import * as math from  'mathjs'

const initialState = {
    knowns: {force:[],moment:[],distributed:[]},
    unknowns: [],
    beam: 0,
    unit: 'U.S',
    solve: false,
    setupBeam:false,
    error: null
}

class Content extends Component {
    state = {
        knowns: {force:[],moment:[],distributed:[]},
        unknowns: [],
        beam: 0,
        unit: 'U.S',
        solve: false,
        setupBeam:false,
        error: null
    }

    componentDidMount(){
        document.body.style.backgroundColor = '#ced4da'
    }

    deleteElement(element){ //delete only forces
        if (!element.isSupport) {
            let splitArray = element.type.split(' ')
            let type = splitArray[1].toLowerCase()
            let newArray = [...this.state.knowns[type]].filter(item => item.id !== element.id)
            this.setState({knowns:{...this.state.knowns,[type]:newArray}})
        }
        else if (element.isSupport){//implement for supports
            let newArray2 = [...this.state.unknowns].filter(item => item.id !== element.id)
            //console.log(element.edit)
            this.setState({unknowns:[...newArray2]})
        }


    }

    changeUnit(unit){
        this.setState(()=>
            ({unit:unit})
        )
        console.log(this.state.unit)
    }

    setOpen(element){
        let splitArray = element.type.split(' ')
        let type = splitArray[1].toLowerCase()
        let newElement = {...element,edit:!element.edit}

        if(!element.isSupport) {                                                  //edit button logic for non supoort buttons
            let found= this.state.knowns[type].find(item=>item.id === element.id) //exclude the target item in state array
            let indexOfFound = this.state.knowns[type].indexOf(found)             //find item insert order
            let newElement = {...element,edit:!element.edit}                      //reinsert the desired changed element into same index as the state array
            let newArray = [...this.state.knowns[type]].filter(item => item.id !== element.id)
                newArray.splice(indexOfFound,0,newElement)
            this.setState({knowns:{...this.state.knowns, [type]:[...newArray]}})   //set state
        }
        else if (element.isSupport) {                                              //edit button logic for support buttons
            let found2= this.state.unknowns.find(item=>item.id === element.id)
            let indexOfFound2 = this.state.unknowns.indexOf(found2)
            let newArray2 = [...this.state.unknowns].filter(item => item.id !== element.id)
                newArray2.splice(indexOfFound2,0,newElement)
            this.setState({unknowns:[...newArray2]})
        }
    }

    //submitElement(type) { //handle submit for edit form
    //    return event =>{
    //    event.preventDefault()
    //    event.stopPropagation()
    //    return console.log('changed for ' + type)
    //    }
        //let splitArray = element.type.split(' ')
        //let type = splitArray[1].toLowerCase()
        //let target = this.state.knowns[type].find(item=>item.id === element.id)
        //console.log('element of ' + type + ' submitted a change:', target)


    //handleEdit(element,event) {
    //    let splitArray = element.type.split(' ')
    //    let type = splitArray[1].toLowerCase()
    //    let found= this.state.knowns[type].find(item=>item.id === element.id)
    //    console.log(found)
    //    this.setState({knowns:{...this.state.knowns, [type]:[...this.state.knowns[type],{...found,[event.target.name]:event.target.value}]}})
    //}

    getChanges(element) { //for editing
        let splitArray = element.type.split(' ')
        let type = splitArray[1].toLowerCase()
        if (!element.isSupport){
            let found= this.state.knowns[type].find(item=>item.id === element.id)
            //console.log('Found: ',found)
            this.deleteElement(found)
            this.setState({knowns:{...this.state.knowns, [type]:[...this.state.knowns[type],element]}})
            console.log(this.state)
        }else if (element.isSupport){
            let newArray2 = [...this.state.unknowns].filter(item => item.id !== element.id)
            let found= this.state.unknowns.find(item=>item.id === element.id)
            //console.log(element.edit)
            this.deleteElement(found)
            this.setState({unknowns:[...newArray2,{...element}]})
        }
       //implement for supports

    }

    getData(newData){ //for getting new data from buttongroup
        console.log('Content Page Received Data from child!')
        const {length,...newKnown} = newData
        const {direction,...newSupport} = newKnown
        this.setState({unit:newData.unit})
        this.setState(()=>{
            if (newData.type === 'Add Force'){
                return {knowns:{...this.state.knowns,force:[...this.state.knowns.force,newKnown]}}
            }
            else if (newData.type === 'Add Moment'){
                return {knowns:{...this.state.knowns,moment:[...this.state.knowns.moment,newKnown]}}
            }
            else if (newData.type === 'Add Distributed Load'){
                return {knowns:{...this.state.knowns,distributed:[...this.state.knowns.distributed,newKnown]}}

            }
            else if (newData.type === 'Add Support'){
                return {unknowns:[...this.state.unknowns,newSupport]}
            }
            else if (newData.type === 'Add Beam'){
                let length = newData.length
                if (length > 0){
                    this.setState({setupBeam:true})
                }
                return {beam:parseInt(length)}
            }

        }
        )
        console.log("Content State", this.state)
    }

    sumFi(Fi) { //sum of first row in b vector
        let array1 = Fi.force.map((force)=>{
            return force.magnitude*force.direction*-1
        })

        let array2 = Fi.distributed.map((distr)=>{
            return distr.magnitude*(distr.end-distr.start)
        })


        let reducer = (acc,curr) => acc+curr

        let forceOnly = array1.length !==0
        let distrOnly = array2.length !== 0

        if (forceOnly && distrOnly) {
            return array1.reduce(reducer) +  array2.reduce(reducer)
        }
        else if(forceOnly) {
            return array1.reduce(reducer)
        }
        else if (distrOnly){
            return array2.reduce(reducer)
        }
        else {
            return 0
        }
    }

    sumFiXi(Fi,Ri){ //sum of products of interaction x distance for second row in b vector
        let inverse = 1
        let array1 = Fi.force.map((force)=>{
            let deltaX = Math.abs(Ri[0].location - force.location)
            if (force.location < Ri[0].location && force.direction === 1) {
                inverse = 1
            }
            else if(force.location < Ri[0].location && force.direction === -1) {
                inverse = -1
            }
            else if (force.location > Ri[0].location && force.direction === -1){
                inverse = 1
            }
            else if (force.location === Ri[0].location){
                inverse = 0
            }
            else if (force.location > Ri[0].location && force.direction === 1){
                inverse = -1
            }
            return force.magnitude*deltaX*inverse
        })

        let array2 = Fi.moment.map((moment)=>{
            return moment.magnitude*moment.direction*-1
        })

        let array3 = Fi.distributed.map((distr)=>{
            let distance = Math.abs(Ri[0].location - ((distr.end-distr.start)/2+distr.start))
            let inverse = 1
            if (distr.start >= Ri[0].location) {
                inverse = 1
            }
            else if(distr.start < Ri[0].location) {
                inverse = -1
            }
            return distr.magnitude*(distr.end - distr.start)*distance*inverse

        })

        let reducer = (acc,curr) => acc+curr
        let forceOnly = array1.length !== 0
        let momentOnly = array2.length !== 0
        let distrOnly = array3.length !== 0


        if (forceOnly && momentOnly && distrOnly) {
            return array1.reduce(reducer) +  array2.reduce(reducer) + array3.reduce(reducer)
        }
        else if (forceOnly && momentOnly){
            return array1.reduce(reducer) + array2.reduce(reducer)
        }
        else if (forceOnly && distrOnly){
            return array1.reduce(reducer) + array3.reduce(reducer)
        }
        else if (momentOnly && distrOnly) {
            return array2.reduce(reducer) + array3.reduce(reducer)
        }else if(forceOnly) {
            return array1.reduce(reducer)
        }
        else if (momentOnly) {
            return array2.reduce(reducer)
        }
        else if(distrOnly) {
            return array3.reduce(reducer)
        }
    }

    solve(){ //solving the problem by vector matrices
        //Trival Case: 2 supports and x knowns
        //let answers = []
        let R1 = this.state.unknowns[0]
        let R2 = this.state.unknowns[1]

        let A = [[1,1],
                 [0,R2.location-R1.location]]

        let b = [[this.sumFi(this.state.knowns)],
                 [this.sumFiXi(this.state.knowns,this.state.unknowns)]]

        let A_I = math.inv(A)

        let x = math.multiply(A_I,b)

        console.log(b)
        //answers.push({name:'R1', location: R1.location, magnitude: x[0][0], direction:x[0][0]/Math.abs(x[0][0])})
        //answers.push({name:'R2', location: R2.location, magnitude: x[1][0], direction:x[1][0]/Math.abs(x[1][0])})
        //console.log(x)

        this.setState({solve:true,unknowns:[{...this.state.unknowns[0],magnitude:x[0][0].toFixed(1),direction:x[0][0]/Math.abs(x[0][0])},
                    {...this.state.unknowns[1],magnitude:x[1][0].toFixed(1),direction:x[1][0]/Math.abs(x[1][0])}]},
                   ()=>console.log('Solved!', this.state.unknowns))
    }

    getSolveSignal(){ //get solve signal from buttongroup
        console.log('Content received signal to solve')
        if (this.state.knowns.force.length === 0 && this.state.knowns.moment.length === 0 && this.state.knowns.distributed.length ===0
            )
        {
            this.setState({error:'Cannot solve due to missing loads!'})
            console.log('Cannot solve due to missing loads!')

        }
        else if (this.state.unknowns.length < 2){
            this.setState({error:'Cannot solve due to missing supports!'})
            console.log('Cannot solve due to missing supports!')
        }
        else {
            this.setState({error:'Solved!'})
            this.solve()
        }
    }


    async resetData(){ //reset all state arrays to zero
       await this.setState(()=>initialState)
       console.log(this.state)
    }



    render() { //render components


        let noBeam = 'No beam added'

        return (
            <div className = {classes.flexContainer}>
                <div className={classes.left}>
                    <ButtonGroup beamCheck = {this.state.beam} changeUnit = {this.changeUnit.bind(this)} solve = {this.getSolveSignal.bind(this)} reset = {this.resetData.bind(this)} getData = {this.getData.bind(this)}/>
                </div>
                <div className={classes.middle}>
                    <Canvas pass = {this.state} output = {this.state}/>
                    <div className = {classes.message}><h4>Message:</h4>
                        {this.state.beam === 0? <span>{noBeam}</span>:
                            <span style = {this.state.error === 'Solved!'? {color: 'green'}: {color: 'red'}}> {this.state.error}</span>
                        }
                    </div>

                    <Table open = {this.setOpen.bind(this)} getData = {this.getChanges.bind(this)} delete = {this.deleteElement.bind(this)} pass = {this.state}></Table>
                </div>
            </div>
        )
    }
}

export default Content

