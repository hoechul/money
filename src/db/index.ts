import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { attachDatabasePool } from "@vercel/functions";
import * as schema from "./schema";

// 지연 초기화: 빌드 타임에 DATABASE_URL이 아직 없어도 next build가 깨지지 않도록
// 모듈 최상단에서 커넥션을 만들지 않는다. 실제 쿼리가 처음 실행될 때만 Pool을 생성한다.
let _db: ReturnType<typeof drizzle<typeof schema>> | null = null;

export function getDb() {
  if (!_db) {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    // Vercel Fluid Compute에서 함수 인스턴스가 재사용/종료될 때 커넥션을 안전하게 정리한다.
    attachDatabasePool(pool);
    _db = drizzle(pool, { schema });
  }
  return _db;
}
