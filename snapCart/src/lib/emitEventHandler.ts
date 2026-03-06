import axios from "axios";

export default async function emitEventHandler(
  event: string,
  data: any,
  socketId?: string,
) {
  try {
    console.log(`${process.env.NEXT_SOCKET_URL}/notify`);
    axios.post(`${process.env.NEXT_SOCKET_URL}/notify`, {
      //axios.post("https://socketioserver-at8m.onrender.com/notify", {
      socketId,
      event,
      data,
    });
  } catch (error) {
    console.log(error);
  }
}
