import { useForm } from 'react-hook-form';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { Button } from '../ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { getApiUrl } from '../../lib/utils';
import useLocalStorage from '../../hooks/useLocalStorage';
import { localStorageKeyName } from '../../constants';


interface SignupPayload {
    username: string;
    email: string;
    password: string;
}

//   interface SignupResponse {
//     jwt: string;
//     user: {
//       id: number;
//       username: string;
//       email: string;
//       // Add other user fields as needed
//     };
//   }



const formSchema = z.object({
    username: z.string().min(3).max(100).transform((value: string) => value.trim()),
    email: z.string().email().transform((value: string) => value.trim()),
    password: z.string().min(8).max(100)
        .refine((value) => { // No need to specify type for value as Zod infers it
            return value.match(/[a-z]/) && value.match(/[A-Z]/) && value.match(/[0-9]/);
        }, {
            message: 'Password must contain at least one lowercase letter, one uppercase letter, and one number',
        }).transform((value: string) => value.trim()),
    confirm_password: z.string().min(8).max(100)
        .transform((value: string) => value.trim())
}).superRefine((data, ctx) => {
    if (data.password !== data.confirm_password) {
        return ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Passwords do not match',
            path: ['confirm_password'],
        });
    }
})

export const Signup = () => {
    const navigateTo = useNavigate()

    const createOrUpdateLocalStorage = useLocalStorage().createOrUpdateLocalStorage

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: undefined,
            email: undefined,
            password: undefined,
            confirm_password: undefined,
        },
    });


    const signupRequest = async <T extends SignupPayload>(payload: T): Promise<T> => {
        try {
            const response = await axios.post(getApiUrl(`/api/auth/local/register`), payload, {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
            );
            return response.data;
        } catch (error) {
            console.error('Signup request failed', error);
            throw error;
        }
    };

    const mutation = useMutation({
        mutationFn: async (values: SignupPayload) => {
            const data = await signupRequest(values)
            if (data?.jwt) {
                createOrUpdateLocalStorage(localStorageKeyName, data)
                navigateTo("/")
            }
            return data

        }
    })


    function onSubmit(data: z.infer<typeof formSchema>) {
        const payload = {
            username: data.username.trim(),
            email: data.email.trim(),
            password: data.password.trim(),
        }
        mutation.mutate(payload)

    }

    return (
        <section className="p-6 flex items-center justify-center h-screen w-screen">
            <div className='flex justify-center w-full'>
                <Card className='w-full md:w-[500px]'>
                    <CardHeader>
                        <CardTitle className='font-inter text-2xl font-semibold leading-9 text-black text-center'>Create your account</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            {mutation.isError &&
                                <Alert variant="destructive" className='p-1'>
                                    <AlertDescription>
                                        {mutation.error?.response?.data?.error.message}
                                    </AlertDescription>
                                </Alert>
                            }
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                                <FormField
                                    control={form.control}
                                    name="username"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Name</FormLabel>
                                            <FormControl>
                                                <Input type='username' placeholder="Lorem Laura" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
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
                                <FormField
                                    control={form.control}
                                    name="confirm_password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Confirm Password</FormLabel>
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
                        <div>Have an Account? </div>
                        <Link className='text-blue-500' to={"/login"}>Login</Link>
                    </CardFooter>
                </Card >
            </div>
        </section>
    )
}