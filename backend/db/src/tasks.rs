use anyhow::Context;
use chrono::{DateTime, Utc};

use crate::{create_id, Pool};

#[derive(Debug, serde::Serialize)]
pub struct Task {
    pub id: String,
    pub user_id: String,
    pub tag_id: String,
    pub is_manual: bool,
    pub started_at: DateTime<Utc>,
    pub expires_at: DateTime<Utc>,
    pub stopped_at: Option<DateTime<Utc>>,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, serde::Serialize)]
pub struct TaskWithTag {
    pub id: String,
    pub user_id: String,
    pub tag_id: String,
    pub is_manual: bool,
    pub started_at: DateTime<Utc>,
    pub expires_at: DateTime<Utc>,
    pub stopped_at: Option<DateTime<Utc>>,
    pub created_at: DateTime<Utc>,

    pub tag_label: String,
}

pub async fn owns_task(db: &Pool, user_id: &str, task_id: &str) -> Result<bool, anyhow::Error> {
    let owns_task = sqlx::query!(
        r#"
            SELECT EXISTS (
                SELECT 1 FROM tasks
                WHERE id = $1
                AND user_id = $2
            )
        "#,
        task_id,
        user_id
    )
    .fetch_one(db)
    .await
    .context("error checking task owner")?
    .exists
    .context("error checking task owner")?;

    return Ok(owns_task);
}

pub async fn get_tasks_by_day(
    db: &Pool,
    user_id: &str,
    day: &DateTime<Utc>,
) -> Result<Vec<TaskWithTag>, anyhow::Error> {
    let tasks_with_tags = sqlx::query_as!(
        TaskWithTag,
        r#"
            SELECT tasks.*, tags.label AS tag_label
            FROM tasks
            INNER JOIN tags ON tasks.tag_id = tags.id
            WHERE tasks.user_id = $1
                AND tasks.started_at >= $2
                AND tasks.started_at < ($2 + INTERVAL '1 day')
            ORDER BY tasks.started_at DESC;
        "#,
        user_id,
        day
    )
    .fetch_all(db)
    .await
    .context("error fetching tasks")?;

    return Ok(tasks_with_tags);
}

pub async fn get_ongoing_task(db: &Pool, user_id: &str) -> Result<Option<Task>, anyhow::Error> {
    let ongoing_task = sqlx::query_as!(
        Task,
        r#"
            SELECT * FROM tasks
            WHERE user_id = $1
            AND created_at <= NOW()
            AND expires_at >= NOW()
            AND stopped_at IS NULL
        "#,
        user_id
    )
    .fetch_optional(db)
    .await
    .context("error fetching ongoing task")?;

    return Ok(ongoing_task);
}

pub async fn add_manual_task(
    db: &Pool,
    user_id: &str,
    tag_id: &str,
    started_at: &DateTime<Utc>,
    expires_at: &DateTime<Utc>,
) -> Result<(), anyhow::Error> {
    sqlx::query!(
        r#"
            INSERT INTO tasks (id, user_id, tag_id, is_manual, started_at, expires_at)
            VALUES ($1, $2, $3, TRUE, $4, $5)
        "#,
        create_id(),
        user_id,
        tag_id,
        started_at,
        expires_at,
    )
    .fetch_one(db)
    .await
    .context("error inserting manual task")?;

    return Ok(());
}

pub async fn start_task(
    db: &Pool,
    user_id: &str,
    tag_id: &str,
    expires_at: DateTime<Utc>,
) -> Result<(), anyhow::Error> {
    sqlx::query!(
        r#"
            INSERT INTO tasks (id, user_id, tag_id, expires_at)
            VALUES ($1, $2, $3, $4)
        "#,
        create_id(),
        user_id,
        tag_id,
        expires_at,
    )
    .fetch_one(db)
    .await
    .context("error inserting task")?;

    return Ok(());
}

pub async fn stop_task(db: &Pool, user_id: &str, task_id: &str) -> Result<(), anyhow::Error> {
    sqlx::query!(
        r#"
            UPDATE tasks
            SET stopped_at = NOW()
            WHERE id = $1
            AND user_id = $2
        "#,
        task_id,
        user_id
    )
    .fetch_one(db)
    .await
    .context("error stopping task")?;

    return Ok(());
}

pub async fn delete_task(db: &Pool, user_id: &str, task_id: &str) -> Result<(), anyhow::Error> {
    sqlx::query!(
        r#"
            DELETE FROM tasks
            WHERE id = $1
            AND user_id = $2
        "#,
        task_id,
        user_id
    )
    .fetch_one(db)
    .await
    .context("error deleting task")?;

    return Ok(());
}