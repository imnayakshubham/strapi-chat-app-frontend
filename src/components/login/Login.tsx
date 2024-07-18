"use client";

import { useForm } from 'react-hook-form';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Alert, AlertDescription } from '../ui/alert';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Link, useNavigate } from 'react-router-dom';
import { getApiUrl } from '../../lib/utils';
import axios from 'axios';
import { useMutation } from '@tanstack/react-query';
import useLocalStorage from '../../hooks/useLocalStorage';
import { localStorageKeyName } from '../../constants';


interface LoginPayload {
    email: string;
    password: string;
}


const formSchema = z.object({
    email: z.string().email().transform((value: string) => value.trim()),
    password: z.string().min(1).max(100)
        .refine((value) => { // No need to specify type for value as Zod infers it
            return !!value.trim().length
        }, {
            message: 'Input Password',
        }).transform((value: string) => value.trim()),
})

export const Login = () => {
    const navigateTo = useNavigate()


    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: undefined,
            password: undefined,
        },
    });
    const createOrUpdateLocalStorage = useLocalStorage().createOrUpdateLocalStorage


    const loginRequest = async (payload: LoginPayload) => {
        try {
            const response = await axios.post(getApiUrl(`/api/auth/local/`), payload, {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
            );
            return response.data;
        } catch (error) {
            console.error('Login request failed', error);
            throw error;
        }
    };

    const mutation = useMutation({
        mutationFn: async (values: LoginPayload) => {
            const payload: any = {
                identifier: values.email,
                password: values.password
            }
            const data: any = await loginRequest(payload)
            if (data?.jwt) {
                createOrUpdateLocalStorage(localStorageKeyName, data)
                navigateTo("/")
            }
            return data
        }
    })


    function onSubmit(data: z.infer<typeof formSchema>) {
        mutation.mutate(data)
    }


    return (
        <section className="p-6 flex items-center justify-center h-screen w-screen">
            <div className='flex justify-center w-full'>
                <Card className='w-full md:w-[500px]'>
                    <CardHeader>
                        <CardTitle className='font-inter text-2xl font-bold leading-9 text-black text-center'>Login</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            {mutation.isError &&
                                <Alert variant="destructive" className='p-1'>
                                    <AlertDescription>
                                        {(mutation.error as any)?.response?.data?.error?.message ?? (mutation.error as any)?.response?.data}
                                    </AlertDescription>
                                </Alert>
                            }
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input type='email' placeholder="example@example.com" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                <Input type='password' placeholder='Enter Password' {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" className='w-full' loading={mutation.isPending}>Submit</Button>
                            </form>
                        </Form>
                    </CardContent >
                    <CardFooter className='flex justify-center gap-1'>
                        <div>{`Don't have an Account?`}</div>
                        <Link className='text-blue-500' to={"/signup"}>Sign up</Link>
                    </CardFooter>
                </Card >
            </div>
        </section>
    )
}