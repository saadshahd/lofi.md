import { LofiPreview } from "../LofiPreview";

export default {
  title: "Compositions/Auth",
  component: LofiPreview,
};

export const Login = {
  args: {
    source: `page "Login"
  section
    card
      heading "Welcome Back"
      text "Sign in to your account" muted=1
      form
        input "Email" type=email placeholder="you@example.com"
        input "Password" type=password
        checkbox "Remember me"
        button "Sign In" variant=primary
      grid flow=row align=between
        link "Forgot password?"
        link "Create account"`,
  },
};

export const Signup = {
  args: {
    source: `page "Sign Up"
  section
    card
      heading "Create Account"
      text "Start your free trial" muted=1
      form
        grid cols=2 gap=2
          input "First Name"
          input "Last Name"
        input "Email" type=email placeholder="you@example.com"
        input "Password" type=password
        input "Confirm Password" type=password
        checkbox "I agree to the Terms of Service"
        button "Create Account" variant=primary
      md
        Already have an account? [Sign in](#)`,
  },
};

export const ForgotPassword = {
  args: {
    source: `page "Reset Password"
  section
    card
      heading "Forgot Password?"
      text "Enter your email to receive a reset link" muted=1
      form
        input "Email" type=email placeholder="you@example.com"
        button "Send Reset Link" variant=primary
      link "Back to login"`,
  },
};
