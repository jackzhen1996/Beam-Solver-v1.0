import React , {useState, useEffect,useRef} from 'react';
import classes from './Content.module.css'
import Form from './Form'
import {Spring} from 'react-spring/renderprops'

const initialState = {
    magnitude:0,
    location:0,
    direction:1,
    length:0,
    location:0,
    errorMessage: ''
}

function ButtonGroup(props) {
    //const useStyle ={
    //    boxShadow: '3px 3px 4px 4px #adb5bd',
    //    background:'#ffffff',
    //    width: '200px',
    //    margin: '50px',
    //    paddingTop: '25px',
    //    paddingBottom: '40px',
    //    paddingLeft: '30px',
    //    paddingRight: '30px'
    //}

    const [checked, setColl] = React.useState(false);

    const [buttons,setShow] = useState(
        {'Add Force': {instances:[],show:false}, 
        'Add Support': {instances:[],show:false}, 
        'Add Beam': {instances:[],show:false}, 
        'Add Moment': {instances:[],show:false},
        'Add Distributed Load': {instances:[],show:false},}
        )
    
    const [data,setData] = useState (initialState)
    const [reset,activateReset] = useState (false)
    const [units, setUnits] = useState('U.S')
    const [error,throwError] = useState('')

    //const prevUnit = useRef()

    const open =(buttonName)=> {

        setShow({...buttons,[buttonName]: {...buttons[buttonName],show:!buttons[buttonName].show}})
    }

    const resetData=()=>{
        activateReset(!reset)
        if (reset === true) {
            props.reset()
        }
    }


    useEffect(()=>{
        //prevUnit.current = units
        if (data.location > data.length || data.location < 0)
        {
            throwError('You can only enter location in range of 0 to ' + data.length)
            console.log(error)
        }
        else if (data.length <= 0){
            throwError("Beam length has to be greater than 0")
            console.log(error)
        }
        else if (data.length > 0  && props.beamCheck === 0){
            throwError("Beam length can't be 0")
            console.log(props.beamCheck,data.length)
        }
        else if (data.end > data.length || data.start < 0 || data.end <= data.start || data.start >= data.length){
            throwError('Start or End is out of range')
            console.log(error)
        }
        //else if (units !== prev){
        //    props.changeUnit(units)
        //}
        else{
            throwError('')
        }
    },[data.location,data.length,data.end,data.start,error,props.beamCheck])

    //const prev = prevUnit.current

    


    const handleChange =(event)=> {
            //setShow({...buttons,
            //formType: {...buttons[formType],instances: [{[event.target.name]:parseInt(event.target.value)}]},
            //})
        let targetValue = event.target.value
        let targetName = event.target.name
        setData({...data,[targetName] : parseInt(targetValue)})   
    }

    const unitChange=()=>{
        if (units === 'S.I'){
        setUnits('U.S') 
        
    }
        if (units == 'U.S') {
            setUnits('S.I') 
        }
        
    }


    const handleSubmit = (formType)=> { //Currying function
        return async event => {
            event.preventDefault()
            await setShow(
                //{...buttons,[formType]: {instances:[...buttons[formType].instances,{...data}],show:!buttons[formType].show}}
                //) //old close form 
                {...buttons,[formType]: {show:!buttons[formType].show}}
                ) // closes form
                console.log('Currently entered: '+ formType, data)
                props.getData({...data,type:formType,unit:units,id:Date.now(),edit:false,isSupport: formType === 'Add Support',unit:units}) //added field of 'form' for unit conversion
            //await setData(initialState)
            //console.log('Data Cleared:', data)
        }
        
    }

    const renderButtons = (
        Object.keys(buttons).map((buttonName,index)=>{
                return (
                             <div>
                                <button name = {buttonName} key = {index} onClick = {()=>open(buttonName)}>{buttonName}</button>
                                {data.length === 0 && buttonName === 'Add Beam'&& buttons[buttonName].show === false?  <p style = {{color:'red',}}>Please Add Beam first !</p>: null}
                                {buttons[buttonName].show ? 

                                <Spring
                                    
                                    from = {{opacity:0,marginTop: -100}}
                                    to= {{opacity:1,marginTop: 0}}
                                >
                                    {props => (<div style = {props}>
                                        <Form id = {'addID' + index} error = {error} units = {units} values = {data} change = {handleChange} type = {buttonName} onSubmit = {handleSubmit}/>
                                    </div>)}
                                </Spring>

                                : null}
                                <br/>
                            </div>
                        
                   
                )
            }
        )
    )

    return (
        <div className = {classes.buttonGroup}>
            {renderButtons}
            <button onClick = {resetData}>Reset Data</button>
            <p style = {{fontSize: '13px'}}>*Double click to reset</p>
            <br/>
        <div style = {{marginTop:'20px'}}>
        
            <label>Units: </label>
                    <select name = 'select' value = {units} onChange= {unitChange}>
                        <option value="U.S">U.S</option>
                        <option value="S.I">S.I</option>
                    </select>
        </div>
            <button style = {{padding: '12px 40px', fontSize: '20px', background: '#e63946'}} id = {'solve'} onClick = {props.solve}>Solve</button>
        </div>
    )
}

export default ButtonGroup

