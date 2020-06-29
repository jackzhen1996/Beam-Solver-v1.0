import React from 'react';
import Wrap from './Wrap'
import classes from './Form.module.css'

function Form(props) {
    let type = props.type
    let length = true
    let magnitude = true
    let direction = true
    let location = true
    let unit = props.units
    let throwError = props.error
    let disable = throwError !== ''

    let data = props.values

    if (type === 'Add Beam'){
        disable = null
    }

    switch(type) {
        case 'Add Force':
            length = false
            break
        case 'Add Support':
            direction = false
            length = false
            magnitude = false
            break
        case 'Add Beam':
            location = false
            magnitude = false
            direction = false
            break
        case 'Add Moment':
            length = false
            break
        case 'Add Distributed Load':
            location = false
            length = false
            direction = false

        default:
            length = false
    }

    let len = 'm'
    let mag = 'N'

    switch(unit){
        case 'U.S':
            len = 'ft'
            mag = 'Lb'
            break
        case 'S.I': 
            len = 'm'
            mag = 'N'
    }

    if (type === 'Add Moment' && unit === 'U.S'){
        mag = 'Lb-ft'
    }
    else if (type === 'Add Distributed Load' && unit === 'S.I') {
       mag = 'N/m'
    }
    else if (type === 'Add Distributed Load' && unit === 'U.S'){
        mag = 'Lb/ft'

    }
    else if (type === 'Add Moment' && unit === 'S.I'){
        mag = 'N-m'
    }


    return(
        <div className = {classes.form}>
            <form onSubmit = {props.onSubmit(props.type)}>

            {type === 'Add Distributed Load'?
                    <Wrap>
                        <label>Start ({len}):</label>
                        <input value = {data.start} name = 'start' onChange = {props.change} type = 'number'></input>
                        {throwError === 'Start or End is out of range'? <p style = {{color:'red'}}>{throwError}</p>: null}
                        <br/>
                        <label>End ({len}):</label>
                        <input value = {data.end} name = 'end' onChange = {props.change} type = 'number'></input>
                        {throwError === 'Start or End is out of range'? <p style = {{color:'red'}}>{throwError}</p>: null}
                        <br/>
                    </Wrap>
                :null}


                {location? 
                <div>
                    <label>Location ({len}):</label>
                    <input value = {data.location} name = 'location' onChange = {props.change} type = 'number'></input>
                     {throwError !== ''? <p style = {{color:'red'}}>{throwError}</p>: null} <br/>
                </div>:null}

                {magnitude? 
                <div>
                    <label>Magnitude ({mag}):</label>
                    <input value = {data.magnitude} name = 'magnitude' onChange = {props.change} type = 'number'></input>
                    <br/>
                </div>
                :null }
                {direction? 
                <div>
                    <label>Direction:  </label>
                    <select type = 'number' name = 'direction' onChange= {props.change} value = {data.direction}>
                        <option value= '1'>{type === 'Add Moment'? 'Counter-Clockwise': 'Positive'}</option>
                        <option value='-1'>{type === 'Add Moment'? 'Clockwise': 'Negative'}</option>
                    </select>
                    <br/>
                </div>
                :null}
                
                {length?
                <div>
                    <label>Length ({len})</label>
                    <input value = {data.length} name = 'length' onChange = {props.change} type = 'number'></input>
                    {throwError === "Beam length has to be greater than 0"? <p style = {{color:'red'}}>{throwError}</p>: null}
                    <br/>
                </div>
                 : null  }
    
                <input class = {'submit'} disabled = {disable} id = {props.id} type = 'submit' name = 'Submit'></input>
                    
            </form>
           
        </div>
    )
}

export default Form