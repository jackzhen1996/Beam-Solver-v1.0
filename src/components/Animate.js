import React from 'react';
import {Spring} from 'react-spring/renderprops'

const Animate =(props)=>{
    const children = props.children
    return (
    <Spring
        from = {{opacity:0,marginTop: -100}}
        to= {{opacity:1,marginTop: 0}}
    >
        {props=>(<div style = {props}>
            {children}
        </div>)}
    </Spring>
    )
}

export default Animate