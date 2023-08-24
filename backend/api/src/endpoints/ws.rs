use axum::{
    extract::{
        ws::{Message, WebSocket},
        ConnectInfo, State, WebSocketUpgrade,
    },
    response::IntoResponse,
};
use entity::{tags, tasks};
use futures_util::{SinkExt, StreamExt};
use std::{net::SocketAddr, vec};

use crate::types::{RequestContext, RequestContextStruct};

pub async fn ws_handler(
    ws: WebSocketUpgrade,
    ConnectInfo(addr): ConnectInfo<SocketAddr>,
    State(ctx): RequestContext,
) -> impl IntoResponse {
    tracing::info!("{}: connected", addr);

    return ws.on_upgrade(move |socket| handle_socket(socket, addr, ctx.clone()));
}

async fn handle_socket(mut socket: WebSocket, who: SocketAddr, ctx: RequestContextStruct) -> () {
    if socket.send(Message::Ping(vec![1])).await.is_ok() {
        tracing::info!("{}: Ping sent", who);
    } else {
        tracing::info!("{}: Ping failed, closing connection", who);
    }

    let (mut sender, mut receiver) = socket.split();

    let mut rx = ctx.tx.subscribe();

    tokio::spawn(async move {
        while let Ok(msg) = rx.recv().await {
            if sender.send(Message::Text(msg)).await.is_err() {
                tracing::info!("{}: failed to send message", who);
            }
        }
    });

    tokio::spawn(async move {
        while let Some(Ok(msg)) = receiver.next().await {
            match msg {
                Message::Ping(d) => {
                    tracing::info!("{}: Ping received", who);
                }
                Message::Pong(d) => {
                    tracing::info!("{}: Pong received", who);
                }
                _ => {
                    tracing::info!("{}: unknown message received", who);
                }
            }
        }
    });

    tracing::info!("{}: destroyed", who);
}

#[derive(Debug, serde::Deserialize, serde::Serialize)]
pub struct WsMessage {
    pub t: String,
    pub d: serde_json::Value,
}

#[derive(Debug, serde::Deserialize, serde::Serialize)]
pub struct TagSyncMessage {
    pub d: Vec<tags::Model>,
}

#[derive(Debug, serde::Deserialize, serde::Serialize)]
pub struct TaskSyncMessage {
    pub d: Vec<tasks::Model>,
}