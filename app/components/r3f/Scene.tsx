'use client';

import React, { useCallback, useRef, useState } from 'react'
import { Canvas, useFrame, extend, Vector2 } from '@react-three/fiber'
import OrbitControls from 'three/examples/jsm/controls/OrbitControls.js';
import { Mesh, PlaneGeometry } from 'three';
import { useSpring, animated, easings, SpringValue } from '@react-spring/three'


extend({ OrbitControls })

function Box(props: any) {
    const meshRef = useRef(null)
    const [hovered, setHover] = useState(false)
    const [active, setActive] = useState(false)
    useFrame((state, delta) => (
        // @ts-ignore
        meshRef.current.rotation.x += 0.01
    ))
    return (
        <mesh
            {...props}
            ref={meshRef}
            scale={active ? 1.5 : 1}
            onClick={(event) => setActive(!active)}
            onPointerOver={(event) => setHover(true)}
            onPointerOut={(event) => setHover(false)}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
        </mesh>
    )
}


const Plane = (props: any) => {

    return (
        <mesh {...props}>
            <planeGeometry args={[1, 1, 1]} />
            <meshStandardMaterial />
        </mesh>
    )
}


const Bottle = ({ position, color, rotation }: { position: any, color: string, rotation: any }) => {


    const bottleRef = useRef<Mesh>(null);


    return (
        <animated.mesh position={position}
            ref={bottleRef} rotation={rotation}>
            {/* <cylinderGeometry args={[0.5, 0.5, 1]} /> */}
            <boxGeometry args={[0.2, 0.2, 0.2]} />
            <meshPhysicalMaterial attach="material" color={color} />
        </animated.mesh>
    )
}


const Poster = (props: any) => {

    return (
        <mesh {...props}>
            <planeGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="white" />
        </mesh>
    )
}


const Group = ({ items, rotation }: { rotation: number | any, items: { color: string }[] }) => {

    const [step, setStep] = useState(0)

    const groupRef = useRef(null)

    const { rotationD } = useSpring({
        // rotationD: rotation === 1 ? Math.PI / 2 : 0,
        rotationD: rotation,
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
        for (let i = 0; i < nrOfItems; i++) {
            const angle = (2 * Math.PI / nrOfItems) * i;
            const x = circleSize * Math.cos(angle);
            const y = circleSize * Math.sin(angle);
            const angleToFaceCenter = Math.atan2(y, x);

            positions.push({ x, y, angle: angleToFaceCenter });
        }
        return positions;
    }


    const pos = getCirclePositions(items.length, 4)

    console.log('POS;', pos)


    return (
        <animated.group ref={groupRef} rotation-y={rotationD} >
            {/* <group ref={groupRef} rotation-y={springs.rotation.to((rotation) => rotation)} > */}

            {/* <Bottle position={[1, 1, 1]} /> */}
            {/* <mesh position={[0, 0, 0]} scale={0.3}>
                <boxGeometry />
                <meshStandardMaterial color="pink" />
            </mesh> */}

            {/* <Bottle color="red" position={[1, 2, 0]} /> */}
            {items.map((item, i) => (
                <Bottle color={item.color} position={[pos[i].x, 0, pos[i].y]} rotation={[0, -pos[i].angle, 0]} />
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
        { color: 'pink' },
        { color: 'blue' },
        { color: 'orange' },
        { color: 'orange' },
    ]




    const NR_OF_ITEMS = items.length ?? 0;




    const STEP_SIZE = getStepSize(NR_OF_ITEMS)

    const [rotation, setRotation] = useState<number>(STEP_SIZE / 2);

    function getStepSize(nrOfItems: number) {
        const degrees = 360 / nrOfItems;
        console.log({ degrees })
        const radians = degrees * (Math.PI / 180);
        console.log({ radians })

        return radians;

    }


    const rotateL = () => {
        setRotation((prev) => prev - STEP_SIZE)

    }

    const rotateR = () => {
        setRotation((prev) => prev + STEP_SIZE)
    }


    const [springs, api] = useSpring(
        () => ({
            rotate: 0,
            config: key => {
                switch (key) {
                    // case 'position':
                    //     return {
                    //         mass: 4,
                    //         friction: 10,
                    //     }
                    default:
                        return {}
                }
            },
        }),
        []
    )


    console.log({ springs })
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
            <Canvas>
                <ambientLight intensity={0.2} />
                <pointLight position={[11, -6, 4]} intensity={100} />
                {/* <Box position={[-1.2, 0, 0]} />
            <Box position={[1.2, 0, 0]} /> */}
                {/* <Group rotation-y={rotation} /> */}
                <Group rotation={rotation} items={items} />
                {/* <Poster position={[0, 0, 2]} /> */}
                <Plane position={[0, -2.53, 1]} rotation-x={1} scale={10} />
            </Canvas>

            <div className="flex gap-4">
                <div className="text-xl cursor-pointer active:bg-red-200" onClick={rotateL}>{'<'}</div>
                <div className="text-xl cursor-pointer active:bg-red-200" onClick={rotateR}>{'>'}</div>
            </div>

        </>
    )
}