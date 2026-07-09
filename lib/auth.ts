// lib/auth.ts
import { supabase } from "./supabase";

export const signUp = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
      // supabase가 준 error 객체 정보를 보존해서 반환
      return { success: false, error: { message: error.message, status: (error as any).status } };
    }

    return { success: true, user: data.user };
  } catch (err) {
    console.error("회원가입 오류:", err);
    return { success: false, error: { message: (err as Error).message } };
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      return { success: false, error: { message: error.message, status: (error as any).status } };
    }

    return { success: true, user: data.user, session: data.session };
  } catch (err) {
    console.error("로그인 오류:", err);
    return { success: false, error: { message: (err as Error).message } };
  }
};

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      return { success: false, error: { message: error.message, status: (error as any).status } };
    }
    return { success: true };
  } catch (err) {
    console.error("로그아웃 오류:", err);
    return { success: false, error: { message: (err as Error).message } };
  }
};

export const getCurrentUser = async () => {
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      console.error("사용자 조회 오류:", error);
      return null;
    }

    return user;
  } catch (err) {
    console.error("사용자 조회 중 오류:", err);
    return null;
  }
};