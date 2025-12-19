import { produce } from "immer";
import { Buffer } from "buffer";
import { useChunkStore } from "@/db/chunkStore";
import { Alert } from "react-native";

export const receiveFileAck = async (
  data: any,
  socket: any,
  setReceivedFiles: any,
) => {
  const { setChunkStore, chunkStore } = useChunkStore.getState();
  if (chunkStore) {
    Alert.alert("File received successfully",);
    return
  }

  setReceivedFiles((prevData: any) =>
    produce(prevData, (draft: any) => {
      draft.push(data);
    })
  );

  setChunkStore({
    id: data.id,
    totalChunks: data?.totalChunks,
    name: data?.name,
    size: data?.size,
    mineType: data?.mineType,
    chunkArray: [],
  })

  if (!socket) {
    console.log("Socket is not connected");
    return;
  }

  try {
    await new Promise((resolve,) => setTimeout(resolve, 10))
    console.log("FILE RECEVIED ")
    socket.write(JSON.stringify({
      event: 'send_chunk_ack',
      chunkNo: 0,
    }));
    console.log("REQUEST FOR CHUNK SENT ")
  }

  catch (error) {
    console.error("Error sending chunk ack:", error);
  }

};

export const sendChunkAck = async (
  socket: any,
  chunkIndex: any,
  setTotalSentBytes: any,
  setSendtFiles: any,
) => {
  const { currentChunkSet, resetCurrentChunkSet } = useChunkStore.getState();

  if (!currentChunkSet) {
    Alert.alert("No current chunk set available");
    return;
  };

  if (!socket) {
    console.log("Socket is not connected");
    return;
  }
  const totalChunks = currentChunkSet?.totalChunks;

  try {
    await new Promise((resolve,) => setTimeout(resolve, 10));
    socket.write(JSON.stringify({
      event: 'receive_chunk_ack',
      chunk: currentChunkSet?.chunkArray[chunkIndex].toString('base64'),
      chunkNo: chunkIndex,
    }));
    setTotalSentBytes((prev: number) => prev + currentChunkSet?.chunkArray[chunkIndex].length);

    if (chunkIndex + 2 > totalChunks) {
      console.log("All chunks sent successfully");
      setSendtFiles((prevData: any) =>
        produce(prevData, (draftFiles: any) => {
          const fileIndex = draftFiles?.findIndex((f: any) => f.id === currentChunkSet.id);
          if (fileIndex !== -1) {
            draftFiles[fileIndex].avaliable = true;
          }
        })
      );
      resetCurrentChunkSet();
    }
  } catch (error) {
    console.error("Error sending chunk ack:", error);
  }
};

export const receiveChunk = async (
  chunk: any,
  chunkNo: any,
  socket: any,
  setTotalReceivedBytes: any,
  generateFile: any,
) => {
  const { chunkStore, resetChunkStore, setChunkStore } = useChunkStore.getState();
  if (!chunkStore) {
    console.log("chunk store is null");
    return;
  }
  try {
    const bufferChunk = Buffer.from(chunk, 'base64');
    const updatedCheckArray = [...(chunkStore.checkArray || [])];
    updatedCheckArray[chunkNo] = 1; // Mark this chunk as received
    setChunkStore({
      ...chunkStore,
      checkArray: updatedCheckArray,
    });
    setTotalReceivedBytes((prev: number) => prev + bufferChunk.length);
  } catch (error) {
    console.log("Error processing received chunk:", error);
  }

  if (chunkNo + 1 === chunkStore?.totalchunks) {
    console.log("All chunks received, generating file...");
    generateFile();
    resetChunkStore();
    return;
  }

  if (!socket) {
    console.error("Socket is not connected");
    return;
  }

  try {
    await new Promise((resolve) => setTimeout(resolve, 10));
    console.log("Requesting next chunk:", chunkNo + 1);
    socket.write(JSON.stringify({
      event: 'send_chunk_ack',
      chunkNo: chunkNo + 1,
    }));
  } catch (error) {
    console.error("Error requesting next chunk:", error);
  }
};