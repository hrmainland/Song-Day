import baseUrl from "../../utils/urlPrefix";

function Login() {
  return (
    // <form action={`${baseUrl}/spotify/auth`}>
    <form action={`${baseUrl}/spotify/auth`}>
      <button>LOGIN TO SPOTIFY</button>
    </form>
  );
}

export default Login;
