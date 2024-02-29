import { TypeOf, object, string } from "zod";

export const registerUserSchema = object({
  body: object({
    username: string({
      required_error: "Username is required.",
    })
      .trim()
      .min(6, "Should be more than 6 character long."),
    email: string({
      required_error: "Email is required",
    })
      .trim()
      .email("Should be valid email"),
    password: string({
      required_error: "Password is required.",
    })
      .trim()
      .min(6, "Should be more than 6 character long")
      .max(30, "Should be less than 30 character"),
  }),
});

export const loginUserSchema = object({
  body: object({
    email: string({
      required_error: "Email is required.",
    })
      .trim()
      .email("Should be valid email."),
    password: string({
      required_error: "Password is required.",
    }).trim(),
  }),
});

export type registerUserInput = TypeOf<typeof registerUserSchema>;
export type loginUserInput = TypeOf<typeof loginUserSchema>;
