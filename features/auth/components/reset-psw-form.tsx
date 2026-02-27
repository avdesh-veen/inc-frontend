"use client";

import { useState } from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { EyeIcon, EyeOff } from "@hugeicons/core-free-icons";
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

import { useResetPsw } from "../hooks/use-reset-psw";
import { ResetPswFormData, resetPswSchema } from "../validations/schemas";

interface ResetPswFormProps {
  token: string;
  buttonLabel?: string;
  pendingLabel?: string;
}

export function ResetPswForm({
  token,
  buttonLabel = "Reset Password",
  pendingLabel = "Resetting password...",
}: ResetPswFormProps) {
  const { mutate: resetPassword, isPending } = useResetPsw();

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<ResetPswFormData>({
    resolver: zodResolver(resetPswSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: ResetPswFormData) => {
    resetPassword({
      token,
      password: data.newPassword,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Password</FormLabel>
              <FormControl>
                <InputGroup>
                  <InputGroupInput
                    type={showNewPassword ? "text" : "password"}
                    placeholder="Enter your new password"
                    autoComplete="new-password"
                    {...field}
                  />
                  <InputGroupAddon align="inline-end" className="cursor-pointer">
                    <HugeiconsIcon
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      icon={!showNewPassword ? EyeIcon : EyeOff}
                      className="w-4 h-4"
                    />
                  </InputGroupAddon>
                </InputGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <InputGroup>
                  <InputGroupInput
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your new password"
                    autoComplete="confirm-password"
                    {...field}
                  />
                  <InputGroupAddon align="inline-end" className="cursor-pointer">
                    <HugeiconsIcon
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      icon={!showConfirmPassword ? EyeIcon : EyeOff}
                      className="w-4 h-4"
                    />
                  </InputGroupAddon>
                </InputGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" size="lg" disabled={isPending} className="w-full">
          {isPending ? (
            <>
              <Spinner className="mr-2 h-4 w-4" />
              {pendingLabel}
            </>
          ) : (
            buttonLabel
          )}
        </Button>
      </form>
    </Form>
  );
}
