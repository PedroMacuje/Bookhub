import '../styles/globals.css'
import { useAuth } from '../utils/auth'
import setupAxiosInterceptors from '../utils/axiosInterceptor'
import Head from 'next/head'; // Importa o Head
import { useEffect } from 'react'

export default function App({ Component, pageProps }) {
  const auth = useAuth()

  // Configurar interceptors do axios uma vez
  useEffect(() => {
    setupAxiosInterceptors();
  }, []);

  return (
    <div>
      <Head>
        <title>Bookhub</title>
      </Head>
      <Component {...pageProps} auth={auth} />
    </div>
  )
}

