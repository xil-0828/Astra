"use client"
export const dynamic = "force-dynamic";

import { useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { createClient } from "@/utils/supabase/client"

export default function AuthCallback() {
  const router = useRouter()
  const params = useSearchParams()
  const next = params.get("next") || "/"

  useEffect(() => {
    const supabase = createClient()

    // Supabase のセッションを確立
    supabase.auth.getSession().then(() => {
      // セッション確立後に元のページへ戻る
      router.push(next)
    })
  }, [])

  return <p style={{ textAlign: "center" }}>ログイン中...</p>
}
