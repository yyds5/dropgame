import React, { useEffect, useState } from 'react';
import { Button } from '@material-ui/core';
import * as matter from 'matter-js';
const Interface = () => {
    const [buttonMsg, setButtonMsg] = useState('Restart');

    //returns random integer in range
    const randomInt = (min = 1, max) => {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    const initGame = () => {
        //initial
        let engine = matter.Engine.create();
        let render = matter.Render.create({
            element: document.body,
            engine
        });

        //set ground block size and position
        let groundx = randomInt(200, 550);
        let groundy = window.innerHeight / 1.5;
        let ground = matter.Bodies.rectangle(groundx, groundy, randomInt(100, 850), randomInt(100, 350), { isStatic: true });

        let boxList = [];

        //set mouse constraint
        let mouse = matter.Mouse.create(render.canvas);
        let mouseConstraint = matter.MouseConstraint.create(engine, {
            mouse,
            constraint: {
                render: { visible: false }
            },
        });

        //set mouse click event
        matter.Events.on(mouseConstraint, 'mouseup', () => {
            //grab mouse absolute position
            let x = mouse.absolute.x;
            let y = mouse.absolute.y;
            let newShape = matter.Bodies.rectangle(x, y, randomInt(2, 80), randomInt(2, 80), { chamfer: { radius: randomInt(5, 30) } });
            //checks if mouse position is on top of another existing shape
            let bodyArr = engine.world.bodies;
            let isInsideObj = false;
            bodyArr.forEach((val, i) => {
                if (i > 0) {
                    const { position } = val;
                    if (Math.abs(position.y - y) < 5 || Math.abs(position.x - x) < 5) {
                        isInsideObj = true;
                    }
                }
            });
            if (!isInsideObj) {
                matter.World.add(engine.world, newShape);
            }

            //checks if any shapes are below ground
            setInterval(function () {
                bodyArr.forEach((val, i) => {
                    const { position } = val;
                    if (position.y > groundy) {
                        setButtonMsg('😭Object fell below the ground😭, Game restarting in 3 seconds');

                        setTimeout(() => {
                            resetGame();
                        }, 2500);
                    }
                });
            }, 1000);
        });
        render.mouse = mouse;

        //sets canvas proper position
        render.canvas.width = window.innerWidth / 1.5;
        render.canvas.height = window.innerHeight / 1.5;
        render.canvas.style = "width: 100%;text-align:center;";

        //initials base ground block and game in general
        matter.World.add(engine.world, [...boxList, ground, mouseConstraint]);
        matter.Engine.run(engine);
        matter.Render.run(render);
    };

    useEffect(() => {
        initGame();
    }, []);

    const resetGame = () => {
        document.location.reload();
    };

    return <div><Button
        fullWidth={true}
        onClick={() => {
            resetGame();
        }}>
        {buttonMsg}
    </Button></div >;
};


export default Interface;