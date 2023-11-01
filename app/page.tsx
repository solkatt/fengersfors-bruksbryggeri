import Image from 'next/image'
import Link from 'next/link'
import Scene from './components/r3f/Scene'

export default function Home() {
  return (
    <div className="h-screen w-screen">
      <Link href="/projects"> Projects</Link>

      <Scene />
    </div>
  )
}
