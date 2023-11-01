import Image from "next/image";


const getPokemon = async () => {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/ditto`)
    return res.json()
}



export default async function Project() {

    const pokemon = await getPokemon();


    return (

        <>
            <h1>
                Projectsx
            </h1>
            <Image src={pokemon.sprites.front_default} alt="pokemon" width={100} height={100} />
        </>
    )
}