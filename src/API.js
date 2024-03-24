export const authToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlrZXkiOiJiYWZhMmFiMC02ZWVlLTQ5YjQtYmYzZi03ZTg0YThlNzZkNTQiLCJwZXJtaXNzaW9ucyI6WyJhbGxvd19qb2luIl0sImlhdCI6MTcxMTIzOTg1MSwiZXhwIjoxNzExODQ0NjUxfQ.qzuIsfUGeiDhFo9gVPwNO-3ax74yLQ67m6MV1Ftuzrk";
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
