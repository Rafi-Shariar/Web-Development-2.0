"use client"
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import React, { useActionState, useEffect } from 'react';
import { loginAction } from '../_actions/authActions';
import { toast } from 'sonner';
import { stat } from 'fs';
import { Spinner } from '@/components/ui/spinner';

const LoginForm = () => {

    const [ state, action, pending] = useActionState(loginAction, false);

    useEffect(()=>{
        if(!state) return;
       
        if(state.success){
            toast.success(state.message)
        }

        if(!state.success){
            toast.error(state.message)
        }


    }, [state])
    return (
        <div>
            <form action={action} className='space-y-3 max-w-xl'>
                <Card className='p-6 space-y-3'>
                    <Input name='email' type='email' placeholder='Enter your email' required></Input>
                    <Input name='password' type='password' placeholder='Enter your password' required></Input>
                    <Button type='submit' className='cursor-pointer bg-green-700'>
                        {
                            pending ? <Spinner className='size-6'/> : "Login"
                        }
                        </Button>
                </Card>
            </form>
        </div>
    );
};
   
export default LoginForm;