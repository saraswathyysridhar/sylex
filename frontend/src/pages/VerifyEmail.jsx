import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import axios from 'axios'
import { CheckCircle2, XCircle, Loader2, Leaf } from 'lucide-react'

export default function VerifyEmail() {
  const [searchParams] = useSearchParams()
  const [status, setStatus] = useState('loading') // loading | success | error
  const [message, setMessage] = useState('')

  useEffect(() => {
    const token = searchParams.get('token')
    if (!token) {
      setStatus('error')
      setMessage('Missing verification token.')
      return
    }
    axios.get('/api/auth/verify-email', { params: { token } })
      .then(res => {
        setStatus('success')
        setMessage(res.data.message || 'Email verified. You can now sign in.')
      })
      .catch(err => {
        setStatus('error')
        setMessage(err.response?.data?.error || 'Invalid or expired verification link.')
      })
  }, [searchParams])

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#FAF7F2' }}>
      <div className="w-full max-w-md rounded-3xl p-8 text-center shadow-xl"
        style={{ background: '#fff', border: '1.5px solid #D4CCBC' }}>
        <div className="w-9 h-9 mx-auto rounded-xl flex items-center justify-center mb-6"
          style={{ background: 'rgba(77,122,82,0.1)', border: '1.5px solid rgba(77,122,82,0.25)' }}>
          <Leaf className="w-4 h-4 text-sage-500" />
        </div>

        {status === 'loading' && (
          <>
            <Loader2 className="w-10 h-10 mx-auto mb-4 animate-spin text-sage-500" />
            <h1 className="text-xl font-bold text-ink">Verifying your email...</h1>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle2 className="w-10 h-10 mx-auto mb-4 text-sage-500" />
            <h1 className="text-xl font-bold text-ink mb-2">Email verified</h1>
            <p className="text-sm text-ink-muted mb-6">{message}</p>
            <Link to="/" className="btn-primary inline-block px-6 py-3 text-sm rounded-xl">
              Go to Sylex
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <XCircle className="w-10 h-10 mx-auto mb-4 text-red-500" />
            <h1 className="text-xl font-bold text-ink mb-2">Verification failed</h1>
            <p className="text-sm text-ink-muted mb-6">{message}</p>
            <Link to="/" className="btn-primary inline-block px-6 py-3 text-sm rounded-xl">
              Back to Sylex
            </Link>
          </>
        )}
      </div>
    </div>
  )
}
