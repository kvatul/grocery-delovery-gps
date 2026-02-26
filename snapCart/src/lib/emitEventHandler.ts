import axios from "axios";

export default async function emitEventHandler(
  event: string,
  data: any,
  socketId?: string,
) {
  try {
    axios.post(`${process.env.NEXT_SOCKET_URL}/notify`, {
      socketId,
      event,
      data,
    });
  } catch (error) {
    console.log(error);
  }
}
