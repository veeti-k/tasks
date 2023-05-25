use crate::{
    auth::user_id::UserId,
    types::{ApiError, RequestContext},
};
use anyhow::Context;
use axum::{extract::State, response::IntoResponse, Json};

use data::create_id;
use hyper::StatusCode;

use entity::notif_subs::{self, Entity as NotifSubEntity};
use sea_orm::{sea_query::OnConflict, EntityTrait};
#[derive(serde::Deserialize)]
pub struct AddNotifSubEndpointBody {
    pub endpoint: String,
    pub p256dh: String,
    pub auth: String,
}

pub async fn add_notif_sub_endpoint(
    UserId(user_id): UserId,
    State(state): RequestContext,
    Json(body): Json<AddNotifSubEndpointBody>,
) -> Result<impl IntoResponse, ApiError> {
    let insert_result = NotifSubEntity::insert(notif_subs::ActiveModel {
        id: sea_orm::ActiveValue::Set(create_id()),
        user_id: sea_orm::ActiveValue::Set(user_id),
        auth: sea_orm::ActiveValue::Set(body.auth),
        endpoint: sea_orm::ActiveValue::Set(body.endpoint),
        p256dh: sea_orm::ActiveValue::Set(body.p256dh),
        created_at: sea_orm::ActiveValue::Set(chrono::Utc::now().into()),
    })
    .on_conflict(
        OnConflict::column(notif_subs::Column::Endpoint)
            .do_nothing()
            .to_owned(),
    )
    .exec(&state.db)
    .await
    .context("Failed to upsert notif sub")?;

    print!("insert_result: {:?}", insert_result);

    return Ok(StatusCode::CREATED);
}