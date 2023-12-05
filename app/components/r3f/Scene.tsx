'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, extend, Vector2, useThree } from '@react-three/fiber'
import OrbitControls from 'three/examples/jsm/controls/OrbitControls.js';
import { Mesh, PlaneGeometry, ShaderMaterial, Vector3 } from 'three';
import { useSpring, animated, easings, SpringValue } from '@react-spring/three'
import vertexShader from '../../shaders/vertexShader';
import fragmentShader from '../../shaders/fragmentShader';
import { useDrag, useGesture } from "@use-gesture/react"
import Bottle from './Bottle';
import Poster from './Poster';
import Plane from './Plane';


extend({ OrbitControls })

const Group = ({ items, rotation, rotateL, rotateR }: { rotation: { rotation: number, step: number }, items: { color: string }[], rotateL: () => void, rotateR: () => void }) => {


    const groupRef = useRef(null)

    const { rotationD } = useSpring({
        // rotationD: rotation === 1 ? Math.PI / 2 : 0,
        rotationD: rotation.rotation,
        config: {
            mass: 2,
            friction: 50,
            tension: 70,
        },
    });



    // todo
    // calculate bottle position based on number of items 
    // map bottles with correct position in a circle

    function getCirclePositions(nrOfItems: number, circleSize: number) {
        const positions = [];
        const adjustment = Math.PI / 2;

        for (let i = 0; i < nrOfItems; i++) {
            const angle = (2 * Math.PI / nrOfItems) * i + adjustment;
            const x = circleSize * Math.cos(angle);
            const y = circleSize * Math.sin(angle);
            const angleToFaceCenter = Math.atan2(y, x);

            positions.push({ x, y, angle: angleToFaceCenter });
        }
        return positions;
    }


    const pos = getCirclePositions(items.length, 2)

    console.log('POS;', pos)

    // todo 
    // draggable={i === rotation.step + 2}
    // the starting bottle should be calululated at step 0
    // so draggable is - i === rotation.step

    return (
        <animated.group ref={groupRef} rotation-y={rotationD} position={[0, 0, 2]} >
            {/* <group ref={groupRef} rotation-y={springs.rotation.to((rotation) => rotation)} > */}

            {/* <Bottle position={[1, 1, 1]} /> */}
            {/* <mesh position={[0, 0, 0]} scale={0.3}>
                <boxGeometry />
                <meshStandardMaterial color="pink" />
            </mesh> */}

            {/* <Bottle color="red" position={[1, 2, 0]} /> */}
            {items.map((item, i) => (
                <Bottle draggable={i === (rotation.step + 2) % 7} color={item.color} position={[pos[i].x, 0, pos[i].y]} rotation={[0, -pos[i].angle, 0]} rotateL={rotateL} rotateR={rotateR} />
            ))}
        </animated.group>
    )
}

export default function Scene() {

    // const numberOfObjects = 8;
    // const radianInterval = (2.0 * Math.PI) / numberOfObjects;

    // const [scene, setScene] = useState({
    //     x: Math.cos(radianInterval),
    //     z: Math.sin(radianInterval)
    // })


    const items = [
        { color: 'red' },
        { color: 'green' },
        { color: 'yellow' },
        { color: 'blue' },
        { color: 'orange' },
        { color: 'orange' },
        // { color: 'orange' },
        // { color: 'orange' },
        // { color: 'orange' },
        // { color: 'orange' },
        // { color: 'orange' },
        // { color: 'orange' },
        // { color: 'orange' },
        // { color: 'orange' },
        // { color: 'purple' }
    ]

    const posters = [
        { color: 'red' },
        { color: 'green' },
        { color: 'pink' },
        { color: 'blue' },
        { color: 'orange' },
        // { color: 'purple' },
    ]




    const NR_OF_ITEMS = items.length ?? 0;

    console.log({ NR_OF_ITEMS })


    const STEP_SIZE = getStepSize(NR_OF_ITEMS)

    const [rotation, setRotation] = useState<{ rotation: number, step: number }>({ rotation: 0, step: 0 });

    function getStepSize(nrOfItems: number) {
        const degrees = 360 / nrOfItems;
        console.log({ degrees })
        const radians = degrees * (Math.PI / 180);
        console.log({ radians })

        return radians;

    }


    const handleStep = (step: number) => {
        if (step >= NR_OF_ITEMS) return 0;
        if (step <= 0) return NR_OF_ITEMS;
        return step;
    }

    const rotateL = () => {
        setRotation((prev) => ({ rotation: prev.rotation - STEP_SIZE, step: handleStep(prev.step - 1) }))

    }

    const rotateR = () => {
        setRotation((prev) => ({ rotation: prev.rotation + STEP_SIZE, step: handleStep(prev.step + 1) }))
    }


    const bottleRef = useRef<Mesh>(null);


    // todo:
    // array of items (bottles and posters and text)
    // calculate radial thing(math pi / nr of items ) to get rotational step size 


    // function degreesToRadians(degrees: number) {
    //     return degrees * (Math.PI / 180);
    // }



    console.log(getStepSize(4))

    return (
        // <Canvas camera={{ fov: 75, near: 0.1, far: 1000, position: [0, 1, 5] }}>
        <>
            <Canvas style={{ background: "white" }} shadows>
                {/* <ambientLight intensity={0.2} castShadow /> */}
                <directionalLight castShadow position={[2.5, 8, 5]} intensity={1.5} shadow-mapSize={1024} />

                <pointLight position={[2, 2, 6]} intensity={100} />
                {/* <Box position={[-1.2, 0, 0]} />
            <Box position={[1.2, 0, 0]} /> */}
                {/* <Group rotation-y={rotation} /> */}
                <Group rotation={rotation} items={items} rotateL={rotateL} rotateR={rotateR} />
                {/* <Poster position={[0, 0, 2]} posters={posters} step={rotation.step} /> */}
                <Plane position={[-0.5, -0.6, 2]} rotation-x={-90 * (Math.PI / 180)} scale={4} />
            </Canvas>

            <div className="flex gap-4">
                <h1>{rotation.step}</h1>
                <div className="text-xl cursor-pointer active:bg-red-200" onClick={rotateL}>{'<'}</div>
                <div className="text-xl cursor-pointer active:bg-red-200" onClick={rotateR}>{'>'}</div>
            </div>

        </>
    )
}