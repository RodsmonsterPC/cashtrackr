import Image from "next/image"

const Logo = () => {
  return (
   <Image src="/logo.svg" alt="logo cashtrackr" width={0} height={0} className="w-full" priority/>
  )
}

export default Logo
