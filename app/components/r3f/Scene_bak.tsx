'use client';

import React, { useCallback, useRef, useState } from 'react'
import { Canvas, useFrame, extend } from '@react-three/fiber'
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


const Bottle = ({ position, color }: { position: any, color: string }) => {

    // const [position, setPosition] = useState(0)
    // const { width, height } = useThree(state => state.size)


    // TODO
    // const numberOfObjects
    // calculate the step between each object (Math.Pi * somethind / numberOfObjects?)
    // onClick  object / swipe / click arrow (<= / =>) set update positions 


    // example
    // props.x
    //  .to([0, 1], [0, 360])
    // .to(value => `rotateZ(${value}deg)`),

    // idea !!!!!!
    // props.rotationY
    //       .to(value => Math.sin(value)),
    //       props.rotationX
    //       .to(value => Math.cos(value)),

    const [springs, api] = useSpring(
        () => ({
            scale: 1,
            // position: [0, 0],
            color: '#ff6d6d',
            config: key => {
                switch (key) {
                    case 'scale':
                        return {
                            mass: 4,
                            friction: 10,
                        }
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
    const bottleRef = useRef<Mesh>(null);


    const handleClick = () => {
        api.start({
            scale: 2.5,
        })
    }

    //------

    const props = useSpring({
        from: { x: 0 },
        to: { x: 360 },
    })
    //------
    // const handleClick = useCallback(
    //     () => {

    //         const numberOfObjects = 8;
    //         const radius = 6;
    //         const radianInterval = (2.0 * Math.PI) / numberOfObjects;

    //         console.log({ position })

    //         setPosition((prev) => (radianInterval + prev))
    //         const x = Math.cos(position + radianInterval)
    //         const z = Math.sin(position + radianInterval)

    //         // const x = position + radianInterval
    //         // const z = position + radianInterval

    //         api.start({
    //             position: [x * 2, z * 2],
    //         })
    //     },

    //     [api, position]
    // )




    // useFrame((state, delta) => {

    //     // console.log(delta)
    //     bottleRef.current!.position.x = Math.cos(state.clock.elapsedTime) * 1.5
    //     bottleRef.current!.position.z = Math.sin(state.clock.elapsedTime) * 1.5

    // })

    return (
        // <animated.mesh onClick={handleClick} position={[Math.cos(position) * 3, 0, Math.sin(position) * 3]} ref={bottleRef} rotation-z={1.6}>
        // <animated.mesh onClick={handleClick} position={springs.position.to((x, z) => [x, 0, z])}
        <animated.mesh onClick={handleClick} position={position} rotation-y={props.x.to(value => value)}
            ref={bottleRef} >
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


const Group = ({ rotation }: { rotation: number | any }) => {


    console.log({ rotation })
    const groupRef = useRef(null)




    // const [springs, api] = useSpring(
    //     () => ({
    //         rotation: 0,
    //         color: '#ff6d6d',
    //         onStart: () => {
    //             console.log('hej')
    //             rotation: () => console.log('rotation trigger')
    //         },
    //         config: key => {
    //             switch (key) {
    //                 case 'rotation':
    //                     return {
    //                         mass: 4,
    //                         friction: 10,
    //                     }
    //                 default:
    //                     return {}
    //             }
    //         },
    //     }),
    //     []
    // )



    // const handleClick = useCallback(
    //     () => {
    //         alert('po')
    //         const numberOfObjects = 8;
    //         const radius = 6;
    //         const radianInterval = (2.0 * Math.PI) / numberOfObjects;

    //         // console.log({ position })

    //         // setPosition((prev) => (radianInterval + prev))
    //         // const x = Math.cos(position + radianInterval)
    //         // const z = Math.sin(position + radianInterval)

    //         // const x = position + radianInterval
    //         // const z = position + radianInterval

    //         api.start({
    //             rotation: rotation + radianInterval,
    //         })
    //     },

    //     [api, rotation]
    // )



    // TODO
    // recieve array objects
    // arr.length == numberOfObjects
    // generate placement of Bottles based on PI and how many items (Math.PI / numberOfObjects?)

    // each bottle takes color, img, as prop


    // const [rotation, setRotation] = useState(0)


    // useFrame((state, delta) => (
    //     // @ts-ignore
    //     groupRef.current.rotation.y += 0.01
    // ))

    // const rotate = () => {
    //     setRotation(prev => prev + 0.5)
    // }


    console.log({})

    return (
        <group ref={groupRef} rotation-y={rotation} >
            {/* <group ref={groupRef} rotation-y={springs.rotation.to((rotation) => rotation)} > */}

            {/* <Bottle position={[1, 1, 1]} /> */}
            <Bottle position={[0, 0, 4]} color="red" />
            <mesh position={[0, 0, 0]} scale={0.3}>
                <boxGeometry />
                <meshStandardMaterial color="blue" />
            </mesh>
            <Bottle position={[0, 0, -4]} color="blue" />
            <Bottle position={[4, 0, 1]} color="green" />
            <Bottle position={[-4, 0, 1]} color="yellow" />
        </group>
    )
}

export default function Scene() {

    // const numberOfObjects = 8;
    // const radianInterval = (2.0 * Math.PI) / numberOfObjects;

    // const [scene, setScene] = useState({
    //     x: Math.cos(radianInterval),
    //     z: Math.sin(radianInterval)
    // })


    const [rotation, setRotation] = useState(0);

    const rotateL = () => {
        setRotation((prev) => prev - 0.2)
        api.start({
            rotate: 0,
        })
    }

    const rotateR = () => {
        setRotation((prev) => prev + 0.2)
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




    return (
        // <Canvas camera={{ fov: 75, near: 0.1, far: 1000, position: [0, 1, 5] }}>
        <>
            <Canvas>
                <ambientLight intensity={0.2} />
                <pointLight position={[11, -6, 4]} intensity={100} />
                {/* <Box position={[-1.2, 0, 0]} />
            <Box position={[1.2, 0, 0]} /> */}
                {/* <Group rotation-y={rotation} /> */}
                <Group rotation={springs.rotate.to((x) => Math.sin(x))} />
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