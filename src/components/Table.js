import React, {useState,useEffect} from 'react';
import Form from './Form'
//import classes from './Table.module.css'
import classes from './Content.module.css'
import Animate from './Animate.js'

function Table(props){
    

    const tableStyle = {
        margin:'auto',
        
        padding: '10px'
    }

    const [error,throwError] = useState('')
    const [changes,setChanges] = useState({magnitude:0,
        location:0,
        start:0,
        end:0,
        direction:1,})


    const allMagUnits = {
        'U.S': {
            'Add Force': ' Lb',
            'Add Moment': ' Lb-ft',
            'Add Distributed Load':' Lb/ft',
        },
        'S.I' : {
            'Add Force':' N',
            'Add Moment':' N-m',
            'Add Distributed Load':' N/m',
    
        }
    }

    const unit = props.pass.unit

    const allLengths = {
        'U.S': ' ft',
        'S.I': ' m'
    }

    const suppUnit= {
        'U.S': ' Lb',
        'S.I': ' N'

    }

    useEffect(()=>{
        if (changes.location > props.pass.beam || changes.location < 0 || changes.end > props.pass.beam || changes.start < 0 || changes.end < changes.start){
            throwError('You can only enter location in range of 0 to ' + props.pass.beam)
            console.log(error)
        }
        else if (props.pass.beam === 0){
            throwError("Beam length can't be 0")
            console.log(error)
        }
        else{
            throwError('')
        }
        console.log("handlechange: after setting",changes)
    }, [changes.location,changes.end,changes.start,props.pass.beam,error,changes])

  

    
    //let items = props.pass.knowns
    //const [combined,setCombined] = useState([])
    

    //const addToList=(button)=>{
    //    setButtons([...buttonList,button])
    //}

    const handleSubmit = (type)=> { //check element id to close
        return async event => {
            await event.preventDefault()
            //handleOpen(
                //{...buttons,[formType]: {instances:[...buttons[formType].instances,{...data}],show:!buttons[formType].show}}
                //) //old close form 
                //{...buttons,[formType]: {show:!buttons[formType].show}}
                //) // closes form
                console.log('handelSubmit ', changes)
                props.getData({...changes, type:type}) //added field of 'form' for unit conversion
        }
        
    }

    const handleChange =(element)=>{
        //let targetValue = event.target.value
        //setChanges({...changes,[event.target.name] : parseInt(targetValue)})   
        return event => {
            console.log("handlechange: before",element)
            let targetValue = event.target.value
            let id = element.id
            setChanges({...element,...changes,[event.target.name] : parseInt(targetValue),id:id},()=>console.log("handlechange: after setting",changes))   

        }
    }


    let items = props.pass.knowns
    let combined = [...items.force,...items.moment,...items.distributed,...props.pass.unknowns]

    //const handleOpen=(item)=>{
    //    setOpen(true)
        
    //}
    
    let renderItems = combined.map((item,index)=>{
        
        return(
            <tr>
           <td>
                {item.type === 'Add Force'? 'Force':null}
                {item.type === 'Add Moment'? 'Moment':null}
                {item.type === 'Add Distributed Load'? 'Distributed Load':null}
                {item.type === 'Add Support'? 'Support': null}
            </td>
            <td>{item.type=== 'Add Distributed Load'? 'Start :' + item.start + allLengths[unit] + ' End :'+ item.end + allLengths[unit] : item.location+ allLengths[unit]}</td>
            <td>{item.isSupport === false? item.magnitude + allMagUnits[unit][item.type]:
                    Math.abs(item.magnitude) + suppUnit[unit]} </td>
            <td>{item.direction === 1? 'Positive':'Negative'}</td>
            <td><button  id =  {index} onClick = {()=>props.open(item)}>Edit</button>
            {item.edit? 
                <Animate><Form   id = {'editID'+index} change = {handleChange(item)} values = {changes} error = {error} type = {item.type} units = {unit} onSubmit = {handleSubmit}/></Animate>
            :null}
            {item.type !== 'Add Support'?
                <button onClick = {()=>props.delete(item)} style ={{marginBottom: '15px',
            marginLeft:'10px'}}>Delete</button>
            :null}
            </td>
           
            </tr>
        )
    })
    return(
        <div className ={classes.Table}>
            <h2>Added Components</h2>
            <table style = {tableStyle}>
                <tbody>
                <tr>
                    <th>Type</th>
                    <th>Location</th>
                    <th>Magnitude</th>
                    <th>Direction</th>
                    <th>Edit/Delete Component</th>
                </tr>
                {renderItems}
                </tbody>
            </table>
        </div>
    )
}

export default Table