import axios from "axios";

export default async function emitEventHandler(
  event: string,
  data: any,
  socketId?: string,
) {
  try {
    //console.log(`${process.env.NEXT_PUBLIC_SOCKET_URL}/notify`);
    axios.post(`${process.env.NEXT_PUBLIC_SOCKET_URL}/notify`, {
      socketId,
      event,
      data,
    });
  } catch (error) {
    console.log(error);
  }
}
