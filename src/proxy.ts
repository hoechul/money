import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_SESSION_COOKIE, isValidSessionValue } from "@/lib/session-token";

// /admin 이하 경로를 보호한다. 로그인 페이지 자체는 제외해야 하며,
// 실제 데이터 조회는 admin 페이지/서버 액션 안에서도 다시 한 번 세션을 검증한다
// (Next.js 문서: 서버 액션은 proxy matcher와 별개의 체인으로 취급될 수 있으므로 이중 검증 권장).
export function proxy(request: NextRequest) {
  const session = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  if (!isValidSessionValue(session)) {
    const loginUrl = new URL("/admin/login", request.url);
    return NextResponse.redirect(loginUrl);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/((?!login).*)", "/admin"],
};
