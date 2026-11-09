CREATE TABLE `member_days` (
	`id` text PRIMARY KEY NOT NULL,
	`member_id` text NOT NULL,
	`day` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `members` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`name` text NOT NULL,
	`first_seen` text NOT NULL,
	`last_seen` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `subscriptions` (
	`id` text PRIMARY KEY NOT NULL,
	`member_id` text NOT NULL,
	`paid_on` text NOT NULL,
	`starts` text NOT NULL,
	`ends` text NOT NULL,
	`amount` text NOT NULL,
	`note` text NOT NULL
);
