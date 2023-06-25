use anyhow::Context;
use axum::{extract::State, response::IntoResponse, Json};
use entity::{
    tags::{self, Entity as TagsEntity},
    tasks::{self, Entity as TasksEntity},
};
use hyper::StatusCode;

use sea_orm::{
    prelude::DateTimeWithTimeZone, sea_query::OnConflict, ActiveValue, ColumnTrait, EntityTrait,
    QueryFilter, QueryTrait,
};
use serde_json::json;

use crate::{
    auth::user_id::UserId,
    types::{ApiError, RequestContext},
};

#[derive(serde::Deserialize, serde::Serialize)]
pub struct SyncEndpointTask {
    pub id: String,
    pub tag_id: String,
    pub is_manual: bool,
    pub started_at: DateTimeWithTimeZone,
    pub stopped_at: Option<DateTimeWithTimeZone>,
    pub expires_at: DateTimeWithTimeZone,
    pub deleted_at: Option<DateTimeWithTimeZone>,
    pub created_at: DateTimeWithTimeZone,
    pub updated_at: DateTimeWithTimeZone,
}

#[derive(serde::Deserialize, serde::Serialize)]
pub struct SyncEndpointTag {
    pub id: String,
    pub label: String,
    pub color: String,
    pub deleted_at: Option<DateTimeWithTimeZone>,
    pub created_at: DateTimeWithTimeZone,
    pub updated_at: DateTimeWithTimeZone,
}

#[derive(serde::Deserialize, serde::Serialize)]
pub struct SyncEndpointBody {
    pub last_synced_at: Option<DateTimeWithTimeZone>,
    pub tasks: Vec<SyncEndpointTask>,
    pub tags: Vec<SyncEndpointTag>,
}

pub async fn sync_endpoint(
    UserId(user_id): UserId,
    State(ctx): RequestContext,
    Json(body): Json<SyncEndpointBody>,
) -> Result<impl IntoResponse, ApiError> {
    if body.tags.len() > 0 {
        tracing::debug!("Upserting {} tags", body.tags.len());

        TagsEntity::insert_many(body.tags.into_iter().map(|tag| tags::ActiveModel {
            id: ActiveValue::Set(tag.id),
            user_id: ActiveValue::Set(user_id.to_owned()),
            label: ActiveValue::Set(tag.label),
            color: ActiveValue::Set(tag.color.to_owned()),
            deleted_at: match tag.deleted_at {
                Some(deleted_at) => ActiveValue::Set(Some(deleted_at)),
                None => ActiveValue::NotSet,
            },
            created_at: ActiveValue::Set(tag.created_at),
            updated_at: ActiveValue::Set(tag.updated_at),
            synced_at: ActiveValue::Set(chrono::Utc::now().into()),
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
        .context("Failed to upsert tags")?;
    }

    if body.tasks.len() > 0 {
        tracing::debug!("Upserting {} tasks", body.tasks.len());

        TasksEntity::insert_many(body.tasks.into_iter().map(|task| tasks::ActiveModel {
            id: ActiveValue::Set(task.id),
            user_id: ActiveValue::Set(user_id.to_owned()),
            tag_id: ActiveValue::Set(task.tag_id),
            is_manual: ActiveValue::Set(task.is_manual),
            started_at: ActiveValue::Set(task.started_at),
            stopped_at: match task.stopped_at {
                Some(stopped_at) => ActiveValue::Set(Some(stopped_at)),
                None => ActiveValue::NotSet,
            },
            expires_at: ActiveValue::Set(task.expires_at),
            deleted_at: match task.deleted_at {
                Some(deleted_at) => ActiveValue::Set(Some(deleted_at)),
                None => ActiveValue::NotSet,
            },
            updated_at: ActiveValue::Set(task.updated_at),
            created_at: ActiveValue::Set(task.created_at),
            synced_at: ActiveValue::Set(chrono::Utc::now().into()),
        }))
        .on_conflict(
            OnConflict::column(tasks::Column::Id)
                .update_columns(vec![
                    tasks::Column::TagId,
                    tasks::Column::IsManual,
                    tasks::Column::CreatedAt,
                    tasks::Column::UpdatedAt,
                    tasks::Column::StoppedAt,
                    tasks::Column::DeletedAt,
                    tasks::Column::SyncedAt,
                ])
                .to_owned(),
        )
        .exec(&ctx.db)
        .await
        .context("Failed to upsert tasks")?;
    }

    let tags_out_of_date_on_client = TagsEntity::find()
        .filter(tags::Column::UserId.eq(user_id.to_owned()))
        .apply_if(body.last_synced_at, |q, last_synced_at| {
            q.filter(tags::Column::SyncedAt.gt(last_synced_at - chrono::Duration::minutes(2)))
        })
        .all(&ctx.db)
        .await
        .context("Failed to find tags out of date on client")?;

    let tasks_out_of_date_on_client = TasksEntity::find()
        .filter(tasks::Column::UserId.eq(user_id))
        .apply_if(body.last_synced_at, |q, last_synced_at| {
            q.filter(tasks::Column::SyncedAt.gt(last_synced_at - chrono::Duration::minutes(2)))
        })
        .all(&ctx.db)
        .await
        .context("Failed to find tasks out of date on client")?;

    return Ok((
        StatusCode::OK,
        Json(json!({
            "tags": tags_out_of_date_on_client.into_iter().map(|tag| SyncEndpointTag {
                id: tag.id,
                label: tag.label,
                color: tag.color,
                created_at: tag.created_at,
                updated_at: tag.updated_at,
                deleted_at: tag.deleted_at,
            }).collect::<Vec<_>>(),
            "tasks": tasks_out_of_date_on_client .into_iter().map(|task| SyncEndpointTask {
                id: task.id,
                tag_id: task.tag_id,
                is_manual: task.is_manual,
                started_at: task.started_at,
                stopped_at: task.stopped_at,
                expires_at: task.expires_at,
                deleted_at: task.deleted_at,
                created_at: task.created_at,
                updated_at: task.updated_at,
            }).collect::<Vec<_>>(),
        })),
    ));
}
