"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Mail01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

import { ForgotPswFormData, forgotPswSchema } from "../validations/schemas";
import { useForgotPsw } from "../hooks/use-forgot-psw";
import { appRoutes } from "@/lib/constants/navigation";
import Link from "next/link";

export function ForgotPswForm() {
  const form = useForm<ForgotPswFormData>({
    resolver: zodResolver(forgotPswSchema),
    defaultValues: {
      email: "",
    },
  });

  const { mutate: forgotPsw, isPending } = useForgotPsw({
    onSuccess: () => form.reset(),
  });

  const onSubmit = (data: ForgotPswFormData) => forgotPsw(data);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <InputGroup>
                  <InputGroupAddon align="inline-end">
                    <HugeiconsIcon icon={Mail01Icon} className="w-4 h-4" />
                  </InputGroupAddon>
                  <InputGroupInput
                    type="email"
                    placeholder="Enter your email"
                    autoComplete="email"
                    {...field}
                  />
                </InputGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" size="lg" className="w-full" disabled={isPending}>
          {isPending ? <Spinner /> : null}
          {isPending ? "Sending reset link..." : "Send Reset Link"}
        </Button>

        <div className="text-center">
          <Link
            href={appRoutes.auth.login}
            className="text-sm text-primary hover:text-primary/90 transition-colors"
          >
            Back to login
          </Link>
        </div>
      </form>
    </Form>
  );
}
