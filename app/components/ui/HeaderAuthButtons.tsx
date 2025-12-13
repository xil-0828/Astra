"use client"

import { Button, HStack } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { createClient } from "@/utils/supabase/client"
import type { User } from "@supabase/supabase-js"

export default function HeaderAuthButtons() {
  const supabase = createClient()
  const [user, setUser] = useState<User | null>(null)

  // ログイン状態を取得
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
    })
  }, [supabase])

  // ログインボタン → /login に移動
  const goToLogin = () => {
    window.location.href = "/login"
  }

  // ログアウト
  const logout = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  return (
    <HStack>
      {user ? (
        <Button colorScheme="pink" variant="outline" onClick={logout}>
          Logout
        </Button>
      ) : (
        <Button colorScheme="pink" variant="solid" onClick={goToLogin}>
          Login
        </Button>
      )}
    </HStack>
  )
}
