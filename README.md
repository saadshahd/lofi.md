# lofi

Wireframes as code.

```bash
npm install -g lofi
```

```lofi
card
  heading "Login"
  input "Email" type=email
  input "Password" type=password
  grid flow=row justify=between
    link "Forgot password?"
    button "Sign In" primary
```

```bash
lofi login.lofi → login.html
```

[Syntax](SYNTAX.md) · [Philosophy](PHILOSOPHY.md)
