import axios from 'axios'

const setupAxiosInterceptors = () => {
  axios.interceptors.request.use(
    (config) => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token')
        if (token) {
          config.headers = {
            ...config.headers,
            Authorization: `Bearer ${token}`,
          }
        }
      }
      return config
    },
    (error) => Promise.reject(error)
  )

  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (
        error.response &&
        error.response.status === 401 &&
        typeof window !== 'undefined'
      ) {
        localStorage.removeItem('token')
        localStorage.removeItem('userData')
      }
      return Promise.reject(error)
    }
  )
}

export default setupAxiosInterceptors
