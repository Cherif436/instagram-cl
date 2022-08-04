import { getProviders, signIn } from "next-auth/react"
import Header from "../../components/Header"

export default function signin({providers}) {
  return (
    <>
      <Header />
      <div className="flex justify-center mt-20 space-x-7">
        <img
          className="hidden object-cover rotate-6 md:inline-flex md:w-48"
          src="https://superviral.com.au/wp-content/uploads/2021/08/instagix-banner-graphic.png"
          alt="instagram-image"
        />
        <div className="">
          {Object.values(providers).map((provider) => (
            <div key={provider.name} className="flex flex-col items-center">
              <img
                className="object-cover w-32"
                src="https://socodigital.com/wp-content/uploads/2021/03/Instagram.png"
                alt=""
              />
              <p className="my-10 text-sm italic text-center">
                This app is created for learning purposes
              </p>
              <button
                onClick={() => signIn(provider.id, {callbackUrl: "/"})}
                className="p-3 text-white bg-red-400 rounded-lg hover:bg-red-500"
              >
                Sign in with {provider.name}
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export async function getServerSideProps(context){
  const providers = await getProviders();
  return {
    props: { providers }
  }
}