use std::collections::HashMap;

use crate::{auth::user_id::UserId, error::ApiError, state::RequestState};
use anyhow::Context;
use axum::{
    extract::{Query, State},
    response::IntoResponse,
    Json,
};

use hyper::StatusCode;

#[derive(serde::Deserialize)]
pub struct AddNotifSubEndpointBody {
    pub endpoint: String,
    pub p256dh: String,
    pub auth: String,
}

pub async fn add_notif_sub_endpoint(
    Query(query): Query<HashMap<String, String>>,
    UserId(user_id): UserId,
    State(state): RequestState,
    Json(body): Json<AddNotifSubEndpointBody>,
) -> Result<impl IntoResponse, ApiError> {
    if body.endpoint.len() > 2000 {
        return Err(ApiError::BadRequest(
            "endpoint url must be shorter than 2000 characters".to_owned(),
        ));
    }

    let notification_sub = db::notification_subs::upsert(
        &state.db,
        &user_id,
        &body.endpoint,
        &body.p256dh,
        &body.auth,
    )
    .await
    .context("error inserting notification sub")?;

    if query.get("send_test_notification").is_some() {
        notifications::send_notification(
            &notification_sub,
            "Test notification",
            "If you see this, notifications are working! 🥳",
        )
        .await
        .context("error sending notification")?
    }

    return Ok(StatusCode::CREATED);
}

#[derive(serde::Deserialize)]
pub struct DeleteNotifSubBody {
    pub endpoint: String,
}

pub async fn delete_notif_sub_endpoint(
    UserId(user_id): UserId,
    State(state): RequestState,
    Json(body): Json<DeleteNotifSubBody>,
) -> Result<impl IntoResponse, ApiError> {
    let deleted = db::notification_subs::delete(&state.db, &user_id, &body.endpoint)
        .await
        .context("error deleting notification sub")?;

    if !deleted {
        return Err(ApiError::NotFound("notification sub not found".to_owned()));
    }

    return Ok(StatusCode::NO_CONTENT);
}
