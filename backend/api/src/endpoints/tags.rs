use anyhow::Context;
use axum::{extract::State, response::IntoResponse, Json};
use entity::tags;
use hyper::StatusCode;
use sea_orm::{sea_query::OnConflict, ActiveValue, EntityTrait};
use serde_json::json;

use crate::{
    auth::user_id::UserId,
    types::{ApiError, ClientTag, RequestContext},
};

pub async fn put_tags(
    UserId(user_id): UserId,
    State(ctx): RequestContext,
    Json(tags): Json<Vec<ClientTag>>,
) -> Result<impl IntoResponse, ApiError> {
    tags::Entity::insert_many(tags.clone().into_iter().map(|tag| tags::ActiveModel {
        id: ActiveValue::Set(tag.id),
        user_id: ActiveValue::Set(user_id.to_owned()),
        label: ActiveValue::Set(tag.label),
        color: ActiveValue::Set(tag.color.to_owned()),
        was_last_used: ActiveValue::Set(tag.was_last_used),
        deleted_at: match tag.deleted_at {
            Some(deleted_at) => ActiveValue::Set(Some(deleted_at)),
            None => ActiveValue::NotSet,
        },
        created_at: ActiveValue::Set(tag.created_at),
        updated_at: ActiveValue::Set(tag.updated_at),
        synced_at: ActiveValue::Set(chrono::Utc::now().naive_utc()),
    }))
    .on_conflict(
        OnConflict::column(tags::Column::Id)
            .update_columns(vec![
                tags::Column::Color,
                tags::Column::Label,
                tags::Column::CreatedAt,
                tags::Column::UpdatedAt,
                tags::Column::DeletedAt,
                tags::Column::SyncedAt,
            ])
            .to_owned(),
    )
    .exec(&ctx.db)
    .await
    .context("Failed to insert tags")?;

    ctx.tx
        .send(
            json!({
                "t": "sync",
                "d": { "tags": tags }
            })
            .to_string(),
        )
        .ok();

    return Ok(StatusCode::CREATED);
}