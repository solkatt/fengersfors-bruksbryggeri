import { useSpring, animated } from '@react-spring/three'
import { useThree } from "@react-three/fiber";
import { useDrag } from "@use-gesture/react";
import { useRef } from "react";
import { Mesh } from "three";

const Bottle = ({ position, color, rotation, rotateL, rotateR, draggable }: { draggable: boolean, position: any, color: string, rotation: any, rotateL: () => void, rotateR: () => void }) => {
    const { size, viewport } = useThree()
    const aspect = size.width / viewport.width;

    const [spring, api] = useSpring(() => ({ position: [0, 0, 0], config: { mass: 1, friction: 40, tension: 800 } }))
    // const [{ x, y }, api] = useSpring(() => ({ x: 0, y: 0 }))

    const changeStep = (movement: any) => {

        console.log('move:', movement)
        // alert('change step')
    }

    //       const bind = useDrag(({ down, movement: [mx, my] }) => {
    //     api.start({ x: down ? mx : 0, y: down ? my : 0, immediate: down })
    //   })




    const bind: any = useDrag(
        ({ active, movement: [x, y], down, cancel, canceled }) => {
            if (!draggable) return;
            if (active && down && x <= -100) {
                console.log('rotating Left')
                rotateL();
                cancel();
            }

            if (active && down && x >= 100) {
                console.log('rotating Right')
                cancel();
                rotateR();
            }


            api.start({ config: { mass: canceled ? 8 : down ? 2 : 4, tension: canceled ? 200 : down ? 1000 : 800 }, position: down && active ? [0, (-y / aspect) * 0.2, (-x / aspect) * 0.2] : [0, 0, 0], delay: canceled ? 100 : 0 })
        })




    const bottleRef = useRef<Mesh>(null);


    return (
        <group position={position} rotation={rotation}
        >
            <animated.mesh
                {...spring}
                {...bind()}
                castShadow
                ref={bottleRef}
            >
                {/* <cylinderGeometry args={[0.5, 0.5, 1]} /> */}
                <boxGeometry args={[0.2, 0.2, 0.2]} />
                <meshPhysicalMaterial attach="material" color={color} />
            </animated.mesh>
        </group>
    )
}

export default Bottle;