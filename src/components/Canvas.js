import React from 'react';
import classes from './Content.module.css'
import { Stage, Layer, Text, Arrow, Line, Rect, Circle } from 'react-konva';
import Wrap from './Wrap'
import Animate from './Animate.js'




function Canvas(props) {
    const useStyle = {
        background:'#ffffff',
        boxShadow: '3px 3px 4px 4px #adb5bd',
        height: '500px',
        margin: '50px',
        marginLeft: '50px',
        marginRight: '50px',
    }

    let addBeam = props.pass.setupBeam
    let system = props.pass.unit
    let unit = 'm'

    if (system === 'U.S') {
        unit = 'ft'
    }
    else {
        unit = 'm'
    }

    let lengthEnd = props.pass.beam + " " + unit
    let lengthBegin = '0' + " " + unit

    let zeroX = 200
    let zeroY = 200
    let pixelLength = 600
    let renderLength = 600/props.pass.beam

    let allUnits = {
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

    let initialScreen = null
    if (!addBeam) {
        initialScreen = (<Text text={'Add a beam to start!'} fontSize={35} x={100} y={200}/>)
    }


    let newSupport = props.pass.unknowns.map((support,index)=>{
        let supportName = 'Support ' + index
        let deltaX = support.location*renderLength
        let answer = support.magnitude
        let marker = support.location + ' '+ unit
        let reactionName = 'R'+index+ ": " + Math.abs(answer) +  allUnits[system]['Add Force']
        return (
            <Wrap>
                <Text text={supportName} fontSize={15} x={zeroX+deltaX-30} y={zeroY+23} />
                <Circle x={zeroX+deltaX} y={zeroY} radius={20} fill="orange" />
                <Line x={zeroX+deltaX} y={400} points={[0, -15, 0, 0, 0, 0]} stroke="black"/>
                <Text text= {marker} fontSize={15} x={zeroX+deltaX} y={405}/>
                {props.pass.solve && support.direction === 1?
                    <Wrap>
                    <Arrow points={[0,60,0,0]} x={zeroX+deltaX} y={zeroY+50} pointerLength = {20} pointerWidth = {10}  pointerAtBeginning = {false} stroke="red" />
                    <Text text={reactionName} fontSize={15} x={zeroX+deltaX-23} y={zeroY+112}/>
                    </Wrap>
                :null}
                {props.pass.solve && support.direction === -1?

                    <Wrap>
                    <Arrow points={[0,-60,0,0]} x={zeroX+deltaX} y={zeroY+100} pointerLength = {20} pointerWidth = {10}  pointerAtBeginning = {false} stroke="red" />
                    <Text text={reactionName} fontSize={15} x={zeroX+deltaX-23} y={zeroY+112}/>
                    </Wrap>
                :null}
                {props.pass.solve && !support.direction?
                    <Wrap>
                    <Arrow points={[0,60,0,0]} x={zeroX+deltaX} y={zeroY+50} pointerLength = {20} pointerWidth = {10}  pointerAtBeginning = {false} stroke="red" />
                    <Text text={reactionName} fontSize={15} x={zeroX+deltaX-23} y={zeroY+112}/>
                    </Wrap>
                :null}
            </Wrap>
        )
    })

    let newForces = props.pass.knowns.force.map((item, index)=>{
        let itemName = 'F' + index+ ": " + item.magnitude + allUnits[system][item.type]
        //let itemName = item.id

        let marker = item.location + ' '+ unit
        let deltaX = item.location*renderLength
        if (item.direction === 1) {
            return (
                <Wrap>
                    <Arrow points={[0,60,0,0]} x={zeroX+deltaX} y={60} pointerLength = {20} pointerWidth = {10}  pointerAtBeginning = {false} stroke="red" />
                    <Text text={itemName} fontSize={15} x={zeroX+deltaX} y={40}/>
                    <Line x={zeroX+deltaX} y={400} points={[0, -15, 0, 0, 0, 0]} stroke="black"/>
                    <Text text= {marker} fontSize={15} x={zeroX+deltaX} y={405}/>
                </Wrap>
            )
        }

        else if (item.direction === -1) {
            return (
                <Wrap>
                    <Arrow points={[0,-60,0,0]} x={zeroX+deltaX} y={117} pointerLength = {20} pointerWidth = {10}  pointerAtBeginning = {false} stroke="red" />
                    <Text text={itemName} fontSize={15} x={zeroX+deltaX} y={40}/>
                    <Line x={zeroX+deltaX} y={400} points={[0, -15, 0, 0, 0, 0]} stroke="black"/>
                    <Text text= {marker} fontSize={15} x={zeroX+deltaX} y={405}/>
                </Wrap>
        )
        }
    }
    )


    let newMoments = props.pass.knowns.moment.map((item, index)=>{
        let itemName = 'M' + index+ ": " + item.magnitude + allUnits[system][item.type]
        let marker = item.location + ' '+ unit
        let deltaX = item.location*renderLength
            if (item.direction === 1){
                        return (
                            <Wrap>
                                <Arrow points={[-100/2,10/2,-30/2,-30/2,-100/2,-100/2]} x={zeroX+deltaX} y={180} pointerLength = {20} pointerWidth = {10}  pointerAtBeginning = {false} stroke="red" tension = {0.8}/>
                                <Text text={itemName} fontSize={15} x={zeroX+deltaX-70} y={200}/>
                                <Text text= {marker} fontSize={15} x={zeroX+deltaX} y={405}/>
                                <Line x={zeroX+deltaX} y={400} points={[0, -15, 0, 0, 0, 0]} stroke="black"/>
                            </Wrap>
                        )
                    }
            else if ( item.direction === -1) {
                        return (
                            <Wrap>
                                <Arrow points={[0,40,-20,20,5,0,25,30]} x={zeroX+deltaX+6} y={150} pointerLength = {20} pointerWidth = {10}  pointerAtBeginning = {false} stroke="red" tension = {0.8}/>
                                <Text text={itemName} fontSize={15} x={zeroX+deltaX-20} y={200}/>
                                <Text text= {marker} fontSize={15} x={zeroX+deltaX} y={405}/>
                                <Line x={zeroX+deltaX} y={400} points={[0, -15, 0, 0, 0, 0]} stroke="black"/>
                            </Wrap>
                        )
                    }
    })

    let newDistributed = props.pass.knowns.distributed.map((item, index)=>{
        let magStart = 'w' + index + ': ' + item.magnitude + allUnits[system][item.type] //starting magnitude
        let magEnd = null //implement end magnitude later
        let startLabel = item.start + ' '+ unit
        let endLabel = item.end + ' ' + unit

        let renderStart = item.start*renderLength // start arrow
        let renderEnd = item.end*renderLength //end arrow
        let sqStart = zeroX+ renderStart //rect X and line X
        let width = renderEnd - renderStart //rect width
            return (
                <Wrap>
                    <Rect x={zeroX + renderStart} y={110} width={width} height={40} fill="#00D2FF" opacity = '0.5'/>
                    <Line x={zeroX + renderStart} y={110} points={[width, 0, 0, 0, 0, 0]} stroke="blue"/>
                    <Arrow points={[0,-40,0,-30,0,0]} x={zeroX + renderStart} y={150} pointerLength = {20}
                        pointerWidth = {10}  pointerAtBeginning = {false} stroke="blue" tension = {0.8}/>
                    <Arrow points={[0,-40,0,-30,0,0]} x={zeroX+renderEnd} y={150} pointerLength = {20}
                        pointerWidth = {10}  pointerAtBeginning = {false} stroke="blue" tension = {0.8}/>
                    <Text text= {magStart} fontSize={15} x={zeroX+renderStart} y={90}/>
                    <Text text= {startLabel} fontSize={15} x={zeroX+renderStart} y={405}/>
                    <Text text= {endLabel} fontSize={15} x={zeroX+renderEnd} y={405}/>
                    <Line x={zeroX+renderStart} y={400} points={[0, -15, 0, 0, 0, 0]} stroke="black"/>
                    <Line x={zeroX+renderEnd} y={400} points={[0, -15, 0, 0, 0, 0]} stroke="black"/>
                </Wrap>
            )
    })





    return (
        <div style = {useStyle} className = {classes.Canvas}>
            <Stage width={900} height={500}>
                <Layer>

                {initialScreen}

                    {/*Positive Force*/}
                    {/*<Arrow points={[0,60,0,0]} x={500} y={60} pointerLength = {20} pointerWidth = {10}  pointerAtBeginning = {false} stroke="red" />
                    <Text text="+Force" fontSize={15} x={485} y={125}/>*/}

                    {/*Negative Force*/}
                    {/*<Arrow points={[0,-60,0,0]} x={570} y={117} pointerLength = {20} pointerWidth = {10}  pointerAtBeginning = {false} stroke="red" />
                    <Text text="-Force" fontSize={15} x={550} y={125}/>*/}

                    {/*BEAM SETUP*/}
                    {addBeam?
                    <Wrap>
                        <Rect x={200} y={150} width={600} height={30} fill="grey"/>
                        {/*label beginning*/}
                        <Text text={lengthBegin} fontSize={15} x={200} y={405}/>
                        {/*tick mark beginning*/}
                        <Line x={200} y={400} points={[0, -15, 0, 0, 0, 0]} stroke="black"/>

                        {/*Ruler*/}
                        <Line x={200} y={400} points={[600, 0, 0, 0, 0, 0]} stroke="black"/>
                        {/*tick mark end*/}
                        <Line x={800} y={400} points={[0, -15, 0, 0, 0, 0]} stroke="black"/>
                        {/*label end*/}
                        <Text text= {lengthEnd} fontSize={15} x={800} y={405}/>
                    </Wrap>
                    :null}

                    {/*Actual User Inputted Supports*/}
                    {newSupport}

                    {/*Actual User Inputted Forces/Moments*/}


                    {/*Reference ONLY!*/}
                    {/*Support A*/}
                    {/*<Text text="Support A" fontSize={15} x={zeroX-30} y={zeroY+23} />
                    <Circle x={zeroX} y={zeroY} radius={20} fill="green" />*/}

                    {/*Support B*/}
                    {/*<Text text="Support B" fontSize={15} x={665} y={223} />
                    <Line x={685} y={200} points={[40, 15, 15, -20, -15, 15, 15,15]}  fill = 'blue' closed />*/}

                    {/*Moment*/}
                    {/*CW moment*/}
                    {/*<Arrow points={[0,40,-20,20,5,0,25,30]} x={700} y={150} pointerLength = {20} pointerWidth = {10}  pointerAtBeginning = {false} stroke="red" tension = {0.8}/>
                    <Text text="Moment Mangitude" fontSize={15} x={680} y={200}/>*/}

                    {/*CCW moment*/}
                    {/*<Arrow points={[-100/2,10/2,-30/2,-30/2,-100/2,-100/2]} x={500} y={180} pointerLength = {20} pointerWidth = {10}  pointerAtBeginning = {false} stroke="red" tension = {0.8}/>
                    <Text text="Moment Mangitude" fontSize={15} x={430} y={200}/>*/}

                    {/*distributed load*/}
                    {/*<Rect x={zeroX} y={110} width={600} height={40} fill="#00D2FF"/>
                    <Line x={zeroX} y={110} points={[600, 0, 0, 0, 0, 0]} stroke="blue"/>
                    <Arrow points={[0,-40,0,-30,0,0]} x={zeroX} y={150} pointerLength = {20} pointerWidth = {10}  pointerAtBeginning = {false} stroke="blue" tension = {0.8}/>
                    <Arrow points={[0,-40,0,-30,0,0]} x={zeroX+600} y={150} pointerLength = {20} pointerWidth = {10}  pointerAtBeginning = {false} stroke="blue" tension = {0.8}/>*/}

                    {newDistributed}
                    {newForces}
                    {newMoments}
                </Layer>
            </Stage>
        </div>
    )
}

export default Canvas

