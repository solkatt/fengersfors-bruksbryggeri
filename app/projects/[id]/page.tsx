import Image from "next/image";
import { Suspense } from "react";
import { notFound } from 'next/navigation'


const getPokemon = async (id: string) => {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon${id}`)
    console.log(res);
    if (!res.ok) return undefined;
    return res.json()
}



export default async function Project({ params: { id } }: { params: { id: string } }) {


    console.log({ id })
    const pokemon = await getPokemon(id);

    console.log(pokemon)

    if (!pokemon) notFound();

    return (

        <>
            <Suspense fallback="Error">
                <h1>
                    Projectsx
                </h1>
                <Image src={pokemon.sprites.front_default} alt="pokemon" width={100} height={100} />
            </Suspense>
        </>
    )
}