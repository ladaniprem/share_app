import React, {
    createContext,
    FC,
    useCallback,
    useContext,
    useRef,
    useState,
} from "react";
import { Platform } from "react-native";
import * as FileSystem from "expo-file-system";
import { Buffer } from "buffer";
import { v4 as uuidv4 } from "uuid";
import { produce } from "immer";

import { useChunkStore } from "@/db/chunkStore";
import {
    receiveFileAck,
    sendChunkAck,
    receiveChunk,
} from "./TCPUtills";

/* ================= CONTEXT ================= */

interface SocketContextType {
    isConnected: boolean;
    sentFiles: any[];
    receivedFiles: any[];
    totalSentBytes: number;
    totalReceivedBytes: number;
    connect: (url: string, deviceName: string) => void;
    disconnect: () => void;
    sendFileAck: (file: any, type: "file" | "image") => Promise<void>;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const useSocket = () => {
    const ctx = useContext(SocketContext);
    if (!ctx) throw new Error("useSocket must be used inside SocketProvider");
    return ctx;
};

/* ================= PROVIDER ================= */

export const SocketProvider: FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const wsRef = useRef<WebSocket | null>(null);

    const [isConnected, setIsConnected] = useState(false);
    const [sentFiles, setSentFiles] = useState<any[]>([]);
    const [receivedFiles, setReceivedFiles] = useState<any[]>([]);
    const [totalSentBytes, setTotalSentBytes] = useState(0);
    const [totalReceivedBytes, setTotalReceivedBytes] = useState(0);

    const {
        setCurrentChunkSet,
        setChunkStore,
        resetChunkStore,
        resetCurrentChunkSet,
    } = useChunkStore();

    /* ---------- SEND ---------- */
    const send = useCallback((payload: any) => {
        if (wsRef.current?.readyState === 1) {
            wsRef.current.send(JSON.stringify(payload));
        }
    }, []);

    /* ---------- CONNECT ---------- */
    const connect = (url: string, deviceName: string) => {
        if (wsRef.current) return;

        const ws = new WebSocket(url);
        wsRef.current = ws;

        ws.onopen = () => {
            setIsConnected(true);
            send({ event: "connect", deviceName });
        };

        ws.onmessage = (e) => {
            const data = JSON.parse(e.data);

            if (data.event === "file-ack") {
                receiveFileAck(data.file, send, setReceivedFiles);
            }

            if (data.event === "send_chunk_ack") {
                sendChunkAck(
                    data.chunkNo,
                    send,
                    setTotalSentBytes,
                    setSentFiles
                );
            }

            if (data.event === "receive_chunk_ack") {
                receiveChunk(
                    data.chunk,
                    data.chunkNo,
                    send,
                    setTotalReceivedBytes,
                    generateFile
                );
            }
        };

        ws.onclose = disconnect;
        ws.onerror = console.error;
    };

    /* ---------- DISCONNECT ---------- */
    const disconnect = () => {
        wsRef.current?.close();
        wsRef.current = null;

        setIsConnected(false);
        setSentFiles([]);
        setReceivedFiles([]);
        setTotalSentBytes(0);
        setTotalReceivedBytes(0);

        resetChunkStore();
        resetCurrentChunkSet();
    };

    /* ---------- FILE GENERATION ---------- */
    const generateFile = async () => {
        const { chunkStore } = useChunkStore.getState();
        if (!chunkStore) return;

        // Use the correct property for chunks; assuming 'checkArray' holds the chunk Buffers
        // If 'checkArray' is not the correct property, replace it with the actual array of Buffers
        const buffer = Buffer.concat(chunkStore.checkArray as unknown as Buffer[]);
        const dir = (FileSystem as any).cacheDirectory || (FileSystem as any).documentDirectory;
        const uri = `${dir}${chunkStore.name}`;

        await FileSystem.writeAsStringAsync(
            uri,
            buffer.toString("base64"),
            { encoding: "base64" }
        );

        setReceivedFiles((prev) =>
            produce(prev, (draft: any[]) => {
                const f = draft.find((x) => x.id === chunkStore.id);
                if (f) {
                    f.uri = uri;
                    f.available = true;
                }
            })
        );

        resetChunkStore();
    };

    /* ---------- SEND FILE ---------- */
    const sendFileAck = async (file: any, type: "file" | "image") => {
        const path =
            Platform.OS === "android"
                ? file.uri.replace("file://", "")
                : file.uri;

        const base64 = await FileSystem.readAsStringAsync(path, {
            encoding: "base64",
        });

        const buffer = Buffer.from(base64, "base64");
        const CHUNK = 8 * 1024;
        const chunks: Buffer[] = [];

        for (let i = 0; i < buffer.length; i += CHUNK) {
            chunks.push(buffer.slice(i, i + CHUNK));
        }

        const meta = {
            id: uuidv4(),
            name: file.name || file.fileName,
            size: buffer.length,
            mineType: type,
            totalChunks: chunks.length,
        };

        setCurrentChunkSet({
            id: meta.id,
            totalChunks: meta.totalChunks,
            chunkArray: chunks,
        });

        setSentFiles((prev) =>
            produce(prev, (draft: any[]) => {
                draft.push({ ...meta, uri: file.uri, available: false });
            })
        );

        send({ event: "file-ack", file: meta });
    };

    return (
        <SocketContext.Provider
            value={{
                isConnected,
                sentFiles,
                receivedFiles,
                totalSentBytes,
                totalReceivedBytes,
                connect,
                disconnect,
                sendFileAck,
            }}
        >
            {children}
        </SocketContext.Provider>
    );
};