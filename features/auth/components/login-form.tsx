"use client";

import { useState } from "react";
import Link from "next/link";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Mail01Icon, EyeIcon, EyeOff } from "@hugeicons/core-free-icons";
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

import { useLogin } from "../hooks/use-auth";
import { loginSchema } from "../validations/schemas";
import { type LoginFormData } from "../types";

export function LoginForm() {
  const { mutate: login, isPending } = useLogin();

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginFormData) => {
    setIsSubmitted(true);
    login(data, {
      onSuccess: (response) => {
        // Only reset submitted state if login actually failed (API returned status: false)
        // If login succeeded, keep button disabled until navigation completes
        if (!response.status) {
          setIsSubmitted(false);
        }
        // If response.status is true, keep isSubmitted true to prevent double-click during navigation
      },
      onError: () => setIsSubmitted(false),
    });
  };

  const isLoading = isPending || isSubmitted;

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

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="inline-end-input">Password</FormLabel>
              <InputGroup>
                <InputGroupInput
                  id="inline-end-input"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  {...field}
                />
                <InputGroupAddon align="inline-end" className="cursor-pointer">
                  <HugeiconsIcon
                    onClick={() => setShowPassword(!showPassword)}
                    icon={!showPassword ? EyeIcon : EyeOff}
                    className="w-4 h-4"
                  />
                </InputGroupAddon>
              </InputGroup>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center justify-end">
          <Link
            href="/forgot-password"
            className="text-sm text-primary hover:text-primary/90 transition-colors"
          >
            Forgot password?
          </Link>
        </div>

        <Button type="submit" size="lg" disabled={isLoading} className="w-full">
          {isLoading ? (
            <>
              <Spinner className="mr-2 h-4 w-4" />
              Signing in...
            </>
          ) : (
            "Sign In"
          )}
        </Button>
      </form>
    </Form>
  );
}
