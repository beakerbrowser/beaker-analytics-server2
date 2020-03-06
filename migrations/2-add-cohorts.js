exports.up = async function (knex) {
  await knex.schema.raw(`
  CREATE VIEW cohorts AS
  SELECT DISTINCT ON (first_ping.id)
    first_ping."userId" AS "userId",
    latest_ping."id" AS test,
    DATE_TRUNC('week', first_ping.date) AS cohort,
    DATE_TRUNC('month', latest_ping.date) = DATE_TRUNC('month', NOW()) AS is_active_this_month,
    DATE_TRUNC('week', latest_ping.date) = DATE_TRUNC('week', NOW()) AS is_active_this_week
    FROM pings first_ping
    LEFT JOIN pings latest_ping ON first_ping."userId" = latest_ping."userId"
    WHERE first_ping."isFirstPing"=1
    ORDER BY first_ping.id, latest_ping.id DESC;

  CREATE VIEW cohorts_retention AS
  SELECT
    cohort,
    COUNT("userId") AS total,
    SUM(CAST(is_active_this_month AS integer)) AS still_active_this_month,
    SUM(CAST(is_active_this_week AS integer)) AS still_active_this_week
    FROM cohorts
    GROUP BY cohort;
  `)
}

exports.down = async function (knex) {
  await knex.schema.raw(`
  DROP VIEW cohorts_retention;
  DROP VIEW cohorts;
  `)
}

/*
SELECT pings."userId", DATE_TRUNC('week', TO_TIMESTAMP(pings.date, 'YYYY-MM-DD HH24:MI:SS')) AS cohort FROM pings WHERE pings."isFirstPing"=1;

SELECT COUNT(pings."userId"), DATE_TRUNC('week', TO_TIMESTAMP(pings.date, 'YYYY-MM-DD HH24:MI:SS')) AS cohort FROM pings WHERE pings."isFirstPing"=1 GROUP BY cohort;

SELECT
  first_ping."userId" AS "userId",
  DATE_TRUNC('week', first_ping.date) AS cohort,
  DATE_TRUNC('month', latest_ping.date) = DATE_TRUNC('month', NOW()) AS is_active_this_month,
  DATE_TRUNC('week', latest_ping.date) = DATE_TRUNC('week', NOW()) AS is_active_this_week
  FROM pings first_ping
  LEFT JOIN pings latest_ping ON first_ping."userId" = latest_ping."userId"
  WHERE first_ping."isFirstPing"=1;


CREATE VIEW cohorts AS
SELECT
  first_ping."userId" AS "userId",
  DATE_TRUNC('week', TO_TIMESTAMP(first_ping.date, 'YYYY-MM-DD HH24:MI:SS')) AS cohort,
  DATE_TRUNC('month', TO_TIMESTAMP(latest_ping.date, 'YYYY-MM-DD HH24:MI:SS')) = DATE_TRUNC('month', NOW()) AS is_active_this_month,
  DATE_TRUNC('week', TO_TIMESTAMP(latest_ping.date, 'YYYY-MM-DD HH24:MI:SS')) = DATE_TRUNC('week', NOW()) AS is_active_this_week
  FROM pings first_ping
  LEFT JOIN pings latest_ping ON first_ping."userId" = latest_ping."userId"
  WHERE first_ping."isFirstPing"=1;

SELECT
  COUNT("userId") AS total,
  SUM(CAST(is_active_this_week AS integer)) AS still_active
  FROM (
    SELECT
      first_ping."userId" AS "userId",
      DATE_TRUNC('week', TO_TIMESTAMP(first_ping.date, 'YYYY-MM-DD HH24:MI:SS')) AS cohort,
      DATE_TRUNC('month', TO_TIMESTAMP(latest_ping.date, 'YYYY-MM-DD HH24:MI:SS')) = DATE_TRUNC('month', NOW()) AS is_active_this_month,
      DATE_TRUNC('week', TO_TIMESTAMP(latest_ping.date, 'YYYY-MM-DD HH24:MI:SS')) = DATE_TRUNC('week', NOW()) AS is_active_this_week
      FROM pings first_ping
      LEFT JOIN pings latest_ping ON first_ping."userId" = latest_ping."userId"
      WHERE first_ping."isFirstPing"=1
  ) t
  GROUP BY cohort;
  */