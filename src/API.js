export const authToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlrZXkiOiJhMjRkZDc2NS05ZDg0LTRkMjAtYTNkOC1kMTlhYjk4ZDM0OWYiLCJwZXJtaXNzaW9ucyI6WyJhbGxvd19qb2luIl0sImlhdCI6MTcxMTA4MjU4OCwiZXhwIjoxNzExNjg3Mzg4fQ.yk7iN5QkNUoEoNq1iRGzxYM-0ciqhBNO_WSCJwNa6PM";
// API call to create a meeting
export const createMeeting = async ({ token }) => {
  const res = await fetch(`https://api.videosdk.live/v2/rooms`, {
    method: "POST",
    headers: {
      authorization: `${authToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
  });
  //Destructuring the roomId from the response
  const { roomId } = await res.json();
  return roomId;
};
