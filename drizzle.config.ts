import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle",
  schema: "./src/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    // 마이그레이션은 세션 상태(SET 등)가 필요할 수 있어 direct(unpooled) 커넥션을 사용한다.
    url: process.env.DATABASE_URL_UNPOOLED!,
  },
});
