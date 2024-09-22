'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm } from "@tanstack/react-form";
import { zodValidator } from "@tanstack/zod-form-adapter"
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { SignInSchema } from "@server/validatorTypes";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";

export default function SignInForm() {
    const navigate = useNavigate()
    const form = useForm({
        validatorAdapter: zodValidator(),
        defaultValues: {
            email: '',
            password: '',
        },
        onSubmit: async ({ value }) => {
            const res = await api.authenticate.login.$post({ json: value });
            if (res.status == 200) {
                toast.success("Logged In Successfully");
                navigate({ to: '/' });
            } else {
                toast.error("Error");
            }
            console.log(value);
        },
    });

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle> Welcome back! </CardTitle>
                    <CardDescription>
                        Signn in to your account to continue.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            form.handleSubmit();
                        }}
                    >
                        <div>
                            <form.Field
                                name="email"
                                validators={{ onChange: SignInSchema.shape.email }}
                                children={(field) => {
                                    return (
                                        <>
                                            <Label htmlFor={field.name}> Email </Label>
                                            <Input
                                                name={field.name}
                                                value={field.state.value}
                                                onBlur={field.handleBlur}
                                                onChange={(e) => field.handleChange(e.target.value)}
                                            />
                                        </>
                                    )
                                }}
                            />
                        </div>
                        <div>
                            <form.Field
                                name="password"
                                validators={{ onChange: SignInSchema.shape.password }}
                                children={(field) => {
                                    return (
                                        <>
                                            <Label htmlFor={field.name}> Password</Label>
                                            <Input
                                                name={field.name}
                                                value={field.state.value}
                                                onBlur={field.handleBlur}
                                                onChange={(e) => field.handleChange(e.target.value)}
                                            />
                                        </>
                                    )
                                }}
                            />
                        </div>
                        <form.Subscribe
                            selector={(state) => [state.canSubmit, state.isSubmitting]}
                            children={([canSubmit, isSubmitting]) => (
                                <Button type="submit" disabled={!canSubmit}>
                                    {isSubmitting ? '...' : 'Submit'}
                                </Button>
                            )}
                        />
                    </form>
                </CardContent>
            </Card >
        </>
    );
}


