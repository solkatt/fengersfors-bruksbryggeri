
const Plane = (props: any) => {

    return (
        <mesh {...props} receiveShadow>
            <planeGeometry args={[2, 1.5, 1]} />
            <shadowMaterial attach="material" transparent opacity={0.4} />

            {/* <meshPhysicalMaterial attach="material" color="white" /> */}
        </mesh>
    )
}

export default Plane;