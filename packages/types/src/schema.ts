import { pgTable, serial, varchar, text, timestamp, boolean, integer, jsonb } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  password: varchar('password', { length: 255 }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  role: varchar('role', { length: 50 }).notNull(), // 'admin' | 'guru'
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const attendance = pgTable('attendance', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  checkInTime: timestamp('check_in_time'),
  checkOutTime: timestamp('check_out_time'),
  date: timestamp('date').notNull(),
  status: varchar('status', { length: 50 }).notNull(), // 'present' | 'absent' | 'late'
  createdAt: timestamp('created_at').defaultNow(),
});

export const documents = pgTable('documents', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  type: varchar('type', { length: 50 }).notNull(), // 'prota' | 'prosem' | 'modul_ajar' | 'kktp' | 'analisis_cp'
  title: varchar('title', { length: 255 }).notNull(),
  content: text('content').notNull(),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const majors = pgTable('majors', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  name: varchar('name', { length: 255 }).notNull(), // e.g. 'Rekayasa Perangkat Lunak'
  code: varchar('code', { length: 50 }).notNull(), // e.g. 'RPL'
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const classes = pgTable('classes', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  majorId: integer('major_id').references(() => majors.id),
  name: varchar('name', { length: 255 }).notNull(), // e.g. 'XII RPL 1'
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const subjects = pgTable('subjects', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  majorId: integer('major_id').references(() => majors.id),
  classId: integer('class_id').references(() => classes.id),
  name: varchar('name', { length: 255 }).notNull(), // e.g. 'Pemrograman Dasar'
  code: varchar('code', { length: 50 }).notNull(), // e.g. 'PDE'
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
  attendance: many(attendance),
  documents: many(documents),
  classes: many(classes),
  majors: many(majors),
}));

export const majorsRelations = relations(majors, ({ one, many }) => ({
  user: one(users, {
    fields: [majors.userId],
    references: [users.id],
  }),
  classes: many(classes),
}));

export const classesRelations = relations(classes, ({ one }) => ({
  user: one(users, {
    fields: [classes.userId],
    references: [users.id],
  }),
  major: one(majors, {
    fields: [classes.majorId],
    references: [majors.id],
  }),
}));

export const documentsRelations = relations(documents, ({ one }) => ({
  user: one(users, {
    fields: [documents.userId],
    references: [users.id],
  }),
}));

export const attendanceRelations = relations(attendance, ({ one }) => ({
  user: one(users, {
    fields: [attendance.userId],
    references: [users.id],
  }),
}));
