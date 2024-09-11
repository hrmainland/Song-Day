// MyComponent.js
import baseUrl from "../../utils/urlPrefix";
import { Button} from "@mui/material";
import { useSearchParams } from "react-router-dom";

function Pad() {
  const [searchParams] = useSearchParams();
  const paramsObj = Object.fromEntries([...searchParams]);
  // console.log(paramsObj["from"]);
  return (
    <>
      <form action={`${baseUrl}/pad`} method="GET">
        {paramsObj["from"] && (
          <input type="hidden" name="from" value={`${paramsObj["from"]}`} />
        )}
        <Button type="submit">Submit</Button>
      </form>
      {/* <a href={`${baseUrl}/pad?name=tony`}>go</a> */}
    </>
  );
}

export default Pad;
