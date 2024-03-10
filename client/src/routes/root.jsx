function Root() {
  return (
    <>
      <h1>Song Day</h1>
      <form action="/new-session">
        <button>New Session</button>
      </form>
      <form action="/join-session">
        <button>Join Session</button>
      </form>
    </>
  );
}

export default Root;
