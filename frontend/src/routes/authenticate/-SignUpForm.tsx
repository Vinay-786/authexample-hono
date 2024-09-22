'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm } from "@tanstack/react-form";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { SignUpSchema } from "@server/validatorTypes";

export default function SignUpForm() {
    const navigate = useNavigate();
    const form = useForm({
        validatorAdapter: zodValidator(),
        defaultValues: {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
        onSubmit: async ({ value }) => {
            const res = await api.authenticate.signup.$post({ json: value });
            if (res.status == 200) {
                toast.success("Account created succesfully");
                navigate({ to: '/' });
            } else {
                toast.error("Error");
            }
        },
    });

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle> Begin your journey! </CardTitle>
                    <CardDescription>
                        Create your account to continue
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
                                name="name"
                                validators={{ onChange: SignUpSchema.shape.name }}
                                children={(field) => {
                                    return (
                                        <>
                                            <Label htmlFor={field.name}> Name </Label>
                                            <Input
                                                name={field.name}
                                                value={field.state.value}
                                                onBlur={field.handleBlur}
                                                onChange={(e) => field.handleChange(e.target.value)}
                                            />
                                            {field.state.meta.isTouched && field.state.meta.errors.length ? (
                                                <em>{field.state.meta.errors.join(", ")}</em>
                                            ) : null}

                                        </>
                                    )
                                }}
                            />
                        </div>
                        <div>
                            <form.Field
                                name="email"
                                validators={{ onChange: SignUpSchema.shape.email }}
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
                                            {field.state.meta.isTouched && field.state.meta.errors.length ? (
                                                <em>{field.state.meta.errors.join(", ")}</em>
                                            ) : null}
                                        </>
                                    )
                                }}
                            />
                        </div>
                        <div>
                            <form.Field
                                name="password"
                                validators={{ onChange: SignUpSchema.shape.password }}
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
                                            {field.state.meta.isTouched && field.state.meta.errors.length ? (
                                                <em>{field.state.meta.errors.join(", ")}</em>
                                            ) : null}

                                        </>
                                    )
                                }}
                            />
                        </div>
                        <div>
                            <form.Field
                                name="confirmPassword"
                                validators={{
                                    onChangeListenTo: ['password'],
                                    onChange: ({ value, fieldApi }) => {
                                        if (value != fieldApi.form.getFieldValue('password')) {
                                            return 'Password do not match'
                                        }
                                        return undefined
                                    },
                                }}
                                children={(field) => {
                                    return (
                                        <>
                                            <Label htmlFor={field.name}> Confirm Password</Label>
                                            <Input
                                                name={field.name}
                                                value={field.state.value}
                                                onBlur={field.handleBlur}
                                                onChange={(e) => field.handleChange(e.target.value)}
                                            />
                                            {field.state.meta.isTouched && field.state.meta.errors.length ? (
                                                <em>{field.state.meta.errors.join(", ")}</em>
                                            ) : null}

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


