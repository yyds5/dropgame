import React, { useEffect } from 'react';
import { Button } from '@material-ui/core';
import * as matter from 'matter-js'
const Interface = () => {

    // const [resetToggle, setResetToggle] = useState(true);
    const randomInt = (min = 1, max) => {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    const initGame = () => {
        let engine = matter.Engine.create();
        let render = matter.Render.create({
            element: document.body,
            engine
        })

        let ground = matter.Bodies.rectangle(randomInt(200, 550), window.innerHeight / 1.5, randomInt(100, 850), randomInt(100, 350), { isStatic: true });
        let boxList = [];
        // let x = 0;
        // let y = 0
        // let regularBox = matter.Bodies.rectangle(x ? x : 0, y ? y : 0, 80, 80);

        let mouse = matter.Mouse.create(render.canvas);

        let mouseConstraint = matter.MouseConstraint.create(engine, {
            mouse,
            constraint: {
                render: { visible: false }
            },
        });
        matter.Events.on(mouseConstraint, 'mouseup', () => {
            let x = mouse.absolute.x;
            let y = mouse.absolute.y;
            matter.World.add(engine.world, matter.Bodies.rectangle(x, y, 80, 80));
        })
        render.mouse = mouse;

        render.canvas.width = window.innerWidth / 1.5;
        render.canvas.height = window.innerHeight / 1.5;
        render.canvas.style = "width: 100%;text-align:center;"
        matter.World.add(engine.world, [...boxList, ground, mouseConstraint]);
        matter.Engine.run(engine);
        matter.Render.run(render);
    }
    useEffect(() => {
        initGame()
    }, [])
    const resetGame = () => {
        document.location.reload()
    }

    return <div><Button
        fullWidth={true}
        onClick={() => {
            resetGame()
        }}>
        Restart
    </Button></div >
}


export default Interface