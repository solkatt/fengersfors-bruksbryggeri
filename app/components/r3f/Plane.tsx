
const Plane = (props: any) => {

    return (
        <mesh {...props} receiveShadow>
            <planeGeometry args={[1, 1, 1]} />
            <meshPhysicalMaterial attach="material" color="white" />
        </mesh>
    )
}

export default Plane;