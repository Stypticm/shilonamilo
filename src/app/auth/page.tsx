'use client'

import CredentialsAuth from '@/app/components/CredentialsAuth'
import { Icons } from '@/app/components/Icons'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { githubProviderAuth } from '@/lib/firebase/auth/authGithubLogic'
import { googleProviderAuth } from '@/lib/firebase/auth/authGoogleLogic'

import { User } from '@/lib/interfaces'
import { useRouter } from 'next/navigation'

import { useState } from 'react'

const AuthPage = () => {
    const router = useRouter()

    const [user, setUser] = useState<User | null>(null)
    const [title, setTitle] = useState<'Sign In' | 'Sign up'>('Sign In')

    const toggleTitle = () => {
        setTitle(title === 'Sign In' ? 'Sign up' : 'Sign In')
    }

    const googleAuthClick = async () => {
        await googleProviderAuth({ setUser })
        router.push('/')
    }

    const githubAuthClick = async () => {
        await githubProviderAuth({ setUser })
        router.push('/')
    }

    return (
        <section className='w-[300px] mx-auto flex flex-col gap-2'>
            <header className='text-center'>
                {
                    title === 'Sign In' ? 'Sign in to your account' : 'Create a new account'
                }
            </header>
            <CredentialsAuth title={title} setUser={setUser} />
            <Separator />
            <span className='text-center'>Or you can use</span>
            <main className='flex flex-col gap-4 items-center'>
                <Button className='w-2/3 flex justify-between rounded-full bg-slate-500 hover:bg-slate-600' onClick={googleAuthClick}>
                    Sign In with Google
                    <Icons.google className='w-5 h-5' />
                </Button>
                {/* <Button className='w-2/3 flex justify-between rounded-full bg-slate-500 hover:bg-slate-600' onClick={() => providerAuth({ setUser, providerType: 'facebook' })}>
                    Sign In with Facebook
                    <Icons.facebook className='w-5 h-5' />
                </Button> */}
                <Button className='w-2/3 flex justify-between rounded-full bg-slate-500 hover:bg-slate-600' onClick={githubAuthClick}>
                    Sign In with GitHub
                    <Icons.github className='w-5 h-5' />
                </Button>
            </main>
            <Separator />
            <footer className='text-center'>
                {
                    title === 'Sign In' ? 'Don\'t have an account?' : 'Already have an account?'
                }
                <Button className='hover:underline cursor-pointer' onClick={toggleTitle}>
                    {
                        title === 'Sign In' ? 'Sign up' : 'Sign In'
                    }
                </Button>
            </footer>
        </section>
    )
}

export default AuthPage