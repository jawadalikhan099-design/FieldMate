import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
export const records = sqliteTable('records', {id:text('id').primaryKey(), ownerId:text('owner_id').notNull().default('original-workspace'), kind:text('kind').notNull(), data:text('data').notNull()});
export const members=sqliteTable('members',{id:text('id').primaryKey(),email:text('email').notNull(),name:text('name').notNull(),firstSeen:text('first_seen').notNull(),lastSeen:text('last_seen').notNull()});
export const memberDays=sqliteTable('member_days',{id:text('id').primaryKey(),memberId:text('member_id').notNull(),day:text('day').notNull()});
export const subscriptions=sqliteTable('subscriptions',{id:text('id').primaryKey(),memberId:text('member_id').notNull(),paidOn:text('paid_on').notNull(),starts:text('starts').notNull(),ends:text('ends').notNull(),amount:text('amount').notNull(),note:text('note').notNull()});
